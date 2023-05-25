import { HStack, VStack, Text, Box } from "@chakra-ui/react";
import styles from "@styles/Main.module.css";
import { CopyIcon } from "@chakra-ui/icons";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { metadata, methodMap, methods, tokenBalances } from "@data/sample";
import Highlight from "react-highlight";
import { useToast, Link as ChakraLink, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Navbar from "@modules/Navbar";
import { useEffect, useState } from "react";
import Loading from "@modules/Loading";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

const API_URL =
  process.env.NEXT_PUBLIC_API_ENV != "prod"
    ? process.env.NEXT_PUBLIC_API_URL_DEV
    : process.env.NEXT_PUBLIC_API_URL_PROD;

export default function Main() {
  const toast = useToast();
  const router = useRouter();
  const { address } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [ethers, setEthers] = useState("");
  const [wagmi, setWagmi] = useState("");
  const [abi, setAbi] = useState("");
  const [functions, setFunctions] = useState([]);

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        if (!address) return;
        const response = await fetch(`${API_URL}/contract/${address}`);
        const { summary, ethers, wagmi, functions, abi } =
          await response.json();
        setSummary(summary);
        setEthers(ethers);
        setWagmi(wagmi);
        setFunctions(functions);
        setAbi(abi);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchContractData();
  }, [address]);

  const copyToClipboard = async (
    text: string,
    title: string,
    description: string
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title,
        description,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const formatCode = (response: string) => {
    const codeBlockRegex = /(\d+\.)([\s\S]*?)```(?:javascript)?([\s\S]*?)```/g;
    const codeBlocks: JSX.Element[] = [];

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
                  onClick={() =>
                    copyToClipboard(
                      codeContent,
                      "Code snippet copied.",
                      "Successfully copied to your clipboard."
                    )
                  }
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

  if (!address) return <Text>Invalid address</Text>;

  if (isLoading) return <Loading />;

  return (
    <VStack>
      <Navbar />
      <main className={styles.main}>
        <VStack w="100%" alignItems="flex-start">
          <HStack w="100%" paddingTop="1.5rem" paddingBottom=".5rem">
            <VStack className={styles.contractName}>
              <Text>{metadata.contractName}</Text>
            </VStack>
            <Text className={styles.contractAddress}>{address}</Text>
            <VStack className={styles.iconContainer}>
              <CopyIcon
                className={styles.icon}
                onClick={() =>
                  copyToClipboard(
                    address as string,
                    "Address copied.",
                    "Successfully copied to your clipboard."
                  )
                }
              />
            </VStack>
            <ChakraLink
              href={`https://www.mintscan.io/evmos/evm/contract/${address}`}
              isExternal
            >
              <VStack className={styles.iconContainer}>
                <ExternalLinkIcon className={styles.icon} />
              </VStack>
            </ChakraLink>
          </HStack>
          <HStack w="100%" gap={1} alignItems="flex-start">
            <VStack w="70%" gap={1}>
              <VStack className={styles.contractLeftSubsection}>
                <Text className={styles.sectionTitle}>Contract Summary</Text>
                {summary.split("\n").map((line, index) => (
                  <Text key={index}>{line}</Text>
                ))}
              </VStack>
              <VStack className={styles.contractSubsection}>
                <VStack className={styles.sectionTitleContainer}>
                  <Text className={styles.sectionTitle}>
                    Contract Interactions
                  </Text>
                </VStack>
                <Tabs
                  width="102%"
                  variant="custom"
                  paddingLeft="1rem"
                  paddingRight="1rem"
                >
                  <TabList>
                    <Tab w="100%">Ethers.js</Tab>
                    <Tab w="100%">wagmi.sh</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>{formatCode(ethers)}</TabPanel>
                    <TabPanel>{formatCode(wagmi)}</TabPanel>
                  </TabPanels>
                </Tabs>
              </VStack>
            </VStack>
            <VStack w="30%" gap={1}>
              <VStack className={styles.contractRightSubsection}>
                <Text className={styles.sectionTitle}>Contract Info</Text>
                <HStack>
                  <Text>· Total assets: </Text>
                  <Text>{metadata.totalAssets} TRX</Text>
                </HStack>
                <HStack>
                  <Text>· Transaction count: </Text>
                  <Text>{metadata.txnCount} transactions</Text>
                </HStack>
                <HStack>
                  <Text>· Created on: </Text>
                  <Text>{metadata.createdOn}</Text>
                </HStack>
                <HStack>
                  <Text>· Creator : </Text>
                  <Text>{metadata.creator}</Text>
                </HStack>
              </VStack>
              <VStack className={styles.contractRightSubsection}>
                <Text className={styles.sectionTitle}>Token Balances</Text>
                {tokenBalances.map(({ name, value, fiatValue, imageUrl }) => (
                  <HStack w="100%" justifyContent="space-between" key={name}>
                    <HStack>
                      <Image
                        src={imageUrl}
                        alt="token icon"
                        className={styles.tokenIcon}
                      />
                      <Text>{name}</Text>
                    </HStack>
                    <VStack alignItems="flex-end">
                      <Text className={styles.tokenValue}>
                        {value.toFixed(2)}
                      </Text>
                      <Text className={styles.fiatValue}>${fiatValue}</Text>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
              <VStack className={styles.contractRightSubsection}>
                <Text className={styles.sectionTitle}>Contract Calls</Text>
                <Text fontWeight={600}>Top 5 Methods</Text>
                {methods.map(({ name, percentage }, idx) => (
                  <HStack
                    key={`method-${idx}`}
                    w="100%"
                    justifyContent="flex-start !important"
                  >
                    <Text w="100px">{name}</Text>
                    <Box className={styles.ratioContainer}>
                      <Box
                        className={styles.ratioBar}
                        width={`${percentage}%`}
                      ></Box>
                    </Box>
                    <Text pl="10px">{percentage}%</Text>
                  </HStack>
                ))}
              </VStack>
              <VStack className={styles.contractRightSubsection}>
                <HStack w="100%" justifyContent="space-between">
                  <Text className={styles.sectionTitle}>Contract Methods</Text>
                  <CopyIcon
                    className={styles.icon}
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(abi),
                        "Contract ABI copied.",
                        "Successfully copied to your clipboard."
                      )
                    }
                  />
                </HStack>
                {address == "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
                  ? Object.values(methodMap).map((method: string, idx) => (
                      <Text key={idx} className={styles.method}>
                        {idx + 1}. {method}
                      </Text>
                    ))
                  : functions.map((method, idx) => (
                      <Text key={idx} className={styles.method}>
                        {idx + 1}. {method}
                      </Text>
                    ))}
              </VStack>
            </VStack>
          </HStack>
        </VStack>
      </main>
    </VStack>
  );
}
