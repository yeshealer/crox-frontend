import { useCallback } from "react";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { useDispatch } from "react-redux";
import {
  fetchFarmUserDataAsync,
  fetchDualFarmUserDataAsync,
  updateUserBalance,
  updateUserPendingReward,
  fetchGrandPoolsUserDataAsync,
  fetchRastaFarmUserDataAsync
} from "state/actions";
import {
  soushHarvest,
  soushHarvestBnb,
  harvest,
  nextHarvest,
  xpadHarvest,
  grandHarvest,
  compound,
  rastaHarvest,
} from "utils/callHelpers";
import { useMasterchef, useNextGenPool, useSousChef, useGrandPool, useXpadContract, useRastaMasterchef } from "./useContract";

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;

export const useHarvest = (farmPid: number) => {
  const dispatch = useDispatch();
  const { account } = useWallet();
  const masterChefContract = useMasterchef();

  const handleHarvest = useCallback(async () => {
    const txHash = await harvest(masterChefContract, farmPid, account);
    dispatch(fetchFarmUserDataAsync(account));
    return txHash;
  }, [account, dispatch, farmPid, masterChefContract]);

  return { onReward: handleHarvest };
};

export const useRastaHarvest = (farmPid: number) => {
  const dispatch = useDispatch();
  const { account } = useWallet();
  const masterChefContract = useRastaMasterchef();

  const handleHarvest = useCallback(async () => {
    const txHash = await rastaHarvest(masterChefContract, farmPid, account);
    dispatch(fetchRastaFarmUserDataAsync(account));
    return txHash;
  }, [account, dispatch, farmPid, masterChefContract]);

  return { onReward: handleHarvest };
};

export const useDualHarvest = (poolAddress) => {
  const dispatch = useDispatch();
  const { account } = useWallet();
  const nextGenContract = useNextGenPool(poolAddress);

  const handleHarvest = useCallback(async () => {
    const txHash = await nextHarvest(nextGenContract, account);
    dispatch(fetchDualFarmUserDataAsync(account));
    return txHash;
  }, [account, dispatch, nextGenContract]);

  return { onReward: handleHarvest };
};

export const useGrandHarvest = (poolAddress) => {
  const dispatch = useDispatch();
  const { account } = useWallet();
  const GrandContract = useGrandPool(poolAddress);

  const handleHarvest = useCallback(async () => {
    const txHash = await grandHarvest(GrandContract, account);
    dispatch(fetchGrandPoolsUserDataAsync(account));
    return txHash;
  }, [account, dispatch, GrandContract]);

  return { onReward: handleHarvest };
};

export const useXpadHarvest = (poolAddress) => {
  const { account } = useWallet();
  const XpadContract = useXpadContract(poolAddress);
  const handleHarvest = useCallback(async () => {
    const txHash = await xpadHarvest(XpadContract, account);
    return txHash;
  }, [account, XpadContract]);

  return { onReward: handleHarvest };
};

export const useCompound = (farmPid: number) => {
  const dispatch = useDispatch();
  const { account } = useWallet();
  const masterChefContract = useMasterchef();

  const handleCompound = useCallback(async () => {
    const txHash = await compound(masterChefContract, farmPid, account);
    dispatch(fetchFarmUserDataAsync(account));
    return txHash;
  }, [account, dispatch, farmPid, masterChefContract]);

  return { onCompound: handleCompound };
};

export const useAllHarvest = (farmPids: number[]) => {
  const { account } = useWallet();
  const masterChefContract = useMasterchef();

  const handleHarvest = useCallback(async () => {
    const harvestPromises = farmPids.reduce((accum, pid) => {
      return [...accum, harvest(masterChefContract, pid, account)];
    }, []);

    return Promise.all(harvestPromises);
  }, [account, farmPids, masterChefContract]);

  return { onReward: handleHarvest };
};

export const useSousHarvest = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch();
  const { account } = useWallet();
  const sousChefContract = useSousChef(sousId);
  const masterChefContract = useMasterchef();

  const handleHarvest = useCallback(async () => {
    if (sousId === 0) {
      await harvest(masterChefContract, 0, account);
    } else if (isUsingBnb) {
      await soushHarvestBnb(sousChefContract, account);
    } else {
      await soushHarvest(sousChefContract, account);
    }
    dispatch(updateUserPendingReward(sousId, account));
    dispatch(updateUserBalance(sousId, account));
  }, [
    account,
    dispatch,
    isUsingBnb,
    masterChefContract,
    sousChefContract,
    sousId,
  ]);

  return { onReward: handleHarvest };
};
