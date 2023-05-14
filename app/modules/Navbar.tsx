import Link from "next/link";
import styles from "@styles/Navbar.module.css";
import { HStack, Image, Input, VStack } from "@chakra-ui/react";
import { InfoIcon, Search2Icon } from "@chakra-ui/icons";
import { useState } from "react";
import { useRouter } from "next/router";

const Navbar = () => {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  function handleInputChange(e: any) {
    setInputValue(e.target.value);
  }
  function handleNavigation(e: any) {
    e.preventDefault();
    if (!validateTronAddress(inputValue)) return;
    router.push(`/contract/${inputValue}`);
  }

  function validateTronAddress(address: string): boolean {
    return address.startsWith("T") && address.length === 34;
  }
  return (
    <HStack className={styles.navbar}>
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Logo"
          cursor="pointer"
          className={styles.logo}
        ></Image>
      </Link>
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
      <VStack className={styles.rightSection}>
        <InfoIcon className={styles.icon} />
      </VStack>
    </HStack>
  );
};

export default Navbar;
