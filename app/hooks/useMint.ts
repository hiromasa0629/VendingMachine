import { useState } from "react";
import {
	useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { config } from "../config";
import { toast } from "react-toastify";

const useMint = (abi: any, address: `0x${string}` | undefined) => {
  const [randomIndex, setRandomIndex] = useState<number>(0);
	const [isAllowedToMint, setIsAllowedToMint] = useState<boolean>(false);

  const handleMintButton = () => {
		const random = Math.floor(Math.random() * 10);
		console.log(random);
    setRandomIndex(random);
    mint?.();
  };
	
	const { data: _isAllowedToMint = false, refetch: refetchIsAllowedToMint } = useContractRead({
		address: config.ca,
		abi,
		functionName: 'isAllowedToMint',
		select: (data: unknown[] | boolean) => data as boolean,
		onSuccess: (data) => setIsAllowedToMint(data),
		args: [address]
	});

	const { config: mintConfig } = usePrepareContractWrite({
		address: config.ca,
		abi: abi,
		functionName: "mint",
		args: [randomIndex],
		enabled: isAllowedToMint
	});

	const { data, write: mint, error: mintError, isError: mintIsError, isLoading: mintIsLoading } =
		useContractWrite(mintConfig);

	const { isLoading: mintTxIsLoading, isSuccess: mintTxIsSuccess, refetch: refetchMintTx } =
		useWaitForTransaction({
			hash: data?.hash,
			enabled: isAllowedToMint && !!data,
			onSuccess: async (data) => {
				toast("Minted a soda", { type: "success" })
				await refetchIsAllowedToMint();
			}
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
