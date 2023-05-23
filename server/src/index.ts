import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import express, { Request, Response, Express } from "express";
import { chatRouter } from "./routes/chat.router";
import { startBrowser } from "./browser";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import jsonminify from "jsonminify";
import fs from "fs";
import axios from "axios";

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

const BSC_API_KEY = process.env.BSCSCAN_API_KEY ?? "";

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRouter);

function removeComments(code: string): string {
  // Remove all multi-line comments
  let result = code.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "");
  // Remove all single line comments
  result = result.replace(/\/\/.*/g, "");
  return result;
}

app.get("/contract", async (req, res) => {
  const response = await axios.get(
    `https://api.bscscan.com/api?module=contract&action=getsourcecode&address=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c&apikey=${BSC_API_KEY}`
  );

  const contractCode = removeComments(response.data.result[0].SourceCode);

  const contractMessages: ChatCompletionRequestMessage[] = [
    {
      role: "user",
      content: `Here is the solidity code for a smart contract on the BNB Chain: ${contractCode}.`,
    },
  ];

  // summary
  const completion1 = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "I want you to act as an expert smart contract instructor. I will give you the solidity code of a smart contract deployed on the BNB Chain. You will explain the smart contract to a non-technical user. You will explain what it does, why it's useful to blockchain users, and how it can be used by other developers. Get straight into the explanation, omit introductory statements, and do not make up things that aren't in evident in the code. start with `This smart contract is designed to be ...`",
      },
      ...contractMessages,
    ],
  });

  // ethers
  const completion2 = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "I want you to act as an expert Ethereum dapp developer. I will give you the solidity code of a smart contract deployed on the BNB Chain. You will provide code samples to a new developer on BSC how to interact with the most important methods on the smart contract using hardhat. Don't say any introductory statements like `Sure, I can provide code samples...` and get straight into the content. Please format it like this example response: '1. Get the total supply of WBNB tokens```javascriptconst wbnbContract = await ethers.getContractAt('WBNB', 'WBNB_CONTRACT_ADDRESS');\nconst totalSupply = await wbnbContract.totalSupply();\nconsole.log(`Total supply of WBNB tokens:`, ethers.utils.formatUnits(totalSupply, 'ether'));\n\n```2. Get the balance of a user's WBNB tokens```javascriptconst userAddress = 'USER_ADDRESS';\nconst userBalance = await wbnbContract.balanceOf(userAddress);\nconsole.log(`User's balance of WBNB tokens:`, ethers.utils.formatUnits(userBalance, 'ether'));\n\n```...",
      },
      ...contractMessages,
    ],
  });

  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "I want you to act as an expert Ethereum dapp developer. I will give you the solidity code of a smart contract deployed on the BNB Chain. You will provide code samples to a new developer on BSC how to interact with the most important methods on the smart contract using wagmi.sh. Don't say any introductory statements like `Sure, I can provide code samples...` and get straight into the content. Please format it like this example response: '1. Get the total supply of WBNB tokens```javascriptconst { data: totalSupply } = useContractRead({\n    address: 'WBNB_CONTRACT_ADDRESS',\n    abi: WBNB.abi,\n    functionName: 'totalSupply'\n});\nconsole.log(`Total supply of WBNB tokens:`, totalSupply ? ethers.utils.formatUnits(totalSupply, 'ether') : 'Loading...');\n\n```2. Get the balance of a user's WBNB tokens```javascriptconst userAddress = 'USER_ADDRESS';\nconst { data: userBalance } = useContractRead({\n    address: 'WBNB_CONTRACT_ADDRESS',\n    abi: WBNB.abi,\n    functionName: 'balanceOf',\n    args: [userAddress],\n});\n\nconsole.log(`User's balance of WBNB tokens:`, userBalance ? ethers.utils.formatUnits(userBalance, 'ether') : 'Loading...');n\n```...",
      },
      ...contractMessages,
    ],
  });

  const outputFile = "wrapped_bnb_wagmi.json";

  fs.writeFile(
    outputFile,
    JSON.stringify(completion.data.choices[0], null, 2),
    (err) => {
      if (err) {
        console.error("Error writing JSON file:", err);
        // res.status(500).send("An error occurred while writing the JSON file.");
      } else {
        console.log(`JSON file saved as ${outputFile}`);
        res.status(200).send(completion.data.choices[0].message!.content);
      }
    }
  );
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
