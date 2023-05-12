import "@styles/globals.css";
import { Box, ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Navbar from "@modules/Navbar";
import styles from "@styles/Main.module.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Navbar />
      <Component {...pageProps} />
      <Box className={styles.ellipseOne}></Box>
      <Box className={styles.ellipseTwo}></Box>
    </ChakraProvider>
  );
}
