import React, { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js';
import axios from "axios";
import { Text, useMatchBreakpoints, LinkExternal, Link, Input, Button, Flex } from 'crox-new-uikit'
import { useERC20, useTokenSale } from 'hooks/useContract'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useXpadHarvest } from "hooks/useHarvest";
import { getBalanceNumber } from 'utils/formatBalance'
import useMediaQuery from '@mui/material/useMediaQuery';
import IcoJson from '../../../config/Ico/Ico-detail.json'

const CardForm = styled.div`
  background-color: #15161C;
  width: 45%;
  color: white;
  margin-right: 3%;
  @media screen and (max-width: 1000px) {
    margin: auto;
    width: 100%;
    margin: 5% 0;
  }
`

const CardContent = styled.div`
  padding: 3% 4% 1%; 
`

const PriceBox = styled.div`
  padding: 20px 10px; 
  border: 1px solid white;
  width: 48%;
  border-radius: 10px;
`


interface WithdrawBoxProps {
  liveId?: number
}

const WithdrawBox: React.FC<WithdrawBoxProps> = ({ liveId }) => {

  const loadedData = JSON.stringify(IcoJson);
  const Icodata = JSON.parse(loadedData);
  const liveCard = Icodata.liveCards[liveId - 1];

  const tier1Rate = liveCard.tier1.tokenprice1;
  const tier2Rate = liveCard.tier2.tokenprice2;

  const tokenSaleAddress1 = liveCard.tokenAddresses.tokenSale1;
  const tokenSaleAddress2 = liveCard.tokenAddresses.tokenSale2;

  const tokenSaleContract1 = useTokenSale(tokenSaleAddress1);
  const tokenSaleContract2 = useTokenSale(tokenSaleAddress2);
  const { account, connect, reset } = useWallet();

  const [busdPledged1, setBusdPledged1] = useState(0)
  const [busdPledged2, setBusdPledged2] = useState(0)
  const [blockNumber1, setBlockNumber1] = useState(0)
  const [blockNumber2, setBlockNumber2] = useState(0)

  useEffect(() => {
    if (account) {
      (async () => {
        const _tokensPurchased = await tokenSaleContract1.methods.tokensPurchased(account).call();
        const _conclusionBlockNumber = await tokenSaleContract1.methods.conclusionBlockNumber().call()
        setBusdPledged1(_tokensPurchased)
        setBlockNumber1(_conclusionBlockNumber)
      })();
    }
  }, [account, tokenSaleContract1])
  useEffect(() => {
    if (account) {
      (async () => {
        const _tokensPurchased = await tokenSaleContract2.methods.tokensPurchased(account).call();
        const _conclusionBlockNumber = await tokenSaleContract2.methods.conclusionBlockNumber().call()
        setBusdPledged2(_tokensPurchased)
        setBlockNumber2(_conclusionBlockNumber)
      })();
    }
  }, [account, tokenSaleContract2]);

  const totalTokenClaimed = busdPledged1 + busdPledged2

  const [blockFlag, setBlockFlag] = useState(false)
  const [setTierTime1, setSetTierTime1] = useState("");
  const [setTierTime2, setSetTierTime2] = useState("");

  const [tokensPurchased1, setTokensPurchased1] = useState(0);
  const [tokensPurchased2, setTokensPurchased2] = useState(0);
  const updateData = useCallback(async () => {
    const _tokensPurchased1 = await tokenSaleContract1.methods.tokensPurchased(account).call();
    setTokensPurchased1(getBalanceNumber(_tokensPurchased1));
    const _tokensPurchased2 = await tokenSaleContract2.methods.tokensPurchased(account).call();
    setTokensPurchased2(getBalanceNumber(_tokensPurchased2));
  }, [account, tokenSaleContract1, tokenSaleContract2]);


  const { onReward: onReward1 } = useXpadHarvest(tokenSaleAddress1);
  const { onReward: onReward2 } = useXpadHarvest(tokenSaleAddress2);

  const calcStartTier1Time = () => {
    const diff = 1642431600000 - new Date().getTime()
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

  const calcStartTier2Time = () => {
    const diff = 1642431600000 - new Date().getTime()
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
    updateData()
  }, [updateData])

  useEffect(() => {
    setSetTierTime1(calcStartTier1Time());
    setSetTierTime2(calcStartTier2Time());
    const handle = setInterval(() => {
      setSetTierTime1(calcStartTier1Time())
      setSetTierTime2(calcStartTier2Time())
    }, 1000);
    return () => clearInterval(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ismobile = useMediaQuery("(max-width: 600px)");

  return (
    <>
      <CardForm className='col-lg-2 col-md-6'>
        <div>
          <CardContent>
            <Text color='textSubtle' fontSize='25px' bold mt='20px' p='10px 20px' style={{ backgroundColor: '#5774ae' }}>My Tokens</Text>
            <Flex p='30px 20px 10px' justifyContent='space-between'>
              <Flex flexDirection='column'>
                <Text color='textSubtle' fontSize='18px' bold>BUSD Pledged</Text>
                <Flex mt='10px'>
                  <Text color='textSubtle' pr='3px'>Tier 1: </Text>
                  <Text color='textSubtle'>{(getBalanceNumber(new BigNumber(busdPledged1)) * tier1Rate).toFixed(2)} BUSD</Text>
                </Flex>
                <Flex mt='10px'>
                  <Text color='textSubtle' pr='3px'>Tier 2: </Text>
                  <Text color='textSubtle'>{(getBalanceNumber(new BigNumber(busdPledged2)) * tier2Rate).toFixed(2)} BUSD</Text>
                </Flex>
              </Flex>
              <Flex flexDirection='column'>
                <Text color='textSubtle' fontSize='18px' bold>WSOW Bought</Text>
                <Flex mt='10px'>
                  <Text color='textSubtle' pr='3px'>Tier 1: </Text>
                  <Text color='textSubtle'>{getBalanceNumber(new BigNumber(busdPledged1)).toFixed(2)} WSOW</Text>
                </Flex>
                <Flex mt='10px'>
                  <Text color='textSubtle' pr='3px'>Tier 2: </Text>
                  <Text color='textSubtle'>{getBalanceNumber(new BigNumber(busdPledged2)).toFixed(2)} WSOW</Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex flexDirection='column' alignItems='center'>
              <Text color='textSubtle' fontSize='18px' bold>Total WSOW Claimed</Text>
              <Text color='textSubtle'>{(getBalanceNumber(new BigNumber(busdPledged1)) + getBalanceNumber(new BigNumber(busdPledged2))).toFixed(2)} WSOW</Text>
            </Flex>
          </CardContent>
          {!ismobile ? (<>
            <Flex justifyContent='space-between' p="10px 40px 0">
              <div style={{ paddingBottom: "5px" }}>
                <Button
                  style={{ borderRadius: '0', height: '40px', backgroundColor: '#3399FF' }}
                  className='disableButton'
                  onClick={async () => {
                    await onReward1();
                    updateData()
                  }}
                  disabled={tokensPurchased1 === 0}
                >
                  Claim Tier1 Tokens
                </Button>
              </div>
              <div style={{ paddingBottom: "5px" }}>
                <Button
                  style={{ borderRadius: '0', height: '40px', backgroundColor: '#3399FF' }}
                  className='disableButton'
                  onClick={async () => {
                    await onReward2();
                    updateData()
                  }}
                  disabled={tokensPurchased2 === 0}
                >
                  Claim Tier2 Tokens
                </Button>
              </div>
            </Flex>
            <Flex p="10px 70px" justifyContent='space-between'>
              <Text color='textSubtle'>{setTierTime1}</Text>
              <Text color='textSubtle'>{setTierTime2}</Text>
            </Flex></>) : (<><Flex justifyContent='space-between' p="10px 20px 0">
              <div style={{ paddingBottom: "5px" }}>
                <Button
                  style={{ borderRadius: '0', height: '40px', backgroundColor: '#3399FF', maxWidth: '150px' }}
                  className='disableButton'
                  onClick={async () => {
                    await onReward1();
                    updateData()
                  }}
                  disabled={tokensPurchased1 === 0}
                >
                  Claim Tier1 Tokens
                </Button>
              </div>
              <div style={{ paddingBottom: "5px" }}>
                <Button
                  style={{ borderRadius: '0', height: '40px', backgroundColor: '#3399FF', maxWidth: '150px' }}
                  className='disableButton'
                  onClick={async () => {
                    await onReward2();
                    updateData()
                  }}
                  disabled={tokensPurchased2 === 0}
                >
                  Claim Tier2 Tokens
                </Button>
              </div>
            </Flex>
              <Flex p="10px 30px" justifyContent='space-between'>
                <Text color='textSubtle'>{setTierTime1}</Text>
                <Text color='textSubtle'>{setTierTime2}</Text>
              </Flex></>
          )}
        </div>
      </CardForm>
    </>

  )
}

export default WithdrawBox