export const summary =
  "This smart contract is designed to be a Wrapped TRON (WTRX) contract. It allows users to deposit TRX (the native currency of the TRON blockchain) into the contract and receive WTRX tokens in return. These tokens represent the equivalent value of the deposited TRX and can be traded, transferred or held like any ERC20 token.\n\nThe contract is implemented through three individual files: token_deposit.sol, trc20.sol and wtrx.sol. The trc20.sol contract provides an API for tokens that comply with the TRC20 standard, which is similar to the more common ERC20 standard. The token_deposit.sol contract extends the trc20.sol contract and adds two additional functions: deposit() and withdraw(). The deposit() function allows users to send TRX to the contract and receive the equivalent amount of WTRX tokens in return. The withdraw() function allows users to redeem their WTRX tokens for TRX.\n\nThe final contract, wtrx.sol, is the implementation of the actual WTRX token. It imports the token_deposit.sol contract and adds the necessary variables and functions to define the parameters of WTRX. This includes variables like the name, symbol, and number of decimals. It also defines the deposit() and withdraw() functions from the parent contract and adds four events: Approval, Transfer, Deposit, and Withdrawal.\n\nIn summary, this smart contract provides a way for TRON users to trade and hold TRX in the form of WTRX tokens, which can be used like any other ERC20 token. Other developers can use and interact with this contract by integrating it into their own applications, such as decentralized exchanges or wallets that support TRON.";

export const interaction =
  "To interact with the methods of the WTRX smart contract using tronweb, you can follow the sample code snippets below:\n\n1. Get the total supply of WTRX tokens\n\n```javascript\nconst wtrxAddress = 'WTRX_CONTRACT_ADDRESS';\nconst wtrxContract = await tronWeb.contract().at(wtrxAddress);\nconst totalSupply = await wtrxContract.totalSupply().call();\nconsole.log('Total supply of WTRX tokens:', toNumber(totalSupply));\n```\n\n2. Get the balance of a user's WTRX tokens\n\n```javascript\nconst userAddress = 'USER_ADDRESS';\nconst wtrxAddress = 'WTRX_CONTRACT_ADDRESS';\nconst wtrxContract = await tronWeb.contract().at(wtrxAddress);\nconst userBalance = await wtrxContract.balanceOf(userAddress).call();\nconsole.log(`User's balance of WTRX tokens:`, toNumber(userBalance));\n```\n\n3. Approve another address to spend a specified amount of WTRX tokens on behalf of the user\n\n```javascript\nconst spenderAddress = 'SPENDER_ADDRESS';\nconst amount = 100;\nconst wtrxAddress = 'WTRX_CONTRACT_ADDRESS';\nconst wtrxContract = await tronWeb.contract().at(wtrxAddress);\nconst approveTx = await wtrxContract.approve(spenderAddress, amount).send({\n    from: 'USER_ADDRESS',\n    feeLimit: 100000000 // optional\n});\nconsole.log('Approved transaction ID:', approveTx);\n```\n\n4. Transfer WTRX tokens from the user's account to another address\n\n```javascript\nconst recipientAddress = 'RECIPIENT_ADDRESS';\nconst amount = 100;\nconst wtrxAddress = 'WTRX_CONTRACT_ADDRESS';\nconst wtrxContract = await tronWeb.contract().at(wtrxAddress);\nconst transferTx = await wtrxContract.transfer(recipientAddress, amount).send({\n    from: 'USER_ADDRESS',\n    feeLimit: 100000000 // optional\n});\nconsole.log('Transfer transaction ID:', transferTx);\n```\n\n5. Transfer WTRX tokens from one address to another address, on behalf of the user (requires approval)\n\n```javascript\nconst payerAddress = 'PAYER_ADDRESS';\nconst recipientAddress = 'RECIPIENT_ADDRESS';\nconst amount = 100;\nconst wtrxAddress = 'WTRX_CONTRACT_ADDRESS';\nconst wtrxContract = await tronWeb.contract().at(wtrxAddress);\nconst allowance = await wtrxContract.allowance(payerAddress, 'USER_ADDRESS').call();\nif (allowance < amount) {\n    throw new Error('Not enough allowance');\n}\nconst transferFromTx = await wtrxContract.transferFrom(payerAddress, recipientAddress, amount).send({\n    from: 'USER_ADDRESS',\n    feeLimit: 100000000 // optional\n});\nconsole.log('Transfer-from transaction ID:', transferFromTx);\n```";

export const metadata = {
  totalAssets: 18237100512.396912,
  txnCount: 98681,
  contractName: "WTRX",
  createdOn: "2020-04-03 03:53:42 (Local)",
  creator: "TG6jUMfwpwR9QNFsSwCGtLaV2TR2g",
};

export const methods = [
  { name: "Withdraw", percentage: 59.94 },
  { name: "Deposit", percentage: 16.4 },
  { name: "Approve", percentage: 15.19 },
  { name: "Transfer", percentage: 8.32 },
  { name: "TransferFrom", percentage: 0.16 },
];

