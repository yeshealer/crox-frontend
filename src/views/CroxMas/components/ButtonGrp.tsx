import React, { useRef, useState, useCallback, useMemo } from 'react'
import { Text, Flex, Link, useModal, IconButton, AddIcon, Button as UiKitButton, useWalletModal, ConnectorId } from 'crox-new-uikit'
import styled, { keyframes } from "styled-components";
import useDualStake from "hooks/useDualStake";
import useDualUnstake from "hooks/useDualUnstake";
import BigNumber from "bignumber.js";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { provider } from "web3-core";
import { getContract } from "utils/erc20";
import { getBalanceNumber } from 'utils/formatBalance';
import { useDualHarvest, useHarvest } from "hooks/useHarvest";
import {
    useCroxmasFromPid,
    useCroxmasPoolUser,
} from "state/hooks";
import { useDualApprove } from "hooks/useApprove";
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";

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

const ButtonGrp = (props) => {
    const { entry, disable, index } = props;
    const {
        lpAddresses,
        tokenAddresses,
        isTokenOnly,
        depositFeeBP,
    } = useCroxmasFromPid(entry.poolAddress);
    const {
        allowance,
        tokenBalance,
        stakedBalance,
        earnings,
        nextHarvestUntil,
    } = useCroxmasPoolUser(entry.poolAddress);
    // const nextHarvestUntil = 0;
    // const earnings = 0;
    // const stakedBalance = new BigNumber(0);
    const { onDualStake } = useDualStake(entry.poolAddress);
    const { onDualUnstake } = useDualUnstake(entry.poolAddress);

    const rawStakedBalance = getBalanceNumber(stakedBalance);

    const rawEarningsBalance1 = getBalanceNumber(
        new BigNumber(earnings[0]).times(
            10 ** (entry.tokenDecimal ? 18 - entry.tokenDecimal : 0)
        )
    );

    const rawEarningsBalance2 = getBalanceNumber(
        earnings[1],
    );
    const today = new Date().getTime() / 1000;

    const [onPresentDeposit] = useModal(
        <DepositModal
            max={tokenBalance}
            onConfirm={onDualStake}
            tokenName={entry.lpSymbol}
            depositFeeBP={0}
            depositLink={entry.depositLink}
            stakedBalance={stakedBalance}
            tokenDecimal={entry.lpTokenDecimal}
        />
    );

    const [onPresentWithdraw] = useModal(
        <WithdrawModal
            max={stakedBalance}
            onConfirm={onDualUnstake}
            tokenName={entry.lpSymbol}
            tokenDecimal={entry.lpTokenDecimal}
            withdrawModalHint={entry.withdrawModalHint}
        />
    );

    const [pendingTx, setPendingTx] = useState(false);
    const { onReward } = useDualHarvest(entry.poolAddress);
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
    const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID];
    const tokenAddress = tokenAddresses[process.env.REACT_APP_CHAIN_ID];

    const lpContract = useMemo(() => {
        if (isTokenOnly) {
            return getContract(ethereum as provider, tokenAddress);
        }
        return getContract(ethereum as provider, lpAddress);
    }, [ethereum, lpAddress, tokenAddress, isTokenOnly]);
    const { onApprove } = useDualApprove(lpContract, entry.poolAddress);

    const [requestedApproval, setRequestedApproval] = useState(false);
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

    const earnedBalance = useRef("");
    const tokenStakedBalance = useRef("")
    if (((entry as any).tokenSymbol === 'CNR' || (entry as any).tokenSymbol === 'CNS') && entry.userData) {
        earnedBalance.current = getBalanceNumber(new BigNumber(entry.userData.earnings[0]).times(10 ** 10)).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3, })
    } else if (entry.userData) {
        earnedBalance.current = getBalanceNumber(new BigNumber(entry.userData.earnings[0]).times(10 ** (entry.tokenDecimal ? 18 - entry.tokenDecimal : 0))).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3, })
        tokenStakedBalance.current = getBalanceNumber(new BigNumber(entry.userData.stakedBalance).times(10 ** 10)).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3, })
    }
    if (entry.userData) {
        tokenStakedBalance.current = getBalanceNumber(new BigNumber(entry.userData.stakedBalance).times(10 ** (entry.lpTokenDecimal ? 18 - entry.lpTokenDecimal : 0))).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3, })
    }
    return (
        <>
            <Flex justifyContent='space-between' alignItems='center'>
                <div style={{ width: '56.5%' }}>
                    <Flex justifyContent='space-between' alignItems='center'>
                        <Text className='pool_card_text font-size-1'>{entry.tokenSymbol} Earned</Text>
                        <Text className='pool_card_text font-size-1 color_white'>{entry.userData ? earnedBalance.current : `0.000`}</Text>
                    </Flex>
                    {(entry as any).rewardTokenSymbol && (
                        <Flex justifyContent='space-between' alignItems='center'>
                            <Text className='pool_card_text font-size-1'>{(entry as any).rewardTokenSymbol} Earned</Text>
                            <Text className='pool_card_text font-size-1 color_white'>{entry.userData ? getBalanceNumber(new BigNumber(entry.userData.earnings[1]).times(10 ** (entry.lpTokenDecimal ? 18 - entry.lpTokenDecimal : 0))).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3, }) : `0.000`}</Text>
                        </Flex>
                    )}
                </div>
                {
                    account && entry.tokenSymbol !== 'CNR' && entry.tokenSymbol !== 'CNS' && (
                        <button type='button' className='action_button'
                            onClick={async () => {
                                setPendingTx(true);
                                await onReward();
                                setPendingTx(false);
                            }}
                            disabled={disable[index] || !entry.userData || (getBalanceNumber(new BigNumber(entry.userData.earnings[1]).times(10 ** (entry.lpTokenDecimal ? 18 - entry.lpTokenDecimal : 0))) || getBalanceNumber(new BigNumber(entry.userData.earnings[0]).times(10 ** (entry.lpTokenDecimal ? 18 - entry.lpTokenDecimal : 0)))).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3, }) === "0.000"}
                        >
                            Claim
                        </button>
                    )
                }
                {
                    account && (entry.tokenSymbol === 'CNR' || entry.tokenSymbol === 'CNS') && (
                        <button type='button' className='action_button'
                            onClick={async () => {
                                setPendingTx(true);
                                await onReward();
                                setPendingTx(false);
                            }}
                            disabled={disable[index] || !entry.userData || (getBalanceNumber(new BigNumber(entry.userData.earnings[1]).times(10 ** (entry.lpTokenDecimal ? 18 - entry.lpTokenDecimal : 0))) || getBalanceNumber(new BigNumber(entry.userData.earnings[0]).times(10 ** 10))).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3, }) === "0.000"}
                        >
                            Claim
                        </button>
                    )
                }
            </Flex>
            <Flex justifyContent='space-between' mt='2vw'>
                <div style={{ width: '56.5%' }}>
                    <Flex justifyContent='space-between' alignItems='center'>
                        <Text className='pool_card_text font-size-1'>{entry.lpSymbol} Staked</Text>
                        <Text className='pool_card_text font-size-1 color_white'>{entry.userData ? tokenStakedBalance.current : `0.000`}</Text>
                    </Flex>
                </div>
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
                                        <button type='button' className='action_button' onClick={onPresentDeposit} disabled={disable[index]}>Stake</button>
                                    ) : (
                                        <IconButtonWrapper>
                                            <button type='button' className='action_button' onClick={onPresentWithdraw}>
                                                {/* <MinusIcon color="primary" /> */}
                                                Unstake
                                            </button>
                                            <IconButton variant="tertiary" style={{ backgroundColor: "#D74C4C", padding: "6px", width: "33px", margin: "0 5px", borderRadius: "10px", height: "100%" }} onClick={onPresentDeposit}>
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
        </>
    )
}

export default ButtonGrp;
