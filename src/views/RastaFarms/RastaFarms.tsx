/* eslint-disable */
import React, { useEffect, useCallback, useState, useMemo } from "react";
import { Route, useRouteMatch, useLocation, Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import BigNumber from "bignumber.js";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { provider } from "web3-core";
import { Heading } from "crox-uikit";
import { RASTA_POOL_PID, RASTA_PER_BLOCK, BLOCKS_PER_YEAR } from 'config'
import { useMatchBreakpoints, ButtonMenu, ButtonMenuItem, Text, Toggle } from "crox-new-uikit";
import { orderBy } from "lodash";
import FlexLayout from "components/layout/Flex";
import Page from "components/layout/Page";
import { useRastaFarms, usePriceBnbBusd, usePriceCakeBusd, usePriceEthBusd, usePriceRastaBusd } from "state/hooks";
import Grid from '@mui/material/Grid';
import { fetchRastaFarmsPublicDataAsync, fetchRastaFarmUserDataAsync } from "state/actions";
import useI18n from "hooks/useI18n";
import { useGetPriceData, useGetCNSPriceVsBnb } from 'hooks/api'
import useMRastaPrice from 'hooks/useMRastaPrice'
import { getAPYAndTVLOfRastaFarms } from "utils/defi";
import Select, { OptionProps } from "components/Select/Select";
import FarmCard, { FarmWithStakedValue } from "./components/FarmCard/FarmCard";
import FarmTabButtons from "./components/FarmTabButtons";
import Divider from "./components/Divider";
import CountDown from "components/CountDown";
import SearchInput from "./components/SearchInput";

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  justify-content: space-between;
  flex-direction: column;

  @media screen and (max-width: 1000px) {
    margin: 10px 0;
    display: -webkit-box;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`;

const HeaderText = styled.div`
  font-size: 40px;
  font-weight: bolder;
  
  @media screen and (max-width: 1000px) {
    font-size: 29px;
  }
`;

const HeaderText1 = styled.div`
  font-size: 20px;
  margin-top: -54px;
  @media screen and (max-width: 550px) {
    font-size:18px;
  }
`;

const TabMagin = styled.div`
  text-align: center; 
  margin-top: -40px;
  @media screen and (max-width: 550px) {
    margin-top: -38px;
  }
`;

const FarmCSS = styled.p`
  border-bottom: 3px solid #61471C;
  display:inline-block;
  color: white;
  font-weight: bold;
  font-size: 20px;
  width: max-content;
  background-color: #61471C;
  opacity: 0.8;
  padding: 10px 15px 7px 15px;
  border-radius: 5px 0px 0px 0px;
  @media screen and (max-width: 550px) {
    padding: 10px 5px 7px 5px;
    width: 33%;
    font-size: 18px;
  }
`;

const DualCSS = styled.p`
  border-bottom: 3px solid #61471C;
  border-left: 1px solid lightgrey;
  border-left-style: dashed;
  display:inline-block;
  color: white;
  font-weight: bold;
  font-size: 20px;
  width: max-content;
  background-color: #61471C;
  opacity: 0.8;
  padding: 10px 15px 7px 15px;
  @media screen and (max-width: 550px) {
    padding: 10px 5px 7px 5px;
    width: 33%;
    font-size: 18px;
  }
`;

const RastaCSS = styled.p`
  border-bottom: 3px solid lightgrey;
  display:inline-block;
  color: white;
  font-weight: bold;
  font-size: 20px;
  width: max-content;
  background-color: #2d74c4;
  padding: 10px 15px 7px 15px;
  border-radius: 0px 5px 0px 0px;
  @media screen and (max-width: 550px) {
    padding: 10px 5px 7px 5px;
    width: 33%;
    font-size: 18px;
  }
`;

const SelectSearch = styled.div`
  display: flex;
  @media screen and (max-width: 1000px) {
    display: flex;
    margin-top: 1%;
  }
`;

const Selecter = styled.div`
  flex: auto;
  @media screen and (max-width: 1000px) {
    display: flex;
    width: 136px !important;
    margin-top: 8px;
  }
`;

const Searchfarm = styled.div`
  flex: auto;
  margin-left: 40px;
  @media screen and (max-width: 1000px) {
    display: block;
    margin-left: 0px;
    width: fit-content;
  }
`;


export interface FarmsProps {
  tokenMode?: boolean;
}

const NUMBER_OF_FARMS_VISIBLE = 12;

const Farms: React.FC<FarmsProps> = (farmsProps) => {
  const history = useHistory()
  const { isMd, isSm, isXs, isLg } = useMatchBreakpoints();
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState("hot");
  const { pathname } = useLocation();
  const { path } = useRouteMatch();
  const TranslateString = useI18n();
  const farmsLP = useRastaFarms();
  const cakePrice = usePriceCakeBusd();
  const bnbPrice = usePriceBnbBusd();
  const ethPriceUsd = usePriceEthBusd()
  const rastaPrice = usePriceRastaBusd()
  const mrastaPrice = useMRastaPrice()
  const cnsPriceVsBnb = useGetCNSPriceVsBnb()
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet();
  const { tokenMode } = farmsProps;
  const isInactive = pathname.includes("history");
  const isActive = !isInactive;
  const priceData = useGetPriceData()
  const manualCNRPrice = 0.08

  const [stakedOnly, setStakedOnly] = useState(!isActive);
  useEffect(() => {
    setStakedOnly(!isActive);
  }, [isActive]);

  const dispatch = useDispatch();
  useEffect(() => {
    if (account) {
      dispatch(fetchRastaFarmUserDataAsync(account))
    }
  }, [account, dispatch]);

  const poolsList = farmsLP.filter((farm) => farm.lpSymbol && !farm.lpSymbol.includes('RLP') && !farm.lpSymbol.includes('CAKE LP'))
  const activeFarms = farmsLP.filter((farm) => farm.multiplier !== '0X' && farm.lpSymbol !== "RX")
  const inactiveFarms = farmsLP.filter((farm) => farm.multiplier === '0X')

  const stakedOnlyFarms = activeFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  );

  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  );

  const farmsList = useCallback(
    (farmsToDisplay, removed?: boolean) => {
      const cakePriceVsBNB = new BigNumber(farmsLP.find((farm) => farm.pid === RASTA_POOL_PID)?.tokenPriceVsQuote || 0)

      let farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map(
        (farm) => {
          if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
            return farm
          }

          let apy;
          if (!farm.lpSymbol.includes('RLP') && !farm.lpSymbol.includes('CAKE LP')) {
            if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken || !priceData) {
              return farm
            }
            const cakeRewardPerBlock = RASTA_PER_BLOCK.times(farm.poolWeight)
            const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

            let price = ''
            if (farm.tokenSymbol === 'MRASTA') {
              price = mrastaPrice.toString()
            } else if (farm.lpSymbol === 'CNR') {
              // price = new BigNumber(cnsPriceVsBnb).times(115).times(bnbPrice).toString()
              price = new BigNumber(manualCNRPrice).toString()
            } else if (farm.lpSymbol === 'BNB') {
              price = new BigNumber(bnbPrice).toString();
            } else if (farm.lpSymbol === 'RASTA') {
              price = new BigNumber(rastaPrice).toString();
            }

            apy = cakePriceVsBNB
              .times(bnbPrice)
              .times(cakeRewardPerYear)
              .div(new BigNumber(farm.singleTokenAmount).times(Number(price)))
          }
          else {
            apy = getAPYAndTVLOfRastaFarms(farm, { rastaPrice, ethPriceUsd, bnbPrice, cakePriceVsBNB });
          }

          return { ...farm, apy };
        }
      );
      return farmsToDisplayWithAPY;
    },
    [bnbPrice, account, cakePrice, ethereum]
  );

  const { url, isExact } = useRouteMatch()

  const farmsStakedMemoized = useMemo(() => {
    let farmsStaked = [];

    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case "apy":
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => farm.apy,
            "desc"
          );
        case "multiplier":
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) =>
              farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0,
            "desc"
          );
        case "earned":
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) =>
              farm.userData ? Number(farm.userData.earnings) : 0,
            "desc"
          );
        default:
          return farms;
      }
    };

    if (isActive) {
      farmsStaked = stakedOnly
        ? farmsList(stakedOnlyFarms, false)
        : farmsList(activeFarms, false);
    }
    if (isInactive) {
      farmsStaked = stakedOnly
        ? farmsList(stakedInactiveFarms, true)
        : farmsList(inactiveFarms, true);
      farmsStaked = farmsStaked.filter(farmStaked => farmStaked.lpSymbol !== 'RX')
    }
    return sortFarms(farmsStaked);
  }, [
    sortOption,
    activeFarms,
    farmsList,
    inactiveFarms,
    isActive,
    isInactive,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
  ]);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value);
  };

  return (
    <Page style={{ padding: '0px' }}>
      <div style={{ textAlign: "center", position: "absolute", top: "65px", width: "100%", left: "0" }}>
        <Heading
          as="h1"
          size="lg"
          color="primary"
          mb="50px"
          style={{ fontWeight: "bolder" }}
        >
          <HeaderText>
            Next-Generation Staking & Yield Farming
          </HeaderText>
        </Heading>
        <Heading
          size="md"
          color="primary"
          mb="30px"
          style={{ textAlign: "center" }}
        >
          <HeaderText1>
            Stake your LP tokens to earn CROX
          </HeaderText1>
        </Heading>
      </div>
      <TabMagin>
        <Link to="/farms"><FarmCSS>CROX FARMS</FarmCSS></Link>
        <Link to="/dualfarms"><DualCSS>DUAL-FARMS</DualCSS></Link>
        <Link to="/rastafarms"><RastaCSS>RASTA FARMS</RastaCSS></Link>
      </TabMagin>
      <CountDown timestamp={1618708740000} />
      {!isMd && !isSm && !isXs && !isLg ? (
        <>
          <ControlContainer>
            <FarmTabButtons stakedOnly={stakedOnly} setStakedOnly={setStakedOnly} />
            <SelectSearch >
              <Selecter>
                <Select
                  options={[
                    {
                      label: "Hot",
                      value: "hot",
                    },
                    {
                      label: "APY",
                      value: "apy",
                    },
                    {
                      label: "Multiplier",
                      value: "multiplier",
                    },
                    {
                      label: "Earned",
                      value: "earned",
                    },
                  ]}
                  onChange={handleSortOptionChange}
                />
              </Selecter>
              <Searchfarm>
                <SearchInput onChange={handleChangeQuery} />
              </Searchfarm>
            </SelectSearch>
          </ControlContainer>
        </>
      ) : (
        <>
          <ControlContainer>
            <Searchfarm>
              <SearchInput onChange={handleChangeQuery} />
              <label>
                <input type='checkbox' />
                <span className='base-color'>
                  <span className='toggle-slider' />
                  <span className='cash' onClick={() => { history.replace(url) }}>Active</span>
                  <span className='token' onClick={() => { history.replace(`${url}/history`) }}>Finished</span>
                </span>
              </label>
            </Searchfarm>
            <div style={{ display: "block", width: "fit-content" }}>
              <div style={{ display: "flex" }}>
                <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} />
                <Text style={{ padding: "3% 9px" }}> {TranslateString(699, 'Staked only')}</Text>
              </div>
              <Selecter>
                <Select
                  options={[
                    {
                      label: "Hot",
                      value: "hot",
                    },
                    {
                      label: "APY",
                      value: "apy",
                    },
                    {
                      label: "Multiplier",
                      value: "multiplier",
                    },
                    {
                      label: "Earned",
                      value: "earned",
                    },
                  ]}
                  onChange={handleSortOptionChange}
                />
              </Selecter>
            </div>

          </ControlContainer>
        </>
      )}
      <div>
        <Divider />
        <FlexLayout>
          <Route exact path={`${path}`}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ alignItems: 'center' }}>
              {farmsStakedMemoized.map((farm) => (
                <Grid item xs={12} sm={6} md={6} lg={4}>
                  <FarmCard
                    key={farm.pid}
                    farm={farm}
                    account={account}
                    bnbPrice={bnbPrice}
                    ethereum={ethereum}
                    removed={false}
                    rastaPrice={rastaPrice}
                    ethPrice={ethPriceUsd}
                  />
                </Grid>
              ))}
            </Grid>
          </Route>
          <Route exact path={`${path}/history`}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ alignItems: 'center' }}>
              {farmsStakedMemoized.map((farm) => (
                <Grid item xs={12} sm={6} md={6} lg={4}>
                  <FarmCard
                    key={farm.pid}
                    farm={farm}
                    account={account}
                    bnbPrice={bnbPrice}
                    ethereum={ethereum}
                    removed={true}
                    rastaPrice={rastaPrice}
                    ethPrice={ethPriceUsd}
                  />
                </Grid>
              ))}
            </Grid>
          </Route>
        </FlexLayout>
      </div>
    </Page >
  );
};

export default Farms;
