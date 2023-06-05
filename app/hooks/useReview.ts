import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { config } from "../config";
import { useState } from "react";
import { toast } from "react-toastify";

const useReview = (abi: any, address: `0x${string}` | undefined) => {
	const [res, setRes] = useState<boolean>(true);
	const [isAllowedToReview, setIsAllowedToReview] = useState<boolean>(false);
	
  const { data: _isAllowedToReview = false, refetch: refetchIsAllowedToReview } = useContractRead({
    address: config.ca,
    abi,
    functionName: "isAllowedToReview",
    select: (data: unknown[] | boolean) => data as boolean,
		onSuccess: (data) => setIsAllowedToReview(data),
    args: [address],
  });

	const handleReviewButton = () => {
		review?.();
	}

  const { config: reviewConfig } = usePrepareContractWrite({
    address: config.ca,
    abi,
    functionName: "review",
    enabled: isAllowedToReview,
		args: [res]
  });

  const {
    data,
    write: review,
    error: reviewError,
    isError: reviewIsError,
    isLoading: reviewIsLoading,
  } = useContractWrite(reviewConfig);

  const { isLoading: reviewTxIsLoading, isSuccess: reviewTxIsSuccess } =
    useWaitForTransaction({
      hash: data?.hash,
			enabled: isAllowedToReview && !!data,
			onSuccess: async (data) => {
				toast("Thanks for the review!", { type: "success" })
				await refetchIsAllowedToReview();
			}
    });

  return {
    isAllowedToReview,
		review,
		reviewError,
		reviewIsError,
		reviewIsLoading,
		reviewTxIsLoading,
		reviewTxIsSuccess,
		handleReviewButton,
		setRes,
		refetchIsAllowedToReview
  };
};

export default useReview;
