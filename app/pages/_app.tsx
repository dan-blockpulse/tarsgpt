import "@styles/globals.css";
import { Box, ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Navbar from "@modules/Navbar";
import styles from "@styles/Main.module.css";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <ChakraProvider>
      <Navbar />
      <Component {...pageProps} />
      <Box className={styles.ellipseOne}></Box>
      <Box className={styles.ellipseTwo}></Box>
    </ChakraProvider>
  );
}
