import BigNumber from "bignumber.js";
import { FarmConfig, PoolConfig, RastaFarmConfig } from "config/constants/types";

export interface Farm extends FarmConfig {
  tokenAmount?: BigNumber;
  lpTotalInQuoteToken?: BigNumber;
  lpTotalSupply?: BigNumber;
  lpBalance?: BigNumber;
  tokenPriceVsQuote?: BigNumber;
  poolWeight?: number;
  depositFeeBP?: number;
  croxPerBlock?: number;
  poolAddress?: any;
  userData?: {
    allowance: BigNumber;
    tokenBalance: BigNumber;
    stakedBalance: BigNumber;
    prevStakedBalance: BigNumber;
    earnings: BigNumber;
    nextHarvestUntil: number;
  };
}

export interface Pool extends PoolConfig {
  totalStaked?: BigNumber;
  startBlock?: number;
  endBlock?: number;
  userData?: {
    allowance: BigNumber;
    stakingTokenBalance: BigNumber;
    stakedBalance: BigNumber;
    pendingReward: BigNumber;
  };
}

export interface RastaFarm extends RastaFarmConfig {
  tokenAmount?: BigNumber
  quoteTokenAmount?: BigNumber
  singleTokenAmount?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  tokenPriceVsQuote?: BigNumber
  poolWeight?: BigNumber
  userData?: {
    allowance: BigNumber
    tokenBalance: BigNumber
    stakedBalance: BigNumber
    earnings: BigNumber
  }
}

// Slices states

export interface RastaFarmsState {
  data: RastaFarm[];
}

export interface FarmsState {
  data: Farm[];
}

export interface PoolsState {
  data: Pool[];
}

// Global state

export interface State {
  farms: FarmsState;
  rastaFarms: RastaFarmsState;
  rastaPools: RastaFarmsState;
  dualFarms: FarmsState;
  pools: PoolsState;
  croxPools: FarmsState;
  croxmasPools: FarmsState;
  grandPools: FarmsState;
}
