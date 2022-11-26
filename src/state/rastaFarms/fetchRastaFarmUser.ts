import BigNumber from "bignumber.js";
import { getAddress, getMasterChefAddress } from 'utils/rastaAddressHelpers'
import erc20ABI from "../../config/abi/erc20.json";
import masterchefABI from "../../config/abi/rastaMasterchef.json";
import multicall from "../../utils/rastaMulticall";

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;

export const fetchRastaFarmUserAllowances = async (account: string, rastaConfig) => {
  const masterChefAdress = getMasterChefAddress()

  const calls = rastaConfig.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)
    return { address: lpContractAddress, name: 'allowance', params: [account, masterChefAdress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  return parsedLpAllowances
};

export const fetchRastaFarmUserTokenBalances = async (account: string, rastaConfig) => {
  const calls = rastaConfig.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses)
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
};

export const fetchRastaFarmUserStakedBalances = async (account: string, rastaConfig) => {
  const masterChefAdress = getMasterChefAddress()

  const calls = rastaConfig.map((farm) => {
    return {
      address: masterChefAdress,
      name: 'userInfo',
      params: [farm.pid, account],
    }
  })

  const rawStakedBalances = await multicall(masterchefABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
};

export const fetchRastaFarmUserEarnings = async (account: string, rastaConfig) => {
  const masterChefAdress = getMasterChefAddress()

  const calls = rastaConfig.map((farm) => {
    return {
      address: masterChefAdress,
      name: 'pendingRasta',
      params: [farm.pid, account],
    }
  })

  const rawEarnings = await multicall(masterchefABI, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
};
