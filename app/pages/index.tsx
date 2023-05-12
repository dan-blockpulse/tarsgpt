import { HStack, VStack, Text } from "@chakra-ui/react";
import styles from "@styles/Main.module.css";
import { CopyIcon } from "@chakra-ui/icons";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export default function Main() {
  return (
    <main className={styles.main}>
      <VStack w="100%">
        <HStack w="100%" paddingTop="1.5rem" paddingBottom=".5rem">
          <VStack className={styles.contractName}>
            <Text>WTRX</Text>
          </VStack>
          <Text className={styles.contractAddress}>
            TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR
          </Text>
          <VStack className={styles.iconContainer}>
            <CopyIcon className={styles.icon} />
          </VStack>
          <VStack className={styles.iconContainer}>
            <ExternalLinkIcon className={styles.icon} />
          </VStack>
        </HStack>
        <HStack w="100%" gap={1} alignItems="flex-start">
          <VStack w="70%" gap={1}>
            <VStack className={styles.contractLeftSubsection}>
              <Text className={styles.sectionTitle}>Contract Summary</Text>
              <Text>
                This is a smart contract that allows users to deposit and
                withdraw TRX, the native cryptocurrency of the Tron blockchain,
                in the form of a TRC20 token called WTRX. TRC20 is a technical
                standard for tokens on the Tron blockchain, and this smart
                contract implements that standard. The "token_deposit.sol" file
                defines an interface for depositing and withdrawing tokens,
                while the "trc20.sol" file provides the implementation of the
                TRC20 standard. The "wtrx.sol" file creates the WTRX token by
                implementing the ITokenDeposit interface and the TRC20 standard.
                It defines the properties of the token, including its name,
                symbol, and number of decimals, and allows users to deposit and
                withdraw TRX in exchange for WTRX tokens. This smart contract is
                useful to Tron blockchain users who want to use TRX in a
                decentralized manner, as it allows them to convert TRX into a
                TRC20 token that can be traded on decentralized exchanges and
                used in other decentralized applications. Users can deposit
                their TRX into the smart contract, receive WTRX tokens in
                exchange, and then trade those tokens on decentralized exchanges
                or use them in other applications. They can also withdraw their
                TRX by exchanging their WTRX tokens for the equivalent amount of
                TRX.
              </Text>
            </VStack>
            <VStack className={styles.contractLeftSubsection}>
              <Text className={styles.sectionTitle}>
                Contract Interactions via TronWeb
              </Text>
              <Text>1. Deposit WTRX tokens to the contract</Text>
              <Text>{`const contractAddress = "CONTRACT_ADDRESS";const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);const contract = await tronWeb.contract(abi, contractAddress);const depositAmount = '1000000'; // 1 TRX = 1,000,000 SUN (smallest TRX unit)const transaction = await contract.deposit().send({  callValue: depositAmount,  shouldPollResponse:true});`}</Text>
            </VStack>
          </VStack>
          <VStack w="30%" gap={1}>
            <VStack className={styles.contractRightSubsection}>
              <Text className={styles.sectionTitle}>Contract Info</Text>
              <Text>
                Total assets: 18,245,357,121.400803 TRX Historical Transaction
                Count: 98,541 Created on: 2020-04-03 03:53:42 (Local) Creator
                address: TG6jUMfwpwR9QNFsSwCGtLaV2TR2gV8yru
              </Text>
            </VStack>
            <VStack className={styles.contractRightSubsection}>
              <Text className={styles.sectionTitle}>Contract Call Summary</Text>
              <Text>
                Top 5 Methods Withdraw Deposit Approve Transfer TransferFrom
              </Text>
            </VStack>
            <VStack className={styles.contractRightSubsection}>
              <Text className={styles.sectionTitle}>Contract Methods</Text>
              <Text>
                increaseAllowance(address,uint256)
                transferFrom(address,address,uint256) balanceOf(address)
                transfer(address,uint256) totalSupply() symbol()
                allowance(address,address)
              </Text>
            </VStack>
          </VStack>
        </HStack>
      </VStack>
    </main>
  );
}
