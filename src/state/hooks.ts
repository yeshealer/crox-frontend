import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import useRefresh from "hooks/useRefresh";
import useMRastaPrice from 'hooks/useMRastaPrice'
import {
  fetchFarmsPublicDataAsync,
  fetchRastaFarmsPublicDataAsync,
  fetchCroxPoolsPublicDataAsync,
  fetchDualFarmsPublicDataAsync,
  fetchCroxmasPoolsPublicDataAsync,
  fetchGrandPoolsPublicDataAsync,
} from "./actions";
import { State, Farm, Pool, RastaFarm } from "./types";
import { QuoteToken } from "../config/constants/types";

const ZERO = new BigNumber(0);

export const useFetchPublicData = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync());
    dispatch(fetchRastaFarmsPublicDataAsync());
    dispatch(fetchCroxmasPoolsPublicDataAsync());
    dispatch(fetchGrandPoolsPublicDataAsync());
    dispatch(fetchCroxPoolsPublicDataAsync());
    dispatch(fetchDualFarmsPublicDataAsync());
  }, [dispatch]);
};

// Farms

export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data);
  return farms;
};

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) =>
    state.farms.data.find((f) => f.pid === pid)
  );
  return farm;
};

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) =>
    state.farms.data.find((f) => f.lpSymbol === lpSymbol)
  );
  return farm;
};

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid);
  return {
    allowance: farm.userData
      ? new BigNumber(farm.userData.allowance)
      : new BigNumber(0),
    tokenBalance: farm.userData
      ? new BigNumber(farm.userData.tokenBalance)
      : new BigNumber(0),
    stakedBalance: farm.userData
      ? new BigNumber(farm.userData.stakedBalance)
      : new BigNumber(0),
    earnings: farm.userData
      ? new BigNumber(farm.userData.earnings)
      : new BigNumber(0),
    nextHarvestUntil: farm.userData
      ? Number(farm.userData.nextHarvestUntil)
      : 0,
  };
};

// RastaFarms

export const useRastaFarms = (): RastaFarm[] => {
  const farms = useSelector((state: State) => state.rastaFarms.data);
  return farms;
};

export const useRastaFarmFromPid = (pid): RastaFarm => {
  const farm = useSelector((state: State) =>
    state.rastaFarms.data.find((f) => f.pid === pid)
  );
  return farm;
};

export const useRastaFarmFromSymbol = (lpSymbol: string): RastaFarm => {
  const farm = useSelector((state: State) =>
    state.rastaFarms.data.find((f) => f.lpSymbol === lpSymbol)
  );
  return farm;
};

export const useRastaFarmUser = (pid) => {
  const farm = useRastaFarmFromPid(pid);
  return {
    allowance: farm.userData
      ? new BigNumber(farm.userData.allowance)
      : new BigNumber(0),
    tokenBalance: farm.userData
      ? new BigNumber(farm.userData.tokenBalance)
      : new BigNumber(0),
    stakedBalance: farm.userData
      ? new BigNumber(farm.userData.stakedBalance)
      : new BigNumber(0),
    earnings: farm.userData
      ? new BigNumber(farm.userData.earnings)
      : new BigNumber(0),
  };
};

// Rastas

export const useRastaPools = (): RastaFarm[] => {
  const farms = useSelector((state: State) => state.rastaPools.data);
  return farms;
};

export const useRastaPoolFromPid = (pid): RastaFarm => {
  const farm = useSelector((state: State) =>
    state.rastaPools.data.find((f) => f.pid === pid)
  );
  return farm;
};

export const useRastaPoolFromSymbol = (lpSymbol: string): RastaFarm => {
  const farm = useSelector((state: State) =>
    state.rastaPools.data.find((f) => f.lpSymbol === lpSymbol)
  );
  return farm;
};

export const useRastaPoolUser = (pid) => {
  const farm = useRastaPoolFromPid(pid);
  return {
    allowance: farm.userData
      ? new BigNumber(farm.userData.allowance)
      : new BigNumber(0),
    tokenBalance: farm.userData
      ? new BigNumber(farm.userData.tokenBalance)
      : new BigNumber(0),
    stakedBalance: farm.userData
      ? new BigNumber(farm.userData.stakedBalance)
      : new BigNumber(0),
    earnings: farm.userData
      ? new BigNumber(farm.userData.earnings)
      : new BigNumber(0),
  };
};

