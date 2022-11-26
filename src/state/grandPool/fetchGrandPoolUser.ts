import BigNumber from "bignumber.js";
import erc20ABI from "config/abi/erc20.json";
import masterchefABI from "config/abi/nextGenPool.json";
import grandPoolABI from "config/abi/grandPool.json";
import multicall from "utils/multicall";
import farmsConfig from "config/constants/grandpool";

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;
const indexes = [];

for (let i = 0; i < farmsConfig.length; i++)
  if (farmsConfig[i].active) indexes.push(i);
for (let i = 0; i < farmsConfig.length; i++)
  if (!farmsConfig[i].active) indexes.push(i);

export const fetchGrandPoolsUserAllowances = async (account: string) => {
  const calls = farmsConfig.map((farm) => {
    return {
      address: farm.tokenAddresses[CHAIN_ID],
      name: "allowance",
      params: [account, farm.poolAddress[CHAIN_ID]],
    };
  });

  const rawLpAllowances = await multicall(erc20ABI, calls);
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON();
  });
  return parsedLpAllowances;
};

export const fetchGrandPoolsUserTokenBalances = async (account: string) => {

  const calls = farmsConfig.map((farm) => {
    return {
      address: farm.tokenAddresses[CHAIN_ID],
      name: "balanceOf",
      params: [account],
    };
  });

  const rawTokenBalances = await multicall(erc20ABI, calls);
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON();
  });
  return parsedTokenBalances;
};

export const fetchGrandPoolsUserStakedBalances = async (account: string) => {
  const calls = farmsConfig
    .filter((it) => !it.active)
    .map((farm) => {
      return {
        address: farm.poolAddress[CHAIN_ID],
        name: "userInfo",
        params: [account],
      };
    });

  const rawStakedBalances = await multicall(masterchefABI, calls);

  const callsNew = farmsConfig
    .filter((it) => it.active)
    .map((farm) => {
      return {
        address: farm.poolAddress[CHAIN_ID],
        name: "userInfo",
        params: [account],
      };
    });

  const rawStakedBalancesNew = await multicall(grandPoolABI, callsNew);
  const parsedStakedBalances = [
    ...rawStakedBalancesNew,
    ...rawStakedBalances,
  ].map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON();
  });
  const response = [...parsedStakedBalances];

  for (let i = 0; i < indexes.length; i++) {
    response[indexes[i]] = parsedStakedBalances[i];
  }

  return response;
};

export const fetchGrandPoolsUserEarnings = async (account: string) => {
  const calls = farmsConfig
    .filter((it) => it.active)
    .map((farm) => {
      return {
        address: farm.poolAddress[CHAIN_ID],
        name: "pendingReward",
        params: [account],
      };
    });

  const rawEarnings = await multicall(grandPoolABI, calls);
  // const callsNew = farmsConfig
  //   .filter((it) => it.active)
  //   .map((farm) => {
  //     return {
  //       address: farm.poolAddress[CHAIN_ID],
  //       name: "pendingReward",
  //       params: [account],
  //     };
  //   });

  // const rawEarningsNew = await multicall(grandPoolABI, callsNew);

  const parsedEarnings = [
    // ...rawEarningsNew, 
    ...rawEarnings
  ].map((earnings) => {
    // return [parseInt(earnings[0]._hex), parseInt(earnings[1]._hex)];
    return earnings[0].map((obj) => parseInt(obj._hex));
  });
  const response = [...parsedEarnings];
  return response[0];
};
