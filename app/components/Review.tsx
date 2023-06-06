import React, { Dispatch, SetStateAction } from "react";
import { Button, Col, Image, Row, Form } from "react-bootstrap";
import SodaImage from "./SodaImage";

interface ReviewProps {
  metadata: { name: string; image: string } | undefined;
  isAllowedToReview: boolean;
  review: (() => void) | undefined;
  reviewIsLoading: boolean;
  reviewTxIsLoading: boolean;
  handleReviewButton: () => void;
  reviewTxIsSuccess: boolean;
	setRes: Dispatch<SetStateAction<boolean>>
}

const Review = (props: ReviewProps) => {
  const {
    metadata,
    isAllowedToReview,
    review,
    reviewIsLoading,
    reviewTxIsLoading,
    reviewTxIsSuccess,
    handleReviewButton,
		setRes
  } = props;

  return (
		<Row className="align-items-center">
			<Col xs="6">
				{metadata && <SodaImage src={`https://ipfs.io/ipfs/${metadata.image}`} />}
			</Col>
			<Col xs="6">
				<h4>{metadata?.name}</h4>
				<span>How was your soda, rate it</span>
				<Form>
					<Form.Check
						type={'radio'}
						name="res"
						label="Love it"
						onChange={(e) => setRes(true)}
						defaultChecked
					/>
					<Form.Check
						type={'radio'}
						name="res"
						label="Nah"
						onChange={(e) => setRes(false)}
					/>
				</Form>
				<Button
					disabled={!review || reviewIsLoading || reviewTxIsLoading}
					onClick={() => handleReviewButton()}
				>
					{reviewTxIsLoading || reviewIsLoading ? 'Reviewing...' : 'Review'}
				</Button>
			</Col>
		</Row>
	);
};

export default Review;
