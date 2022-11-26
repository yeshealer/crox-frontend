/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import farmsConfig from "../../config/constants/grandpool";
import fetchGrandPools from "./fetchGrandPools";
import {
  fetchGrandPoolsUserEarnings,
  fetchGrandPoolsUserAllowances,
  fetchGrandPoolsUserTokenBalances,
  fetchGrandPoolsUserStakedBalances,
} from "./fetchGrandPoolUser";
import { FarmsState, Farm } from "../types";

const initialState: FarmsState = { data: [...farmsConfig] };

export const farmsSlice = createSlice({
  name: "GrandPools",
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
export const fetchGrandPoolsPublicDataAsync = () => async (dispatch) => {
  const farms = await fetchGrandPools();
  dispatch(setFarmsPublicData(farms));
};

export const fetchGrandPoolsUserDataAsync = (account) => async (dispatch) => {
  const userFarmAllowances = await fetchGrandPoolsUserAllowances(account);
  const userFarmTokenBalances = await fetchGrandPoolsUserTokenBalances(account);
  const userStakedBalances = await fetchGrandPoolsUserStakedBalances(account);
  const userFarmEarnings = await fetchGrandPoolsUserEarnings(account);

  const arrayOfUserDataObjects = userFarmAllowances.map(
    (farmAllowance, index) => {
      return {
        index,
        allowance: userFarmAllowances[index],
        tokenBalance: userFarmTokenBalances[index],
        stakedBalance: userStakedBalances[index],
        earnings: [...userFarmEarnings],
      };
    }
  );

  dispatch(setFarmUserData({ arrayOfUserDataObjects }));
};

export default farmsSlice.reducer;
