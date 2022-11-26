import React, { useState } from 'react'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Text, useMatchBreakpoints, Flex, Link } from 'crox-new-uikit'
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import useMediaQuery from '@mui/material/useMediaQuery';
import LaunchIcon from '@mui/icons-material/Launch';
import IcoJson from '../../../config/Ico/Ico-detail.json'

const CardForm = styled.div`
  background-color: #2C2D3A;
  width: 55%;
  color: white;
  margin-left: 3%;
  @media screen and (max-width: 1000px) {
    margin: auto;
    width: 100%;
    margin: 5% 0;
  }
`

const CardHeader = styled.div`
  padding: 10px 20px;
  justify-content: space-between;
  display: flex;
  @media screen and (max-width: 850px) {
    width: 100%;
    display: inline-block;
  }
`

const HeaderText = styled.div`
  width: 60%;
  display: inline-block;
`

const Tooltip = styled.div<{ isTooltipDisplayed: boolean }>`
  display: ${({ isTooltipDisplayed }) => (isTooltipDisplayed ? "block" : "none")};
  bottom: -22px;
  right: 0;
  left: 0;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.contrast};
  color: ${({ theme }) => theme.colors.invertedContrast};
  border-radius: 16px;
  opacity: 0.7;
  padding-top: 4px;
`;

interface LiveCardProps {
  backColor?: string
  liveId?: number
}

