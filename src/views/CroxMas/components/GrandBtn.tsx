import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { Text, Flex, Link, useModal, IconButton, AddIcon, Button as UiKitButton, useWalletModal, ConnectorId } from 'crox-new-uikit'
import styled, { keyframes } from "styled-components";
import useGrandStake from "hooks/useGrandStake";
import useGrandUnstake from "hooks/useGrandUnstake";
import BigNumber from "bignumber.js";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { provider } from "web3-core";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getContract } from "utils/erc20";
import { getBalanceNumber } from 'utils/formatBalance';
import { useGrandHarvest, useHarvest } from "hooks/useHarvest";
import {
  useGrandFromPid,
  useGrandPoolUser,
} from "state/hooks";
import { useDualApprove, useGrandApprove } from "hooks/useApprove";
import GrandDeposit from "./GrandDeposit";
import GrandWithdraw from "./GrandWithdraw";

const DisableButton = styled.button`
  font-size: 15px;
  padding: 0px 5px;
  height: 35px;
  border-radius: 10px;
  border: none;
  background-color: #3c3742;
  color: #666171;
  font-weight: bold;
`;
const IconButtonWrapper = styled.div`
  margin-top: 5px;
  display: flex;
  justify-content: flex-end;
  text-align: left;
  svg {
    width: 20px;
  }
`;

const GrandBtn = (props) => {
  const lg = useMediaQuery("(max-width: 1024px)");
  const { grandpool } = props;
  const poolAddress = grandpool[0].poolAddress;
  const {
    lpAddresses,
    tokenAddresses,
    // isTokenOnly,
    // depositFeeBP,
  } = useGrandFromPid(poolAddress);
  const {
    allowance,
    tokenBalance,
    stakedBalance,
    earnings,
    nextHarvestUntil,
  } = useGrandPoolUser(poolAddress);
  const totalEarned = useMemo(() => {
    let sum = new BigNumber(0);
    earnings.forEach((val, inx) => {
      const { tokenPrice, tokenSymbol } = grandpool[0].rewardTokens[inx]
      if (tokenSymbol === 'CNS' || tokenSymbol === 'CNR') {
        sum = sum.plus(new BigNumber(val).div(10 ** 8).times(tokenPrice));
      } else {
        sum = sum.plus(new BigNumber(val).div(10 ** 18).times(tokenPrice));
      }
    })
    return sum;
  }, [earnings, grandpool]);
  const { onGrandStake } = useGrandStake(poolAddress);
  const { onGrandUnstake } = useGrandUnstake(poolAddress);

  const rawStakedBalance = getBalanceNumber(stakedBalance);

  const rawEarningsBalance1 = getBalanceNumber(
    new BigNumber(earnings[0])
  );

  const rawEarningsBalance2 = getBalanceNumber(
    earnings[1],
  );

  const today = new Date().getTime() / 1000;


  const withdrawModalHint = "/";
  const isDualFarm = true;
  const tokenDecimal = 18;

  const [onPresentDeposit] = useModal(
    <GrandDeposit
      max={tokenBalance}
      onConfirm={onGrandStake}
      tokenName={grandpool[0].lpSymbol}
      depositFeeBP={200}
      depositLink={grandpool[0].depositLink}
      stakedBalance={stakedBalance}
    />
  );

  const [onPresentWithdraw] = useModal(
    <GrandWithdraw
      max={stakedBalance}
      onConfirm={onGrandUnstake}
      tokenName={grandpool[0].lpSymbol}
      tokenDecimal={tokenDecimal}
      withdrawModalHint={withdrawModalHint}
    />
  );
  const [pendingTx, setPendingTx] = useState(false);
  const { onReward } = useGrandHarvest(poolAddress);
  const { account, reset, ethereum, connect } = useWallet();
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
  // const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID];
  const tokenAddress = tokenAddresses[process.env.REACT_APP_CHAIN_ID];

  const tokenContract = useMemo(() => {
    return getContract(ethereum as provider, tokenAddress);
  }, [ethereum, tokenAddress]);
  const { onApprove } = useGrandApprove(tokenContract, poolAddress);

  const [requestedApproval, setRequestedApproval] = useState(false);
  // const rawEarningsBalance = 0;

  const isApproved = account && allowance && allowance.isGreaterThan(0);
  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);

      await onApprove();

      setRequestedApproval(false);
    } catch (e) {
      console.error(e);
    }
  }, [onApprove]);

  return (
    <>
      <Flex justifyContent='center' mt='20px'>
        {
          !account ? (
            <UiKitButton onClick={onPresentConnectModal} style={{ height: "35px", padding: "0 10px", borderRadius: "10px" }}>Connect Wallet</UiKitButton>
          ) : (
            <>
              {!isApproved ? (
                <button
                  type='button'
                  onClick={handleApprove}
                  style={{ fontSize: "18px", color: "white", border: "none", fontWeight: "bold", width: "100px", height: "30px", borderRadius: "8px", backgroundColor: "#D74C4C" }}
                >
                  Approve
                </button>
              ) : (
                <>
                  {rawStakedBalance === 0 ? (
                    <button type='button' className='action_button grandpool_btn' onClick={onPresentDeposit}>Stake</button>
                  ) : (
                    <IconButtonWrapper>
                      <button type='button' className='action_button grandpool_btn' onClick={onPresentWithdraw}>
                        {/* <MinusIcon color="primary" /> */}
                        Unstake
                      </button>
                      <IconButton variant="tertiary" style={{ backgroundColor: "#D74C4C", padding: "6px", width: "40px", margin: "0 5px", borderRadius: "10px", height: "100%" }} onClick={onPresentDeposit}>
                        <AddIcon color="white" style={{ fontWeight: "bold" }} />
                      </IconButton>
                    </IconButtonWrapper>
                  )}
                </>
              )}
            </>
          )
        }
      </Flex>
      <Flex justifyContent='right' alignItems='center' flexDirection={lg ? 'column' : 'row'} mt="12px">
        <Flex justifyContent='space-between'>
          <Text fontSize='18px' mr='5px' color='white'>Total Earned:</Text>
          <Text fontSize='18px' mr='30px' color='gold' bold>${totalEarned.toFixed(2)}</Text>
          <Text fontSize='18px' mr='5px' color='white'>Staked:</Text>
          <Text fontSize='18px' mr='30px' color='gold' bold>{rawStakedBalance.toFixed(2)}</Text>
        </Flex>
        <button type='button' className='action_button grandpool_btn' style={lg ? { marginTop: '10px' } : {}}
          onClick={async () => {
            setPendingTx(true);
            await onReward();
            setPendingTx(false);
          }}
          disabled={!grandpool[0].userData || (getBalanceNumber(new BigNumber(grandpool[0].userData.earnings[1]).times(10 ** (grandpool[0].lpTokenDecimal ? 18 - grandpool[0].lpTokenDecimal : 0))) || getBalanceNumber(new BigNumber(grandpool[0].userData.earnings[0]).times(10 ** 10))).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3, }) === "0.000"}
        >
          Harvest All
        </button>
      </Flex>
    </>
  )
}

export default GrandBtn;
