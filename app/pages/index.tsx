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
import Mint from "../components/Mint";
import useDrink from "../hooks/useDrink";
import useTokenInfo from "../hooks/useTokenInfo";
import Drink from "../components/Drink";
import useReview from "../hooks/useReview";
import Review from "../components/Review";
import dynamic from "next/dynamic";
import { useAlchemySdk } from "../providers/AlchemySdkProvider";
import { Wallet, ethers } from "ethers";
import {
  AlchemyProvider,
  Contract,
  EventFilter,
  Network,
  Utils,
} from "alchemy-sdk";
import { config } from "../config";
import useActionHistory from "../hooks/useActionHistory";
import Rack from "../components/Rack";
import Histories from "../components/Histories";
import Score from "../components/Score";
import useScores from "../hooks/useScores";

export const getServerSideProps = async () => {
  const { abi } = JSON.parse(
    fs.readFileSync("artifacts/contracts/SodasNFT.sol/SodasNFT.json", "utf8")
  );

  const contract = new Contract(config.ca, abi);

  return {
    props: { abi },
  };
};

const Home = ({
  abi,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { address } = useAccount();
  const { scores, setScores } = useScores(abi);

  return (
    <div>
      <Head>
        <title>Vending Machine</title>
      </Head>
      <Container className="py-3">
        <Header />
        <Row className="py-3" style={{ height: 400 }}>
          <Col xs="4" className="h-100">
            <Rack abi={abi} address={address} />
          </Col>
          <Col xs="8" className="h-100">
            <Histories setScores={setScores} />
          </Col>
        </Row>
        <Row className="py-3">
          <Col xs="12">
            <Score scores={scores} />
          </Col>
        </Row>
        <Row className="py-3 justify-content-center">
          <Col xs="auto">
            <a
              href="https://github.com/hiromasa0629/VendingMachine"
              target="_blank"
            >
              Github
            </a>
          </Col>
          <Col xs="auto">
            CA:{" "}
            <a
              href={`https://sepolia.etherscan.io/address/${config.ca}`}
              target="_blank"
            >
              {config.ca}
            </a>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