// CroxmasPools

export const useCroxmasPools = (): Farm[] => {
  const farms = useSelector((state: State) => state.croxmasPools.data);
  return farms;
};

export const useCroxmasFromPid = (pid): Farm => {
  const farm = useSelector((state: State) =>
    state.croxmasPools.data.find(
      (f) => JSON.stringify(f.poolAddress) === JSON.stringify(pid)
    )
  );
  return farm;
};

export const useCroxmasPoolPid = (pid): Farm => {
  const farm = useSelector((state: State) => {
    return state.croxmasPools.data.find(
      (f) => JSON.stringify(f.poolAddress) === JSON.stringify(pid)
    );
  });
  return farm;
};

export const useCroxmasPoolUser = (pid) => {
  const farm = useCroxmasPoolPid(pid);
  return {
    allowance: farm.userData
      ? new BigNumber(farm.userData.allowance)
      : new BigNumber(0),
    tokenBalance: farm.userData
      ? new BigNumber(farm.userData.tokenBalance)
      : new BigNumber(0),
    stakedBalance: farm.userData
      ? new BigNumber(farm.userData.stakedBalance)
      : new BigNumber(0),
    earnings: farm.userData ? farm.userData.earnings : [0, 0],
    nextHarvestUntil: farm.userData
      ? Number(farm.userData.nextHarvestUntil)
      : 0,
  };
};

// GrandPool

export const useGrandPools = (): Farm[] => {
  const farms = useSelector((state: State) => state.grandPools.data);
  return farms;
};

export const useGrandFromPid = (pid): Farm => {
  const farm = useSelector((state: State) =>
    state.grandPools.data.find(
      (f) => JSON.stringify(f.poolAddress) === JSON.stringify(pid)
    )
  );
  return farm;
};

export const useGrandPoolPid = (pid): Farm => {
  const farm = useSelector((state: State) => {
    return state.grandPools.data.find(
      (f) => JSON.stringify(f.poolAddress) === JSON.stringify(pid)
    );
  });
  return farm;
};

export const useGrandPoolUser = (pid) => {
  const farm = useGrandPoolPid(pid);
  return {
    allowance: farm.userData
      ? new BigNumber(farm.userData.allowance)
      : new BigNumber(0),
    tokenBalance: farm.userData
      ? new BigNumber(farm.userData.tokenBalance)
      : new BigNumber(0),
    stakedBalance: farm.userData
      ? new BigNumber(farm.userData.stakedBalance)
      : new BigNumber(0),
    earnings: (farm.userData ? farm.userData.earnings : [0, 0]) as any,
    nextHarvestUntil: farm.userData
      ? Number(farm.userData.nextHarvestUntil)
      : 0,
  };
};

// Dual-farms

export const useDualFarms = (single = false): Farm[] => {
  let farms = useSelector((state: State) => state.dualFarms.data);
  farms = farms.filter((it) => (single ? !it.isDualFarm : it.isDualFarm));
  return farms;
};

export const useDualFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) =>
    state.dualFarms.data.find(
      (f) => JSON.stringify(f.poolAddress) === JSON.stringify(pid)
    )
  );
  return farm;
};

export const useDualFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) =>
    state.dualFarms.data.find((f) => f.lpSymbol === lpSymbol)
  );
  return farm;
};

export const useDualFarmUser = (pid) => {
  const farm = useDualFarmFromPid(pid);
  return {
    allowance: farm.userData
      ? new BigNumber(farm.userData.allowance)
      : new BigNumber(0),
    tokenBalance: farm.userData
      ? new BigNumber(farm.userData.tokenBalance)
      : new BigNumber(0),
    stakedBalance: farm.userData
      ? new BigNumber(farm.userData.stakedBalance)
      : new BigNumber(0),
    earnings: farm.userData ? farm.userData.earnings : [0, 0],
    nextHarvestUntil: farm.userData
      ? Number(farm.userData.nextHarvestUntil)
      : 0,
  };
};

