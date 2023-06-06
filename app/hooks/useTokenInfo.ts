import { useContractRead, useQuery } from "wagmi";
import { config } from "../config";
import { useState } from "react";

const useTokenInfo = (
  abi: any,
  address: `0x${string}` | undefined,
  isAllowedToDrink: boolean = false,
	isAllowedToReview: boolean = false
) => {
  const [metadata, setMetadata] = useState<{ name: string; image: string }>();
	const [tokenIdNIndex, setTokenIdNIndex] = useState<BigInt[] | undefined>();
	const [tokenURI, setTokenURI] = useState<string>()

  const { data: _tokenIdNIndex } = useContractRead({
    address: config.ca,
    abi,
    functionName: "tokenIdByAddress",
    args: [address],
    select: (data: unknown[] | BigInt[]) => data as BigInt[],
    enabled: isAllowedToDrink || isAllowedToReview,
		onSuccess: (data) => setTokenIdNIndex(data)
  });

  const { data: tokenUri } = useContractRead({
    address: config.ca,
    abi,
    functionName: "tokenURIs",
    args: [tokenIdNIndex?.[0]],
    select: (data: unknown[] | string) => data as string,
    enabled: (isAllowedToDrink || isAllowedToReview) && !!tokenIdNIndex,
		onSuccess: (data) => setTokenURI(data)
  });

  const { isLoading: getMetadataIsLoading, isSuccess: getMetadataIsSuccess } =
    useQuery(["getMetadata"], {
      queryFn: async () => (await fetch(tokenUri!)).json(),
			onSuccess: (res) => setMetadata(res),
      enabled: !!tokenUri,
    });
	
	console.log(tokenIdNIndex);
	console.log(metadata);

  return {
    tokenId: tokenIdNIndex?.[0],
    tokenIndex: tokenIdNIndex?.[1],
    tokenUri,
		metadata
  };
};

export default useTokenInfo;
