import { HStack, VStack, Image, Input } from "@chakra-ui/react";
import styles from "@styles/Main.module.css";
import { Search2Icon } from "@chakra-ui/icons";
import { useState } from "react";
import { useRouter } from "next/router";
import Hero from "@modules/Hero";

export default function Main() {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  function handleInputChange(e: any) {
    setInputValue(e.target.value);
  }

  function handleNavigation(e: any) {
    e.preventDefault();
    router.push(`/contract/${inputValue}`);
  }

  return (
    <VStack>
      <main className={styles.main}>
        <VStack w="100%">
          <Image
            src="/logo.png"
            alt="Logo"
            cursor="pointer"
            className={styles.logo}
          ></Image>
          <HStack className={styles.searchbar}>
            <Search2Icon color="white" />
            <form onSubmit={handleNavigation} style={{ width: "100%" }}>
              <Input
                className={styles.searchInput}
                placeholder={"Search contract by address"}
                onSubmit={handleNavigation}
                onChange={handleInputChange}
              />
            </form>
          </HStack>
        </VStack>
      </main>
      <Hero />
    </VStack>
  );
}
