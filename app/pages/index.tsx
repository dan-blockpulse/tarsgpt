import { HStack, VStack, Text, Code, Box } from "@chakra-ui/react";
import styles from "@styles/Main.module.css";
import { CopyIcon } from "@chakra-ui/icons";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { contractInteraction, contractSummary } from "@data/sample";
import Highlight from "react-highlight";
import { useToast } from "@chakra-ui/react";

export default function Main() {
  const toast = useToast();

  const formatCode = (response: string) => {
    const codeBlockRegex = /(\d+\.)([\s\S]*?)```(?:javascript)?([\s\S]*?)```/g;
    const codeBlocks: JSX.Element[] = [];

    const copyToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        toast({
          title: "Code snippet copied.",
          description: "Successfully copied to your clipboard.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    };

    let match;
    let lastIndex = 0;

    while ((match = codeBlockRegex.exec(response)) !== null) {
      const stepNumber = match[1];
      const stepDescription = match[2];
      const codeContent = match[3];
      const codeEnd = codeBlockRegex.lastIndex;

      codeBlocks.push(
        <VStack key={lastIndex} className={styles.codeSection}>
          <Text>{`${stepNumber} ${stepDescription}`}</Text>
          <VStack className={styles.codeBackground}>
            <VStack className={styles.codeContainer}>
              <HStack w="100%" justifyContent="space-between">
                <HStack zIndex={2}>
                  <Box className={styles.redDot} />
                  <Box className={styles.yellowDot} />
                  <Box className={styles.greenDot} />
                </HStack>
                <CopyIcon
                  className={styles.icon}
                  onClick={() => copyToClipboard(codeContent)}
                />
              </HStack>
              <Highlight className="javascript">{codeContent}</Highlight>
            </VStack>
          </VStack>
        </VStack>
      );

      lastIndex = codeEnd;
    }

    if (lastIndex < response.length) {
      codeBlocks.push(<Text key={lastIndex}>{response.slice(lastIndex)}</Text>);
    }

    return codeBlocks;
  };

  return (
    <main className={styles.main}>
      <VStack w="100%" alignItems="flex-start">
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
              {contractSummary.split("\n").map((line, index) => (
                <Text key={index}>{line}</Text>
              ))}
            </VStack>
            <VStack className={styles.contractLeftSubsection}>
              <Text className={styles.sectionTitle}>
                Contract Interactions via TronWeb
              </Text>
              {formatCode(contractInteraction)}
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
