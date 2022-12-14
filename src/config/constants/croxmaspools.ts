import contracts from "./contracts";
import { DualFarmConfig, QuoteToken } from "./types";

const croxmaspools: DualFarmConfig[] = [
  {
    pid: -124,
    risk: 5,
    lpSymbol: "XWIN",
    lpType: "No Fees",
    poolAddress: {
      97: "",
      56: "0x9a9d391d3ba11a80abe99baabeb3becab99530cb",
    },
    lpAddresses: {
      97: "",
      56: "0xd88ca08d8eec1E9E09562213Ae83A7853ebB5d28",
    },
    tokenSymbol: "XWIN",
    tokenPrice: 2.27,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0xd88ca08d8eec1E9E09562213Ae83A7853ebB5d28",
    },
    quoteTokenPrice: 2.27,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    isHintVisible: false,
    active: true,
    reward1: 6500,
    closed: true,
    poolStartTime: 1640386219000,
    projectLink: "https://xwin.finance/",
    depositLink: "https://exchange.babyswap.finance",
    revert: true,
  },
  {
    pid: -125,
    risk: 5,
    lpSymbol: "CROX",
    lpType: "No Fees",
    poolAddress: {
      97: "",
      56: "0x6f9c9ae12b4833de3efb09b63dcd3ffc1ff4e926",
    },
    lpAddresses: {
      97: "",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    tokenSymbol: "CNS",
    tokenPrice: 0.0004124,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0xf6cb4ad242bab681effc5de40f7c8ff921a12d63",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    active: true,
    reward2: 2425000,
    closed: true,
    poolStartTime: 1640583602000,
    projectLink: "https://centric.com/",
    depositLink: "https://exchange.croxswap.com",
  },
  {
    pid: -101,
    risk: 5,
    lpSymbol: "CROX",
    lpType: "No Fees",
    poolAddress: {
      97: "",
      56: "0xe17f0ef01385c23771a79b133deb581689ebd8c2",
    },
    lpAddresses: {
      97: "",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    tokenSymbol: "CROX",
    tokenPrice: 0.206,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    isHintVisible: false,
    active: true,
    reward1: 6500,
    closed: true,
    poolStartTime: 1640303483000,
    projectLink: "https://app.croxswap.com/",
    depositLink: "https://exchange.croxswap.com",
  },
  {
    pid: -102,
    risk: 5,
    lpSymbol: "WBNB",
    lpType: "",
    poolAddress: {
      97: "",
      56: "0xfada247ac69fac3bde67e88d9e18d85759440c98",
    },
    lpAddresses: {
      97: "",
      56: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    },
    tokenSymbol: "CROX",
    tokenPrice: 0.206,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    quoteTokenPrice: 550,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    active: true,
    reward1: 7200,
    closed: true,
    poolStartTime: 1640307018000,
    projectLink: "https://app.croxswap.com/",
    depositLink: "https://exchange.croxswap.com",
    revert: true,
  },
  {
    pid: -103,
    risk: 5,
    lpSymbol: "CROX",
    lpType: "No Fees",
    poolAddress: {
      97: "",
      56: "0x744203bad3de493ec19eaea4fc04414c5f7008f5",
    },
    lpAddresses: {
      97: "",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    tokenSymbol: "RASTA",
    tokenPrice: 0.092,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0xe3e8cc42da487d1116d26687856e9fb684817c52",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    active: true,
    reward1: 11500,
    closed: true,
    poolStartTime: 1640310678000,
    projectLink: "https://rasta.finance/",
    depositLink: "https://rastadex.croxswap.com",
  },
  {
    pid: -104,
    risk: 5,
    lpSymbol: "CAKE",
    lpType: "",
    poolAddress: {
      97: "",
      56: "0x6221ccaa8300760cd9ad7ebc4df2301448589689",
    },
    lpAddresses: {
      97: "",
      56: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
    },
    tokenSymbol: "CROX",
    tokenPrice: 0.206,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    quoteTokenPrice: 12.45,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    active: true,
    reward1: 4000,
    closed: true,
    poolStartTime: 1640314258000,
    projectLink: "https://pancakeswap.finance/",
    depositLink: "https://exchange.croxswap.com",
    revert: true,
  },
  {
    pid: -105,
    risk: 5,
    lpSymbol: "CROX",
    lpType: "No Fees",
    poolAddress: {
      97: "",
      56: "0x844a51400a8752277bd5d98aeb57cd6aa809220d",
    },
    lpAddresses: {
      97: "",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    tokenSymbol: "CRUSH",
    tokenPrice: 0.2812,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x0ef0626736c2d484a792508e99949736d0af807e",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    active: true,
    reward1: 11500,
    closed: true,
    poolStartTime: 1640317818000,
    projectLink: "https://bitcrush.com/",
    depositLink: "https://exchange.croxswap.com",
  },
  {
    pid: -106,
    risk: 5,
    lpSymbol: "Banana",
    lpType: "",
    poolAddress: {
      97: "",
      56: "0x44ef672b209c1c353009cef91171f3aa3020848a",
    },
    lpAddresses: {
      97: "",
      56: "0x603c7f932ed1fc6575303d8fb018fdcbb0f39a95",
    },
    tokenSymbol: "CROX",
    tokenPrice: 0.206,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    quoteTokenPrice: 14.01,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    active: true,
    reward1: 4000,
    closed: true,
    poolStartTime: 1640321418000,
    projectLink: "https://apeswap.finance/",
    depositLink: "https://app.apeswap.finance",
    revert: true,
  },
  {
    pid: -107,
    risk: 5,
    lpSymbol: "CROX",
    lpType: "No Fees",
    poolAddress: {
      97: "",
      56: "0xf2a37337f3ed6ebc0b6b944658dfd286be315955",
    },
    lpAddresses: {
      97: "",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    tokenSymbol: "CNS",
    tokenPrice: 0.0004124,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0xf750a26eb0acf95556e8529e72ed530f3b60f348",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    active: true,
    reward1: 11500,
    closed: true,
    poolStartTime: 1640325018000,
    projectLink: "https://centric.com/",
    depositLink: "https://exchange.croxswap.com",
  },
  {
    pid: -108,
    risk: 5,
    lpSymbol: "BABY",
    lpType: "",
    poolAddress: {
      97: "",
      56: "0xd5278d4f63888a99967efee2667becd4b3f15887",
    },
    lpAddresses: {
      97: "",
      56: "0x53E562b9B7E5E94b81f10e96Ee70Ad06df3D2657",
    },
    tokenSymbol: "CROX",
    tokenPrice: 0.206,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    quoteTokenPrice: 1.45,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    active: true,
    reward1: 6500,
    closed: true,
    poolStartTime: 1640328678000,
    projectLink: "https://babyswap.finance/",
    depositLink: "https://exchange.babyswap.finance",
    revert: true,
  },

  {
    pid: -109,
    risk: 5,
    lpSymbol: "CROX",
    lpType: "No Fees",
    poolAddress: {
      97: "",
      56: "0xf38235b8c96d4a190158982c78db3a12f4c5a0e1",
    },
    lpAddresses: {
      97: "",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    tokenSymbol: "WNOW",
    tokenPrice: 0.099658,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x56aa0237244c67b9a854b4efe8479cca0b105289",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    active: true,
    reward1: 11500,
    closed: true,
    poolStartTime: 1640332218000,
    projectLink: "https://walletnow.net/",
    depositLink: "https://exchange.croxswap.com",
  },
  {
    pid: -110,
    risk: 5,
    lpSymbol: "CROX",
    lpType: "No Fees",
    poolAddress: {
      97: "",
      56: "0x6982d6226d1716ddf3c99d156e89f633d3a77351",
    },
    lpAddresses: {
      97: "",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    tokenSymbol: "FCF",
    tokenPrice: 0.0002335,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x4673f018cc6d401aad0402bdbf2abcbf43dd69f3",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    active: true,
    reward1: 8800000,
    closed: true,
    poolStartTime: 1640339418000,
    projectLink: "https://frenchconnection.finance/",
    depositLink: "https://exchange.croxswap.com",
  },

  {
    pid: -112,
    risk: 5,
    lpSymbol: "ETH",
    lpType: "",
    poolAddress: {
      97: "",
      56: "0xfd0f09cba3ac1eb4505576efa7b915dece773e32",
    },
    lpAddresses: {
      97: "",
      56: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
    },
    tokenSymbol: "CROX",
    tokenPrice: 0.206,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    quoteTokenPrice: 4100,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    active: true,
    reward1: 5200,
    closed: true,
    poolStartTime: 1640343018000,
    projectLink: "https://app.croxswap.com/",
    depositLink: "https://exchange.croxswap.com",
    revert: true,
  },
  {
    pid: -113,
    risk: 5,
    lpSymbol: "CROX",
    lpType: "No Fees",
    poolAddress: {
      97: "",
      56: "0xf6885826d038fb604c64a5a64dc017203bbc15c3",
    },
    lpAddresses: {
      97: "",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    tokenSymbol: "BGLG",
    tokenPrice: 0.0126401,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0xea01d8d9eacca9996db6bb3377c1fe64308e7328",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    active: true,
    reward1: 78200,
    closed: true,
    poolStartTime: 1640346678000,
    projectLink: "https://bigleague.art//",
    depositLink: "https://exchange.croxswap.com",
  },
  {
    pid: -114,
    risk: 5,
    lpSymbol: "CNR",
    lpTokenDecimal: 8,
    lpType: "",
    poolAddress: {
      97: "",
      56: "0x800d23de9bd616885cd4fc11a8ca3d0f4494b906",
    },
    lpAddresses: {
      97: "",
      56: "0xdCbA3fbd7BBc28abD18A472D28358089467A8a74",
    },
    tokenSymbol: "CROX",
    tokenPrice: 0.206,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    quoteTokenPrice: 0.075,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    active: true,
    reward1: 6500,
    closed: true,
    poolStartTime: 1640350258000,
    projectLink: "https://centric.com/",
    depositLink: "https://exchange.croxswap.com",
    revert: true,
  },
  {
    pid: -115,
    risk: 5,
    lpSymbol: "CROX",
    lpType: "No Fees",
    poolAddress: {
      97: "",
      56: "0xa35167d658055fbd6667064fc522883caf538282",
    },
    lpAddresses: {
      97: "",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    tokenSymbol: "BABY",
    tokenPrice: 1.77,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x53E562b9B7E5E94b81f10e96Ee70Ad06df3D2657",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    active: true,
    reward1: 400,
    closed: true,
    poolStartTime: 1640353818000,
    projectLink: "https://babyswap.finance/",
    depositLink: "https://exchange.croxswap.com",
  },
  {
    pid: -116,
    risk: 5,
    lpSymbol: "RASTA",
    lpType: "",
    poolAddress: {
      97: "",
      56: "0xa152024392bd38cc9d5d8c1ae5e7bffec33517d0",
    },
    lpAddresses: {
      97: "",
      56: "0xe3e8cc42da487d1116d26687856e9fb684817c52",
    },
    tokenSymbol: "CROX",
    tokenPrice: 0.206,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    quoteTokenPrice: 0.0922,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    active: true,
    reward1: 5000,
    closed: true,
    poolStartTime: 1640357418000,
    projectLink: "https://rasta.finance/",
    depositLink: "https://rastadex.croxswap.com",
    revert: true,
  },
  {
    pid: -117,
    risk: 5,
    lpSymbol: "CROX",
    lpType: "No Fees",
    poolAddress: {
      97: "",
      56: "0x26373b3c6b8ecef5e98700f1d087690ab288b3d7",
    },
    lpAddresses: {
      97: "",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    tokenSymbol: "CNR",
    tokenPrice: 0.075,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0xdCbA3fbd7BBc28abD18A472D28358089467A8a74",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    active: true,
    reward1: 10000,
    closed: true,
    poolStartTime: 1640361078000,
    projectLink: "https://centric.com/",
    depositLink: "https://exchange.croxswap.com",
  },
  {
    pid: -118,
    risk: 5,
    lpSymbol: "CRUSH",
    lpType: "",
    poolAddress: {
      97: "",
      56: "0x33190442d1bfac0047b5c4e6b58fcaa3283c98f0",
    },
    lpAddresses: {
      97: "",
      56: "0x0ef0626736c2d484a792508e99949736d0af807e",
    },
    tokenSymbol: "CROX",
    tokenPrice: 0.206,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    quoteTokenPrice: 0.075,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    active: true,
    reward1: 4000,
    closed: true,
    poolStartTime: 1640364658000,
    projectLink: "https://bitcrush.com/",
    depositLink: "https://exchange.babyswap.finance",
    revert: true,
  },
  {
    pid: -119,
    risk: 5,
    lpSymbol: "CROX",
    lpType: "No Fees",
    poolAddress: {
      97: "",
      56: "0xfd102f382fceeecaecd500f91b585d703cc5c8a3",
    },
    lpAddresses: {
      97: "",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    tokenSymbol: "WNOW",
    tokenPrice: 0.099658,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x56aa0237244c67b9a854b4efe8479cca0b105289",
    },
    rewardTokenSymbol: "FCF",
    rewardTokenPrice: 0.0002335,
    rewardTokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x4673f018cc6d401aad0402bdbf2abcbf43dd69f3",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: true,
    active: true,
    reward1: 3000,
    closed: true,
    reward2: 7000000,
    poolStartTime: 1640368268000,
    projectLink: "https://app.croxswap.com/",
    depositLink: "https://exchange.croxswap.com",
  },
  {
    pid: -120,
    risk: 5,
    lpSymbol: "WNOW",
    lpType: "",
    poolAddress: {
      97: "",
      56: "0x885d1e573a9e9e7ddc05a109b115281a891708be",
    },
    lpAddresses: {
      97: "",
      56: "0x56aa0237244c67b9a854b4efe8479cca0b105289",
    },
    tokenSymbol: "CROX",
    tokenPrice: 0.206,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    quoteTokenPrice: 0.07,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    active: true,
    reward1: 5200,
    closed: true,
    poolStartTime: 1640371818000,
    projectLink: "https://walletnow.net/",
    depositLink: "https://exchange.croxswap.com",
    revert: true,
  },
  {
    pid: -122,
    risk: 5,
    lpSymbol: "CROX",
    lpType: "No Fees",
    poolAddress: {
      97: "",
      56: "0xf8ea34d839bf2a72b49369745811be80308487a5",
    },
    lpAddresses: {
      97: "",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    tokenSymbol: "CRUSH",
    tokenPrice: 0.07,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x0ef0626736c2d484a792508e99949736d0af807e",
    },
    rewardTokenSymbol: "BGLG",
    rewardTokenPrice: 0.0126401,
    rewardTokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0xea01d8d9eacca9996db6bb3377c1fe64308e7328",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: true,
    active: true,
    reward1: 11500,
    closed: true,
    reward2: 1000,
    poolStartTime: 1640379048000,
    projectLink: "https://app.croxswap.com/",
    depositLink: "https://exchange.croxswap.com",
  },
  {
    pid: -123,
    risk: 5,
    lpSymbol: "MRASTA",
    lpType: "",
    poolAddress: {
      97: "",
      56: "0x7F6B502FE3Dfdfbd7979686FE56fb3CDC56D4fBc",
    },
    lpAddresses: {
      97: "",
      56: "0xEAA4A2469a8471bD8314b2FF63c1d113FE8114bA",
    },
    tokenSymbol: "CROX",
    tokenPrice: 0.2,
    tokenAddresses: {
      97: "0x7F511033cFDa8dF0189f9c9BEaD981ae0496901C",
      56: "0x2c094f5a7d1146bb93850f629501eb749f6ed491",
    },
    quoteTokenPrice: 1,
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    title: "",
    isDualFarm: false,
    active: true,
    reward1: 5200,
    closed: true,
    poolStartTime: 1640382669000,
    projectLink: "https://rasta.finance/",
    depositLink: "https://exchange.rasta.finance",
    revert: true,
  },
];
export default croxmaspools;
