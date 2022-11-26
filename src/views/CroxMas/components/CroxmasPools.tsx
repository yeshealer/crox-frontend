import React, { useEffect, useState, useRef } from "react";
import { Text, Flex, Link, useModal } from "crox-new-uikit";
import { useDispatch } from "react-redux";
import styled, { keyframes } from "styled-components";
import Grid from "@mui/material/Grid";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { fetchCroxmasPoolsUserDataAsync } from "state/actions";
import axios from "axios";
import useRefresh from "hooks/useRefresh";
import {
  useCroxmasPools,
  usePriceCakeBusd,
  usePriceBnbBusd,
} from "state/hooks";
import { getBalanceNumber } from "utils/formatBalance";
import BigNumber from "bignumber.js";
import { SettingsBackupRestoreTwoTone } from "@mui/icons-material";
import { getAPYAndTVLOfCroxmasPools } from "utils/defi";
import InfoIcon from "@mui/icons-material/Info";
import ButtonGrp from "./ButtonGrp";

const APRInfo = styled.div`
  position: absolute;
  width: 100px;
  background: rgba(122, 230, 246, 0.3);
  left: 86%;
  top: 21%;
  z-index: 10;

  span {
    font-size: 12px;
    line-height: 13px;
    color: #1afac4;
  }
`;

