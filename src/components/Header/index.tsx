/* eslint-disable */
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import {
  Button as UiKitButton,
  ConnectorId,
  useWalletModal,
  Flex,
  Text,
  useMatchBreakpoints,
  Link
} from "crox-new-uikit";
import Menu, {
  Button,
  Dropdown,
  Separator,
  DropdownItem,
} from "@kenshooui/react-menu";
import "./mobileMenu.css";
import SideBar from "./sidebar";
import ReactModal from 'react-modal'
import styled from "styled-components";
import "@szhsin/react-menu/dist/index.css";
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import New from "./New";
import BridgeIcon from './Icon/bridgeIcon'
import { usePriceCakeBusd } from "state/hooks";
import NetworkSelectModal from './NetworkSelectModal'
import getRpcUrl from "utils/getRpcUrl";
import CroxMasHeaderIcon from "../../views/CroxMas/components/CroxMasHeaderIcon"

require("@lottiefiles/lottie-player");

const StyledMenu = styled(Menu)`
  background-color: #1a1b23;
  padding: 0px 10px;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  z-index: 10000;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  box-shadow: 0 3px 6px rgb(0 0 0 / 25%), 0 2px 2px rgb(0 0 0 / 22%);
`;

const StyledMobileMenu = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #1a1b23;
  padding: 0px 10px;
  box-sizing: border-box;
  justify-content: space-between;
  position: fixed;
  top: -1px;
  z-index: 10000;
`;

const SwitchNetButton = styled(Button)`
  margin: 0 24px;
  padding: 0 0 0 10px;
  align-items: center;
  display: flex;
  background-color: #2c2d3a;
  color: white;
  border-radius: 20px;
  font-size: 14px;
  z-index: 0;
  img {
    margin-left: 4px;
  }
  @media screen and (max-width: 550px) {
    margin: 0;
  }
  @media screen and (max-width: 430px) {
    padding: 0;
  }
`

const NetworkMenu = styled(Menu)`
  width: 30px;
  background-color: #2c2d3a;
  top: 0;
  & .networkDropDown {
    padding: 0 5px;
  }
  & svg {
    display: none;
  }
`

const StyledButton = styled(Button)`
  background-color: transparent;
  color: white;
  box-sizing: border-box;
  border-top: 5px solid transparent;
  box-sizing: border-box;
  padding-left: 30px;
  padding-right: 30px;
  font-size: 16px;
  font-weight: 100;
  &:hover {
    background-color: transparent;
    border-top: 5px solid transparent;
  }
`;

const StyledDropDown = styled(Dropdown)`
  background-color: transparent;
  color: white;
  box-sizing: border-box;
  border-top: none;
  box-sizing: border-box;
  padding: 0px 25px;
  font-size: 16px;
  font-weight: 100;
  border-top: 5px solid transparent;
  &:hover {
    background-color: transparent;
    border-top: 5px solid transparent;
  }
  & .itemContainer {
    background-color:  #121827;
    border: none;
    border-radius: 8px;
    margin-top: 3px;
  }
`;

const StyledDropDownGroup = styled.div`
  padding: 8px 0;
  background-color: #121827;
  border-radius: 8px;
  & .swap {
    padding: 16px;
    display: flex;
  }
  & .liquidity {
    padding: 16px;
    display: flex;
  }
`

const StyledDropDownItem = styled(DropdownItem)`
  background-color:  #121827;
  width: 300px;
  border: none;
  padding: 30px 20px;
  &:hover {
    background-color: #253253;
    .changeText {
      color: #2d74c4;
    }
  }
`;

const CroxPriceSection = styled.div`
  display: flex;
  padding: 9px 16px;
  align-items: center;
  background-color: #3b3c4e;
  color: white;
  border-radius: 30px;
`

const StyledDropDownNetwork = styled(Dropdown)`
  background-color: #2c2d3a;
  color: white;
  box-sizing: border-box;
  border-top: none;
  box-sizing: border-box;
  padding: 0px 30px;
  font-size: 14px;
  font-weight: 100;
  &:hover {
    background-color: #2c2d3a;
    border-top: none;
  }
`

const ConnectButton = styled(Button)`
  margin-left: 16px;
  padding: 9px 16px;
  background-color: #3b3c4e;
  color: white;
  font-size: 14px;
  border-radius: 20px;
  z-index: 1;
  letter-spacing: 1px;
  @media screen and (max-width: 550px) {
    letter-spacing: 0;
  }
