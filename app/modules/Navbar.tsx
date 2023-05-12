import Link from "next/link";
import styles from "@styles/Navbar.module.css";
import { Box, HStack, Image, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Search2Icon } from "@chakra-ui/icons";

type SearchBarProps = {
  handleInputChange?: (e: any) => void;
  handleNavigation?: (e: any) => void;
};

const Navbar = () => {
  const roukter = useRouter();

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
        <form onSubmit={() => {}} style={{ width: "100%" }}>
          <Input
            className={styles.searchInput}
            placeholder={"Search contract by address"}
            onSubmit={() => {}}
            onChange={() => {}}
          />
        </form>
      </HStack>
      <Box className={styles.rightSection} />
    </HStack>
  );
};

export default Navbar;
