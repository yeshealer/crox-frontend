import React, {useEffect, useState} from 'react';
import { Text, Link, Flex, Progress } from 'crox-new-uikit';
import { border, borderRadius, styled } from '@mui/system';
import BigNumber from 'bignumber.js';
import styled1 from "styled-components"
import { useTokenSale } from 'hooks/useContract'
import { getBalanceNumber } from 'utils/formatBalance';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';
import useMediaQuery from '@mui/material/useMediaQuery';
import IcoJson from '../../../config/Ico/Ico-detail.json'
import "./Card.css";

const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#80BFFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  800: '#004C99',
  900: '#003A75',
};

const Tab = styled(TabUnstyled)`
  color: white;
  cursor: pointer;
  font-size: 18px;
  background-color: #253253;
  width: 100%;
  padding: 12px 16px;
  border: none;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: #3d5179;
  }

  &.${buttonUnstyledClasses.focusVisible} {
    color: #fff;
    outline: none;
    background-color: #253253;
  }

  &.${tabUnstyledClasses.selected} {
    background-color: ${blue[400]};
    color: white;
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabPanel = styled(TabPanelUnstyled)`
  background-color: #15161C;
  width: 100%;
  font-size: 0.875rem;
  height: calc( 100% - 53px );
  padding: 30px;
  color: white;
`;

const TabsList = styled(TabsListUnstyled)`
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
`;

const TabsContainer = styled1.div`
  margin-right: 3%;
  width: 35%;
  @media screen and (max-width: 1000px) {
    margin: 5% 0;
    display: inline-block;
    width: 100%;
  }
`;

interface SaleTabCardProps {
  liveId?: number
}

const SaleTabCard: React.FC<SaleTabCardProps> = ({ liveId }) => {
  const loadedData = JSON.stringify(IcoJson);
  const Icodata = JSON.parse(loadedData);
  const liveCard = Icodata.liveCards[liveId - 1];

  const hardcap1 = liveCard.tier1.hardcap;
  const minlimit1 = liveCard.tier1.minlimit;
  const maxlimit1 = liveCard.tier1.maxlimit;
  const hardcap2 = liveCard.tier2.hardcap;
  const minlimit2 = liveCard.tier2.minlimit;
  const maxlimit2 = liveCard.tier2.maxlimit;
  const tokenDistribution2 = liveCard.tier2.tokendistribution2;

  const tokenSaleAddress1 = liveCard.tokenAddresses.tokenSale1;
  const tokenSaleAddress2 = liveCard.tokenAddresses.tokenSale2;

  const tokenSaleContract1 = useTokenSale(tokenSaleAddress1);
  const tokenSaleContract2 = useTokenSale(tokenSaleAddress2);

  const [totalProceed1, setTotalProceed1] = useState(0)
  const [totalProceed2, setTotalProceed2] = useState(0)

  useEffect(() => {
    (async () => {
      const _totalProceeds = await tokenSaleContract1.methods.totalProceeds().call();
      setTotalProceed1(_totalProceeds)
    })();
  }, [ tokenSaleContract1])
  useEffect(() => {
    (async () => {
      const _totalProceeds = await tokenSaleContract2.methods.totalProceeds().call();
      setTotalProceed2(_totalProceeds)
    })();
  }, [ tokenSaleContract2]);

  const [statusTime, setStatusTime] = useState("")
  
  const calcStatusTime = () => {
    const diff = 1642305600000 - new Date().getTime()
    const second = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 60000) % 60);
    const hours = Math.floor((diff / 3600000) % 24);
    const days = Math.floor(diff / 3600000 / 24);

    return (
      (days > 0 ? `${days}d : ` : "") +
      (hours >= 0 ? `${hours}h : ` : "") +
      (minutes >= 0 ? `${minutes}m: ` : "") +
      (second >= 0 ? `${second}s` : "")
    );
  };
  useEffect(() => {
    setStatusTime(calcStatusTime());
    const handle = setInterval(() => {
      setStatusTime(calcStatusTime())
    }, 1000);
    return () => clearInterval(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isMobile = useMediaQuery("(max-width: 600px)")

  return (
    <TabsContainer>
      <TabsUnstyled defaultValue={0} style={{ height: "100%" }}>
        <TabsList>
          <Tab>TIER 1</Tab>
          <Tab>TIER 2</Tab>
        </TabsList>
        <TabPanel value={0}>
          <Flex justifyContent='flex-end' m={isMobile ? '-10px 0 10px' : '-10px -30px 10px'}>
            <h6 className="vc">Discount 16%</h6>
          </Flex>
          <Flex justifyContent='space-between' mb='15px'>
            <Text fontSize="15px" color="white" style={{ marginRight: "3px" }}>Hard Cap:</Text>
            <Text fontSize="15px" color="white">${hardcap1.toLocaleString()}</Text>
          </Flex>
          <Flex justifyContent='space-between' mb='15px'>
            <Text fontSize="15px" color="white" style={{ marginRight: "3px" }}>Min Limit:</Text>
            <Text fontSize="15px" color="white">${minlimit1.toLocaleString()}</Text>
          </Flex>
          <Flex justifyContent='space-between' mb='15px'>
            <Text fontSize="15px" color="white" style={{ marginRight: "3px" }}>Max Limit:</Text>
            <Text fontSize="15px" color="white">${maxlimit1.toLocaleString()}</Text>
          </Flex>
          <Flex justifyContent='space-between' mb='15px'>
            <Text fontSize="15px" className='big_text' color="white" style={{ marginRight: "3px" }}>Hold 1000 CROX in wallet during the sale. No vesting and No whitelist</Text>
          </Flex>
        </TabPanel>
        <TabPanel value={1}>
          <Flex justifyContent='space-between' mb='25px'>
            <Text fontSize="15px" color="white">Hard Cap:</Text>
            <Text fontSize="15px" color="white">${hardcap2.toLocaleString()}</Text>
          </Flex>
          <Flex justifyContent='space-between' mb='25px'>
            <Text fontSize="15px" color="white">Min Limit:</Text>
            <Text fontSize="15px" color="white">${minlimit2.toLocaleString()}</Text>
          </Flex>
          <Flex justifyContent='space-between' mb='25px'>
            <Text fontSize="15px" color="white">Max Limit:</Text>
            <Text fontSize="15px" color="white">${maxlimit2.toLocaleString()}</Text>
          </Flex>
        </TabPanel>
      </TabsUnstyled>
    </TabsContainer>
  );
}

export default SaleTabCard
