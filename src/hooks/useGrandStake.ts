import Web3 from "web3";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useWallet } from "@binance-chain/bsc-use-wallet";

import { fetchGrandPoolsUserDataAsync } from "state/actions";
import { grandStake } from "utils/callHelpers";
import { useGrandPool, useSousChef } from "./useContract";

const useGrandStake = (poolAddress: any) => {
  const dispatch = useDispatch();
  const { account } = useWallet();
  const GrandContract = useGrandPool(poolAddress);

  const handleStake = useCallback(
    async (amount: string, decimal = 18) => {
      const txHash = await grandStake(GrandContract, amount, account, decimal);
      dispatch(fetchGrandPoolsUserDataAsync(account));
      return txHash;
    },
    [account, dispatch, GrandContract]
  );

  return { onGrandStake: handleStake };
};

export default useGrandStake;
