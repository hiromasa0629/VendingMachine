import { useContractRead } from "wagmi";
import { config } from "../config";
import { useState } from "react";

const useScores = (abi: any) => {
  const [scores, setScores] = useState<bigint[]>([]);

  const { data: _scores } = useContractRead({
    address: config.ca,
    abi,
    functionName: "scores",
    select: (data: unknown[] | bigint[]) => data as bigint[],
    onSuccess: (data) => setScores(data),
  });

  return { scores, setScores };
};

export default useScores;
