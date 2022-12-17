import { VStack, Box } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import type { FC } from "react";
import * as Browser from "../browser";
import { Game as GameLib, GAME_SIZE } from "../game";

type GameProps = {};

export const Game: FC<GameProps> = () => {
  const gameRef = useRef<GameLib | undefined>(undefined)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!Browser.isOnServer() && gameRef.current == null) {
      gameRef.current = GameLib.initialize(canvasRef.current);
    }
  }, []);

  return (
    <VStack h="full" w="full" alignItems="center" justifyContent="center">
      <Box
        h={GAME_SIZE.height}
        w={GAME_SIZE.width}
      >
        <canvas ref={canvasRef} />
      </Box>
    </VStack>
  );
};