const LiveCard: React.FC<LiveCardProps> = ({ backColor, liveId }) => {
  const { isMd, isSm, isXs, isLg } = useMatchBreakpoints();

  const { account } = useWallet();
  const loadedData = JSON.stringify(IcoJson);
  const Icodata = JSON.parse(loadedData);
  const liveCard = Icodata.liveCards[liveId - 1]

  const WSOWContract = liveCard.tokenAddresses.wsow

  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)")

  return (
    <>
      <CardForm className='col-lg-2 col-md-6'>
        <div style={{ backgroundColor: `#${backColor}`, padding: "10px" }}>
          {!isMd && !isSm && !isXs && !isLg ? (

            <CardHeader>
              <HeaderText>
                <Text fontSize="30px" color="white" bold>{liveCard.projectName}</Text>
                <Text fontSize="15px" color="white" bold style={{ marginLeft: "30px" }}>Token : {liveCard.tokenName}</Text>
                <Flex justifyContent='flex-start'>
                  <Link href={`${liveCard.web}`} color="white" m='5px 10px'><TravelExploreIcon /></Link>
                  <Link href={`${liveCard.twitter}`} color="white" m='5px 10px'><TwitterIcon /></Link>
                  <Link href={`${liveCard.telegram}`} color="white" m='5px 10px'><TelegramIcon /></Link>
                </Flex>
              </HeaderText>
              <div style={{ width: "30%" }}>
                <div style={{ display: "flex", margin: "10px 0" }}>
                  {
                    liveCard.Audited ? <img src="/images/ico/audit.png" width="20px" style={{ height: "20px" }} alt="" /> :
                      <img src="/images/ico/cross.png" width="20px" style={{ height: "20px" }} alt="" />
                  }
                  <Text fontSize="15px" color="white" bold style={{ marginLeft: "5px" }}>Audited</Text>
                </div>
                <div style={{ display: "flex" }}>
                  {
                    liveCard.Kyc ? <img src="/images/ico/audit.png" width="20px" style={{ height: "20px" }} alt="" /> :
                      <img src="/images/ico/kyc.png" width="20px" style={{ height: "20px" }} alt="" />
                  }
                  <Text fontSize="15px" color="white" bold style={{ marginLeft: "5px" }}>KYC</Text>
                </div>
              </div>
              <img style={{ verticalAlign: "text-bottom", padding: "5px 0" }} src={`/images/ico/livetoken/${liveCard.tokenName}.png`} width="100px" height="80px" alt="" />
            </CardHeader>
          ) : (
            <>
              <CardHeader>
                <HeaderText>
                  <div>
                    <Text fontSize="30px" color="white" bold>{liveCard.projectName}</Text>
                  </div>
                  <div>
                    <Text fontSize="15px" color="white" bold style={{ marginLeft: "30px" }}>Token : {liveCard.tokenName}</Text>
                  </div>
                  <Flex justifyContent='flex-start'>
                    <Link href={`${liveCard.web}`} color="white" m='5px 10px'><TravelExploreIcon /></Link>
                    <Link href={`${liveCard.twitter}`} color="white" m='5px 10px'><TwitterIcon /></Link>
                    <Link href={`${liveCard.telegram}`} color="white" m='5px 10px'><TelegramIcon /></Link>
                  </Flex>
                </HeaderText>
                <img style={{ verticalAlign: "text-bottom", padding: "5px 0" }} src={`/images/ico/livetoken/${liveCard.tokenName}.png`} width="100px" alt="" />
              </CardHeader>
              <div style={{ width: "100%", display: "flex" }}>
                <div style={{ display: "flex", margin: "10px 10px" }}>
                  {
                    liveCard.Audited ? <img src="/images/ico/audit.png" width="20px" style={{ height: "20px" }} alt="" /> :
                      <img src="/images/ico/cross.png" width="20px" style={{ height: "20px" }} alt="" />
                  }
                  <Text fontSize="15px" color="white" bold style={{ marginLeft: "5px" }}>Audited</Text>
                </div>
                <div style={{ display: "flex", margin: "10px 0" }}>
                  {
                    liveCard.Kyc ? <img src="/images/ico/audit.png" width="20px" style={{ height: "20px" }} alt="" /> :
                      <img src="/images/ico/kyc.png" width="20px" style={{ height: "20px" }} alt="" />
                  }
                  <Text fontSize="15px" color="white" bold style={{ marginLeft: "5px" }}>KYC</Text>
                </div>
              </div>
            </>
          )}
          <Flex>
            <Flex>
              <Text fontSize="15px" color="white" bold style={{ marginRight: "10px" }}>Chain:</Text>
              <img src="/images/ico/chain-bsc.png" width='20px' style={{ height: 'fit-content' }} alt="" />
            </Flex>
            <Flex>
              <Link external href={`https://bscscan.com/address/${liveCard.bscAddress}`} bold={false} color="white">
                <Text fontSize="15px" color="white" bold m='0 5px'>BscScan</Text>
                <LaunchIcon />
              </Link>
            </Flex>
            <Flex>
              <Text fontSize="15px" color="white" bold m='0 5px'>
                {WSOWContract && WSOWContract.slice(0, 5)}...{WSOWContract && WSOWContract.slice(-5)}
              </Text>
              <ContentCopyIcon onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(WSOWContract);
                  setIsTooltipDisplayed(true);
                  setTimeout(() => {
                    setIsTooltipDisplayed(false);
                  }, 1000);
                }
              }} />
              <Tooltip isTooltipDisplayed={isTooltipDisplayed} style={{ width: "70px", left: "-15px" }}>Copied</Tooltip>
            </Flex>
          </Flex>
        </div>

        <div style={{ backgroundColor: '#15161c' }}>
          <Flex flexDirection='column' p='20px' >
            <Flex justifyContent='space-between' pb='10px'>
              <Text color='white'>For Sale :</Text>
              <Text color='white'>{liveCard.forsale.toLocaleString()} {liveCard.tokenName}</Text>
            </Flex>
            <Flex justifyContent='space-between' pb='10px'>
              <Text color='white'>To Raise(USD) :</Text>
              <Text color='white'>${liveCard.raise.toLocaleString()}</Text>
            </Flex>
            <Flex justifyContent='space-between' pb='10px'>
              <Text color='white'>TIER 1(USD) :</Text><div className="discount">{isMobile ? '-16%' : 'Discount 16%'}</div>
              <Text color='white'>${liveCard.tier1.hardcap.toLocaleString()}</Text>
            </Flex>
            <Flex justifyContent='space-between' pb='10px'>
              <Text color='white'>TIER 2(USD) :</Text>
              <Text color='white'>${liveCard.tier2.hardcap.toLocaleString()}</Text>
            </Flex>
            <Flex justifyContent='space-between' pb='20px' style={{ borderBottom: '1px solid #343542' }}>
              <Text color='white'>$CROX to Burn :</Text>
              <Text color='white'>${liveCard.burnCrox.toLocaleString()}</Text>
            </Flex>
          </Flex>
          <Flex justifyContent='center' flexDirection='column' alignItems='stretch' p='0px 20px'>
            <Flex justifyContent='space-between' mb='10px'>
              <Text color='white'>1 WSOW = $0.125 </Text>
              <Text color='white'>(TIER 1)</Text>
            </Flex>
            <Flex justifyContent='space-between' mb='10px'>
              <Text color='white'>1 WSOW = $0.15 </Text>
              <Text color='white'>(TIER 2)</Text>
            </Flex>
            <Flex justifyContent='space-between' mb='10px'>
              <Text color='white'>Initial Market Cap : </Text>
              <Text color='white'> ~ $600,000 </Text>
            </Flex>
          </Flex>
          <Flex justifyContent='center' flexDirection='column' alignItems='stretch' p='10px 20px'>
            <Text color='white' fontSize='18px' bold pt='10px' style={{ textAlign: 'center', borderTop: '1px solid #343542' }}>Funds Allocation</Text>
            <Flex justifyContent='space-between' mb='10px'>
              <Text color='white'>Liquidity (CEX & DEX) :</Text>
              <Text color='white'>70%</Text>
            </Flex>
            <Flex justifyContent='space-between' mb='20px'>
              <Text color='white'>Marketing & Development :</Text>
              <Text color='white'>30%</Text>
            </Flex>
          </Flex>
        </div>
      </CardForm>
    </>

  )
}

export default LiveCard