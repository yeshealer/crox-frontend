import React, { useState, useEffect, useRef } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Text, Link, useWalletModal, Button, useMatchBreakpoints, ConnectorId, Flex, Image } from 'crox-new-uikit'
import ReactModal from 'react-modal'
import Card from '@mui/material/Card';
import { CardActionArea } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import StarIcon from '@mui/icons-material/Star';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import useMediaQuery from '@mui/material/useMediaQuery';
import styled from "styled-components"
import IcoJson from '../../config/Ico/Ico-detail.json'
import LiveCard from './components/LiveCard'
import UpcomingCard from './components/UpcomingCard'
import PastCard from './components/PastCard'
import './Icopage.css'

const Icopage: React.FC = () => {

  const ComingCard = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 3% 1% 3% 3%;
    @media screen and (max-width: 1000px) {
      display: inline-block;
      margin: 3% 0%;
      width: 100%;
    }
  `

  const ComingContent = styled.div`
    width: 49%;
    @media screen and (max-width: 1000px) {
      width: 100%;
      overflow-wrap: anywhere;
    }
  `

  const LiveCardContent = styled.div`
    display: flex;
    @media screen and (max-width: 850px) {
      display: inline-block;
      width: 100%;
    }
  `

  const LiveContainer = styled.div`
    display: flex;
    margin-left: 3%;
    @media screen and (max-width: 1000px) {
      margin: 3% 0;
    }
  `

  const Container = styled.div`
    margin: auto;
    width: 100%;
    max-width: 100%;
    background-color: ${({ theme }) => (theme.isDark ? '#1A1B23' : 'white')};

    ${({ theme }) => theme.mediaQueries.sm} {
      padding-left: 24px;
      padding-right: 24px;
      margin: auto;
    }
  `

  const Page = styled(Container)`
    min-height: calc(100vh - 64px);
    padding: 12px;
  `

  const SaleBoxContent = styled.div`
    margin: 3%;
    @media screen and (max-width: 800px) {
      margin: 3% 0%;
    }
  `

  ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(69,42,122,0.6)';
  ReactModal.defaultStyles.overlay.zIndex = '15';

  const { isMd, isSm, isXs, isLg } = useMatchBreakpoints();

  const [open, setOpen] = useState(false);

  const CloseModal = () => {
    setOpen(false);
  };

  const { connect, reset, account } = useWallet();

  const handleLogin = (connectorId: ConnectorId) => {
    switch (connectorId) {

      case "bsc":
        {
          connect("bsc");
          break;
        }
      case "walletconnect":
        {
          connect("walletconnect");
          break;
        }
      default:
        connect("injected");
    }
  }
  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(
    handleLogin,
    reset,
    account as string
  );

  const [isNetworkSelectModalOpen, setIsNetworkSelectModalOpen] = React.useState(false);

  function closeModal() {
    setIsNetworkSelectModalOpen(false);
  }

  const cardCount = useRef(0)

  useEffect(() => {
    if (isNetworkSelectModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  })
  const loadedData = JSON.stringify(IcoJson);
  const Icodata = JSON.parse(loadedData);
  const isMobile = useMediaQuery("(max-width: 1000px)");

  return (
    <>
      <Page>
        <div className="middle_page">
          <Flex className='xpad_heading' justifyContent='space-between' alignItems='center'>
            <Flex className='xpad_heading_text' flexDirection='column' justifyContent='center'>
              <Text fontSize='30px' bold>X-Pad : A Multi-Chain Launchpad</Text>
              <Flex>
                <hr style={{ borderTop: "2px solid white", width: "20px" }} /><hr style={{ borderTop: "2px solid white", width: "10%" }} /><hr style={{ borderTop: "2px solid white", width: "10%" }} /><hr style={{ borderTop: "2px solid white", width: "10%" }} /><hr style={{ borderTop: "2px solid white", width: "10%" }} /><hr style={{ borderTop: "2px solid white", width: "10%" }} /><hr style={{ borderTop: "2px solid white", width: "10%" }} /><hr style={{ borderTop: "2px solid white", width: "20px" }} />
              </Flex>
              <Text fontSize='18px'>Commit BUSD and get a chance to participate in ICO</Text>
              <Text color='white'>X-Pad is still in Beta. Use it carefully and report the issues to <span style={{ color: "#2d74c4" }}>support@croxswap.com</span></Text>
            </Flex>
            <img src="/images/ico/crox-rocket.png" width="150px" height="auto" alt="" />
          </Flex>

          <VerticalTimeline>
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              contentStyle={{ background: '#253253', color: '#fff', padding: '20px', borderRadius: '0' }}
              contentArrowStyle={{ borderRight: '5px solid  #253253' }}
              iconStyle={isMobile ? { background: '#253253', color: '#fff', width: '45px', height: '45px' } : { background: '#253253', color: '#fff', width: '45px', height: '45px', marginLeft: '-22px' }}
              icon={<LooksOneIcon />}
            >
              <Text color='white'>Get <span style={{ color: '#f2bd00' }}>BUSD</span> Tokens</Text>
            </VerticalTimelineElement>
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              contentStyle={{ background: '#253253', color: '#fff', padding: '20px', borderRadius: '0' }}
              contentArrowStyle={{ borderRight: '5px solid  #253253' }}
              iconStyle={isMobile ? { background: '#253253', color: '#fff', width: '45px', height: '45px' } : { background: '#253253', color: '#fff', width: '45px', height: '45px', marginLeft: '-22px' }}
              icon={<LooksTwoIcon />}
            >
              <Text color='white'>Commit <span style={{ color: '#f2bd00' }}>BUSD</span> Tokens</Text>
            </VerticalTimelineElement>
            <VerticalTimelineElement
              className="vertical-timeline-element--work"
              contentStyle={{ background: '#253253', color: '#fff', padding: '20px', borderRadius: '0' }}
              contentArrowStyle={{ borderRight: '5px solid  #253253' }}
              iconStyle={isMobile ? { background: '#253253', color: '#fff', width: '45px', height: '45px' } : { background: '#253253', color: '#fff', width: '45px', height: '45px', marginLeft: '-22px' }}
              icon={<Looks3Icon />}
            >
              <Text color='white'>Claim Tokens</Text>
            </VerticalTimelineElement>
            <VerticalTimelineElement
              iconStyle={isMobile ? { background: '#253253', color: '#fff', width: '45px', height: '45px' } : { background: '#253253', color: '#fff', width: '45px', height: '45px', marginLeft: '-22px' }}
              icon={<StarIcon />}
            />
          </VerticalTimeline>

          <div>
            <LiveContainer>
              <Card sx={{ maxWidth: 150 }} className='tabbody' >
                <CardActionArea>
                  <CardContent className="cardContent" style={{ margin: '8px 0px' }}>
                    <Typography variant="h5" component="div">
                      <Text fontSize="18px" m='0 44px' bold>Live</Text>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <img style={{ margin: "10px 2%", float: "right", height: "40px" }} src="/images/ico/wifi1.gif" width="40px" alt="" />
            </LiveContainer>
            <LiveCardContent>
              {
                Icodata.liveCards.map((item, index) => {
                  return item.active && (
                    <LiveCard backColor="5774ae" LiveId={item.liveId} />
                  )
                })
              }
            </LiveCardContent>
          </div>

          <ComingCard>
            <ComingContent>
              <Card sx={{ maxWidth: 150 }} className='tabbody' >
                <CardActionArea>
                  <CardContent className="cardContent" style={{ margin: '8px 0px' }}>
                    <Typography variant="h5" component="div">
                      <Text fontSize="18px" mr='3px' bold>Upcoming</Text>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <UpcomingCard />
            </ComingContent>

            <ComingContent>
              <Card sx={{ maxWidth: 150 }} className='tabbody' >
                <CardActionArea>
                  <CardContent className="cardContent" style={{ margin: '8px 0px' }}>
                    <Typography variant="h5" component="div">
                      <Text fontSize="18px" mr='3px' bold>Past</Text>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <PastCard />
            </ComingContent>
          </ComingCard>

          <SaleBoxContent>
            <Card sx={{ maxWidth: 350 }} className='tabbody' >
              <CardActionArea>
                <CardContent className="cardContent" style={{ margin: '8px 0px' }}>
                  <Typography variant="h5" component="div">
                    <Text fontSize="30px" mr='3px' bold>How to participate</Text>
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} style={{ alignItems: 'center', backgroundColor: '#15161c', margin: '3% 0', padding: '20px 0 30px' }}>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Flex flexDirection='column' style={{ minHeight: '150px', borderRight: '1px solid #343542' }}>
                  <Text color="#4583C9" fontSize='20px' style={{ textAlign: 'center' }} bold mb='10px'>Before Sale</Text>
                  <Flex>
                    <LocalGroceryStoreIcon />
                    <Text ml='5px' style={{ textAlign: 'center' }}>Get BUSD Tokens</Text>
                  </Flex>
                </Flex>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Flex flexDirection='column' style={{ minHeight: '150px', borderRight: '1px solid #343542' }}>
                  <Text color="#4583C9" fontSize='20px' style={{ textAlign: 'center' }} bold mb='10px'>During Sale</Text>
                  <Flex alignItems='center' >
                    <Image src="/images/ico/during_sale_1.svg" alt='During Sale Avatar 1' width={30} height={30} />
                    <Text fontSize="15px" color="white" style={{ textAlign: 'left' }} ml='10px' ><b>TIER 1:&nbsp;</b>  HODL $CROX in your wallet  and  commit BUSD </Text>
                  </Flex>
                  <Flex alignItems='center' mt='10px' >
                    <Image src="/images/ico/during_sale_2.svg" alt='During Sale Avatar 2' width={30} height={30} />
                    <Text fontSize="15px" color="white" style={{ textAlign: 'left' }} ml='10px' ><b>TIER 2:&nbsp;</b>  Get whitelisted and commit BUSD  to buy ICO tokens </Text>
                  </Flex>
                </Flex>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Flex flexDirection='column' style={{ minHeight: '150px' }}>
                  <Text color="#4583C9" fontSize='20px' style={{ textAlign: 'center' }} bold mb='10px'>After Sale</Text>
                  <Flex alignItems='center' >
                    <CheckCircleIcon />
                    <Text fontSize="15px" color="white" style={{ textAlign: 'left' }} ml='10px' >Claim the tokens you bought along with unspent funds</Text>
                  </Flex>
                  <Text fontSize="20px" color="#f2bd00" style={{ textAlign: 'center' }} mt="10px">You are all set !</Text>
                </Flex>
              </Grid>
            </Grid>
          </SaleBoxContent>
          <Flex flexDirection='column' justifyContent='center' alignItems='center'>
            <Card sx={{ maxWidth: 450 }} className='tabbody' >
              <CardActionArea>
                <CardContent className="cardContent" style={{ margin: '8px 0px' }}>
                  <Typography variant="h5" component="div">
                    <Text fontSize="25px" mr='3px' bold>Want to launch your token?</Text>
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            <Link external href="https://forms.gle/dnKpsKvd3svqbpPM9" bold={false} color="white" style={{ margin: "auto", textDecoration: "none" }}>
              <Button style={{ fontSize: "20px", borderRadius: '0', backgroundColor: '#3399FF' }}>Apply here</Button>
            </Link>
          </Flex>
        </div>
      </Page>
    </>
  )
}

export default Icopage;
