import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { config } from "../config";
import { Alchemy, Utils } from "alchemy-sdk";
import { useAlchemySdk } from "../providers/AlchemySdkProvider";

type ActionType = "Mint" | "Drink" | "Review";

interface History {
  txHash: string;
  from: string;
  type: ActionType;
  data: { index: number; res?: boolean };
}

const extractInfoFromLog = (evt: any, type: ActionType) => {
  const { data, transactionHash } = evt;
  const trimmedData = data.substring(2);
  const from = `0x${trimmedData.substring(24, 64)}`;
  const index = parseInt(trimmedData.substring(64, 128));
  let res: boolean = false;
  if (type === "Review") {
    res = Boolean(parseInt(trimmedData.substring(128)));
  }
  const newHistory: History = {
    txHash: transactionHash,
    from: from,
    type: type,
    data: { index: index, res: res },
  };
  return newHistory;
};

const mintTopic = Utils.id("Mint(address,uint256)");
const drinkTopic = Utils.id("Drink(address,uint256)");
const reviewTopic = Utils.id("Review(address,uint256,bool)");

const useActionHistory = (alchemy: Alchemy, setScores: Dispatch<SetStateAction<bigint[]>>) => {
  const [histories, setHistories] = useState<History[]>([]);

  useEffect(() => {
    if (alchemy) {
      const handleWs = (evt: any, type: ActionType) => {
        setHistories((prev) => {
          if (prev.find((value) => value.txHash === evt.transactionHash))
            return prev;
          const newHistory = extractInfoFromLog(evt, type);
					if (newHistory.type === "Review" && newHistory.data.res) {
						setScores(prev => {
							const tmp = prev[newHistory.data.index];
							prev[newHistory.data.index] = tmp + BigInt(1);
							return [...prev];
						});
					}
					if (prev.length === 20) prev.shift();
          return [...prev, newHistory];
        });
      };

      alchemy.core
        .getLogs({
          fromBlock: 3639996,
          toBlock: "latest",
          address: config.ca,
          topics: [[mintTopic, drinkTopic, reviewTopic],],
        })
        .then((value) => {
          const newHistories: History[] = [];
          for (const v of value) {
            let type: ActionType;
            if (v.topics[0] === mintTopic) type = "Mint";
            else if (v.topics[0] === drinkTopic) type = "Drink";
            else type = "Review";
            const newHistory = extractInfoFromLog(v, type);
						if (newHistories.length === 20) newHistories.shift();
            newHistories.push(newHistory);
          }
          setHistories(newHistories);
        });
			
			const filter = {
				address: config.ca,
				topics: [
					[mintTopic, drinkTopic, reviewTopic]
				]
			}
			
			alchemy.ws.on(filter, (evt) => {
				const { topics } = evt;
				if (topics[0] === mintTopic) handleWs(evt, "Mint");
				if (topics[0] === drinkTopic) handleWs(evt, "Drink");
				if (topics[0] === reviewTopic) handleWs(evt, "Review");
			});
    }
  }, [alchemy]);

  return { histories };
};

export default useActionHistory;
