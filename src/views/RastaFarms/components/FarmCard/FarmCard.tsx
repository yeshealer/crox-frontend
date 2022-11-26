import React, { useMemo, useState, useCallback, useEffect } from "react";
import BigNumber from "bignumber.js";
import styled, { keyframes } from "styled-components";
import { Flex, Text, Skeleton, IconButton, Button, AddIcon, useModal, LinkExternal, Link } from "crox-new-uikit";
import { provider } from "web3-core";
import { getContract } from "utils/erc20";
import { useRastaApprove } from "hooks/useApprove";
import { RastaFarm } from "state/types";
import useI18n from "hooks/useI18n";
import UnlockButton from "components/UnlockButton";
import { QuoteToken } from "config/constants/types";
import { getBalanceNumber } from "utils/formatBalance";
import { useRastaFarmFromSymbol, useRastaFarmUser, usePriceRastaBusd } from "state/hooks";
import { useRastaHarvest } from "hooks/useHarvest";
import { useRastaStake } from "hooks/useStake";
import { useRastaUnstake } from 'hooks/useUnstake'
import useMRastaPrice from 'hooks/useMRastaPrice'
import { useGetPriceData } from 'hooks/api'
import CardHeading from "./CardHeading";
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'
import './poolTag.scss'

export interface FarmWithStakedValue extends RastaFarm {
  apy?: BigNumber;
}


