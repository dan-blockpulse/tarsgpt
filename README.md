# TARS: AI-Powered Blockchain Data Interpretation

TARS is an application designed to interpret blockchain data, particularly smart contracts on the EVMOS. It utilizes GPT-based models to translate complex contract information into a format that is easily digestible for non-technical users.

![](frontend/public/summary.png)
## Features

- Translates smart contract addresses into non-technical language
- Detailed contract insights for developers
- User-friendly UI/UX for seamless experience
- Integration with EVMOS via Mintscan data

## Limitations

- Currently only supports contract interpretation for v1
- Performance issues may occur due to latency on GPT-4 model API
- Limited to interpreting small-sized contracts less than 4096 tokens 

## Roadmap
- Expand features to interpret accounts and transactions
- Add more features to contract interpretation like assessing vulnerabilities in the contract logic

## How to test
1. Go to [tarsgpt.app](https://tarsgpt.app)
2. Search for a verified, digestible contract on the EVMOS. Some good examples:
   1. Wrapped EVMOS Contract: [0xD4949664cD82660AaE99bEdc034a0deA8A0bd517](https://www.mintscan.io/evmos/evm/contract/0xD4949664cD82660AaE99bEdc034a0deA8A0bd517)
3. See TARS interpretation of contract

Note: The contract you are searching for MUST be (1) verified, (2) small enough that the GPT-4 modal can digest. Failing to comply by the requirements may cause the server to throw an error.