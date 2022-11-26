import { useRef } from "react";
import Axios from "axios";
import BigNumber from "bignumber.js";
import erc20 from "config/abi/erc20.json";
import nextGenPoolABI from "config/abi/nextGenPool.json";
import nextGenPoolNewABI from "config/abi/nextGenPoolNew.json";
import grandPoolABI from "config/abi/grandPool.json";
import multicall from "utils/multicall";
import { getMasterChefAddress } from "utils/addressHelpers";
import farmsConfig from "config/constants/grandpool";
import { QuoteToken } from "../../config/constants/types";

const CHAIN_ID = 56;

const fetchGrandPools = async () => {
  const data = await Promise.all(
    farmsConfig.map(async (farmConfig) => {
      const lpAdress = farmConfig.lpAddresses[CHAIN_ID];
      const poolAddress = farmConfig.poolAddress[CHAIN_ID];
      const tokenAddress = farmConfig.tokenAddresses[CHAIN_ID];
      const calls = [
        {
          address: tokenAddress,
          name: "balanceOf",
          params: [poolAddress],
        },
      ];

      const [
        lpBalance,
      ] = await multicall(erc20, calls);
      const [
        // rewardPerBlocks,
        bonusEndBlock,
        // isInitialized,
        // lastRewardBlock,
        // stakedToken,
        // stakedTokenTransferFee,
        // userInfo,
        // withdrawalInterval,
      ] = await multicall(
        grandPoolABI,
        [
          // pendingReward 
          // {
          //   address: lpAdress,
          //   name: "pendingReward",
          //   params: [tokenAddress],
          // },
          // // rewardPerBlocks
          // {
          //   address: lpAdress,
          //   name: "rewardPerBlocks"
          // },
          // bonusEndBlock
          // {
          //   address: lpAdress,
          //   name: "bonusEndBlock"
          // },
          // // isInitialized
          // {
          //   address: lpAdress,
          //   name: "isInitialized"
          // },
          // // lastRewardBlock
          // {
          //   address: lpAdress,
          //   name: "lastRewardBlock"
          // },
          // // stakedToken
          // {
          //   address: lpAdress,
          //   name: "stakedToken"
          // },
          // // stakedTokenTransferFee
          // {
          //   address: lpAdress,
          //   name: "stakedTokenTransferFee"
          // },
          // // startBlock
          // {
          //   address: lpAdress,
          //   name: "startBlock"
          // },
          // // userInfo
          // {
          //   address: lpAdress,
          //   name: "userInfo",
          //   params: [tokenAddress],
          // },
          // // withdrawalInterval
          // {
          //   address: lpAdress,
          //   name: "withdrawalInterval"
          // }
        ]
      );
      // const tokenPrice = useRef([]);
      // try {
      //   for(let i = 0; i < 15; i ++) {
      //     if (farmConfig.cgProjectID) {
      //       const { data: priceData } = await Axios.get(
      //         `https://api.coingecko.com/api/v3/simple/price?ids=${farmConfig.cgProjectID}&vs_currencies=usd`
      //       );
      //       tokenPrice.current[i] = priceData[farmConfig.cgProjectID].usd;
      //     } else {
      //       const { data: priceData } = await Axios.get(
      //         `https://api.pancakeswap.info/api/v2/tokens/${
      //           farmConfig.rewardTokenAddressGroup[i].tokenAddresses[process.env.REACT_APP_CHAIN_ID]
      //         }`
      //       );
      //       tokenPrice.current[i] = Number((priceData as any).data.price);
      //     }
      //   }
      // } catch (err) {
      //   console.log(err)
      // }

      return {
        ...farmConfig,
        // tokenAmount: tokenAmount.toJSON(),
        // quoteTokenAmount: quoteTokenAmount,
        // lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        // tokenPriceVsQuote: tokenPriceVsQuote.toJSON(),
        // depositFeeBP: parseInt(stakedTokenTransferFee[0]._hex),
        // penaltyFeeBP: parseInt(penaltyFee[0]._hex),
        // startBlock: parseInt(startBlock[0]._hex),
        // bonusEndBlock: parseInt(bonusEndBlock[0]._hex),
        // lastRewardBlock: parseInt(lastRewardBlock[0]._hex),
        // rewardPerBlock: new BigNumber(rewardPerBlocks).toNumber(),
        // secRewardPerBlock: new BigNumber(secRewardPerBlock).toNumber(),
        lpBalance: new BigNumber(lpBalance)
        //   .div(new BigNumber(10).pow(farmConfig.lpTokenDecimal ?? 18))
        //   .toString(),
        // tokenPrice: tokenPrice === 0 ? farmConfig.tokenPrice : tokenPrice,
      };
    })
  );
  return data;
};

export default fetchGrandPools;
