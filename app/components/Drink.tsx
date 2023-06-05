import React from "react";
import { Button, Col, Image, Row } from "react-bootstrap";

interface DrinkProps {
  metadata: { name: string; image: string } | undefined;
  isAllowedToDrink: boolean;
  drink: (() => void) | undefined;
  drinkIsLoading: boolean;
  drinkTxIsLoading: boolean;
  handleDrinkButton: () => void;
  drinkTxIsSuccess: boolean;
}

const Drink = (props: DrinkProps) => {
  const {
    metadata,
    isAllowedToDrink,
    drink,
    drinkIsLoading,
    drinkTxIsLoading,
    drinkTxIsSuccess,
    handleDrinkButton,
  } = props;

  return (
    <>
      {metadata && isAllowedToDrink && (
        <Row className="align-items-center">
          <Col xs="6">
            <Image
              rounded
              src={`https://ipfs.io/ipfs/${metadata.image}`}
              fluid
            />
          </Col>
          <Col xs="6">
            <h4>{metadata.name}</h4>
            <Button
              disabled={!drink || drinkIsLoading || drinkTxIsLoading}
              onClick={() => handleDrinkButton()}
            >
              Drink
            </Button>
            {drinkTxIsSuccess && <h4>How was the soda ?</h4>}
          </Col>
        </Row>
      )}
    </>
  );
};

export default Drink;
