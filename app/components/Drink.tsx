import React from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import SodaImage from "./SodaImage";
import useTokenInfo from "../hooks/useTokenInfo";

interface DrinkProps {
  metadata: { name: string; image: string } | undefined;
  isAllowedToDrink: boolean;
  drink: (() => void) | undefined;
  drinkIsLoading: boolean;
  drinkTxIsLoading: boolean;
  handleDrinkButton: () => void;
  drinkTxIsSuccess: boolean;
	abi: any;
	address: `0x${string}` | undefined
}

const Drink = (props: DrinkProps) => {
  const {
    // metadata,
    isAllowedToDrink,
    drink,
    drinkIsLoading,
    drinkTxIsLoading,
    drinkTxIsSuccess,
    handleDrinkButton,
		abi, address
  } = props;
	
  const { tokenId, tokenIndex, tokenUri, metadata } = useTokenInfo(
    abi,
    address,
    isAllowedToDrink,
  );

  return (
		<Row className="align-items-center">
			<Col xs="6">
				{metadata && <SodaImage src={`https://ipfs.io/ipfs/${metadata.image}`} />}
			</Col>
			<Col xs="6">
				<h4>{metadata?.name}</h4>
				<Button
					disabled={!drink || drinkIsLoading || drinkTxIsLoading}
					onClick={() => handleDrinkButton()}
				>
					Drink
				</Button>
			</Col>
		</Row>
  );
};

export default Drink;