// CroxPools

export const useCroxPools = (): Farm[] => {
  const farms = useSelector((state: State) => state.croxPools.data);
  return farms;
};

export const useCroxPoolFromPid = (pid): Farm => {
  const farm = useSelector((state: State) =>
    state.croxPools.data.find((f) => f.pid === pid)
  );
  return farm;
};

export const useCroxPoolFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) =>
    state.croxPools.data.find((f) => f.lpSymbol === lpSymbol)
  );
  return farm;
};

export const useCroxPoolSymbol = (lpSymbol: string) => {
  const farm = useCroxPoolFromSymbol(lpSymbol);
  return {
    stakedBalance: farm.userData
      ? new BigNumber(farm.userData.stakedBalance)
      : new BigNumber(0),
  };
};

export const useCroxPoolUser = (pid) => {
  const farm = useCroxPoolFromPid(pid);

  return {
    allowance: farm.userData
      ? new BigNumber(farm.userData.allowance)
      : new BigNumber(0),
    tokenBalance: farm.userData
      ? new BigNumber(farm.userData.tokenBalance)
      : new BigNumber(0),
    stakedBalance: farm.userData
      ? new BigNumber(farm.userData.stakedBalance)
      : new BigNumber(0),
    earnings: farm.userData
      ? new BigNumber(farm.userData.earnings)
      : new BigNumber(0),
    nextHarvestUntil: farm.userData
      ? Number(farm.userData.nextHarvestUntil)
      : 0,
  };
};

// Pools

export const usePools = (account): Pool[] => {
  const { fastRefresh } = useRefresh();
  const dispatch = useDispatch();
  useEffect(() => {
    if (account) {
      // dispatch(fetchPoolsUserDataAsync(account));
    }
  }, [account, dispatch, fastRefresh]);

  const pools = useSelector((state: State) => state.pools.data);
  return pools;
};

export const usePoolFromPid = (sousId): Pool => {
  const pool = useSelector((state: State) =>
    state.pools.data.find((p) => p.sousId === sousId)
  );
  return pool;
};

// Prices

export const usePriceBnbBusd = (): BigNumber => {
  const pid = 4; // BUSD-BNB LP
  const farm = useFarmFromPid(pid);
  return farm && farm.tokenPriceVsQuote
    ? new BigNumber(farm.tokenPriceVsQuote)
    : ZERO;
};

export const usePriceCroxBnb = (): BigNumber => {
  const pid = 0; // BUSD-BNB LP
  const farm = useFarmFromPid(pid);
  return farm && farm.tokenPriceVsQuote
    ? new BigNumber(farm.tokenPriceVsQuote)
    : ZERO;
};

export const usePriceCakeBusd = (): BigNumber => {
  const bnbPrice = usePriceBnbBusd();
  const cakeInBnb = usePriceCroxBnb();
  return bnbPrice.times(cakeInBnb);
};

export const usePriceRastaBusd = (): BigNumber => {
  const pid = 1 // RASTA-BNB LP
  const bnbPrice = usePriceBnbBusd()
  const farm = useRastaFarmFromPid(pid)
  return farm && farm.tokenPriceVsQuote ? bnbPrice.times(farm.tokenPriceVsQuote) : ZERO
}

export const usePriceEthBusd = (): BigNumber => {
  const pid = 7 // ETH-BNB LP
  const bnbPrice = usePriceBnbBusd()
  const farm = useRastaFarmFromPid(pid)
  return farm && farm.tokenPriceVsQuote ? bnbPrice.times(farm.tokenPriceVsQuote) : ZERO
}

