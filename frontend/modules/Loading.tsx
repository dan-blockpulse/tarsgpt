import { VStack, Text } from "@chakra-ui/react";
import styles from "@styles/Main.module.css";
import Hero from "@modules/Hero";
import LoadingLottie from "./LoadingLottie";
import { useEffect, useState } from "react";

export default function Loading() {
  const [message, setMessage] = useState("Fetching contract information");

  useEffect(() => {
    const timers = [
      setTimeout(() => setMessage("Transferring data to GPT"), 10000),
      setTimeout(() => setMessage("Awaiting response from GPT"), 30000),
      setTimeout(() => setMessage("Processing response from GPT"), 5000),
    ];

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <VStack>
      <main className={styles.main}>
        <LoadingLottie />
        <Text className={styles.loadingText}>{message}</Text>
        <Text className={styles.loadingSubtext}>
          Due to GPT-4 API traffic, this may take up to ~10 minutes to process.
        </Text>
      </main>
      <Hero />
    </VStack>
  );
}
