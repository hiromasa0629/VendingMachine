import {
  Alchemy,
  AlchemyEventType,
  AlchemySubscription,
  EventFilter,
  Network,
  Utils,
} from "alchemy-sdk";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { ethers } from "ethers";
import fs from "fs";
import { config } from "../config";

interface AlchemySdkProviderProps {
  children: ReactNode;
}

const AlchemySdkContext = createContext<Alchemy>({} as Alchemy);

const AlchemySdkProvider = (props: AlchemySdkProviderProps) => {
  const { children } = props;
  const [alchemy, setAlchemy] = useState<Alchemy>(
    new Alchemy({
      apiKey: process.env.ALCHEMY_SEPOLIA_API_KEY,
      network: Network.ETH_SEPOLIA,
    })
  );

  return (
    <AlchemySdkContext.Provider value={alchemy}>
      {children}
    </AlchemySdkContext.Provider>
  );
};

export const useAlchemySdk = () => useContext(AlchemySdkContext);

export default AlchemySdkProvider;
