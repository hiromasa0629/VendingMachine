import React from "react";
import { Button } from "react-bootstrap";

interface MintProps {
  isAllowedToMint: boolean;
  mint: (() => void) | undefined;
  mintIsLoading: boolean;
  mintTxIsLoading: boolean;
  handleMintButton: () => void;
}

const Mint = (props: MintProps) => {
  const {
    isAllowedToMint,
    mint,
    mintIsLoading,
    mintTxIsLoading,
    handleMintButton,
  } = props;

  return (
    <>
      {isAllowedToMint && (
        <Button
          disabled={ mintIsLoading || mintTxIsLoading}
          onClick={handleMintButton}
        >
          {mintIsLoading || mintTxIsLoading ? "Minting..." : "Mint"}
        </Button>
      )}
    </>
  );
};

export default Mint;