`

let IsConnected = false;

const Header = (props) => {
  const history = useHistory();
  const { account, connect, reset, status, error } = useWallet();
  const [snowBanner, setSnowBanner] = useState("")
  const handleLogin = (connectorId: ConnectorId) => {
    IsConnected = true;
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
  const { onPresentNewConnectModal, onPresentNewAccountModal } = useWalletModal(
    handleLogin,
    reset,
    account as string
  );

  const cakePriceUsd = usePriceCakeBusd();
  const { isMd, isSm, isXs, isLg } = useMatchBreakpoints();

  useEffect(() => {
    if (IsConnected && error) {
      if (error && error.name === "ChainUnsupportedError") {
        const { ethereum } = window as any;
        (async () => {
          try {
            await ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x38" }],
            });
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              try {
                await ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: "0x38",
                      chainName: "Binance Smart Chain",
                      nativeCurrency: {
                        name: "BNB",
                        symbol: "BNB",
                        decimals: 18,
                      },
                      rpcUrls: [getRpcUrl()],
                      blockExplorerUrls: ["https://bscscan.com"],
                    },
                  ],
                });
              } catch (addError: any) {
                console.error(addError);
              }
            }
          }
          connect("injected");
        })();
      }
      IsConnected = false;
    }
  }, [account, status, error]);

  const [isNetworkSelectModalOpen, setIsNetworkSelectModalOpen] = useState(false);

  function closeModal() {
    setIsNetworkSelectModalOpen(false);
  }

  ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(69,42,122,0.6)';
  ReactModal.defaultStyles.overlay.zIndex = '100000';

  const customStyles = {
    body: {
      overflow: 'hidden'
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: "transparent",
      border: 'none',
      overflow: 'hidden',
    },
  };

  return (
    <>

      {!isMd && !isSm && !isXs && !isLg ? (

        <StyledMenu className={snowBanner === 'croxmas' ? "menu_snow" : "menu"}>
          <img
            src="/header_logo.png"
            width="120px"
            alt="logo1"
            style={{ margin: "8px 14px", marginRight: "20px" }}
          />
          <StyledButton className="button" onClick={() => {
            history.push("/")
            setSnowBanner("")
          }}>
            Home
          </StyledButton>
          {/* <StyledDropDown
            label="Trade"
            className="dropdown itemContainer"
            itemsClassName="itemContainer"
          >
            <StyledDropDownItem className="menu-item">
              <a href="https://exchange.croxswap.com/#/swap">Swap (PCS)</a>
            </StyledDropDownItem>
            <StyledDropDownItem className="menu-item">
              <a href="https://exchange.babyswap.finance/#/swap?outputCurrency=0x2c094f5a7d1146bb93850f629501eb749f6ed491">Swap (BABYSWAP)</a>
            </StyledDropDownItem>
            <StyledDropDownItem className="menu-item">
              <a href="https://exchange.croxswap.com/#/pool">Liquidity (CAKE LP)</a>
            </StyledDropDownItem>
            <StyledDropDownItem className="menu-item">
              <a href="https://exchange.babyswap.finance/#/add/0x2c094f5a7d1146bb93850f629501eb749f6ed491/0x55d398326f99059fF775485246999027B3197955">Liquidity (BABY LP)</a>
            </StyledDropDownItem>
          </StyledDropDown> */}
          <StyledDropDown label="Trade" className="dropdown itemContainer" itemsClassName="itemContainer">
            <StyledDropDownGroup>
              <StyledDropDownItem className="menu-item swap">
                <a style={{ marginTop: '3px', marginLeft: '7px' }} href="https://exchange.croxswap.com/#/swap">
                  <Flex alignItems='center'>
                    <SwapHorizontalCircleIcon sx={{ fontSize: '20px' }} />
                    <Text color="white" bold ml='3px' fontSize="14px">Swap</Text>
                  </Flex>
                  <Flex flexDirection='column' ml='20px'>
                    <Text color="white" style={{ lineHeight: '24px' }} fontSize='14px' mt="10px">Exchange your tokens using CroxSwap</Text>
                  </Flex>
                </a>
              </StyledDropDownItem>
              {/* <StyledDropDownItem className="menu-item liquidity">
                <a style={{ marginTop: '3px', marginLeft: '7px' }} href="https://exchange.babyswap.finance/#/swap?outputCurrency=0x2c094f5a7d1146bb93850f629501eb749f6ed491">
                  <Flex alignItems='center'>
                    <SwapHorizontalCircleIcon sx={{ fontSize: '20px' }} />
                    <Text color="white" bold ml='3px' fontSize="14px">Swap (BABYSWAP)</Text>
                  </Flex>
                  <Flex flexDirection='column' ml='20px'>
                    <Text color="white" style={{ lineHeight: '24px' }} fontSize='14px' mt='10px'>Exchange your tokens using BabySwap</Text>
                  </Flex>
                </a>
              </StyledDropDownItem> */}
              <StyledDropDownItem className="menu-item swap">
                <a style={{ marginTop: '3px', marginLeft: '7px' }} href="https://exchange.croxswap.com/#/pool">
                  <Flex alignItems='center'>
                    <SwapHorizontalCircleIcon sx={{ fontSize: '20px' }} />
                    <Text color="white" bold ml='3px' fontSize="14px">Liquidity</Text>
                  </Flex>
                  <Flex flexDirection='column' ml='20px'>
                    <Text color="white" style={{ lineHeight: '24px' }} fontSize='14px' mt='10px'>Provide liquidity to earn a share of</Text>
                    <Text color="white" style={{ lineHeight: '24px' }} fontSize='14px'>trade fees</Text>
                  </Flex>
                </a>
              </StyledDropDownItem>
              {/* <StyledDropDownItem className="menu-item liquidity">
                <a style={{ marginTop: '3px', marginLeft: '7px' }} href="https://exchange.babyswap.finance/#/add/0x2c094f5a7d1146bb93850f629501eb749f6ed491/0x55d398326f99059fF775485246999027B3197955">
                  <Flex alignItems='center'>
                    <MonetizationOnIcon sx={{ fontSize: '20px' }} />
                    <Text color="white" bold ml='3px' fontSize="14px">Liquidity (BABY LP)</Text>
                  </Flex>
                  <Flex flexDirection='column' ml='20px'>
                    <Text color="white" style={{ lineHeight: '24px' }} fontSize='14px' mt='10px'>Provide liquidity to earn a share of</Text>
                    <Text color="white" style={{ lineHeight: '24px' }} fontSize='14px'>trade fees</Text>
                  </Flex>
                </a>
              </StyledDropDownItem> */}
            </StyledDropDownGroup>
          </StyledDropDown>
          <StyledButton className="button" onClick={() => {
            history.push("/farms")
            setSnowBanner("")
          }}>
            Farms
          </StyledButton>
          <StyledButton className="button" onClick={() => {
            history.push("/pools/nextgen")
            setSnowBanner("")
          }}>
            Pools
          </StyledButton>
          <StyledDropDown label="Bridge" className="dropdown itemContainer" itemsClassName="itemContainer">
            <StyledDropDownGroup>
              <StyledDropDownItem className="menu-item swap" style={{ width: '350px' }}>
                <a style={{ marginTop: '3px', marginLeft: '7px' }} href="https://app.multichain.org/#router">
                  <Flex alignItems='center'>
                    <div style={{ width: '16px', height: '16px' }}>
                      <BridgeIcon />
                    </div>
                    <Text color="white" bold ml='5px' fontSize="14px">Multichain Bridge</Text>
                  </Flex>
                  <Flex flexDirection='column' ml='20px'>
                    <Text color="white" style={{ lineHeight: '24px' }} fontSize='14px' mt="10px">Exchange your tokens using Multichain Bridge</Text>
                  </Flex>
                </a>
              </StyledDropDownItem>
              <StyledDropDownItem className="menu-item swap" style={{ width: '350px' }}>
                <a style={{ marginTop: '3px', marginLeft: '7px' }} href="https://bridge.croxswap.com">
                  <Flex alignItems='center'>
                    <div style={{ width: '16px', height: '16px' }}>
                      <BridgeIcon />
                    </div>
                    <Text color="white" bold ml='5px' fontSize="14px">CROX Bridge (soon)</Text>
                  </Flex>
                  <Flex flexDirection='column' ml='20px'>
                    <Text color="white" style={{ lineHeight: '24px' }} fontSize='14px' mt="10px">Exchange your tokens using CROXSWAP</Text>
                  </Flex>
                </a>
              </StyledDropDownItem>
            </StyledDropDownGroup>
          </StyledDropDown>
          <StyledButton className="button">
            <a href="https://referral.croxswap.com">Referral</a>
          </StyledButton>
          {/* <StyledButton className="button" onClick={() => {
            history.push("/ico")
          }}>Xpad</StyledButton> */}
          <StyledButton className="button" onClick={() => {
            history.push("/vpots")
          }}>
            <Flex alignItems='flex-end' mt='-25px'>
              Vpots
              <New />
            </Flex>
          </StyledButton>
          {/* <StyledButton className="button" onClick={() => {
            history.push("/croxmas")
            setSnowBanner('croxmas')
          }}>
            <Flex alignItems='center'>
              <CroxMasHeaderIcon />
              <Text className="HotPink-Glitter" color="white" style={{ marginLeft: '20px', fontFamily: 'Mountains of Christmas' }}>CROXMAS</Text>
            </Flex>
          </StyledButton> */}
          <Separator />

          <div style={{ display: "flex", alignItems: "center" }}>
            <Link href='https://coinmarketcap.com/currencies/croxswap' external style={{ textDecoration: 'none' }}>
              <CroxPriceSection>
                <Text fontSize='14px' color="white">$CROX: </Text>
                <Text fontSize='14px' ml="5px" color="white">{cakePriceUsd.toFixed(3)}</Text>
              </CroxPriceSection>
            </Link>
            {!account ? (
              <SwitchNetButton>
                <Flex onClick={() => setIsNetworkSelectModalOpen(true)} alignItems='center'>
                  <img src="/images/network/bsc_icon.png" alt="BNB" style={{ width: '18px', height: '17px' }} />
                  <NetworkMenu className="menu">
                    <StyledDropDownNetwork label="BNB" className="itemContainer networkDropDown" itemsClassName="itemContainer" onClick={() => setIsNetworkSelectModalOpen(true)} />
                  </NetworkMenu>
                </Flex>
                <ConnectButton onClick={onPresentNewConnectModal}>CONNECT</ConnectButton>
              </SwitchNetButton>
            ) : (
              <SwitchNetButton>
                <Flex onClick={() => setIsNetworkSelectModalOpen(true)} alignItems='center'>
                  <img src="/images/network/bsc_icon.png" alt="BNB" style={{ width: '18px', height: '17px' }} />
                  <NetworkMenu className="menu">
                    <StyledDropDownNetwork label="BNB" className="itemContainer networkDropDown" itemsClassName="itemContainer" onClick={() => setIsNetworkSelectModalOpen(true)} />
                  </NetworkMenu>
                </Flex>
                <ConnectButton onClick={onPresentNewAccountModal}>{account.slice(0, 5)}...{account.slice(-5)}</ConnectButton>
              </SwitchNetButton>
            )}
          </div>
        </StyledMenu>
      ) : (
        <StyledMobileMenu>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div id="App">
              <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />
            </div>
            <img
              src="/header_logo.png"
              width="120px"
              alt="logo1"
              style={{ margin: "8px 14px", marginRight: "80px" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <span style={{ color: "white", padding: "10px", background: "#253253", marginRight: "20px", borderRadius: '8px' }}>$CROX: $20.62</span> */}
            {!account ? (
              <SwitchNetButton>
                <Flex onClick={() => setIsNetworkSelectModalOpen(true)} alignItems='center'>
                  <img src="/images/network/bsc_icon.png" alt="BSC" style={{ width: '18px' }} />
                  <NetworkMenu className="menu">
                    <StyledDropDownNetwork label="BNB" className="itemContainer networkDropDown" itemsClassName="itemContainer" onClick={() => setIsNetworkSelectModalOpen(true)} />
                  </NetworkMenu>
                </Flex>
                <ConnectButton onClick={onPresentNewConnectModal}>CONNECT</ConnectButton>
              </SwitchNetButton>
            ) : (
              <SwitchNetButton>
                <Flex onClick={() => setIsNetworkSelectModalOpen(true)} alignItems='center'>
                  <img src="/images/network/bsc_icon.png" alt="BSC" style={{ width: '18px' }} />
                  <NetworkMenu className="menu">
                    <StyledDropDownNetwork label="BNB" className="itemContainer networkDropDown" itemsClassName="itemContainer" onClick={() => setIsNetworkSelectModalOpen(true)} />
                  </NetworkMenu>
                </Flex>
                <ConnectButton onClick={onPresentNewAccountModal}>{account.slice(0, 5)}...{account.slice(-5)}</ConnectButton>
              </SwitchNetButton>
            )}
          </div>
        </StyledMobileMenu>
      )}
      <div style={{ height: 62 }}></div>
      <ReactModal isOpen={isNetworkSelectModalOpen} onRequestClose={() => closeModal()} style={customStyles}>
        <NetworkSelectModal onDismiss={() => closeModal()} />
      </ReactModal>
    </>
  );
};

export default Header;