const CroxMasPools: React.FC = () => {
  const dispatch = useDispatch();
  const { fastRefresh } = useRefresh();
  const { account } = useWallet();
  const [hover, setHover] = useState("");
  const cakePrice = usePriceCakeBusd();
  const bnbPrice = usePriceBnbBusd();
  const disableButton = useRef([]);
  useEffect(() => {
    if (account) {
      dispatch(fetchCroxmasPoolsUserDataAsync(account));
    }
  }, [account, dispatch, fastRefresh]);
  const [startTime, setStartTime] = useState("");
  // const [poolStartTime, setPoolStartTime] = useState([])
  const poolStartTime = useRef([]);
  const apy1Calc = useRef([]);
  const apy2Calc = useRef([]);
  const apyCalc = useRef([]);
  const totalValuePool = useRef([]);
  const [cnsStartTime, setCNSStartTime] = useState("");
  const totalRewards = useRef([]);
  const calcStartTime = () => {
    const diff = 1640908200000 - new Date().getTime();
    const second = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 60000) % 60);
    const hours = Math.floor((diff / 3600000) % 24);
    const days = Math.floor(diff / 3600000 / 24);

    return (
      (days > 0 ? `${days}d : ` : "") +
      (hours >= 0 ? `${hours}h : ` : "") +
      (minutes >= 0 ? `${minutes}m : ` : "") +
      (second >= 0 ? `${second}s` : "")
    );
  };
  const calcCNSStartTime = () => {
    const diff = 1641188390000 - new Date().getTime();
    const second = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 60000) % 60);
    const hours = Math.floor((diff / 3600000) % 24);
    const days = Math.floor(diff / 3600000 / 24);

    return (
      (days > 0 ? `${days}d : ` : "") +
      (hours >= 0 ? `${hours}h : ` : "") +
      (minutes >= 0 ? `${minutes}m : ` : "") +
      (second >= 0 ? `${second}s` : "")
    );
  };
  const calcPoolStartTime = (times) => {
    const diff = times - new Date().getTime();
    const second = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 60000) % 60);
    const hours = Math.floor((diff / 3600000) % 24);
    const days = Math.floor(diff / 3600000 / 24);

    return (
      (days > 0 ? `${days}d : ` : "") +
      (hours >= 0 ? `${hours}h : ` : "") +
      (minutes >= 0 ? `${minutes}m : ` : "") +
      (second >= 0 ? `${second}s` : "")
    );
  };
  const CroxmasConfig = useCroxmasPools();
  const earnTokenName = useRef([]);
  const poolLaunchTime = useRef([]);
  earnTokenName.current = [];
  apy1Calc.current = [];
  apy2Calc.current = [];
  apyCalc.current = [];
  poolLaunchTime.current = [];
  totalValuePool.current = [];
  // totalRewards.current = [];
  for (let i = 0; i < CroxmasConfig.length; i++) {
    if ((CroxmasConfig as any)[i].rewardTokenSymbol) {
      earnTokenName.current.push(
        `${CroxmasConfig[i].tokenSymbol} + ${(CroxmasConfig as any)[i].rewardTokenSymbol
        }`
      );
    } else {
      earnTokenName.current.push(CroxmasConfig[i].tokenSymbol);
    }
    const { apy1, apy2, totalValue } = getAPYAndTVLOfCroxmasPools(CroxmasConfig[i], {
      cakePrice,
      bnbPrice,
    });
    // if((CroxmasConfig as any)[i].reward2) {
    //   totalRewards.current.push(
    //     (CroxmasConfig as any)[i].reward1 + (CroxmasConfig as any)[i].reward2
    //   )
    // } else {
    //   totalRewards.current.push(
    //     (CroxmasConfig as any)[i].reward1
    //   )
    // }
    if ((CroxmasConfig as any)[i].poolStartTime) {
      poolLaunchTime.current.push((CroxmasConfig as any)[i].poolStartTime);
    }
    totalValuePool.current.push(
      totalValue.toNumber().toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    )
    apy1Calc.current.push(
      Math.min(
        100000,
        apy1.times(new BigNumber(100)).toNumber()
      ).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
    apy2Calc.current.push(
      Math.min(
        100000,
        apy2.times(new BigNumber(100)).toNumber()
      ).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
    apyCalc.current.push(
      (
        Math.min(100000, apy1.times(new BigNumber(100)).toNumber()) +
        Math.min(100000, apy2.times(new BigNumber(100)).toNumber())
      ).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }
  const length = CroxmasConfig.length;
  useEffect(() => {
    setStartTime(calcStartTime());
    setCNSStartTime(calcCNSStartTime());
    poolStartTime.current = [];
    disableButton.current = [];
    for (let i = 0; i < length; i++) {
      if (poolLaunchTime.current[i]) {
        poolStartTime.current.push(
          calcPoolStartTime(poolLaunchTime.current[i])
        );
        if (calcPoolStartTime(poolLaunchTime.current[i]) !== "") {
          disableButton.current.push(true);
        } else {
          disableButton.current.push(false);
        }
      }
    }
    const handle = setInterval(() => {
      setStartTime(calcStartTime());
      setCNSStartTime(calcCNSStartTime());
      poolStartTime.current = [];
      disableButton.current = [];
      for (let i = 0; i < length; i++) {
        if (poolLaunchTime.current[i]) {
          poolStartTime.current.push(
            calcPoolStartTime(poolLaunchTime.current[i])
          );
          if (calcPoolStartTime(poolLaunchTime.current[i]) !== "") {
            disableButton.current.push(true);
          } else {
            disableButton.current.push(false);
          }
        }
      }
    }, 1000);
    return () => clearInterval(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Text fontSize="3vw" pt="1vw" className="croxmas_text" bold mt="0">
        Pools
      </Text>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 18 }}>
        {CroxmasConfig.map((entry, index) => (
          totalValuePool.current[index] !== "0" && (<Grid item xs={12} md={6} lg={6}>
            <div className="pool_card menu_snow">
              <Flex
                alignItems="center"
                justifyContent="center"
                className={
                  disableButton.current[index] || (entry as any).closed
                    ? "pool_card_header warning"
                    : "pool_card_header"
                }
              >
                {!disableButton.current[index] && !(entry as any).closed && (
                  <Text
                    fontSize="18px"
                    bold
                    color="red"
                    style={{ position: "absolute", left: "20px", top: "10px" }}
                  >
                    LIVE
                  </Text>
                )}
                {(entry as any).closed && (
                  <Text
                    fontSize="18px"
                    bold
                    color="black"
                    style={{ position: "absolute", left: "20px", top: "10px" }}
                  >
                    CLOSED
                  </Text>
                )}
                <Flex>
                  {entry.tokenSymbol !== "CROX" ? (
                    <img
                      src={
                        !(entry as any).rewardTokenSymbol
                          ? `/images/farms/${entry.tokenSymbol.toLowerCase()}.svg`
                          : `/images/farms/${entry.tokenSymbol.toLowerCase()}+${(entry as any).rewardTokenSymbol.toLowerCase()}.svg`
                      }
                      alt="logo"
                      className="logo_image"
                    />
                  ) : (
                    <img
                      src={`/images/farms/${entry.lpSymbol.toLowerCase()}.svg`}
                      alt="logo"
                      className="logo_image"
                    />
                  )}
                  <div>
                    <Text className="pool_card_text" bold color="white">
                      Pool #{index + 1}
                    </Text>
                    <Text className="pool_card_text" bold color="white">
                      Stake {entry.lpSymbol}, Earn{" "}
                      {earnTokenName.current[index]}
                    </Text>
                  </div>
                </Flex>
              </Flex>
              <div className="pool_card_body">
                {disableButton.current[index] && (
                  <Flex justifyContent="space-between">
                    <Text className="pool_card_text font-size-1">
                      Launches in:
                    </Text>
                    <Text className="pool_card_text font-size-1 color_white">
                      {poolStartTime.current[index]}
                    </Text>
                  </Flex>
                )}
                <Flex justifyContent="space-between">
                  <Text className="pool_card_text font-size-1">APR:</Text>
                  <Flex alignItems="center">
                    {(entry as any).rewardTokenSymbol && (
                      <InfoIcon
                        onMouseEnter={() => setHover(entry.tokenSymbol)}
                        onMouseLeave={() => setHover("")}
                      />
                    )}
                    {hover === entry.tokenSymbol && (
                      <APRInfo>
                        <div>
                          <span>{entry.tokenSymbol}: </span>
                          <span>{apy1Calc.current[index]}%</span>
                        </div>
                        <div>
                          <span>{(entry as any).rewardTokenSymbol}: </span>
                          <span>{apy2Calc.current[index]}%</span>

                        </div>
                      </APRInfo>
                    )}
                    {/* <Text className='pool_card_text font-size-1 color_white'>{(entry as any).rewardTokenSymbol ? `${apyCalc.current[index]}%` : `${apy2Calc.current[index]}%`}</Text> */}
                    <Text className="pool_card_text font-size-1 color_white">
                      {!disableButton.current[index]
                        ? `${apyCalc.current[index]}%`
                        : `#`}
                    </Text>
                  </Flex>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text className="pool_card_text font-size-1">Liquidity:</Text>
                  <Text className="pool_card_text font-size-1 color_white">
                    ${totalValuePool.current[index]}
                  </Text>
                </Flex>
                {/* <Flex justifyContent="space-between">
                  <Text className="pool_card_text font-size-1">Total Rewards:</Text>
                  <Text className="pool_card_text font-size-1 color_white">
                    {totalRewards.current[index]}
                  </Text>
                </Flex> */}
                <Flex justifyContent="space-between">
                  <Text className="pool_card_text font-size-1">Burn Fee:</Text>
                  <Text className="pool_card_text font-size-1 color_white">
                    1%
                  </Text>
                </Flex>
                <Flex justifyContent="space-between">
                  <Text className="pool_card_text font-size-1">
                    Pool Ends in:
                  </Text>
                  <Text className="pool_card_text font-size-1 color_white">
                    {entry.tokenSymbol === 'CNS' ? cnsStartTime : startTime}
                  </Text>
                </Flex>
                <ButtonGrp
                  entry={entry}
                  disable={disableButton.current}
                  index={index}
                />
                <Flex justifyContent="center">
                  <Link
                    href={`${(entry as any).projectLink}`}
                    className="link_project"
                  >
                    View Project Site
                  </Link>
                </Flex>
              </div>
            </div>
          </Grid>)
        ))}
      </Grid>
    </>
  );
};

export default CroxMasPools;
