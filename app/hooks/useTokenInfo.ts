import { useContractRead, useQuery } from "wagmi";
import { config } from "../config";
import { useState } from "react";

const useTokenInfo = (
  abi: any,
  address: `0x${string}` | undefined,
  isAllowedToDrink: boolean,
	isAllowedToReview: boolean
) => {
  const [metadata, setMetadata] = useState<{ name: string; image: string }>();

  const { data: tokenIdNIndex } = useContractRead({
		
    address: config.ca,
    abi,
    functionName: "tokenIdByAddress",
    args: [address],
    select: (data: unknown[] | BigInt[]) => data as BigInt[],
    enabled: isAllowedToDrink || isAllowedToReview,
  });

  const { data: tokenUri } = useContractRead({
    address: config.ca,
    abi,
    functionName: "tokenURIs",
    args: [tokenIdNIndex?.[0]],
    select: (data: unknown[] | string) => data as string,
    enabled: (isAllowedToDrink || isAllowedToReview) && !!tokenIdNIndex,
  });

  const { isLoading: getMetadataIsLoading, isSuccess: getMetadataIsSuccess } =
    useQuery(["getMetadata"], {
      queryFn: async () => (await fetch(tokenUri!)).json(),
			onSuccess: (res) => setMetadata(res),
      enabled: !!tokenUri,
    });

  return {
    tokenId: tokenIdNIndex?.[0],
    tokenIndex: tokenIdNIndex?.[1],
    tokenUri,
		metadata
  };
};

export default useTokenInfo;
