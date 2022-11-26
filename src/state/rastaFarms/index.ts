/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import multicall from "utils/rastaMulticall";
import erc20 from "config/abi/erc20.json";
import { QuoteToken, RastaFarmConfig } from "config/constants/types";
import rastaErc20 from "config/abi/rastaErc20.json"
import masterchefABI from "config/abi/rastaMasterchef.json";
import { getMasterChefAddress } from "utils/rastaAddressHelpers";
import fetchRastaFarms from "./fetchRastaFarms";
import fetchRastaPools from "./fetchRastaPools";
import {
  fetchRastaFarmUserEarnings,
  fetchRastaFarmUserAllowances,
  fetchRastaFarmUserTokenBalances,
  fetchRastaFarmUserStakedBalances,
} from "./fetchRastaFarmUser";
import contracts from '../../config/constants/contracts'


import { RastaFarmsState, RastaFarm } from "../types";

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;
const farmsConfig = [];
const initialState: RastaFarmsState = { data: [...farmsConfig] };

export const farmsSlice = createSlice({
  name: "RastaFarms",
  initialState,
  reducers: {
    setRastaFarmsPublicData: (state, action) => {
      const liveFarmsData: RastaFarm[] = action.payload;
      liveFarmsData.forEach((rastafarm, index) => {
        state.data[index] = { ...state.data[index], ...rastafarm };
      })
    },
    setRastaFarmUserData: (state, action) => {
      const { arrayOfUserDataObjects } = action.payload;
      arrayOfUserDataObjects.forEach((userDataEl) => {
        const { index } = userDataEl;
        state.data[index] = { ...state.data[index], userData: userDataEl };
      });
    },
  },
});

// Actions
export const { setRastaFarmsPublicData, setRastaFarmUserData } = farmsSlice.actions;

const getTokenSymbol = async (tokenAddress) => {
  const [symbol] = await multicall(erc20, [
    {
      address: tokenAddress,
      name: 'symbol',
    }
  ])
  return symbol[0]
}

