import { VStack } from "@chakra-ui/react";
import dynamic from "next/dynamic";
const Game = dynamic(() =>
  import("../src/components/Game").then(({ Game }) => Game),
  { ssr: false }
);

// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <VStack as="main" bg="purple.800" w="100vw" h="100vh">
      <Game />
    </VStack>
  );
}