export const methodMap = {
  "39509351": "increaseAllowance(address,uint256)",
  "23b872dd": "transferFrom(address,address,uint256)",
  "70a08231": "balanceOf(address)",
  a9059cbb: "transfer(address,uint256)",
  "18160ddd": "totalSupply()",
  "95d89b41": "symbol()",
  dd62ed3e: "allowance(address,address)",
  "095ea7b3": "approve(address,uint256)",
  "313ce567": "decimals()",
  a457c2d7: "decreaseAllowance(address,uint256)",
  "06fdde03": "name()",
};

export const tokenBalances = [
  {
    name: "TRX (TRX)",
    value: 18237089384.965828,
    fiatValue: 1214354499.14,
    imageUrl:
      "https://static.tronscan.org/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png?t=1598430824415",
  },
  {
    name: "BitTorrent Old (BTTOLD)",
    value: 787756.064509,
    fiatValue: 577.16,
    imageUrl: "https://static.tronscan.org/production/logo/1002000.png",
  },
  {
    name: "Tether USD (USDT)",
    value: 105.28249,
    fiatValue: 105.3,
    imageUrl: "https://static.tronscan.org/production/logo/usdtlogo.png",
  },
  {
    name: "Wrapped TRX (WTRX)",
    value: 633.203197,
    fiatValue: 42.16,
    imageUrl:
      "https://static.tronscan.org/production/upload/logo/TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR.png?t=1598430824415",
  },
  {
    name: "Bitcoin (BTC)",
    value: 0.00009296,
    fiatValue: 2.58,
    imageUrl:
      "https://static.tronscan.org/production/logo/TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m9.png",
  },
];

export const abi = {
  entrys: [
    {
      outputs: [{ type: "string" }],
      constant: true,
      name: "name",
      stateMutability: "View",
      type: "Function",
    },
    {
      outputs: [{ type: "bool" }],
      inputs: [
        { name: "guy", type: "address" },
        { name: "sad", type: "uint256" },
      ],
      name: "approve",
      stateMutability: "Nonpayable",
      type: "Function",
    },
    {
      outputs: [{ type: "uint256" }],
      constant: true,
      name: "totalSupply",
      stateMutability: "View",
      type: "Function",
    },
    {
      outputs: [{ type: "bool" }],
      inputs: [
        { name: "src", type: "address" },
        { name: "dst", type: "address" },
        { name: "sad", type: "uint256" },
      ],
      name: "transferFrom",
      stateMutability: "Nonpayable",
      type: "Function",
    },
    {
      inputs: [{ name: "sad", type: "uint256" }],
      name: "withdraw",
      stateMutability: "Nonpayable",
      type: "Function",
    },
    {
      outputs: [{ type: "uint8" }],
      constant: true,
      name: "decimals",
      stateMutability: "View",
      type: "Function",
    },
    {
      outputs: [{ type: "uint256" }],
      constant: true,
      inputs: [{ name: "guy", type: "address" }],
      name: "balanceOf",
      stateMutability: "View",
      type: "Function",
    },
    {
      outputs: [{ type: "string" }],
      constant: true,
      name: "symbol",
      stateMutability: "View",
      type: "Function",
    },
    {
      outputs: [{ type: "bool" }],
      inputs: [
        { name: "dst", type: "address" },
        { name: "sad", type: "uint256" },
      ],
      name: "transfer",
      stateMutability: "Nonpayable",
      type: "Function",
    },
    {
      payable: true,
      name: "deposit",
      stateMutability: "Payable",
      type: "Function",
    },
    {
      outputs: [{ type: "bool" }],
      inputs: [{ name: "guy", type: "address" }],
      name: "approve",
      stateMutability: "Nonpayable",
      type: "Function",
    },
    {
      outputs: [{ type: "uint256" }],
      constant: true,
      inputs: [
        { name: "src", type: "address" },
        { name: "guy", type: "address" },
      ],
      name: "allowance",
      stateMutability: "View",
      type: "Function",
    },
    { payable: true, stateMutability: "Payable", type: "Fallback" },
    {
      inputs: [
        { indexed: true, name: "src", type: "address" },
        { indexed: true, name: "guy", type: "address" },
        { name: "sad", type: "uint256" },
      ],
      name: "Approval",
      type: "Event",
    },
    {
      inputs: [
        { indexed: true, name: "src", type: "address" },
        { indexed: true, name: "dst", type: "address" },
        { name: "sad", type: "uint256" },
      ],
      name: "Transfer",
      type: "Event",
    },
    {
      inputs: [
        { indexed: true, name: "dst", type: "address" },
        { name: "sad", type: "uint256" },
      ],
      name: "Deposit",
      type: "Event",
    },
    {
      inputs: [
        { indexed: true, name: "src", type: "address" },
        { name: "sad", type: "uint256" },
      ],
      name: "Withdrawal",
      type: "Event",
    },
  ],
};
