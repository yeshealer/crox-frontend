import contracts from "./contracts";
import { GrandFarmConfig, QuoteToken } from "./types";

const grandpools: GrandFarmConfig[] = [
  {
    pid: -200,
    risk: 5,
    lpSymbol: "CROX",
    lpType: "No Fees",
    poolAddress: {
      97: "0x9a6becc6519fb1d3ecc70fa14384744174db1c50",
      56: "0x9fd3800ea8b4dec4b2be5887e598dea523469bcf",
    },
    lpAddresses: {
      97: "",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    tokenSymbol: "CROX",
    tokenPrice: 0.19,
    tokenAddresses: {
      97: "0x2b00815d72d80a026c52f8e291d6f486b4637620",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    rewardTokens: [
      {
        tokenSymbol: 'RASTA',
        tokenAddress: {
          97: "",
          56: "0xe3e8cc42da487d1116d26687856e9fb684817c52",
        },
        tokenPrice: 0.09,
        rewardPerBlock: 0.0091, 
      },
      {
        tokenSymbol: 'CROX',
        tokenAddress: {
          97: "",
          56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
        },
        tokenPrice: 0.19,
        rewardPerBlock: 0.0250, 
      },
      {
        tokenSymbol: 'CRUSH',
        tokenAddress: {
          97: "",
          56: "0x0ef0626736c2d484a792508e99949736d0af807e",
        },
        tokenPrice: 0.09,
        rewardPerBlock: 0.0890, 
      },
      {
        tokenSymbol: 'CNS',
        tokenAddress: {
          97: "",
          56: "0xf6cb4ad242bab681effc5de40f7c8ff921a12d63",
        },
        tokenPrice: 0.0004124,
        rewardPerBlock: 9, 
      },
      {
        tokenSymbol: 'WNOW',
        tokenAddress: {
          97: "",
          56: "0x56aa0237244c67b9a854b4efe8479cca0b105289",
        },
        tokenPrice: 0.06695,
        rewardPerBlock: 0.0298, 
      },
      {
        tokenSymbol: 'FCF',
        tokenAddress: {
          97: "",
          56: "0x4673f018cc6d401aad0402bdbf2abcbf43dd69f3",
        },
        tokenPrice: 0.0001147,
        rewardPerBlock: 18, 
      },
      {
        tokenSymbol: 'BGLG',
        tokenAddress: {
          97: "",
          56: "0xea01d8d9eacca9996db6bb3377c1fe64308e7328",
        },
        tokenPrice: 0.0127876,
        rewardPerBlock: 0.7000, 
      },
      {
        tokenSymbol: 'ETH',
        tokenAddress: {
          97: "",
          56: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
        },
        tokenPrice: 4000,
        rewardPerBlock: 0.00000124, 
      },
      {
        tokenSymbol: 'WBNB',
        tokenAddress: {
          97: "",
          56: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        },
        tokenPrice: 550,
        rewardPerBlock: 0.00000496, 
      },
      {
        tokenSymbol: 'CAKE',
        tokenAddress: {
          97: "",
          56: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
        },
        tokenPrice: 13,
        rewardPerBlock: 0.0000992, 
      },
      {
        tokenSymbol: 'MRASTA',
        tokenAddress: {
          97: "",
          56: "0xeaa4a2469a8471bd8314b2ff63c1d113fe8114ba",
        },
        tokenPrice: 0.098768,
        rewardPerBlock: 0.0025, 
      },
      {
        tokenSymbol: 'XWIN',
        tokenAddress: {
          97: "",
          56: "0xd88ca08d8eec1e9e09562213ae83a7853ebb5d28",
        },
        tokenPrice: 2.27,
        rewardPerBlock: 0.0020, 
      },
      {
        tokenSymbol: 'MILK',
        tokenAddress: {
          97: "",
          56: "0xBf37f781473f3b50E82C668352984865eac9853f",
        },
        tokenPrice: 0.00253543,
        rewardPerBlock: 0.1984, 
      },
      {
        tokenSymbol: 'CNR',
        tokenAddress: {
          97: "",
          56: "0xdCbA3fbd7BBc28abD18A472D28358089467A8a74",
        },
        tokenPrice: 0.01427,
        rewardPerBlock: 0.0397, 
      },
      {
        tokenSymbol: 'BTCB',
        tokenAddress: {
          97: "",
          56: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
        },
        tokenPrice: 49130,
        rewardPerBlock: 0.0000000496, 
      },
    ],
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    isHintVisible: false,
    active: true,
    reward2: 6500,
    poolStartTime: 1640664000,
    projectLink: "https://app.croxswap.com/",
    depositLink: "https://exchange.croxswap.com",
  }
];
export default grandpools;
