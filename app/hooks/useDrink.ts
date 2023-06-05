import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { config } from "../config";
import { useState } from "react";
import { toast } from "react-toastify";

const useDrink = (abi: any, address: `0x${string}` | undefined) => {
	const [isAllowedToDrink, setIsAllowedToDrink] = useState<boolean>(false);
	
  const { data: _isAllowedToDrink = false, refetch: refetchIsAllowedToDrink } = useContractRead({
    address: config.ca,
    abi,
    functionName: "isAllowedToDrink",
    select: (data: unknown[] | boolean) => data as boolean,
		onSuccess: (data) => setIsAllowedToDrink(data),
    args: [address],
  });


	const handleDrinkButton = () => {
		drink?.();
	}

  const { config: drinkConfig } = usePrepareContractWrite({
    address: config.ca,
    abi,
    functionName: "drink",
    enabled: isAllowedToDrink,
  });

  const {
    data,
    write: drink,
    error: drinkError,
    isError: drinkIsError,
    isLoading: drinkIsLoading,
  } = useContractWrite(drinkConfig);

  const { isLoading: drinkTxIsLoading, isSuccess: drinkTxIsSuccess } =
    useWaitForTransaction({
      hash: data?.hash,
			enabled: isAllowedToDrink && !!data,
			onSuccess: async (data) => {
				toast("How was the soda ?", { type: "success" })
				await refetchIsAllowedToDrink();
			}
    });

  return {
    isAllowedToDrink,
		drink,
		drinkError,
		drinkIsError,
		drinkIsLoading,
		drinkTxIsLoading,
		drinkTxIsSuccess,
		handleDrinkButton,
		refetchIsAllowedToDrink
  };
};

export default useDrink;
