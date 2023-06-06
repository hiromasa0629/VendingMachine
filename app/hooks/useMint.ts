import { useEffect, useState } from "react";
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { config } from "../config";
import { toast } from "react-toastify";

const useMint = (abi: any, address: `0x${string}` | undefined) => {
  // const [randomIndex, setRandomIndex] = useState<number>(0);
  const [isAllowedToMint, setIsAllowedToMint] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const handleMintButton = () => {
    const random = Math.floor(Math.random() * 10);
    mint?.({ args: [random] });
  };

  const { data: _isAllowedToMint = false, refetch: refetchIsAllowedToMint } =
    useContractRead({
      address: config.ca,
      abi,
      functionName: "isAllowedToMint",
      select: (data: unknown[] | boolean) => data as boolean,
      onSuccess: (data) => setIsAllowedToMint(data),
      args: [address],
    });

  const {
    data,
    write: mint,
    error: mintError,
    isError: mintIsError,
    isLoading: mintIsLoading,
  } = useContractWrite({
    address: config.ca,
    abi: abi,
    functionName: "mint",
    onSuccess: (data, variables, context) => setTxHash(data.hash),
		onError: (error, variables, context) => toast.error(error.name)
  });

  const {
    isLoading: mintTxIsLoading,
    isSuccess: mintTxIsSuccess,
  } = useWaitForTransaction({
    hash: txHash,
    enabled: isAllowedToMint && !!data,
    onSuccess: async (data) => {
      toast("Minted a soda", { type: "success" });
      await refetchIsAllowedToMint();
      setTxHash(undefined);
    },
  });

  return {
    handleMintButton,
    mint,
    mintError,
    mintIsError,
    mintIsLoading,
    mintTxIsLoading,
    mintTxIsSuccess,
    isAllowedToMint,
    refetchIsAllowedToMint,
  };
};

export default useMint;
