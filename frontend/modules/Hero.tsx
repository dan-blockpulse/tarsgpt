import { Box } from "@chakra-ui/react";
import styles from "@styles/Main.module.css";

function Hero() {
  return (
    <Box className={styles.heroContainer}>
      <Box className={styles.hero} bgImage="/hero.png" />
    </Box>
  );
}

export default Hero;