export const useTotalValue = (): BigNumber => {
  const farms = useFarms();
  const croxPools = useCroxPools();
  const dualFarms = useDualFarms();
  const nextPools = useDualFarms(true);
  const croxmasPools = useCroxmasPools();
  const grandPools = useGrandPools();
  const rastaFarms = useRastaFarms();
  const bnbPrice = usePriceBnbBusd();
  const cakePrice = usePriceCakeBusd();
  const ethPrice = usePriceEthBusd()
  const rastaPrice = usePriceRastaBusd()
  const mrastaPrice = useMRastaPrice();
  const manualCNRPrice = 0.08;
  let value = new BigNumber(0);
  for (let i = 0; i < farms.length; i++) {
    const farm = farms[i];
    if (farm.lpTotalInQuoteToken) {
      let val;
      if (farm.quoteTokenSymbol === QuoteToken.BNB) {
        val = bnbPrice.times(farm.lpTotalInQuoteToken);
      } else if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
        val = cakePrice.times(farm.lpTotalInQuoteToken);
      } else {
        val = farm.lpTotalInQuoteToken;
      }
      value = value.plus(val);
    }
  }
  for (let i = 0; i < croxPools.length; i++) {
    const croxPool = croxPools[i];
    if (croxPool.lpTotalInQuoteToken) {
      value = value.plus(croxPool.lpTotalInQuoteToken);
    }
  }
  for (let i = 0; i < dualFarms.length; i++) {
    const dualFarm = dualFarms[i];

    if (dualFarm.lpTotalInQuoteToken) {
      let val2;
      if (dualFarm.quoteTokenSymbol === QuoteToken.BNB) {
        val2 = bnbPrice.times(dualFarm.lpTotalInQuoteToken);
      } else if (dualFarm.quoteTokenSymbol === QuoteToken.CAKE) {
        val2 = cakePrice.times(dualFarm.lpTotalInQuoteToken);
      } else {
        val2 = dualFarm.lpTotalInQuoteToken;
      }
      value = value.plus(val2);
    }
  }
  for (let i = 0; i < nextPools.length; i++) {
    const nextPool = nextPools[i];

    if (nextPool.lpTotalInQuoteToken) {
      let val2 = cakePrice.times(nextPool.lpBalance);
      if (nextPool.lpSymbol !== 'CROX' || nextPool.tokenSymbol === 'PUNKS') {
        val2 = new BigNumber(nextPool.tokenPrice).times(nextPool.lpBalance)
      }
      value = value.plus(val2);
    }
  }
  for (let i = 0; i < croxmasPools.length; i++) {
    const croxmasPool = croxmasPools[i];

    if (croxmasPool.lpTotalInQuoteToken) {
      const val2 = cakePrice.times(croxmasPool.lpBalance);
      value = value.plus(val2);
    }
  }
  for (let i = 0; i < grandPools.length; i++) {
    const grandPool = grandPools[i];

    if (grandPool.lpTotalInQuoteToken) {
      const val2 = cakePrice.times(grandPool.lpBalance);
      value = value.plus(val2);
    }
  }
  for (let i = 0; i < rastaFarms.length; i++) {
    const rastaFarm = rastaFarms[i]
    let val2 = new BigNumber(0);
    if (rastaFarm && rastaFarm.lpSymbol && !rastaFarm.lpSymbol.includes('RLP') && !rastaFarm.lpSymbol.includes('CAKE LP')) {
      let price = new BigNumber(0);
      if (rastaFarm.tokenSymbol === 'MRASTA') {
        price = new BigNumber(mrastaPrice)
      } else if (rastaFarm.lpSymbol === 'CNR') {
        price = new BigNumber(manualCNRPrice)
      } else if (rastaFarm.lpSymbol === 'BNB') {
        price = new BigNumber(bnbPrice);
      } else if (rastaFarm.lpSymbol === 'RASTA') {
        price = new BigNumber(rastaPrice);
      }
      val2 = new BigNumber((rastaFarm.singleTokenAmount)).times(price)
      value = value.plus(new BigNumber(val2))
    }
    else {
      if (rastaFarm.quoteTokenSymbol === QuoteToken.BNB) {
        val2 = bnbPrice.times(rastaFarm.lpTotalInQuoteToken)
      }
      if (rastaFarm.quoteTokenSymbol === QuoteToken.RASTA) {
        val2 = rastaPrice.times(rastaFarm.lpTotalInQuoteToken)
      }
      if (rastaFarm.quoteTokenSymbol === QuoteToken.ETH) {
        val2 = ethPrice.times(rastaFarm.lpTotalInQuoteToken)
      }
      value = value.plus(new BigNumber(val2))
    }
  }
  return value;
};

