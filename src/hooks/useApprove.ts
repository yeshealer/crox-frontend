import { useCallback } from "react";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { Contract } from "web3-eth-contract";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import {
  updateUserAllowance,
  fetchFarmUserDataAsync,
  fetchDualFarmUserDataAsync,
  fetchGrandPoolsUserDataAsync,
  fetchRastaFarmUserDataAsync
} from "state/actions";
import { approve } from "utils/callHelpers";
import {
  useRastaMasterchef,
  useMasterchef,
  useCake,
  useSousChef,
  useLottery,
  useNextGenPool,
  useGrandPool,
} from "./useContract";

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;

// Approve a Farm
export const useApprove = (lpContract: Contract) => {
  const dispatch = useDispatch();
  const { account }: { account: string } = useWallet();
  const masterChefContract = useMasterchef();

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, masterChefContract, account);
      dispatch(fetchFarmUserDataAsync(account));
      return tx;
    } catch (e) {
      return false;
    }
  }, [account, dispatch, lpContract, masterChefContract]);

  return { onApprove: handleApprove };
};

// Approve a RastaFarm
export const useRastaApprove = (lpContract: Contract) => {
  const dispatch = useDispatch();
  const { account }: { account: string } = useWallet();
  const masterChefContract = useRastaMasterchef();

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, masterChefContract, account);
      dispatch(fetchRastaFarmUserDataAsync(account));
      return tx;
    } catch (e) {
      return false;
    }
  }, [account, dispatch, lpContract, masterChefContract]);

  return { onApprove: handleApprove };
};

// Approve a NextGen
export const useDualApprove = (lpContract: Contract, poolAddress: any) => {
  const dispatch = useDispatch();
  const { account }: { account: string } = useWallet();
  const nextGenContract = useNextGenPool(poolAddress);

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, nextGenContract, account);
      dispatch(fetchDualFarmUserDataAsync(account));
      return tx;
    } catch (e) {
      return false;
    }
  }, [account, dispatch, lpContract, nextGenContract]);

  return { onApprove: handleApprove };
};

// Approve a Grand
export const useGrandApprove = (tokenContract: Contract, poolAddress: any) => {
  const dispatch = useDispatch();
  const { account }: { account: string } = useWallet();
  const grandContract = useGrandPool(poolAddress);
  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(tokenContract, grandContract, account);
      dispatch(fetchGrandPoolsUserDataAsync(account));
      return tx;
    } catch (e) {
      return false;
    }
  }, [account, dispatch, tokenContract, grandContract]);

  return { onApprove: handleApprove };
};

// Approve a Pool
export const useSousApprove = (lpContract: Contract, sousId) => {
  const dispatch = useDispatch();
  const { account }: { account: string } = useWallet();
  const sousChefContract = useSousChef(sousId);

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, sousChefContract, account);
      dispatch(updateUserAllowance(sousId, account));
      return tx;
    } catch (e) {
      return false;
    }
  }, [account, dispatch, lpContract, sousChefContract, sousId]);

  return { onApprove: handleApprove };
};

// Approve the lottery
export const useLotteryApprove = () => {
  const { account }: { account: string } = useWallet();
  const cakeContract = useCake();
  const lotteryContract = useLottery();

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(cakeContract, lotteryContract, account);
      return tx;
    } catch (e) {
      return false;
    }
  }, [account, cakeContract, lotteryContract]);

  return { onApprove: handleApprove };
};

// Approve an IFO
export const useIfoApprove = (
  tokenContract: Contract,
  spenderAddress: string
) => {
  const { account } = useWallet();
  const onApprove = useCallback(async () => {
    try {
      const tx = await tokenContract.methods
        .approve(spenderAddress, ethers.constants.MaxUint256)
        .send({ from: account });
      return tx;
    } catch {
      return false;
    }
  }, [account, spenderAddress, tokenContract]);

  return onApprove;
};

// Approve an ICO
export const useSaleApprove = (
  tokenContract: Contract,
  spenderAddress: string
) => {
  const { account } = useWallet();
  const onApprove = useCallback(async () => {
    try {
      const tx = await tokenContract.methods
        .approve(spenderAddress, ethers.constants.MaxUint256)
        .send({ from: account });
      return tx;
    } catch {
      return false;
    }
  }, [account, spenderAddress, tokenContract]);

  return onApprove;
};