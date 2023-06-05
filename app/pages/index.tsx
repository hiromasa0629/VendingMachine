import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import Head from "next/head";
import Header from "../components/Header";
import fs from "fs";
import { InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useMint from "../hooks/useMint";
import { config } from "../config";
import Mint from "../components/Mint";
import useDrink from "../hooks/useDrink";
import useTokenInfo from "../hooks/useTokenInfo";
import Drink from "../components/Drink";
import useReview from "../hooks/useReview";
import Review from "../components/Review";
import dynamic from "next/dynamic";

export const getServerSideProps = async () => {
  const { abi } = JSON.parse(
    fs.readFileSync("artifacts/contracts/SodasNFT.sol/SodasNFT.json", "utf8")
  );
  return {
    props: { abi },
  };
};

const Home = ({
  abi,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { address } = useAccount();

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
		refetchIsAllowedToDrink
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
		refetchIsAllowedToReview
	} = useReview(abi, address);

  const { tokenId, tokenIndex, tokenUri, metadata } = useTokenInfo(
    abi,
    address,
    isAllowedToDrink,
		isAllowedToReview
  );
	
	// console.log(tokenId, tokenIndex);

  useEffect(() => {
    if (mintIsError) toast(mintError?.name, { type: "error" });
    if (drinkIsError) toast(drinkError?.name, { type: "error" });
		if (reviewIsError) toast(reviewError?.name, { type: "error" });
  }, [mintIsError, drinkIsError, reviewIsError]);

	useEffect(() => {
		if (!isAllowedToMint) refetchIsAllowedToDrink();
		if (!isAllowedToDrink) refetchIsAllowedToReview();
		if (!isAllowedToReview) refetchIsAllowedToMint();
	}, [isAllowedToDrink, isAllowedToMint, isAllowedToReview])

  return (
    <div>
      <Head>
        <title>Vending Machine</title>
      </Head>
      <Container className="py-3">
        <Header />
        <Row className="py-3">
          <Col xs="6">
            <Card>
              <Card.Header>Soda</Card.Header>
              <Card.Body>
                <Mint
                  {...{
                    isAllowedToMint,
                    mint,
                    mintIsLoading,
                    mintTxIsLoading,
                    handleMintButton,
                  }}
                />
								<Drink
									{...{
										metadata,
										isAllowedToDrink,
										drink,
										drinkIsLoading,
										drinkTxIsLoading,
										drinkTxIsSuccess,
										handleDrinkButton
									}}
								/>
								<Review 
									{...{
										metadata,
										isAllowedToReview,
										review,
										reviewIsLoading,
										reviewTxIsLoading,
										reviewTxIsSuccess,
										handleReviewButton,
										setRes
									}}
								/>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
