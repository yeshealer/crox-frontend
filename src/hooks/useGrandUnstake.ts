import { useCallback } from "react";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { useDispatch } from "react-redux";
import { fetchGrandPoolsUserDataAsync } from "state/actions";
import { grandUnstake } from "utils/callHelpers";
import { useGrandPool } from "./useContract";

const useGrandUnstake = (poolAddress: any) => {
  const dispatch = useDispatch();
  const { account } = useWallet();
  const GrandContract = useGrandPool(poolAddress);

  const handleUnstake = useCallback(
    async (amount: string, decimal = 18) => {
      const txHash = await grandUnstake(GrandContract, amount, account, decimal);
      dispatch(fetchGrandPoolsUserDataAsync(account));
      return txHash;
    },
    [account, dispatch, GrandContract]
  );

  return { onGrandUnstake: handleUnstake };
};

export default useGrandUnstake;
