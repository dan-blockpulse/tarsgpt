import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import express, { Request, Response, Express } from "express";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import fs from "fs";
import axios from "axios";
import { abi, interaction, methods, summary, wagmi } from "../data/sample";
import { fetchContract } from "./utils";
import output from "../output.json";
import { ethers } from "ethers";

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

function removeComments(code: string): string {
  let result = code.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "");
  result = result.replace(/\/\/.*/g, "");
  return result;
}

function ensureCodeBlock(str) {
  const count = (str.match(/```/g) || []).length;
  if (count % 2 !== 0) {
    str += "```";
  }
  return str;
}

function extractFunctionNames(abiJson: string): string[] {
  const abi = JSON.parse(abiJson);
  const functionNames: string[] = [];

  for (const element of abi) {
    if (element.type === "function") {
      functionNames.push(element.name);
    }
  }

  return functionNames;
}

app.get("/", async (req: Request, res: Response) => {
  console.log("request received");

  res.status(200).send("hi");
});

app.get("/contract/:address", async (req: Request, res: Response) => {
  const { address } = req.params;
  console.log("request received for ", address);

  const response = await fetchContract(address);

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

  const newOutput = {
    ...output,
    tokens: formattedTokens,
    metadata: response.metadata,
    abi: response.abi,
    functions: response.functionNames,
  };
  console.log("wagmi fetched");

  const outputFile = "output.json";

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
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
