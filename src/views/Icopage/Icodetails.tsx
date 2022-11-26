import React, { useState, useEffect, useRef } from 'react'
import { useParams, useHistory } from "react-router-dom";
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Flex, Text, Checkbox, Link, useWalletModal, useMatchBreakpoints, ConnectorId, Button as UiKitButton, Button, Image } from 'crox-new-uikit'
import ReactModal from 'react-modal'
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import StarIcon from '@mui/icons-material/Star';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import styled from "styled-components"
import Card from '@mui/material/Card';
import { CardActionArea } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
// import Checkbox from '@mui/material/Checkbox';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LiveCardDetail from './components/LiveCardDetail'
import DescriptionCard from './components/DescriptionCard'
import SaleDetailCard from './components/SaleDetailCard'
import SaleTabCard from './components/SaleTabCard'
import TermModal from './components/TermModal';
import BuyBox from './components/BuyBox';
import WithdrawBox from './components/WithdrawBox';
import './Icopage.css';

const scrollToRef = (ref) => window.scrollTo({ top: ref.current.offsetTop - 100, left: 0, behavior: 'smooth' })

const Icodetails: React.FC = () => {

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
    margin: 5% 5% 3% 3%;
    @media screen and (max-width: 800px) {
      margin: 5% 0%;
    }
  `

  const StatusInfo = styled.div`
    display: flex; 
    justify-content: space-between;
    @media screen and (max-width: 1000px) {
      width: 100%;
      display: inline-block; 
    }
  `

  const SaleInfo = styled.div`
    display: flex; 
    justify-content: space-between; 
    margin: 5% 0;
    @media screen and (max-width: 1000px) {
      width: 100%;
      display: inline-block; 
    }
  `

  const BuyInfo = styled.div`
    display: flex; 
    justify-content: space-between; 
    margin: 5% 0;
    @media screen and (max-width: 1000px) {
      width: 100%;
      display: inline-block; 
    }
  `

  const SafetyAlert = styled.div`
    padding-left: 0;
    display: flex;
    @media screen and (max-width: 800px) {
      display: inline-block; 
    }
  `

  ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(69, 42, 122, 0.6)';
  ReactModal.defaultStyles.overlay.zIndex = '15';

  const id = useParams();
  const index: number = Object.values(id)[0] as any;

  const [open, setOpen] = useState(false);
  const [isCheck, setCheck] = useState(false);
  const [isAccept, setAccept] = useState(false);
  const { connect, reset, account } = useWallet();

  const history = useHistory()

  useEffect(() => {
    if (isCheck) {
      setCheck(true);
    }
    else {
      setCheck(false);
      setAccept(false);
    }
  }, [isCheck])

  const verifyCheck = () => {
    if (account) {
      if (isCheck && localStorage.getItem("acceptStatus") !== "true") {
        setCheck(false);
      }
      else {
        setCheck(true);
      }
    }
  }

  useEffect(() => {
    if (localStorage.getItem("acceptStatus") === "true" && account) {
      setCheck(true)
      setAccept(true)
    }
  }, [account])

  const verifyAccept = () => {
    if (account) {
      setAccept(true);
      localStorage.setItem("acceptStatus", "true");
    }
  }

  const OpenModal = () => {
    setOpen(true);
  };

  const CloseModal = () => {
    setOpen(false);
  };

  const { isMd, isSm, isXs, isLg } = useMatchBreakpoints();

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

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const isMobile = useMediaQuery("(max-width: 1000px)");

  const safeAlertRef = useRef(null)
  const executeScroll = () => scrollToRef(safeAlertRef)

  return (
    <>
      <Page>
        <div className="middle_page">
          <Button p='3px 15px' mb='10px' style={{ height: '40px', borderRadius: '0', backgroundColor: '#3399FF' }} onClick={() => { history.push("/ico") }}>
            <ArrowBackIcon />
            Go Back
          </Button>
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
          <>
            {!isMd && !isSm ? (
              <Flex alignItems='center' m='20px 40px'>
                <Text fontSize='18px'>Status:</Text>
                <Text fontSize="18px" color="#3AB226" style={{ textAlign: 'left', width: "fit-content" }} m='0 20px' >Completed</Text>
                {!account ? (
                  <UiKitButton className='StatusConnectBtn' onClick={onPresentConnectModal}>Connect Wallet</UiKitButton>
                ) : (
                  <UiKitButton className='StatusConnectBtn' style={{ backgroundColor: '#3399FF' }} onClick={onPresentAccountModal}>
                    Disconnect Wallet
                  </UiKitButton>
                )}
              </Flex>
            ) : (
              <div style={{ textAlign: "center" }}>
                <Flex alignItems='center' justifyContent='flex-start' m='20px 0'>
                  <Text fontSize='18px' mr='5px'>Status:</Text>
                  <Text fontSize="16px" color="#3AB226" style={{ textAlign: 'left', width: "fit-content" }} >TIER 1 in Progress</Text>
                  <Text fontSize="16px" color="#3AB226" style={{ textAlign: 'left', width: "fit-content" }} m='0 20px' >TIER 2 in Progress</Text>
                </Flex>
                {!account ? (
                  <UiKitButton className='StatusConnectBtn' onClick={onPresentConnectModal}>Connect Wallet</UiKitButton>
                ) : (
                  <UiKitButton className='StatusConnectBtn' style={{ backgroundColor: '#3399FF' }} onClick={onPresentAccountModal}>
                    Disonnect Wallet
                  </UiKitButton>
                )}
              </div>
            )}

            <StatusInfo>
              <LiveCardDetail backColor="5774ae" liveId={index} />
              <DescriptionCard liveId={index} />
            </StatusInfo>
            <SaleInfo>
              <SaleDetailCard liveId={index} />
              {!isMobile && <SaleTabCard liveId={index} />}
            </SaleInfo>
            <div className='header-detail' ref={safeAlertRef}>
              <Flex alignItems='center'>
                <GppMaybeIcon sx={{ color: 'yellow' }} />
                <Text fontSize="22px" ml='5px' color="yellow" bold>Safety Alert</Text>
              </Flex>
              <Text fontSize="16px" pl='30px' color="white">X-Pad is a decentralized launchpad. Anyone can create a token and clone as existing coins.  Token creators can pretend to be owners of the real project. Please use provided social links to research and examine every project to avoid scams.</Text>
              <Text fontSize="18px" pl='30px' color="lightgrey" bold style={{ textDecoration: "underline", cursor: "pointer" }} onClick={OpenModal}>Terms and Conditions</Text>
              <SafetyAlert>
                <Flex justifyContent='center' alignItems='center'>
                  <Checkbox
                    {...label}
                    scale='sm'
                    checked={isCheck}
                    onClick={() => verifyCheck()}
                  />
                  <Text fontSize="16px" color="white" style={{ width: "calc( 100% - 27px )" }}>{!isMobile ? 'I understand that I am responsible for doing my own research . I have read and agree to the Terms and Conditions.' : 'I agree to the Tearms and Conditions'} </Text>
                </Flex>
                <div className='acceptbtn_contaier'>
                  <Button p='3px 20px' ml='10px' style={{ cursor: "pointer", backgroundColor: '#3399FF', borderRadius: '0', height: '30px' }}
                    disabled={!isCheck}
                    onClick={() => verifyAccept()}
                  >{isAccept ? "Accepted" : "Accept"}</Button>
                </div>
              </SafetyAlert>
            </div>
            <Flex mb={isMobile && '-9%'}>
              {isMobile && <SaleTabCard liveId={index} />}
            </Flex>
            <BuyInfo>
              <BuyBox liveId={index} isAccept={isAccept} executeScroll={executeScroll} />
              <WithdrawBox liveId={index} />
            </BuyInfo>
          </>
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
                    <Text fontSize="15px" color="white" style={{ textAlign: 'left' }} ml='10px' ><b>TIER 1:&nbsp;</b>  Submit  whitelist form, wallet address and  commit BUSD</Text>
                  </Flex>
                  <Flex alignItems='center' mt='10px' >
                    <Image src="/images/ico/during_sale_2.svg" alt='During Sale Avatar 2' width={30} height={30} />
                    <Text fontSize="15px" color="white" style={{ textAlign: 'left' }} ml='10px' ><b>TIER 2:&nbsp;</b>  Commit BUSD tokens  to buy ICO tokens when the sale is live</Text>
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
                  <Text fontSize="20px" color="white" style={{ textAlign: 'center' }} mt="10px">You are all set !</Text>
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
            <Link external href="https://forms.gle/dnKpsKvd3svqbpPM9" bold={false} color="white" style={{ textDecoration: "none" }}>
              <Button style={{ fontSize: "20px", borderRadius: '0', backgroundColor: '#3399FF' }}>Apply here</Button>
            </Link>
          </Flex>
          <TermModal open={open} CloseModal={CloseModal} />
        </div>
      </Page>
    </>
  )
}

export default Icodetails;
