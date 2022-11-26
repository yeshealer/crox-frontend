import React, { useState, useCallback, useEffect, useMemo } from 'react'
import styled1 from 'styled-components'
import { ethers } from 'ethers'
import { styled } from '@mui/system';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useWallet } from '@binance-chain/bsc-use-wallet'
import InfoIcon from '@mui/icons-material/Info';
import { Text, Input, Button, useModal, useWalletModal, ConnectorId, Flex, Link } from 'crox-new-uikit'
import { ConfirmPendingModal, ConfirmSubmitModal, ConfirmDismissModal } from 'components/ConfirmModal'
import { useERC20, useTokenSale } from 'hooks/useContract'
import { useSaleApprove } from 'hooks/useApprove'
import { useSaleAllowance } from 'hooks/useAllowance'
import useTokenBalance from 'hooks/useTokenBalance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getBalanceNumber } from 'utils/formatBalance';
import { FastRewindTwoTone } from '@mui/icons-material';
import IcoJson from '../../../config/Ico/Ico-detail.json'

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

const CardForm = styled1.div`
  width: 100%;
  color: white;
  background-color: #15161C;
`

const CardContent = styled1.div`
  padding: 5% 7% 2% 7%;
`

const TabsList = styled(TabsListUnstyled)`
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
`;

const TabsContainer = styled1.div`
  margin-left: 3%;
  width: 45%;
  @media screen and (max-width: 1000px) {
    margin: 5% 0;
    display: inline-block;
    width: 100%;
  }
`;


const WarinngContainer = styled1.div`
  
`


const AmountWarningText = styled1.p`
  color: #f94d2f;
  font-size: 15px;
  padding-bottom: 10px;
  @media screen and (max-width: 1000px) {
    width: 100%;
  }
`

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

interface LiveCardProps {
  liveId?: number
  isAccept?: boolean
  executeScroll?: () => void
}

