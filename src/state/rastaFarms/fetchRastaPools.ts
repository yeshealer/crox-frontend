import BigNumber from "bignumber.js";
import erc20 from "config/abi/erc20.json";
import masterchefABI from "config/abi/rastaMasterchef.json";
import multicall from "utils/rastaMulticall";
import { getMasterChefAddress } from "utils/rastaAddressHelpers";
import { getDecimals } from 'utils/rastaCallHelpers'
import { QuoteToken } from "config/constants/types";

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;

const fetchRastaPools = async (farmsConfig) => {
  const data = await Promise.all(
    farmsConfig.map(async (farmConfig) => {
      const lpAdress = farmConfig.lpAddresses[CHAIN_ID];
      const calls = [
        // Balance of token in the LP contract
        {
          address: lpAdress,
          name: "balanceOf",
          params: [farmConfig.tokenAddresses[CHAIN_ID]],
        },
        // Balance of quote token on LP contract
        {
          address: farmConfig.quoteTokenAdresses[CHAIN_ID],
          name: "balanceOf",
          params: [lpAdress],
        },
        // Balance of LP tokens in the master chef contract
        {
          address: lpAdress,
          name: "balanceOf",
          params: [getMasterChefAddress()],
        },
        // Total supply of LP tokens
        {
          address: lpAdress,
          name: "totalSupply",
        },
        // Token decimals
        {
          address: lpAdress,
          name: "decimals",
        },
        // Quote token decimals
        {
          address: farmConfig.quoteTokenAdresses[CHAIN_ID],
          name: "decimals",
        },
      ];
      const [
        tokenBalanceLP,
        quoteTokenBlanceLP,
        lpTokenBalanceMC,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals,
      ] = await multicall(erc20, calls);

      let tokenAmount;
      let lpTotalInQuoteToken;
      let tokenPriceVsQuote;
      if (farmConfig.isTokenOnly) {
        tokenAmount = new BigNumber(lpTokenBalanceMC).div(
          new BigNumber(10).pow(tokenDecimals)
        );
        if (
          farmConfig.tokenSymbol === QuoteToken.BUSD &&
          farmConfig.quoteTokenSymbol === QuoteToken.BUSD
        ) {
          tokenPriceVsQuote = new BigNumber(1);
        } else {
          tokenPriceVsQuote = new BigNumber(farmConfig?.tokenPrice);
        }
        lpTotalInQuoteToken = tokenAmount.times(tokenPriceVsQuote);
      } else {
        // Ratio in % a LP tokens that are in staking, vs the total number in circulation
        const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(
          new BigNumber(lpTotalSupply)
        );

        // Total value in staking in quote token value
        lpTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
          .div(new BigNumber(10).pow(18))
          .times(new BigNumber(2))
          .times(lpTokenRatio);

        // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
        tokenAmount = new BigNumber(tokenBalanceLP)
          .div(new BigNumber(10).pow(tokenDecimals))
          .times(lpTokenRatio);
        const quoteTokenAmount = new BigNumber(quoteTokenBlanceLP)
          .div(new BigNumber(10).pow(quoteTokenDecimals))
          .times(lpTokenRatio);

        if (tokenAmount.comparedTo(0) > 0) {
          tokenPriceVsQuote = quoteTokenAmount.div(tokenAmount);
        } else {
          tokenPriceVsQuote = new BigNumber(quoteTokenBlanceLP).div(
            new BigNumber(tokenBalanceLP)
          );
        }
      }

      const singleTokenAmount = new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(getDecimals(farmConfig.pid)))

      const [info, totalAllocPoint, rastaPerBlock] = await multicall(
        masterchefABI,
        [
          {
            address: getMasterChefAddress(),
            name: "poolInfo",
            params: [farmConfig.pid],
          },
          {
            address: getMasterChefAddress(),
            name: "totalAllocPoint",
          },
          {
            address: getMasterChefAddress(),
            name: "rastaPerBlock",
          },
        ]
      );

      const allocPoint = new BigNumber(info.allocPoint._hex);
      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint));

      return {
        ...farmConfig,
        tokenDecimals: tokenDecimals[0],
        tokenAmount: tokenAmount.toJSON(),
        lpTotalSupply: new BigNumber(lpTokenBalanceMC),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: tokenPriceVsQuote.toJSON(),
        poolWeight: poolWeight.toNumber(),
        multiplier: `${allocPoint.div(10).toString()}X`,
        depositFee: info.depositFeeBP/100,
        rastaPerBlock: new BigNumber(rastaPerBlock).toNumber(),
        singleTokenAmount: singleTokenAmount.toJSON(),
      };
    })
  );
  return data;
};

export default fetchRastaPools;
