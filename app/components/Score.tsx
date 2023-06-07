import React from 'react'
import { Card, Col, Image, Row } from 'react-bootstrap'

const drinks = [
	["QmcM1rESgb6sJPtPRjzM3Q5kTD7EtrDCK3XnF4FMNAmNGX", "7 UP"],
	["QmWwqsi4c2p9nm58tkHWby2fQ6iQcpaVtR1XNFpQyKDQvc", "A&W"],
	["QmTSLgrjVz6PwP6irpsKDYkh1frvz3Z5hrcojkojYqhnQK", "Coca-cola"],
	["QmRJuHkmkrhSAT8XBgiPxXZjdJ6yfACqPdsLK2NNvjRR4L", "Dr Pepper"],
	["QmZPBDcqyeCfcx3Vhb7Kh5jTFfX6ZFo38ma2oAVGZYx6D5", "Fanta"],
	["Qmf4HUyLzySzSBBL2JHJyvCAFjda2jBv3nrd1LBCmtDVco", "Jolly Cola"],
	["Qmc8RKUTfnZWKDBKg46M2SVSchFukKtbC4zEkVfQkLJr36", "Kickapoo"],
	["Qmb5AVY3dHxuyns2PFJF8Le7e1Jxjzn2m2yTiw9ru32GhH", "Pepsi"],
	["QmRhiA1jH7JiMNS2VJPkYJ7BS2gFHgMaPumPuT3JhfFX1d", "Sarsi"],
	["QmRAdDCJcY2veJunLxyGjkusUaMVBh8jqQ6QsaiP7JKoQU", "Sprite"],
]

interface ScoreProps {
	scores: bigint[]
}

const Score = (props: ScoreProps) => {
	const { scores } = props
	return (
		<Card>
			<Card.Header>Scores</Card.Header>
			<Card.Body>
				<Row className="justify-content-center">
					{
						scores.map((value, index) => (
							<Col xs="auto" key={index}>
								<div>
									<Image src={`https://ipfs.io/ipfs/${drinks[index][0]}`} thumbnail width={100} style={{ objectFit: 'contain', height: 100 }}/>
								</div>
								<div className="text-center">
									{value.toString()}
								</div>
							</Col>
						))
					}
				</Row>
			</Card.Body>
		</Card>
	)
}

export default Score