export const summary =
  'This smart contract is designed to be a Wrapped EVMOS (WEVMOS) token on the EVMOS. It is an ERC20-compliant token that represents EVMOS (EVMOS) on a one-to-one basis, allowing users to interact with decentralized applications (dApps) and smart contracts that require ERC20 tokens. WEVMOS is useful because it enables EVMOS holders to participate in the growing DeFi ecosystem on EVMOS. \n\nIn the given code, the most important aspects of the smart contract are as follows:\n\n1. The contract initializes the name, symbol, and decimals of the token, which are "Wrapped EVMOS", "WEVMOS", and 18 respectively.\n\n2. The `balanceOf` mapping keeps track of the token balance of each user\'s address. The `allowance` mapping holds the approved token allowance that can be spent by another address on behalf of the token owner.\n\n3. The smart contract accepts EVMOS deposits as tokens through the fallback function and the `deposit()` function, which are automatically called when users send EVMOS to the contract\'s address.\n\n4. Users can withdraw their EVMOS from the contract using the `withdraw()` function, which checks if the user has a sufficient WEVMOS balance before sending the corresponding EVMOS amount back to them.\n\n5. The`totalSupply()` function returns the total EVMOS balance of the smart contract, representing all the WEVMOS tokens in circulation.\n\n6. The `approve()` function allows a user to approve another address to spend their WEVMOS tokens up to a specified amount.\n\n7. `transfer()` and `transferFrom()` functions are provided for transferring WEVMOS between addresses. The `transfer()` function transfers tokens from the sender to a specified address, while the `transferFrom()` function transfers an approved amount of tokens from one address to another.\n\nIn conclusion, this smart contract allows EVMOS holders to convert their EVMOS into Wrapped EVMOS (WEVMOS) tokens, which they can then use to interact with decentralized applications and smart contracts on the EVMOS. Other developers can interact with this smart contract to incorporate its functionalities into their dApps or build an ecosystem around the use of WEVMOS tokens.';

export const interaction =
  "1. Get the total supply of WEVMOS tokens\n```javascript\nconst wEVMOSContract = await ethers.getContractAt('WEVMOS', 'WEVMOS_CONTRACT_ADDRESS');\nconst totalSupply = await wEVMOSContract.totalSupply();\nconsole.log(`Total supply of WEVMOS tokens:`, ethers.utils.formatUnits(totalSupply, 'ether'));\n```\n\n2. Get the balance of a user's WEVMOS tokens\n```javascript\nconst userAddress = 'USER_ADDRESS';\nconst userBalance = await wEVMOSContract.balanceOf(userAddress);\nconsole.log(`User's balance of WEVMOS tokens:`, ethers.utils.formatUnits(userBalance, 'ether'));\n```\n\n3. Deposit EVMOS to get WEVMOS tokens\n```javascript\nconst depositAmount = ethers.utils.parseUnits('1', 'ether');\nawait wEVMOSContract.deposit({ value: depositAmount });\n```\n\n4. Withdraw WEVMOS to get EVMOS tokens\n```javascript\nconst withdrawAmount = ethers.utils.parseUnits('1', 'ether');\nawait wEVMOSContract.withdraw(withdrawAmount);\n```\n\n5. Approve an address to spend WEVMOS tokens\n```javascript\nconst spender = 'SPENDER_ADDRESS';\nconst approveAmount = ethers.utils.parseUnits('5', 'ether');\nawait wEVMOSContract.approve(spender, approveAmount);\n```\n\n6. Transfer WEVMOS tokens to another address\n```javascript\nconst recipient = 'RECIPIENT_ADDRESS';\nconst transferAmount = ethers.utils.parseUnits('2', 'ether');\nawait wEVMOSContract.transfer(recipient, transferAmount);\n```\n\n7. Transfer WEVMOS tokens from an approved address to another address\n```javascript\nconst src = 'SRC_ADDRESS';\nconst dst = 'DST_ADDRESS';\nconst transferAmount = ethers.utils.parseUnits('1', 'ether');\nawait wEVMOSContract.transferFrom(src, dst, transferAmount);\n```";

