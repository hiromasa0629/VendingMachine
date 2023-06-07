import {
  useAccount,
} from "wagmi";
import { Col, Container, Row } from "react-bootstrap";
import Head from "next/head";
import Header from "../components/Header";
import fs from "fs";
import { InferGetServerSidePropsType } from "next";
import { config } from "../config";
import Rack from "../components/Rack";
import Histories from "../components/Histories";
import Score from "../components/Score";
import useScores from "../hooks/useScores";

export const getServerSideProps = async () => {
  const abi = JSON.parse(
    fs.readFileSync("abi/SodasNFT.json", "utf8")
  );

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
