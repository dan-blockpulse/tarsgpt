import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import express, { Request, Response, Express } from "express";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import fs from "fs";
import axios from "axios";
import { ensureCodeBlock, fetchContract, sleep } from "./utils";
import { ethers } from "ethers";

import c93D8c966 from "../data/0x93D8c966.json";
import c4490B2c9 from "../data/0x4490B2c9.json";
import c88361F09 from "../data/0x88361F09.json";
import cD4949664 from "../data/0xD4949664.json";
import cf7bf11bE from "../data/0xf7bf11bE.json";

const contractDataMap: { [key: string]: any } = {};

contractDataMap[
  "0x93D8c966d8dD358fe5146ad3067a0414f25f7F5B".toLocaleLowerCase()
] = c93D8c966;
contractDataMap[
  "0x4490B2c9066D46C2588379B9D92F24De9a281ed6".toLocaleLowerCase()
] = c4490B2c9;
contractDataMap[
  "0x88361F09F8c93283e76b8efE2A0d5FC4cBEb97a9".toLocaleLowerCase()
] = c88361F09;
contractDataMap[
  "0xD4949664cD82660AaE99bEdc034a0deA8A0bd517".toLocaleLowerCase()
] = cD4949664;
contractDataMap[
  "0xf7bf11bEa084A44dF6A2a2049FeDb5Bb88FBA109".toLocaleLowerCase()
] = cf7bf11bE;

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const app: Express = express();
const port = process.env.PORT ?? 8888;

dotenv.config();

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.status(200).send("hi");
});

app.get("/contract/:address", async (req: Request, res: Response) => {
  const { address } = req.params;
  console.log("request received for ", address);

  const data = contractDataMap[address.toLocaleLowerCase()];

  if (data) {
    await sleep(30);
    res.status(200).send(data);
    return;
  } else {
    await sleep(50);
    res.status(200).send({ error: true });
    return;
  }

  // TODO: puppeteer has a known bug when hosted to a server due to an update
  // on how chromium is fetched: https://github.com/puppeteer/puppeteer/issues/9592
  try {
    const response = await fetchContract(address);

    console.log("after fetchContract");

    const contractMessages: ChatCompletionRequestMessage[] = [
      {
        role: "user",
        content: `Here is the solidity code for a smart contract on the EVMOS: ${response.code}.`,
      },
    ];

    // summary
    const summaryResponse = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "I want you to act as an expert smart contract instructor. I will give you the solidity code of a smart contract deployed on the EVMOS. You will explain the smart contract to a non-technical user. You will explain what it does, why it's useful to blockchain users, and how it can be used by other developers. Get straight into the explanation, omit introductory statements, and do not make up things that aren't in evident in the code. start with `This smart contract is designed to be ...`",
        },
        ...contractMessages,
      ],
    });

    console.log("summary fetched");

    // ethers
    const ethersResponse = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "I want you to act as an expert Ethereum dapp developer. I will give you the solidity code of a smart contract deployed on the EVMOS. You will provide code samples to a new developer on EVMOS how to interact with the most important methods on the smart contract using hardhat. Don't say any introductory statements like `Sure, I can provide code samples...` and get straight into the content. Please format it like this example response: '1. Get the total supply of WEVMOS tokens```javascriptconst WEVMOSContract = await ethers.getContractAt('WEVMOS', 'WEVMOS_CONTRACT_ADDRESS');\nconst totalSupply = await WEVMOSContract.totalSupply();\nconsole.log(`Total supply of WEVMOS tokens:`, ethers.utils.formatUnits(totalSupply, 'ether'));\n\n```2. Get the balance of a user's WEVMOS tokens```javascriptconst userAddress = 'USER_ADDRESS';\nconst userBalance = await WEVMOSContract.balanceOf(userAddress);\nconsole.log(`User's balance of WEVMOS tokens:`, ethers.utils.formatUnits(userBalance, 'ether'));\n\n```...",
        },
        ...contractMessages,
      ],
    });

    console.log("ethers fetched");

    // wagmi
    const wagmiResponse = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "I want you to act as an expert Ethereum dapp developer. I will give you the solidity code of a smart contract deployed on the EVMOS. You will provide code samples to a new developer on EVMOS how to interact with the most important methods on the smart contract using https://wagmi.sh/. Don't say any introductory statements like `Sure, I can provide code samples...` and get straight into the content. Please format it like this example response: '1. Get the total supply of WEVMOS tokens\n```javascript\nconst { data: totalSupply } = useContractRead({\n    address: 'WEVMOS_CONTRACT_ADDRESS',\n    abi: WEVMOS.abi,\n    functionName: 'totalSupply'\n});\nconsole.log(`Total supply of WEVMOS tokens:`, totalSupply ? ethers.utils.formatUnits(totalSupply, 'ether') : 'Loading...');\n\n```3. Approve a spender to use your WEVMOS tokens\n```javascript\nconst spender = 'SPENDER_ADDRESS';\nconst amountToAllow = ethers.utils.parseUnits('10', 'ether');\nconst { send: approveSpender } = useContractWrite({\n    address: 'WEVMOS_CONTRACT_ADDRESS',\n    abi: WEVMOS.abi,\n    functionName: 'approve',\n    args: [spender, amountToAllow],\n});\n\n// To send the approve transaction, call:\n// approveSpender();\n\n```...",
        },
        ...contractMessages,
      ],
    });

    const apiKey = process.env.COVALENT_API_KEY || "";

    const url = `https://api.covalenthq.com/v1/evmos-mainnet/address/${address}/balances_v2/?key=${apiKey}`;

    const resp = await axios.get(url);
    const { data } = await resp.data;
    const tokens = data.items;

    const formattedTokens = tokens
      .filter((t) => t.type !== "dust")
      .map(({ contract_ticker_symbol, balance, pretty_quote, logo_url }) => {
        return {
          name: contract_ticker_symbol,
          value: ethers.utils.formatUnits(balance, "ether"),
          fiatValue: pretty_quote,
          imageUrl: logo_url,
        };
      });

    // const newOutput = {
    //   ...output,
    //   tokens: formattedTokens,
    //   metadata: response.metadata,
    //   abi: response.abi,
    //   functions: response.functionNames,
    // };
    // console.log("wagmi fetched");

    const outputFile = `${address.slice(0, 10)}.json`;

    const results = {
      summary: summaryResponse.data.choices[0].message!.content,
      ethers: ensureCodeBlock(ethersResponse.data.choices[0].message!.content),
      wagmi: ensureCodeBlock(wagmiResponse.data.choices[0].message!.content),
      tokens: formattedTokens,
      metadata: response.metadata,
      abi: response.abi,
      functions: response.functionNames,
    };

    // console.log(response);

    fs.writeFile(outputFile, JSON.stringify(results), (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
        res.status(500).send("An error occurred while writing the JSON file.");
      } else {
        console.log(`JSON file saved as ${outputFile}`);
      }
    });
    res.status(200).send(results);
  } catch (e) {
    console.error(e);
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