const RainbowLight = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  filter: blur(3px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`;

const CardContainer = styled.div`
  margin-bottom: 10px;
  align-self: baseline;
  background: #121827;
  
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  text-align: center;
  border: 1px solid darkslategrey;
`;

const FCard = styled.div`
  width: 100%;
  align-self: baseline;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 15px 20px 9px;
  position: relative;
  text-align: center;
  @media screen and (max-width: 1000px) {
    padding: 12px 10px 7px 10px;
    display: -webkit-inline-box;
  } 
`;

const FinishedText = styled.div`
  @media screen and (max-width: 450px) {
    svg {
      width: 150px;
      height: 30px;
    }
  }
`;

const UnstakeText = styled.p`
  font-size: 15px;
  color: white;
  font-weight: 600;
`;
interface FarmCardProps {
  farm: FarmWithStakedValue;
  removed: boolean;
  bnbPrice?: BigNumber;
  ethereum?: provider;
  account?: string;
  rastaPrice?: BigNumber;
  ethPrice?: BigNumber
}

const FarmCard: React.FC<FarmCardProps> = ({
  farm,
  removed,
  bnbPrice,
  ethereum,
  account,
  rastaPrice,
  ethPrice
}) => {
  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses } = farm;
  const {
    pid,
    lpAddresses,
  } = useRastaFarmFromSymbol(farm.lpSymbol);

  const {
    allowance,
    tokenBalance,
    stakedBalance,
    earnings,
  } = useRastaFarmUser(pid);

  const TranslateString = useI18n();
  const [showExpandableSection, setShowExpandableSection] = useState(false);
  const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()
  const totalValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) {
      return null
    }
    if (farm.quoteTokenSymbol === QuoteToken.BNB) {
      return bnbPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.RASTA) {
      return rastaPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.ETH) {
      return ethPrice.times(farm.lpTotalInQuoteToken)
    }
    return farm.lpTotalInQuoteToken
  }, [bnbPrice, rastaPrice, ethPrice, farm.lpTotalInQuoteToken, farm.quoteTokenSymbol])
  const mrastaPrice = useMRastaPrice();
  const manualCNRPrice = 0.08;

  let totalValueFormated;
  let totalValueUSDValue;
  if (!farm.lpSymbol.includes('RLP') && !farm.lpSymbol.includes('CAKE LP')) {
    let price;
    if (farm.tokenSymbol === 'MRASTA') {
      price = mrastaPrice.toString()
    } else if (farm.lpSymbol === 'CNR') {
      price = new BigNumber(manualCNRPrice).toString()
    } else if (farm.lpSymbol === 'BNB') {
      price = new BigNumber(bnbPrice).toString();
    } else if (farm.lpSymbol === 'RASTA') {
      price = new BigNumber(rastaPrice).toString();
    }
    totalValueFormated = farm.singleTokenAmount
      ? `$${(Number(farm.singleTokenAmount) * price).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : '-'
    totalValueUSDValue = (getBalanceNumber(stakedBalance, farm.tokenDecimals) * price).toLocaleString(undefined, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    })
  }
  else {
    totalValueFormated = totalValue
      ? `$${Number(totalValue).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}`
      : "-";

    totalValueUSDValue = (getBalanceNumber(stakedBalance, farm.tokenDecimals) * Number(totalValue) / Number(farm.singleTokenAmount)).toLocaleString(undefined, {

      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    })
  }

  const lpLabel = farm.lpSymbol;
  const earnLabel = "RASTA";
  const farmAPY =
    farm.apy &&
    farm.apy.times(new BigNumber(100)).toNumber().toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const rawEarningsBalance = getBalanceNumber(earnings);
  const displayBalance = rawEarningsBalance.toLocaleString(undefined, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  const earnedDisplayBalance = (rawEarningsBalance * rastaPrice.toNumber()).toLocaleString(undefined, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })
  const [clickApy, SetClickedApy] = useState(false)
  const [pendingTx, setPendingTx] = useState(false);
  const { onReward } = useRastaHarvest(pid);
  const { onStake } = useRastaStake(pid);
  const { onUnstake } = useRastaUnstake(pid)
  const lpName = farm.lpSymbol.toUpperCase()
  const isApproved = account && allowance && allowance.isGreaterThan(0);
  const [requestedApproval, setRequestedApproval] = useState(false);
  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID];
  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, lpAddress);
  }, [ethereum, lpAddress]);
  const { onApprove } = useRastaApprove(lpContract);

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      await onApprove();
      setRequestedApproval(false);
    } catch (e) {
      console.error(e);
    }
  }, [onApprove]);
  const rawStakedBalance = getBalanceNumber(stakedBalance, farm.tokenDecimals)
  const stakedDisplayBalance = rawStakedBalance.toLocaleString()
  const [onPresentDeposit] = useModal(<DepositModal max={tokenBalance} onConfirm={onStake} tokenName={lpName} tokenDecimals={farm.tokenDecimals} />)
  const [onPresentWithdraw] = useModal(<WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={lpName} tokenDecimals={farm.tokenDecimals} />)

  return (
    <CardContainer>
      {!(!farm.lpSymbol.includes('RLP') && !farm.lpSymbol.includes('CAKE LP')) ? (
        <div className="rastaFarm">
          <div className="rastaFarm__price-tag">
            <p className="rastaFarm__price-tag-price" style={{ color: 'yellow' }}>Farm</p>
          </div>
        </div>
      ) : (
        <div className="rastaFarm">
          <div className="rastaFarm__price-tag">
            <p className="rastaFarm__price-tag-price" style={{ color: '#07f707' }}>Pool</p>
          </div>
        </div>
      )}

      {(farm.lpSymbol === 'BNB-RASTA CAKE LP' || farm.lpSymbol === 'RASTA') && <StyledCardAccent />}
      <FCard onClick={() => !clickApy && setShowExpandableSection(!showExpandableSection)}>
        {removed ? (
          <Flex flexDirection='column'>
            <CardHeading
              removed={removed}
              farmImage={farmImage}
              lpLabel={lpLabel}
              tokenSymbol={farm.tokenSymbol}
            />
            <Flex justifyContent='center' flexDirection='column'>
              <FinishedText>
                <svg width="210" height="42" viewBox="0 0 151 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.907031 14.05L3.58203 16.65L3.58203 22.775L0.907031 25.225L0.907031 14.05ZM3.80703 14.95C3.19036 14.4667 2.60703 14.0083 2.05703 13.575L3.80703 12.25L10.632 12.25L12.382 13.575L10.632 14.95L3.80703 14.95ZM1.60703 0.924999L12.782 0.924999L10.357 3.625H4.18203L1.60703 0.924999ZM0.882031 13.175V2L3.55703 4.425V10.625L0.882031 13.175ZM27.8271 25.225L25.1271 22.65V16.5L27.8271 14.05V25.225ZM27.7771 2V13.175L25.0771 10.75V4.575L27.7771 2ZM38.4973 11.925V0.699999L41.1973 3.175V9.35L38.4973 11.925ZM53.7223 0.699999V11.925L51.0223 9.45V3.3L53.7223 0.699999ZM38.4223 12.775L41.1223 15.35V21.525L38.4223 23.975V12.775ZM53.6473 23.975L50.9473 21.375V15.225L53.6473 12.775V23.975ZM42.4723 8.1V3.025L49.5723 14.975V20.075L42.4723 8.1ZM67.0674 25.225L64.3674 22.65V16.5L67.0674 14.05V25.225ZM67.0174 2V13.175L64.3174 10.75V4.575L67.0174 2ZM79.7375 26.325L82.3125 23.625L88.4875 23.625L90.9125 26.325L79.7375 26.325ZM91.7125 25.225L89.0125 22.65V16.5L91.7125 14.05V25.225ZM81.8875 14.95C81.3042 14.4833 80.7125 14.025 80.1125 13.575L81.8875 12.25H88.7125L90.4625 13.575L88.7125 14.95H81.8875ZM79.7125 0.924999L90.8875 0.924999L88.4125 3.625L82.2875 3.625L79.7125 0.924999ZM78.9125 13.175V2L81.6125 4.425V10.625L78.9125 13.175ZM98.6076 14.05L101.308 16.65V22.775L98.6076 25.225V14.05ZM111.333 25.225L108.633 22.65V16.5L111.333 14.05V25.225ZM101.508 14.95C100.924 14.4833 100.333 14.025 99.7326 13.575L101.508 12.25L108.333 12.25L110.083 13.575L108.333 14.95L101.508 14.95ZM98.5326 13.175V2L101.233 4.425V10.625L98.5326 13.175ZM111.258 2V13.175L108.558 10.75V4.575L111.258 2ZM119.353 26.325L121.928 23.625H128.103L130.553 26.325H119.353ZM118.628 14.05L121.303 16.65V22.775L118.628 25.225V14.05ZM121.503 14.95C120.886 14.4667 120.303 14.0083 119.753 13.575L121.503 12.25H128.328L130.078 13.575L128.328 14.95H121.503ZM119.328 0.924999L130.478 0.924999L128.053 3.625L121.878 3.625L119.328 0.924999ZM118.553 13.175V2L121.228 4.425V10.625L118.553 13.175ZM138.598 26.325L141.173 23.625H147.348L149.773 26.325H138.598ZM137.848 14.05L140.548 16.65V22.775L137.848 25.225V14.05ZM150.573 25.225L147.873 22.65V16.5L150.573 14.05V25.225ZM138.573 0.924999L149.748 0.924999L147.273 3.625L141.148 3.625L138.573 0.924999ZM137.773 13.175V2L140.473 4.425V10.625L137.773 13.175ZM150.498 2V13.175L147.798 10.75V4.575L150.498 2Z" fill="white" />
                </svg>
              </FinishedText>
              <UnstakeText>Unstake Anytime</UnstakeText>
            </Flex>
            <Flex pt='5px' style={{ borderTop: '1px solid #09647a', borderTopStyle: 'dotted' }} m='10px' p='10px' justifyContent='space-between' flexDirection='column' alignItems='flex-start'>
              <Text color="#2d74c4" fontSize="14px">{lpName}{' '}<span style={{ color: 'white' }}>Staked</span></Text>
              {!account ? (
                <UnlockButton mt="8px" fullWidth style={{ borderRadius: '5px', height: '35px' }} />
              ) : (
                isApproved ? (
                  rawStakedBalance === 0 ? (
                    <Flex justifyContent='space-between' alignItems='center' mt='10px' style={{ width: '-webkit-fill-available' }}>
                      <div>
                        <Text fontSize="18px">{stakedDisplayBalance}</Text>
                        <Text fontSize="18px">${stakedDisplayBalance}</Text>
                      </div>
                      <Button style={{ height: "32px", borderRadius: "5px", fontWeight: 'normal' }} onClick={onPresentDeposit}>{TranslateString(999, 'Stake')}</Button>
                    </Flex>
                  ) : (
                    <Flex justifyContent='space-between' alignItems='center' style={{ width: '-webkit-fill-available' }}>
                      <div>
                        <Text fontSize="18px">{stakedDisplayBalance}</Text>
                        <Text fontSize="18px">${totalValueUSDValue}</Text>
                      </div>
                      <Flex>
                        <Button size="sm" style={{ borderRadius: "5px", backgroundColor: "#483f5a", height: '32px', fontWeight: 'normal' }} onClick={onPresentWithdraw} mr="5px">
                          Unstake
                        </Button>
                        <IconButton style={{ borderRadius: "5px", height: '32px', width: '32px' }} onClick={onPresentDeposit}>
                          <AddIcon color="white" />
                        </IconButton>
                      </Flex>
                    </Flex>
                  )
                ) : (
                  <Button
                    disabled={requestedApproval}
                    onClick={handleApprove}
                    mt='10px'
                    style={{ width: "100%", borderRadius: "5px", height: '35px', fontWeight: 'lighter' }}
                  >
                    {requestedApproval ? "Approving..." : TranslateString(999, "Approve Contract")}
                  </Button>
                )
              )}
            </Flex>
          </Flex>
        ) : (
          <Flex flexDirection='column' style={{ width: 'inherit' }}>
            <CardHeading
              fee={farm.depositFee}
              multiplier={farm.multiplier}
              farmImage={farmImage}
              lpLabel={lpLabel}
              tokenSymbol={farm.tokenSymbol}
            />
            <Flex alignItems='center' justifyContent='space-between' style={{ borderTop: '1px solid #09647a', borderTopStyle: 'dashed' }} mt='15px' pt='10px'>
              <Text color="textSubtle" fontSize="18px" >{TranslateString(352, "APR")}</Text>
              <Flex justifyContent='center'>
                <Text color="textSubtle" style={{ display: "flex", alignItems: "center" }} fontSize="18px">
                  {farm.apy && !farm.apy.isNaN() ? (
                    <>
                      {farmAPY}%
                    </>
                  ) : (
                    <Skeleton height={24} width={80} />
                  )}
                </Text>
              </Flex>
            </Flex>
            <Flex alignItems='center' justifyContent='space-between' pt='10px'>
              <Text color="textSubtle" fontSize="18px">Liquidity</Text>
              <Text color="textSubtle" fontSize="18px">{totalValueFormated}</Text>
            </Flex>
            <Flex style={{ borderTop: '1px solid #09647a', borderTopStyle: 'dotted' }} m='15px 10px 0' p='10px 10px 0' justifyContent='space-between'>
              <Flex flexDirection='column' alignItems='flex-start'>
                <Flex justifyContent='center'>
                  <Text color="#2d74c4" fontSize="14px">{earnLabel}{' '}<span style={{ color: 'white' }}>Earned</span></Text>
                </Flex>
                <Text color="textSubtle" fontSize="18px">{displayBalance}</Text>
                <Text color="textSubtle" fontSize="18px">${earnedDisplayBalance}</Text>
              </Flex>
              {pid === -1 ? (
                <Button
                  disabled={rawEarningsBalance === 0 || pendingTx}
                  size="sm"
                  variant="secondary"
                  onClick={async () => {
                    setPendingTx(true);
                    await onStake(rawEarningsBalance.toString());
                    setPendingTx(false);
                  }}
                  mb='5px'
                  style={{ borderRadius: '5px', borderColor: '#2d74c4', color: '#2d74c4', height: '27px' }}
                >
                  {TranslateString(999, "Compound")}
                </Button>
              ) : null}
              {(rawEarningsBalance === 0 || pendingTx) ? (
                <Button disabled style={{ borderRadius: '5px', height: '30px', width: 'auto' }} mt='20px'>Harvest</Button>
              ) : (
                <Button
                  onClick={async () => {
                    setPendingTx(true);
                    await onReward();
                    setPendingTx(false);
                  }}
                  mt='20px'
                  style={{ borderRadius: "5px", height: '30px', width: 'auto' }}
                >
                  Harvest
                </Button>
              )}
            </Flex>
            <Flex pt='5px' style={{ borderTop: '1px solid #09647a', borderTopStyle: 'dotted' }} m='10px' p='10px' justifyContent='space-between' flexDirection='column' alignItems='flex-start'>
              <Text color="#2d74c4" fontSize="14px">{lpName}{' '}<span style={{ color: 'white' }}>Staked</span></Text>
              {!account ? (
                <UnlockButton mt="8px" fullWidth style={{ borderRadius: '5px', height: '35px' }} />
              ) : (
                isApproved ? (
                  rawStakedBalance === 0 ? (
                    <Flex justifyContent='space-between' alignItems='center' mt='10px' style={{ width: '-webkit-fill-available' }}>
                      <div>
                        <Text fontSize="18px">{stakedDisplayBalance}</Text>
                        <Text fontSize="18px">${stakedDisplayBalance}</Text>
                      </div>
                      <Button style={{ height: "32px", borderRadius: "5px", fontWeight: 'normal' }} onClick={onPresentDeposit}>{TranslateString(999, 'Stake')}</Button>
                    </Flex>
                  ) : (
                    <Flex justifyContent='space-between' alignItems='center' style={{ width: '-webkit-fill-available' }}>
                      <div>
                        <Text fontSize="18px">{stakedDisplayBalance}</Text>
                        <Text fontSize="18px">${totalValueUSDValue}</Text>
                      </div>
                      <Flex>
                        <Button size="sm" style={{ borderRadius: "5px", backgroundColor: "#483f5a", height: '32px', fontWeight: 'normal' }} onClick={onPresentWithdraw} mr="5px">
                          Unstake
                        </Button>
                        <IconButton style={{ borderRadius: "5px", height: '32px', width: '32px' }} onClick={onPresentDeposit}>
                          <AddIcon color="white" />
                        </IconButton>
                      </Flex>
                    </Flex>
                  )
                ) : (
                  <Button
                    disabled={requestedApproval}
                    onClick={handleApprove}
                    mt='10px'
                    style={{ width: "100%", borderRadius: "5px", height: '35px', fontWeight: 'lighter' }}
                  >
                    {requestedApproval ? "Approving..." : TranslateString(999, "Approve Contract")}
                  </Button>
                )
              )}
            </Flex>

            <LinkExternal
              href={
                (!farm.lpSymbol.includes('RLP') && !farm.lpSymbol.includes('CAKE LP')) ? `https://exchange.croxswap.com/#/swap/${tokenAddresses[process.env.REACT_APP_CHAIN_ID]}` : `https://exchange.croxswap.com/#/add/ETH/${tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
              }
            >
              <Text color="primary" >Get {lpLabel}</Text>
            </LinkExternal>
            <Link external href={`https://bscscan.com/token/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`}>
              <Text color="primary">{TranslateString(356, "View on BscScan")}</Text>
            </Link>
          </Flex>
        )}
      </FCard>
    </CardContainer>
  );
};

export default FarmCard;