const BuyBox: React.FC<LiveCardProps> = ({ liveId, isAccept, executeScroll }) => {
  const loadedData = JSON.stringify(IcoJson);
  const Icodata = JSON.parse(loadedData);
  const liveCard = Icodata.liveCards[liveId - 1];

  const croxAddress = liveCard.tokenAddresses.crox;
  const busdAddress = liveCard.tokenAddresses.busd;
  const wsowAddress = liveCard.tokenAddresses.wsow;
  const tokenSaleAddress1 = liveCard.tokenAddresses.tokenSale1;
  const tokenSaleAddress2 = liveCard.tokenAddresses.tokenSale2;

  const tier1Rate = liveCard.tier1.tokenprice1;
  const tier2Rate = liveCard.tier2.tokenprice2;

  const croxContract = useERC20(croxAddress);
  const busdContract = useERC20(busdAddress);
  const wsowContract = useERC20(wsowAddress);
  const tokenSaleContract1 = useTokenSale(tokenSaleAddress1);
  const tokenSaleContract2 = useTokenSale(tokenSaleAddress2);

  const croxBalance = useTokenBalance(croxAddress);
  const { account, connect, reset, ethereum } = useWallet();
  const [payTokenAmount1, setVal] = useState('')
  const buyTokenAmount1 = useMemo(() => {
    return payTokenAmount1 ? Number(payTokenAmount1) / tier1Rate : 0;
  }, [payTokenAmount1, tier1Rate])
  const [toAddress1, setToAddress] = useState('')
  const [payTokenAmount2, setVal2] = useState('')
  const buyTokenAmount2 = useMemo(() => {
    return payTokenAmount2 ? Number(payTokenAmount2) / tier2Rate : 0;
  }, [payTokenAmount2, tier2Rate])
  const [toAddress2, setToAddress2] = useState('')
  const [pendingTx, setPendingTx] = useState(false);
  const [isWalletWarning, setWalletWarning] = useState(false);
  const [isAmountWarning, setAmountWarning] = useState(false);

  const [isWalletWarning2, setWalletWarning2] = useState(false);
  const [isAmountWarning2, setAmountWarning2] = useState(false);

  const [isOverflow, setOverflow] = useState(false);

  const [isBox1, setBox1] = useState(true);
  const [isBox2, setBox2] = useState(false);
  const onApprove1 = useSaleApprove(busdContract, tokenSaleAddress1)
  const allowance1 = useSaleAllowance(busdContract, tokenSaleAddress1, pendingTx)
  const isApproved1 = account && allowance1 && allowance1.isGreaterThan(0);

  const onApprove2 = useSaleApprove(busdContract, tokenSaleAddress2)
  const allowance2 = useSaleAllowance(busdContract, tokenSaleAddress2, pendingTx)
  const isApproved2 = account && allowance2 && allowance2.isGreaterThan(0);

  const displayBox1 = () => {
    setBox1(true)
    setBox2(false)
  }

  const displayBox2 = () => {
    setBox1(false)
    setBox2(true)
  }

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


  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const RE = /^\d*\.?\d{0,18}$/
      if (RE.test(e.currentTarget.value)) {
        setVal(e.currentTarget.value);
      }
    },
    [setVal],
  )

  const handleChange2 = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {

      const RE = /^\d*\.?\d{0,18}$/
      if (RE.test(e.currentTarget.value)) {
        setVal2(e.currentTarget.value);
      }
    },
    [setVal2],
  )

  useEffect(() => {
    if (toAddress1 === "") {
      setWalletWarning(true)
    } else {
      setWalletWarning(false)
    }
    if (payTokenAmount1 === "") {
      setAmountWarning(true)
    }
    else {
      setAmountWarning(false)
    }
  }, [toAddress1, payTokenAmount1])

  useEffect(() => {
    if (toAddress2 === "") {
      setWalletWarning2(true)
    } else {
      setWalletWarning2(false)
    }
    if (payTokenAmount2 === "") {
      setAmountWarning2(true)
    }
    else {
      setAmountWarning2(false)
    }
  }, [toAddress2, payTokenAmount2])

  const minDistAmount1 = 800;
  const maxDistAmount1 = 40000;
  const minDistAmount2 = 800;
  const maxDistAmount2 = 24000;
  const [tokensPurchased1, setTokensPurchased1] = useState(0);
  const [tokensPurchased2, setTokensPurchased2] = useState(0);
  useEffect(() => {
    if (account) {
      (async () => {
        const _tokensPurchased = await tokenSaleContract1.methods.tokensPurchased(account).call();
        setTokensPurchased1(getBalanceNumber(_tokensPurchased));
      })();
    }
  }, [account, tokenSaleContract1]);
  useEffect(() => {
    if (account) {
      (async () => {
        const _tokensPurchased = await tokenSaleContract2.methods.tokensPurchased(account).call();
        setTokensPurchased2(getBalanceNumber(_tokensPurchased));
      })();
    }
  }, [account, tokenSaleContract2]);

  const busdBalance = getBalanceNumber(useTokenBalance(busdAddress))

  const updateData = async () => {
    const _tokensPurchased1 = await tokenSaleContract1.methods.tokensPurchased(account).call();
    setTokensPurchased1(getBalanceNumber(_tokensPurchased1));
    const _tokensPurchased2 = await tokenSaleContract2.methods.tokensPurchased(account).call();
    setTokensPurchased2(getBalanceNumber(_tokensPurchased2));
  }


  const validateForTier1 = () => {
    if (!payTokenAmount1) {
      toast.warning('You should input busd token amount.');
      return false;
    }
    if (Number(payTokenAmount1) > busdBalance) {
      toast.warning('Insufficient busd balance');
      return false;
    }
    if (minDistAmount1 > buyTokenAmount1) {
      toast.warning(`You should purchase at least ${minDistAmount1 * tier1Rate} BUSD`);
      return false;
    }
    if (maxDistAmount1 - tokensPurchased1 < buyTokenAmount1) {
      toast.warning(`You can't purchase more than ${(maxDistAmount1 - tokensPurchased1) * tier1Rate} BUSD`);
      return false;
    }
    if (getBalanceNumber(croxBalance) < 1000) {
      toast.warning(`You need at least 1000 crox to proceed purchasing`);
      return false;
    }
    return true;
  }
  const validateForTier2 = () => {
    if (!payTokenAmount2) {
      toast.warning('You should input busd token amount.');
      return false;
    }
    if (Number(payTokenAmount2) > busdBalance) {
      toast.warning('Insufficient busd balance');
      return false;
    }
    if (minDistAmount2 > buyTokenAmount2) {
      toast.warning(`You should purchase at least ${minDistAmount2 * tier2Rate} BUSD`);
      return false;
    }
    if (maxDistAmount2 - tokensPurchased2 < buyTokenAmount2) {
      toast.warning(`You can't purchase more ${(maxDistAmount2 - tokensPurchased2) * tier2Rate} BUSD`);
      return false;
    }
    return true;
  }

  const handleBuyTokens = async () => {
    const amounts = ethers.utils.parseEther(buyTokenAmount1.toString());
    const gasLimit = await tokenSaleContract1.methods.purchaseTokens(amounts).estimateGas({ from: account });
    await tokenSaleContract1.methods
      .purchaseTokens(amounts)
      .send({ from: account, gasLimit })
      .on("transactionHash", async (tx) => {
        localStorage.setItem("bscAddress", tx);
      })
      .on("error", () => {
        return onConfirmDismiss()
      })
    updateData();
    return onConfirmSubmit()
  }

  const handleBuyTokens2 = async () => {
    const amounts = ethers.utils.parseEther(buyTokenAmount2.toString());
    const gasLimit = await tokenSaleContract2.methods.purchaseTokens(amounts).estimateGas({ from: account });
    await tokenSaleContract2.methods
      .purchaseTokens(amounts)
      .send({ from: account, gasLimit })
      .on("transactionHash", async (tx) => {
        localStorage.setItem("bscAddress", tx);
      })
      .on("error", () => {
        return onConfirmDismiss()
      })
    return onConfirmSubmit()
  }

  const [onConfirmPending1] = useModal(<ConfirmPendingModal value={payTokenAmount1} tokenName="BUSD" icobuytoken="true" />)
  const [onConfirmPending2] = useModal(<ConfirmPendingModal value={payTokenAmount2} tokenName="BUSD" icobuytoken="true" />)
  const [onConfirmDismiss] = useModal(<ConfirmDismissModal />)
  const [onConfirmSubmit] = useModal(<ConfirmSubmitModal tokenName="BUSD" />)
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    liveCard.active && <>
      <TabsContainer>
        <TabsUnstyled defaultValue={0} style={{ height: "100%" }}>
          <ToastContainer position="bottom-left" />
          <TabsList>
            <Tab onClick={displayBox1}>TIER 1</Tab>
            <Tab onClick={displayBox2}>TIER 2</Tab>
          </TabsList>
          {isBox1 && <CardForm className='col-lg-2 col-md-6'>
            <div>
              <CardContent>
                <Flex justifyContent='flex-end' m={isMobile ? '-10px 0px 10px' : '-10px -38px 10px'}>
                  <h6 className="vc">Discount 16%</h6>
                </Flex>
                <Text fontSize='25px' bold>{account ? "Buy Tokens" : "Connect Wallet"}</Text>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: '10px' }}><p>Available {busdBalance.toFixed(3)}&nbsp;BUSD</p><p>Max limit: ${(liveCard.tier1.maxlimit).toLocaleString()}</p></div>
                  <div>
                    <Input
                      value={payTokenAmount1}
                      style={{ border: "1px solid white", borderRadius: "5px", backgroundColor: "#2C2D3A", margin: "10px 0", position: "relative", paddingRight: "75px" }}
                      onChange={handleChange}
                    />
                    <div style={{ display: "flex", position: "relative", margin: "-42px 5px 20px 0", justifyContent: "end", paddingRight: "5px", width: "70px", float: "right" }}>
                      <Text color='white'>BUSD</Text>
                      <img style={{ height: "20px", margin: "2px" }} src="/images/ico/BUSD.png" width="20px" alt="" />
                    </div>
                  </div>
                  {isAmountWarning && <AmountWarningText>Please enter the amount of BUSD you wish to invest</AmountWarningText>}
                  <Flex alignItems='center' justifyContent='space-between' style={{ border: "1px solid #253253", borderRadius: "5px", width: '100%' }} p='0 10px'>
                    <Text color='white' fontSize='14px' style={{ margin: "10px 0" }}>You will receive &nbsp; &quot; {buyTokenAmount1.toFixed(2)} {liveCard.tokenName} &quot;</Text>
                    <Text color='white' fontSize='14px'>Limit Available {maxDistAmount1 - tokensPurchased1}</Text>
                  </Flex>
                  <Text color='#f94d2f' style={{ display: 'flex' }} mt='10px' fontSize='14px'>You must hold at least 1000 <Link fontSize='14px' href="https://exchange.croxswap.com" color='white'>&nbsp;CROX&nbsp;</Link> in your wallet</Text>
                </div>

              </CardContent>
              <div style={{ paddingBottom: "5px", textAlign: "right", padding: "0 7% 7%", marginTop: '20px' }}>
                {!account ? (
                  <Button style={{ borderRadius: '0', height: '40px' }} onClick={onPresentConnectModal}>Connect Wallet</Button>
                ) : (
                  <>
                    {
                      !isApproved1 ? (
                        <Button
                          onClick={async () => {
                            setPendingTx(true)
                            await onApprove1()
                            setPendingTx(false)
                          }}
                          className='disableButton'
                          style={{ borderRadius: '0', height: '40px', backgroundColor: '#3399FF' }}
                        >
                          {!pendingTx ? 'Approve' : 'Approving...'}
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={async () => {
                              if (validateForTier1()) {
                                setPendingTx(true)
                                handleBuyTokens()
                                onConfirmPending1()
                                setPendingTx(false)
                              }
                            }}
                            className='disableButton'
                            style={{ borderRadius: '0', height: '40px', backgroundColor: '#3399FF' }}
                            disabled={!isAccept || isOverflow}
                          >
                            Buy Tokens
                          </Button>
                          {(!isAccept || isOverflow) && <Flex alignItems='center' justifyContent='flex-end'>
                            <InfoIcon sx={{ fontSize: '16px' }} />
                            <Text onClick={executeScroll} fontSize='14px' style={{ cursor: 'pointer' }}>Accept Terms & Conditions to Proceed</Text>
                          </Flex>}
                        </>
                      )}
                  </>
                )}
              </div>

            </div>
          </CardForm>}
          {isBox2 && <CardForm className='col-lg-2 col-md-6'>
            <div>
              <CardContent>
                <Text fontSize='25px' bold>{account ? "Buy Tokens" : "Connect Wallet"}</Text>
                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><p>Available {busdBalance.toFixed(3)}&nbsp;BUSD</p><p>Max limit: ${(liveCard.tier2.maxlimit).toLocaleString()}</p></div>
                  <div>
                    <Input
                      value={payTokenAmount2}
                      style={{ border: "1px solid white", borderRadius: "5px", backgroundColor: "#2C2D3A", margin: "10px 0", position: "relative", paddingRight: "75px" }}
                      onChange={handleChange2}
                    />
                    <div style={{ display: "flex", position: "relative", margin: "-42px 5px 20px 0", justifyContent: "end", paddingRight: "5px", width: "70px", float: "right" }}>
                      <Text color='white'>BUSD</Text>
                      <img style={{ height: "20px", margin: "2px" }} src="/images/ico/BUSD.png" width="20px" alt="" />
                    </div>
                  </div>
                  {isAmountWarning2 && <AmountWarningText>Please enter the amount of BUSD you wish to invest</AmountWarningText>}
                  <Flex alignItems='center' justifyContent='space-between' style={{ border: "1px solid white", borderRadius: "5px", width: '100%' }} p='0 10px'>
                    <Text color='white' fontSize='14px' style={{ margin: "10px 0" }}>You will receive &nbsp; &quot; {buyTokenAmount2.toFixed(2)} {liveCard.tokenName} &quot;</Text>
                    <Text color='white' fontSize='14px'>Limit Available {maxDistAmount2 - tokensPurchased2}</Text>
                  </Flex>
                </div>
              </CardContent>
              <div style={{ paddingBottom: "5px", textAlign: "right", padding: "7% 7%" }}>
                {!account ? (
                  <Button mt={isMobile ? '60px' : '35px'} style={{ borderRadius: '0', height: '40px' }} onClick={onPresentConnectModal}>Connect Wallet</Button>
                ) : (
                  <>
                    {
                      !isApproved2 ? (
                        <Button
                          onClick={async () => {
                            try {
                              setPendingTx(true)
                              await onApprove2()
                              setPendingTx(false)
                            } catch (e) {
                              setPendingTx(false)
                              console.error(e)
                            }
                          }}
                          className='disableButton'
                          style={{ borderRadius: '0', height: '40px', backgroundColor: '#3399FF' }}
                        // disabled={!isAccept}
                        >
                          {!pendingTx ? 'Approve' : 'Approving...'}
                        </Button>
                      ) : (
                        <Tooltip title="Accept Terms & Conditions to buy tokens" placement="bottom">
                          <span>
                            <Button
                              onClick={async () => {
                                if (validateForTier2()) {
                                  setPendingTx(true)
                                  handleBuyTokens2()
                                  onConfirmPending2()
                                  setPendingTx(false)
                                }
                              }}
                              className='disableButton'
                              style={{ borderRadius: '0', height: '40px', backgroundColor: '#3399FF' }}
                              disabled={!isAccept}
                            >
                              Buy Tokens
                            </Button>
                          </span>
                        </Tooltip>
                      )
                    }
                  </>
                )}
              </div>
            </div>
          </CardForm>}
        </TabsUnstyled>
      </TabsContainer>
    </>

  )
}

export default BuyBox
