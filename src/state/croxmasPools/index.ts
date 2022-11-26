/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import farmsConfig from "../../config/constants/croxmaspools";
import fetchCroxmasPools from "./fetchCroxmasPools";
import {
  fetchCroxmasPoolsUserEarnings,
  fetchCroxmasPoolsUserAllowances,
  fetchCroxmasPoolsUserTokenBalances,
  fetchCroxmasPoolsUserStakedBalances,
  fetchCroxmasPoolsUserNextHarvestUntil,
  fetchCroxmasPoolsUserRedeemable,
} from "./fetchCroxmasPoolUser";
import { FarmsState, Farm } from "../types";

const initialState: FarmsState = { data: [...farmsConfig] };

export const farmsSlice = createSlice({
  name: "CroxmasPools",
  initialState,
  reducers: {
    setFarmsPublicData: (state, action) => {
      const liveFarmsData: Farm[] = action.payload;
      state.data = state.data.map((farm) => {
        const liveFarmData = liveFarmsData.find((f) => f.pid === farm.pid);
        return { ...farm, ...liveFarmData };
      });
    },
    setFarmUserData: (state, action) => {
      const { arrayOfUserDataObjects } = action.payload;
      arrayOfUserDataObjects.forEach((userDataEl) => {
        const { index } = userDataEl;
        state.data[index] = { ...state.data[index], userData: userDataEl };
      });
    },
  },
});

// Actions
export const { setFarmsPublicData, setFarmUserData } = farmsSlice.actions;

// Thunks
export const fetchCroxmasPoolsPublicDataAsync = () => async (dispatch) => {
  const farms = await fetchCroxmasPools();
  dispatch(setFarmsPublicData(farms));
};
export const fetchCroxmasPoolsUserDataAsync = (account) => async (dispatch) => {
  const userFarmAllowances = await fetchCroxmasPoolsUserAllowances(account);
  const userFarmTokenBalances = await fetchCroxmasPoolsUserTokenBalances(
    account
  );
  const userStakedBalances = await fetchCroxmasPoolsUserStakedBalances(account);
  const userFarmEarnings = await fetchCroxmasPoolsUserEarnings(account);
  const userNextHarvestUntil = await fetchCroxmasPoolsUserNextHarvestUntil(
    account
  );
  const userFarmRedeemable = await fetchCroxmasPoolsUserRedeemable(account);

  const arrayOfUserDataObjects = userFarmAllowances.map(
    (farmAllowance, index) => {
      return {
        index,
        allowance: userFarmAllowances[index],
        tokenBalance: userFarmTokenBalances[index],
        stakedBalance: userStakedBalances[index],
        earnings: [userFarmEarnings[index][0], userFarmEarnings[index][1]],
        nextHarvestUntil: userNextHarvestUntil[index],
        redeemable: userFarmRedeemable[index],
      };
    }
  );

  dispatch(setFarmUserData({ arrayOfUserDataObjects }));
};

export default farmsSlice.reducer;
