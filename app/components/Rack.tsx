import React, { useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import useMint from "../hooks/useMint";
import useDrink from "../hooks/useDrink";
import useReview from "../hooks/useReview";
import useTokenInfo from "../hooks/useTokenInfo";
import Mint from "./Mint";
import Drink from "./Drink";
import Review from "./Review";

interface RackProps {
	abi: any,
	address: `0x${string}` | undefined
}

const Rack = (props: RackProps) => {
	
	const { abi, address } = props;

  const {
    handleMintButton,
    mint,
    mintError,
    mintIsError,
    mintIsLoading,
    mintTxIsLoading,
    mintTxIsSuccess,
    isAllowedToMint,
    refetchIsAllowedToMint,
  } = useMint(abi, address);

  const {
    isAllowedToDrink,
    drink,
    drinkError,
    drinkIsError,
    drinkIsLoading,
    drinkTxIsLoading,
    drinkTxIsSuccess,
    handleDrinkButton,
    refetchIsAllowedToDrink,
  } = useDrink(abi, address);

  const {
    isAllowedToReview,
    review,
    reviewError,
    reviewIsError,
    reviewIsLoading,
    reviewTxIsLoading,
    reviewTxIsSuccess,
    handleReviewButton,
    setRes,
    refetchIsAllowedToReview,
  } = useReview(abi, address);

  const { metadata } = useTokenInfo(
    abi,
    address,
    isAllowedToDrink,
    isAllowedToReview
  );
	
  useEffect(() => {
    if (!isAllowedToMint) refetchIsAllowedToDrink();
    if (!isAllowedToDrink) refetchIsAllowedToReview();
    if (!isAllowedToReview) refetchIsAllowedToMint();
  }, [isAllowedToDrink, isAllowedToMint, isAllowedToReview]);
	
  return (
    <Card className="h-100">
      <Card.Header>
        {isAllowedToMint && "Mint a soda"}
        {isAllowedToDrink && "Drink your soda"}
        {isAllowedToReview && "Rate your soda"}
      </Card.Header>
      <Card.Body>
				<Row className="justify-content-center align-items-center h-100">
					<Col xs="auto">
						{isAllowedToMint && (
							<Mint
								{...{
									isAllowedToMint,
									mint,
									mintIsLoading,
									mintTxIsLoading,
									handleMintButton,
								}}
							/>
						)}
						{isAllowedToDrink && (
							<Drink
								{...{
									metadata,
									isAllowedToDrink,
									drink,
									drinkIsLoading,
									drinkTxIsLoading,
									drinkTxIsSuccess,
									handleDrinkButton,
									abi,
									address,
								}}
							/>
						)}
						{isAllowedToReview && (
							<Review
								{...{
									metadata,
									isAllowedToReview,
									review,
									reviewIsLoading,
									reviewTxIsLoading,
									reviewTxIsSuccess,
									handleReviewButton,
									setRes,
								}}
							/>
						)}
					</Col>
				</Row>
      </Card.Body>
    </Card>
  );
};

export default Rack;
