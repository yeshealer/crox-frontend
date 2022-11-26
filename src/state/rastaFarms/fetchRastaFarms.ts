import BigNumber from "bignumber.js";
import { getDecimals } from 'utils/rastaCallHelpers'
import erc20 from "config/abi/erc20.json";
import masterchefABI from "config/abi/rastaMasterchef.json";
import multicall from "utils/rastaMulticall";
import { getAddress, getMasterChefAddress } from "utils/rastaAddressHelpers";

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;

const fetchRastaFarms = async (rastaConfig) => {
  const data = await Promise.all(
    rastaConfig.map(async (rastaOneElement) => {
      const lpAdress = getAddress((rastaOneElement as any).lpAddresses)
      const calls = [
        // Balance of token in the LP contract
        {
          address: getAddress((rastaOneElement as any).tokenAddresses),
          name: 'balanceOf',
          params: [lpAdress],
        },
        // Balance of quote token on LP contract
        {
          address: getAddress((rastaOneElement as any).quoteTokenAdresses),
          name: 'balanceOf',
          params: [lpAdress],
        },
        // Balance of LP tokens in the master chef contract
        {
          address: lpAdress,
          name: 'balanceOf',
          params: [getMasterChefAddress()],
        },
        // Total supply of LP tokens
        {
          address: lpAdress,
          name: 'totalSupply',
        },
        // Token decimals
        {
          address: getAddress((rastaOneElement as any).tokenAddresses),
          name: 'decimals',
        },
        // Quote token decimals
        {
          address: getAddress((rastaOneElement as any).quoteTokenAdresses),
          name: 'decimals',
        },
      ]

      const [tokenBalanceLP, quoteTokenBlanceLP, lpTokenBalanceMC, lpTotalSupply, tokenDecimals, quoteTokenDecimals] =
        await multicall(erc20, calls)

      // Ratio in % a LP tokens that are in staking, vs the total number in circulation
      let lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))
      if (lpTokenRatio.isZero()) {
        lpTokenRatio = new BigNumber(1)
      }

      // Total value in staking in quote token value
      const lpTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
        .div(new BigNumber(10).pow(18))
        .times(new BigNumber(2))
        .times(lpTokenRatio)

      // Total value in staking in quote token value
      const singleTokenAmount = new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(getDecimals(rastaOneElement.pid)))

      // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
      const tokenAmount = new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)).times(lpTokenRatio)
      const quoteTokenAmount = new BigNumber(quoteTokenBlanceLP)
        .div(new BigNumber(10).pow(quoteTokenDecimals))
        .times(lpTokenRatio)

      const [info, totalAllocPoint] = await multicall(masterchefABI, [
        {
          address: getMasterChefAddress(),
          name: 'poolInfo',
          params: [(rastaOneElement as any).pid],
        },
        {
          address: getMasterChefAddress(),
          name: 'totalAllocPoint',
        },
      ])

      const allocPoint = new BigNumber(info.allocPoint._hex);
      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint));

      return {
        ...rastaOneElement,
        tokenAmount: tokenAmount.toJSON(),
        quoteTokenAmount: quoteTokenAmount.toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: quoteTokenAmount.div(tokenAmount).toJSON(),
        poolWeight: poolWeight.toJSON(),
        multiplier: `${allocPoint.div(10).toString()}X`,
        singleTokenAmount: singleTokenAmount.toJSON(),
        depositFee: info.depositFeeBP / 100,
      }
    }),
  )
  return data;
};

export default fetchRastaFarms;
