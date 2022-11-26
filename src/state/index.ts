import { configureStore } from "@reduxjs/toolkit";
import farmsReducer from "./farms";
import croxPoolsReducer from "./croxPools";
import poolsReducer from "./pools";
import dualFarmsReducer from "./dualFarms";
import croxmasPoolsReducer from './croxmasPools'
import grandPoolsReducer from './grandPool';
import rastaFarmsReducer from "./rastaFarms";

export default configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: {
    farms: farmsReducer,
    pools: poolsReducer,
    croxPools: croxPoolsReducer,
    dualFarms: dualFarmsReducer,
    croxmasPools: croxmasPoolsReducer,
    grandPools: grandPoolsReducer,
    rastaFarms: rastaFarmsReducer,
  },
});
