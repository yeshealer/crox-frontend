/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Card, CardBody, Heading, Text, Flex } from "crox-new-uikit";
import BigNumber from "bignumber.js/bignumber";
import styled from "styled-components";
import { getBalanceNumber } from "utils/formatBalance";
import axios from 'axios'
import useTokenBalance, {
  useTotalSupply,
  useBurnedBalance,
  useTotalStakedSupply,
} from "hooks/useTokenBalance";
import useI18n from "hooks/useI18n";
import { getCakeAddress } from "utils/addressHelpers";
import { CountUp } from "use-count-up";
import { IoMdStats } from 'react-icons/io'
import { MdQueryStats } from 'react-icons/md'
import useMediaQuery from "@mui/material/useMediaQuery";
import CardValue from "./CardValue";
import { useFarms, usePriceCakeBusd } from "../../../state/hooks";
import TotalValueLockedCard from "./TotalValueLockedCard";
import { useTotalValue } from "../../../state/hooks";

const StyledCakeStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  position: initial;
  box-shadow: 0 3px 6px rgb(0 0 0 / 25%), 0 2px 2px rgb(0 0 0 / 22%);
  @media screen and (max-width: 800px) {
    margin-bottom: 20px;
  }
`;

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
  margin-top: 20px;
`;

const SCHeading = styled(Heading)`
  text-align: center;
  font-size: 20px;
  margin-top: 12px;
  border-top: 1px solid #3b3c4e;
  padding-top: 12px;
`;

const NetTVL = styled(Flex)`
  background-color: #3b3c4e;
  padding: 5px 10px;
  border-radius: 10px;
`;

const CakeStats = () => {
  const totalValue = useTotalValue();
  const TranslateString = useI18n();
  const totalSupply = useTotalSupply();
  const burnedBalance = useBurnedBalance(getCakeAddress());
  const stakedCrox = useTotalStakedSupply();
  const farms = useFarms();
  const eggPrice = usePriceCakeBusd();
  const circSupply = totalSupply
    ? totalSupply.minus(burnedBalance)
    : new BigNumber(0);
  const cakeSupply = getBalanceNumber(circSupply);
  const marketCap = eggPrice.times(circSupply);

  let croxPerBlock = 0;
  if (farms && farms[0] && farms[0].croxPerBlock) {
    croxPerBlock = new BigNumber(farms[0].croxPerBlock)
      .div(new BigNumber(10).pow(18))
      .toNumber();
  }

  const isMobile = useMediaQuery("(max-width: 600px)")

  useEffect(() => {
    const addBnbStats = async () => {
      await axios.post(`https://crox-backend.herokuapp.com/record/add/bnb?bnbtvl=${totalValue}&bnbCroxStake=${getBalanceNumber(stakedCrox)}`)
    };
    addBnbStats()
  }, [totalValue, stakedCrox]);

  const [croxstats, setCroxstats] = useState([])

  useEffect(() => {
    const getCroxStats = async () => {
      const res = await axios.get(`https://crox-backend.herokuapp.com/record/get`)
      setCroxstats(((res as any).data)[0])
    };
    getCroxStats()
  });

  const hecotvl = Number(croxstats['hecotvl']) || 0;
  const hecoCroxStake = Number(croxstats['hecoCroxStake']) || 0;

  return (
    <div style={{ flex: "auto" }}>

      <StyledCakeStats>
        <CardBody>
          <Flex alignItems='center' style={{ backgroundColor: '#3b3c4e', width: '140px', padding: '3px 10px', borderRadius: '5px' }}>
            <IoMdStats style={{ color: 'white', fontSize: '20px' }} />
            <Text color="white" fontSize="17px" bold ml='3px'>CROX STATS</Text>
          </Flex>
          {/* <Row style={{ marginTop: '20px' }}>
            <Text fontSize="17px" color='textSubtle' bold>
              {TranslateString(10005, "Market Cap")}
            </Text>
            <CardValue
              fontSize="18px"
              value={getBalanceNumber(marketCap)}
              prefix="$"
              decimals={0}
            />
          </Row> */}
          <Row>
            <Text bold fontSize="17px" color="textSubtle">
              Total CROX Staked
            </Text>
            {stakedCrox && (
              <Text fontSize="18px" color="textSubtle" bold><CountUp isCounting end={getBalanceNumber(stakedCrox) + hecoCroxStake} thousandsSeparator=',' decimalPlaces={0} /></Text>
            )}
          </Row>

          <SCHeading fontSize="18px" color='textSubtle'>
            <MdQueryStats style={{ fontSize: '22px', marginRight: '5px', color: 'textSubtle' }} />
            {TranslateString(999, "Total Value Locked (TVL)")}
          </SCHeading>
          <div style={{ textAlign: "center" }}>
            <Text fontSize="27px" color="textSubtle" bold>$<CountUp isCounting end={totalValue.toNumber() + hecotvl} thousandsSeparator=',' decimalPlaces={2} /></Text>
          </div>
          <Flex justifyContent='space-between' p='0 10px' flexDirection={isMobile ? 'column' : 'row'}>
            <NetTVL justifyContent='center'>
              <img src="/images/network/bsc_icon.png" alt="BSC" style={{ width: '22px', height: '21px' }} />
              <Text bold mr='5px' ml='2px' color='#e0ae32'>TVL</Text>
              <CardValue
                fontSize="16px"
                value={totalValue.toNumber()}
                prefix="$"
                decimals={2}
              />
            </NetTVL>
            <NetTVL justifyContent='center' mt={isMobile && '3px'} alignItems='center'>
              <img src="/images/network/heco_net.svg" alt="HECO" style={{ width: '22px', height: '21px', marginTop: '-3px' }} />
              <Text bold mr='5px' ml='2px' color="#02943f">TVL</Text>
              <Text color="textSubtle" bold>$<CountUp isCounting end={hecotvl} thousandsSeparator=',' decimalPlaces={2} /></Text>
            </NetTVL>
          </Flex>
          <div style={{ textAlign: "center" }}>
            <Text bold fontSize="14px" color='textSubtle'>
              {TranslateString(999, "Across all Farms and Pools")}
            </Text>
          </div>
        </CardBody>
      </StyledCakeStats>
    </div>
  );
};

export default CakeStats;