export const getConfigList = async () => {
  const promises = [];
  const rastaFarmsConfig: RastaFarm[] = [];
  const rastaPoolsConfig: RastaFarm[] = [];
  const rastaAll: RastaFarm[] = [];
  const [poolLength] = await multicall(masterchefABI, [
    {
      address: getMasterChefAddress(),
      name: 'poolLength',
    },
  ])
  for (let i = 0; i < parseInt(poolLength[0]._hex); i++) {
    const wholePoolInfo = multicall(masterchefABI, [
      {
        address: getMasterChefAddress(),
        name: 'poolInfo',
        params: [i]
      }
    ])
    promises.push(wholePoolInfo)
  }
  const results = await Promise.all(promises);
  const actualDatas = results.map((result) => result[0])

  let fullLPSymbol = ''
  const rastaConfig = actualDatas.map(async (actualData, index) => {
    const [lpType, tokenDecimals] = await multicall(rastaErc20, [
      {
        address: (actualData as any).lpToken,
        name: 'symbol',
      },
      {
        address: (actualData as any).lpToken,
        name: 'decimals',
      },
    ])
    let fullTokenSymbol = ''
    let fullTokenAddress = ''
    let fullQuoteTokenAddress = ''
    let fullQuoteTokenSymbol = ''
    let tokenSymbol3 = ''
    let tokenSymbol4 = ''
    if (lpType[0].toUpperCase() === 'RLP' || lpType[0].toUpperCase() === 'CAKE-LP') {
      const [token0, token1] = await multicall(rastaErc20, [
        {
          address: (actualData as any).lpToken,
          name: 'token0',
        },
        {
          address: (actualData as any).lpToken,
          name: 'token1',
        }
      ])
      const tokenSymbol1 = await getTokenSymbol(token0[0])
      const tokenSymbol2 = await getTokenSymbol(token1[0])
      tokenSymbol3 = tokenSymbol1 === 'WBNB' ? 'BNB' : tokenSymbol1.toUpperCase()
      tokenSymbol4 = tokenSymbol2 === 'WBNB' ? 'BNB' : tokenSymbol2.toUpperCase()
      fullLPSymbol = `${tokenSymbol3}-${tokenSymbol4} RLP`
      if (lpType[0].toUpperCase() === 'CAKE-LP') {
        fullLPSymbol = `${tokenSymbol3}-${tokenSymbol4} CAKE LP`
      }
      fullTokenSymbol = tokenSymbol4 === 'MRASTA' || (tokenSymbol3 === 'RASTA' && tokenSymbol4 === 'BUSD') ? tokenSymbol3 : tokenSymbol4
      fullTokenAddress = tokenSymbol4 === 'MRASTA' || (tokenSymbol3 === 'RASTA' && tokenSymbol4 === 'BUSD') ? token0[0] : token1[0]
      fullQuoteTokenSymbol = tokenSymbol3 === 'RASTA' && tokenSymbol4 === 'BUSD' ? tokenSymbol4 : tokenSymbol3
      fullQuoteTokenAddress = tokenSymbol3 === 'RASTA' && tokenSymbol4 === 'BUSD' ? token1[0] : token0[0]
      rastaFarmsConfig.push({ pid: index, lpSymbol: fullLPSymbol, lpAddresses: { 97: '', 56: (actualData as any).lpToken }, tokenSymbol: fullTokenSymbol, tokenAddresses: { 97: '', 56: fullTokenAddress }, quoteTokenSymbol: fullQuoteTokenSymbol as QuoteToken, quoteTokenAdresses: { 97: '', 56: fullQuoteTokenAddress }, tokenDecimals: tokenDecimals[0] })
    } else {
      fullLPSymbol = lpType[0].toUpperCase() === 'WBNB' ? 'BNB' : lpType[0].toUpperCase()
      fullTokenSymbol = fullLPSymbol
      if (lpType[0].toUpperCase() === 'RASTA') {
        fullQuoteTokenSymbol = 'RASTA';
        fullQuoteTokenAddress = contracts.rasta[CHAIN_ID];
      }
      else if (lpType[0].toUpperCase() === 'ETH') {
        fullQuoteTokenSymbol = 'ETH';
        fullQuoteTokenAddress = contracts.eth[CHAIN_ID];

      }
      else if (lpType[0].toUpperCase() === 'BUSD' || lpType[0].toUpperCase() === 'USDT' || lpType[0].toUpperCase() === 'DAI') {
        fullQuoteTokenSymbol = 'BUSD';
        fullQuoteTokenAddress = contracts.busd[CHAIN_ID];
      }
      else {
        fullQuoteTokenSymbol = 'BNB';
        fullQuoteTokenAddress = contracts.wbnb[CHAIN_ID];
      }
      fullQuoteTokenSymbol = fullTokenSymbol
      fullTokenAddress = (actualData as any).lpToken
      rastaPoolsConfig.push({ pid: index, lpSymbol: fullLPSymbol, lpAddresses: { 97: '', 56: (actualData as any).lpToken }, tokenSymbol: fullTokenSymbol, tokenAddresses: { 97: '', 56: fullTokenAddress }, quoteTokenSymbol: fullQuoteTokenSymbol as QuoteToken, quoteTokenAdresses: { 97: '', 56: fullQuoteTokenAddress }, tokenDecimals: tokenDecimals[0] })
    }
    return [rastaFarmsConfig, rastaPoolsConfig];
  })
  const result = await Promise.all(rastaConfig);
  const rastafarms = result[result.length - 1][0];
  const rastapools = result[result.length - 1][1];
  rastafarms.sort(function (a, b) { return a.pid - b.pid })
  rastapools.sort(function (a, b) { return a.pid - b.pid })
  return [rastafarms, rastapools];
}

// Thunks
export const fetchRastaFarmsPublicDataAsync = () => async (dispatch) => {
  const [rastafarms, rastapools] = await getConfigList();
  const farms = await fetchRastaFarms(rastafarms);
  const pools = await fetchRastaPools(rastapools);
  const rastas = farms.concat(pools);
  dispatch(setRastaFarmsPublicData(rastas));
};
export const fetchRastaFarmUserDataAsync = (account) => async (dispatch) => {
  const [rastafarms, rastapools] = await getConfigList();
  const rastaConfig = rastafarms.concat(rastapools);
  const userFarmAllowances = await fetchRastaFarmUserAllowances(account, rastaConfig);
  const userFarmTokenBalances = await fetchRastaFarmUserTokenBalances(account, rastaConfig);
  const userStakedBalances = await fetchRastaFarmUserStakedBalances(account, rastaConfig);
  const userFarmEarnings = await fetchRastaFarmUserEarnings(account, rastaConfig);

  const arrayOfUserDataObjects = userFarmAllowances.map(
    (farmAllowance, index) => {
      return {
        index,
        allowance: userFarmAllowances[index],
        tokenBalance: userFarmTokenBalances[index],
        stakedBalance: userStakedBalances[index],
        earnings: userFarmEarnings[index],
      };
    }
  );

  dispatch(setRastaFarmUserData({ arrayOfUserDataObjects }));
};

export default farmsSlice.reducer;