export const wagmi =
  "1. Get the total supply of WEVMOS tokens\n```javascript\nconst { data: totalSupply } = useContractRead({\n    address: 'WEVMOS_CONTRACT_ADDRESS',\n    abi: WEVMOS.abi,\n    functionName: 'totalSupply'\n});\nconsole.log(`Total supply of WEVMOS tokens:`, totalSupply ? ethers.utils.formatUnits(totalSupply, 'ether') : 'Loading...');\n```\n\n2. Get the balance of a user's WEVMOS tokens\n```javascript\nconst userAddress = 'USER_ADDRESS';\nconst { data: userBalance } = useContractRead({\n    address: 'WEVMOS_CONTRACT_ADDRESS',\n    abi: WEVMOS.abi,\n    functionName: 'balanceOf',\n    args: [userAddress],\n});\n\nconsole.log(`User's balance of WEVMOS tokens:`, userBalance ? ethers.utils.formatUnits(userBalance, 'ether') : 'Loading...');\n```\n\n3. Approve a spender to use your WEVMOS tokens\n```javascript\nconst spender = 'SPENDER_ADDRESS';\nconst amountToAllow = ethers.utils.parseUnits('10', 'ether');\nconst { send: approveSpender } = useContractWrite({\n    address: 'WEVMOS_CONTRACT_ADDRESS',\n    abi: WEVMOS.abi,\n    functionName: 'approve',\n    args: [spender, amountToAllow],\n});\n\n// To send the approve transaction, call:\n// approveSpender();\n```\n\n4. Transfer WEVMOS tokens to another address\n```javascript\nconst destinationAddress = 'DESTINATION_ADDRESS';\nconst amountToTransfer = ethers.utils.parseUnits('5', 'ether');\nconst { send: transferTokens } = useContractWrite({\n    address: 'WEVMOS_CONTRACT_ADDRESS',\n    abi: WEVMOS.abi,\n    functionName: 'transfer',\n    args: [destinationAddress, amountToTransfer],\n});\n\n// To send the transfer transaction, call:\n// transferTokens();\n```\n\n5. Deposit EVMOS into wrapped EVMOS contract\n```javascript\nconst amountToDeposit = ethers.utils.parseUnits('1', 'ether');\nconst { send: deposit } = useContractWrite({\n    address: 'WEVMOS_CONTRACT_ADDRESS',\n    abi: WEVMOS.abi,\n    functionName: 'deposit',\n    etherValue: amountToDeposit,\n});\n\n// To send the deposit transaction, call:\n// deposit();\n```\n\n6. Withdraw EVMOS from the wrapped EVMOS contract\n```javascript\nconst amountToWithdraw = ethers.utils.parseUnits('1', 'ether');\nconst { send: withdraw } = useContractWrite({\n    address: 'WEVMOS_CONTRACT_ADDRESS',\n    abi: WEVMOS.abi,\n    functionName: 'withdraw',\n    args: [amountToWithdraw],\n});\n\n// To send the withdraw transaction, call:\n// withdraw();\n```";

export const metadata = {
  totalAssets: 981593689.12,
  txnCount: 7027421,
  contractName: "WEVMOS",
  createdOn: "Sep-03-2020 07:53:04 AM +UTC",
  creator: abridgeAddress("0x4e656459ed25bf986eea1196bc1b00665401645d", 6),
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
    name: "EVMOS",
    value: 18237089384.965828,
    fiatValue: 981593689.12,
    imageUrl: "",
  },
  {
    name: "Wrapped EVMOS (WEVMOS)",
    value: 787756.064509,
    fiatValue: 367783.69,
    imageUrl: "",
  },
  {
    name: "Evmos-Peg",
    value: 10850.15,
    fiatValue: 105.3,
    imageUrl: "",
  },
  {
    name: "QUINT (QUINT)",
    value: 4040.82,
    fiatValue: 42.16,
    imageUrl: "",
  },
  {
    name: "Evmos_Peg",
    value: 3645.75,
    fiatValue: 2.58,
    imageUrl: "",
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

export function abridgeAddress(address: string, char?: number) {
  if (!char) char = 4;
  const l = address.length;
  if (l < 20) return address;
  return `${address.substring(0, 2 + char)}...${address.substring(
    l - char,
    l
  )}`;
}
