import { Alchemy } from "alchemy-sdk";
import React, { Dispatch, SetStateAction } from "react";
import useActionHistory from "../hooks/useActionHistory";
import { Badge, Card, Col, ListGroup, Row } from "react-bootstrap";
import { useAlchemySdk } from "../providers/AlchemySdkProvider";

const drinks = [
  ["7 UP"],
  ["A&W"],
  ["Coca-cola"],
  ["Dr Pepper"],
  ["Fanta"],
  ["Jolly Cola"],
  ["Kickapoo"],
  ["Pepsi"],
  ["Sarsi"],
  ["Sprite"],
];

interface HistoriesProps {
	setScores: Dispatch<SetStateAction<bigint[]>>
}

const Histories = (props: HistoriesProps) => {
  const alchemy = useAlchemySdk();
	const { setScores } = props;
  const { histories } = useActionHistory(alchemy, setScores);

  return (
    <Card className="h-100">
      <Card.Header>Histories</Card.Header>
      <Card.Body style={{ overflowY: "scroll" }}>
        <ListGroup>
          <ListGroup.Item>
            <Row>
              <Col>
                <strong>TxHash</strong>
              </Col>
              <Col>
                <strong>From</strong>
              </Col>
              <Col className="text-end">
                <strong>Action</strong>
              </Col>
              <Col className="text-end">
                <strong>Soda</strong>
              </Col>
            </Row>
          </ListGroup.Item>
          {histories
            .slice(0)
            .reverse()
            .map((value, index) => (
              <ListGroup.Item key={index}>
                <Row className="justify-content-between">
                  <Col xs="3" className="text-truncate">
                    <a
                      href={`https://sepolia.etherscan.io/tx/${value.txHash}`}
                      target="_blank"
                    >
                      {value.txHash}
                    </a>
                  </Col>
                  <Col xs="3" className="text-truncate">
                    <a
                      href={`https://sepolia.etherscan.io/address/${value.from}`}
                      target="_blank"
                    >
                      {value.from}
                    </a>
                  </Col>
                  <Col xs="3" className="text-end">
                    <Badge
                      bg={
                        value.type === "Mint"
                          ? "primary"
                          : value.type === "Drink"
                          ? "info"
                          : "success"
                      }
                    >
                      {value.type}
                    </Badge>
                  </Col>
                  <Col xs="3" className="text-end">
                    <span className="pl-5">
                      {value.type === "Review"
                        ? value.data.res
                          ? "✅"
                          : "❌"
                        : ""}{" "}
                      {drinks[value.data.index]}
                    </span>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default Histories;
