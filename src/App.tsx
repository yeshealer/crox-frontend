import React, { useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { ResetCSS, Flex } from "crox-new-uikit";
import BigNumber from "bignumber.js";
import { useFetchPublicData } from "state/hooks";
import ScrollToTop from 'react-scroll-up'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import GlobalStyle from "./style/Global";
import PageLoader from "./components/PageLoader";
import NftGlobalNotification from "./views/Nft/components/NftGlobalNotification";
import Header from "./components/Header";
import HeadImage from "./components/HeadImage";
import Footer from "./components/Footer";
import "@szhsin/react-menu/dist/index.css";
import "react-multi-carousel/lib/styles.css";
import './style/scrollTop.css'

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page'
const Home = lazy(() => import("./views/Home"));
const Farms = lazy(() => import("./views/Farms"));
const RastaFarms = lazy(() => import("./views/RastaFarms"));
const NextGen = lazy(() => import("./views/NextGen"));
const DualFarm = lazy(() => import("./views/NextGen/DualFarm"));
const CroxPools = lazy(() => import("./views/CroxPools"));
const Referral = lazy(() => import("./views/Referral"));
const Ref = lazy(() => import("./views/Ref"));
const Bridge = lazy(() => import("./views/Bridge"));
const Icopage = lazy(() => import("./views/Icopage"));
const Icodetails = lazy(() => import("./views/Icopage/Icodetails"));
// const Lottery = lazy(() => import('./views/Lottery'))
// const Pools = lazy(() => import('./views/Pools'))
// const Ifos = lazy(() => import('./views/Ifos'))
const NotFound = lazy(() => import("./views/NotFound"));
// const Nft = lazy(() => import('./views/Nft'))
const CroxMas = lazy(() => import("./views/CroxMas"));
const CroxBalance = lazy(() => import("./views/CroxBalance"));
const VPots = lazy(() => import("./views/VPots"));
const Vault = lazy(() => import("./views/VPots/Vault"));
const Pot = lazy(() => import("./views/VPots/Pot"));

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

const App: React.FC = () => {
  const { account, connect } = useWallet();
  useEffect(() => {
    if (!account && window.localStorage.getItem("accountStatus")) {
      connect("injected");
    }
  }, [account, connect]);

  useFetchPublicData();

  return (
    <Router>
      <ResetCSS />
      <GlobalStyle />
      <Header />
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/croxmas">
            <CroxMas />
          </Route>
          <Route path="/farms">
            <HeadImage />
            <Farms />
          </Route>
          <Route path="/rastafarms">
            <HeadImage isRasta />
            <RastaFarms />
          </Route>
          <Route path="/pools/nextgen">
            <HeadImage />
            <NextGen />
          </Route>
          <Route path="/dualfarms">
            <HeadImage />
            <DualFarm />
          </Route>
          <Route path="/nests">
            <Farms tokenMode />
          </Route>
          <Route path="/pools/crox">
            <HeadImage />
            <CroxPools />
          </Route>
          <Route path="/referral">
            <Referral />
          </Route>
          <Route path="/ref/:ref">
            <Ref />
          </Route>
          <Route path="/ico/:id/details">
            <Icodetails />
          </Route>
          <Route path="/ico">
            <Icopage />
          </Route>
          <Route path="/croxbalance">
            <CroxBalance />
          </Route>
          <Route path="/vpots/vault/:name">
            <Vault />
          </Route>
          <Route path="/vpots/pot/:name">
            <Pot />
          </Route>
          <Route path="/vpots">
            <VPots />
          </Route>
          <Route path="/">
            <Home />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Suspense>
      <Footer />
      <ScrollToTop showUnder={160} style={{ zIndex: "100000000000000" }}>
        <Flex className="scrollTop" justifyContent='center' alignItems='center'>
          <KeyboardArrowUpIcon />
        </Flex>
      </ScrollToTop>
      <NftGlobalNotification />
    </Router>
  );
};

export default React.memo(App);
