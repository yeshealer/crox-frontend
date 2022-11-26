import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { Icon } from '@iconify/react';
import { Flex, Text, Button, Link } from "crox-new-uikit";
import styled from "styled-components";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { useMediaQuery } from "@mui/material";
import Countdown, { zeroPad } from 'react-countdown';
import BigNumber from "bignumber.js";
import { useBabyVaultContract, useVaultContract } from 'hooks/useContract';
import ExpandableSectionButton from "components/ExpandableSectionButton";
import VaultCard from "./VaultCard";
import Loading from "../animation/loading";
import Success from "../animation/Success";
import Fail from "../animation/Fail";

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? "100%" : "0px")};
  overflow: hidden;
  margin: ${(props) => (props.expanded ? "10px 0 10px 10px" : "0px")};
`;

interface VaultBodyProps {
    isApproved: boolean;
    handleApprove: any;
    stakedBalance: number;
    stakerCount: number;
    feeDistributed: number;
    APY: number;
    totalPrize: number;
    totalFeeReward: number;
    jackpotEndTime: number;
    pendingRewardPerUser: number;
    claimedAmount: number;
    stakedAmountStr: string;
    claimHistory: any;
    vaultContract: string;
    nativeTokenPrice: number;
    nativeToken: string;
    vpotInfo: any;
}

const VaultBody: React.FC<VaultBodyProps> = ({
    isApproved,
    handleApprove,
    stakedBalance,
    stakerCount,
    feeDistributed,
    APY,
    totalPrize,
    totalFeeReward,
    jackpotEndTime,
    pendingRewardPerUser,
    claimedAmount,
    stakedAmountStr,
    claimHistory,
    vaultContract,
    nativeTokenPrice,
    nativeToken,
    vpotInfo
}) => {
    const history = useHistory();
    const { account } = useWallet();
    const [claimBtnStats, setClaimBtnStats] = useState('claim')
    const [transactionHash, setTransactionHash] = useState("")
    const [showExpandableSection, setShowExpandableSection] = useState(false);
    const [claimedSum, setClaimedSum] = useState(0)

    const renderer = ({ hours, minutes, seconds, days }) => {
        return <span>{zeroPad(days)}d:{zeroPad(hours)}h:{zeroPad(minutes)}m:{zeroPad(seconds)}s</span>;
    };

    const ismobile = useMediaQuery("(max-width: 600px)")

    let contract = {}
    if (vpotInfo.vaultCurrency === 'cake') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        contract = useVaultContract(vaultContract)
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        contract = useBabyVaultContract(vaultContract)
    }
    const handleClaim = async () => {
        try {
            const inputAmount = new BigNumber(0).toString();
            const txHash = await (contract as any)?.methods.withdraw(inputAmount).send({ from: account });
            return txHash;
        } catch (error) {
            return error;
        }
    }
    const onConfirmResult = (res) => {
        if (res.code) {
            if (res.code !== '4001') {
                setTransactionHash(res.transactionHash)
            }
            return setClaimBtnStats('fail')
        }
        setTransactionHash(res.transactionHash)
        return setClaimBtnStats('success')
    }
    function copyToClipBoard(modalId) {
        const x = document.getElementById(modalId);
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 4500);
    }

    useEffect(() => {
        if (claimBtnStats === 'success') {
            copyToClipBoard("claimSuccessModal")
        } else if (claimBtnStats === 'fail') {
            copyToClipBoard("claimFailModal")
        }
    }, [claimBtnStats])

    useEffect(() => {
        let sumClaimed = 0;
        claimHistory.map((historyOne) => {
            sumClaimed += parseInt(historyOne.value) / 10 ** parseInt(historyOne.tokenDecimal)
            return 0;
        })
        setClaimedSum(sumClaimed)
    })

    return (
        <Flex flexDirection='column'>
            <Flex alignSelf='flex-start' mt='10px'>
                <Button onClick={() => {
                    history.push("/vpots")
                }}><Icon icon="bx:rotate-left" style={{ fontSize: '24px' }} />Go Back</Button>
            </Flex>
            <Flex className="vaultBody" flexDirection={ismobile ? "column" : "row"}>
                <Flex flexDirection='column' mr={!ismobile && '50px'}>
                    <Flex flexDirection='column' alignItems='center' className="statsCard">
                        <Text fontSize="18px">Players in the pool</Text>
                        <Text fontSize="25px" color="#2d74c4" bold>{stakerCount}</Text>
                    </Flex>
                    <Flex flexDirection='column' alignItems='center' className="statsCard">
                        <Text fontSize="18px">Total Fee Distributed</Text>
                        <Text fontSize="25px" color="#2d74c4" bold>{totalFeeReward.toFixed(3)} {vpotInfo.vaultCurrency.toUpperCase()}</Text>
                    </Flex>
                    <Flex flexDirection='column' alignItems='center' className="statsCard">
                        <Text fontSize="18px">My Staked Balance</Text>
                        <Text fontSize="25px" color="#2d74c4" bold>{stakedBalance.toFixed(3)} {vpotInfo.vaultCurrency.toUpperCase()}</Text>
                    </Flex>
                    <Flex flexDirection='column' alignItems='center' className="statsCard">
                        <Text fontSize="18px">Next DRAW</Text>
                        {/* <Text fontSize="25px" bold><span style={{ color: 'orange' }}>TBA</span></Text> */}
                        <Text fontSize="25px" bold><span style={{ color: 'orange' }}>${(totalPrize / 3).toFixed(3)}</span> Prize Pool</Text>
                        {/* <Text fontSize='20px' color='orange'><Countdown date={jackpotEndTime} renderer={renderer} /></Text> */}
                        <Button className="vaultCard__btn win_cake" onClick={() => {
                            history.push(`/vpots/pot/${vpotInfo.vaultCurrency}`)
                        }}>Win {vpotInfo.vaultCurrency.toUpperCase()}</Button>
                        <Link href="https://app.croxswap.com" color="white" mt='5px' mb='-5px'>Learn more</Link>
                    </Flex>
                </Flex>
                <Flex flexDirection='column' mr={!ismobile && '50px'}>
                    <VaultCard
                        isApproved={isApproved}
                        handleApprove={handleApprove}
                        stakedBalance={stakedBalance}
                        stakedAmountStr={stakedAmountStr}
                        totalFeeReward={totalFeeReward}
                        nativeTokenPrice={nativeTokenPrice}
                        vaultContract={vaultContract}
                        nativeToken={nativeToken}
                        vpotInfo={vpotInfo}
                        APY={APY}
                    />
                    <Flex flexDirection='column' className="vaultBody__description">
                        <Text fontSize="16px">1. &nbsp;&nbsp;Stake 7 days or more to enter into jackpot pool.</Text>
                        <Text fontSize="16px">2. &nbsp;&nbsp;No Early withdrawal penalty. But you won&apos;t be able to win a jackpot after withdrawal.</Text>
                        <Text fontSize="16px">3. &nbsp;&nbsp;1% Processing Fees is charged during withdrawal.</Text>
                    </Flex>
                </Flex>
                <Flex flexDirection='column'>
                    <Flex flexDirection='column' alignItems='center' mt={ismobile && '10px'} className="statsCard">
                        <Flex alignItems='center' justifyContent='center'>
                            <Text fontSize="18px" mr='25px'>APY Rewards:</Text>
                            <Text fontSize="25px" color='#2d74c4' mr='3px' bold>{feeDistributed.toFixed(3)} {vpotInfo.vaultCurrency.toUpperCase()}</Text>
                        </Flex>
                        <Text fontSize="13px" color="lightgrey">Rewards are automatically claimed when you unstake</Text>
                    </Flex>
                    <Flex flexDirection='column' alignItems='center' mt={ismobile && '10px'} className="statsCard">
                        {/* <Text fontSize="18px">Total Rewards Earned (YTD)</Text> */}
                        <Flex alignItems='center' justifyContent='center'>
                            <Text fontSize="18px" mr='25px'>Fee Earned:</Text>
                            <Text fontSize="25px" color='#2d74c4' mr='3px' bold>{(pendingRewardPerUser).toFixed(3)} {vpotInfo.vaultCurrency.toUpperCase()}</Text>
                        </Flex>
                        {/* <Flex alignItems='flex-end' justifyContent='center'>
                            <Text fontSize="18px" mr='25px'>Total:</Text>
                            <Text fontSize="25px" color='orange' mr='3px' bold>{(feeDistributed + pendingRewardPerUser).toFixed(3)} {vpotInfo.vaultCurrency.toUpperCase()}</Text>
                        </Flex> */}
                        <Flex alignItems='flex-end' justifyContent='center' mt="-5px">
                            <Text fontSize="18px" mr='25px'>Fee Claimed:</Text>
                            <Text fontSize="25px" color='lightgreen' mr='3px' bold>{claimedSum.toFixed(3)} {vpotInfo.vaultCurrency.toUpperCase()}</Text>
                        </Flex>
                    </Flex>
                    <Flex flexDirection='column' alignItems='center' mt={ismobile && '10px'} className="statsCard">
                        <Text fontSize="18px">Claimable Rewards</Text>
                        <Flex alignItems='center' justifyContent='center'>
                            <Text fontSize="18px" mr='25px'>Fee Rewards:</Text>
                            <Text fontSize="25px" color='#2d74c4' mr='3px' bold>{pendingRewardPerUser.toFixed(3)} {vpotInfo.vaultCurrency.toUpperCase()}</Text>
                        </Flex>
                        {pendingRewardPerUser > 0 ? <Button className="vaultCard__btn win_cake" onClick={async () => {
                            setClaimBtnStats('loading')
                            const res = await handleClaim()
                            onConfirmResult(res)
                        }} disabled>{claimBtnStats === 'claim' ? 'Claim' : claimBtnStats === 'loading' ? (
                            <Loading />
                        ) : claimBtnStats === 'fail' ? 'Claim' : claimBtnStats === 'success' && 'Claim'}</Button> :
                            <Button className="vaultCard__btn win_cake" disabled>Claim</Button>}
                        <Flex flexDirection='column' mt='10px' p='10px' pt='5px' style={{ borderTop: '1px solid #0e48de', borderTopStyle: 'dotted', width: '100%' }}>
                            <Flex alignItems='flex-start' justifyContent='space-between' style={{ cursor: 'pointer' }} onClick={() => setShowExpandableSection(!showExpandableSection)}>
                                <Text fontSize="18px">Claim History</Text>
                                <ExpandableSectionButton
                                    onClick={() => setShowExpandableSection(!showExpandableSection)}
                                    expanded={showExpandableSection}
                                />
                            </Flex>
                            <ExpandingWrapper expanded={showExpandableSection}>
                                {claimHistory.map((historyOne) => {
                                    const timeStamp = parseInt(historyOne.timeStamp) * 1000
                                    const date = new Date(timeStamp)
                                    const feeClaimed = parseInt(historyOne.value) / 10 ** parseInt(historyOne.tokenDecimal)
                                    return (
                                        <div style={{ marginBottom: '10px' }}>
                                            <Flex style={{ marginBottom: 0 }} justifyContent="space-between" alignItems='center'>
                                                <Text color="lightgrey">{date.toLocaleString('default', { month: 'short' })} {date.getUTCDate()}th, {date.getFullYear()}</Text>
                                                <Flex alignItems='center' onClick={() => window.open(`https://bscscan.com/tx/${historyOne.hash}`, '_blank')} style={{ cursor: 'pointer' }}>
                                                    <Text color="lightgrey">{feeClaimed.toFixed(3)} {vpotInfo.vaultCurrency.toUpperCase()}</Text>
                                                    <Icon icon="line-md:external-link-rounded" color="lightgrey" />
                                                </Flex>
                                            </Flex>
                                        </div>
                                    )
                                })}
                            </ExpandingWrapper>
                        </Flex>
                    </Flex>
                    <Flex flexDirection='column' className="strategyCard">
                        <Flex flexDirection='column' alignItems='center' mb='5px' pb='5px' style={{ borderBottom: '1px dotted #264e7c' }}>
                            <Text fontSize="18px">Auto-Compounding Strategy</Text>
                            <Text>1. &nbsp;&nbsp;The users&apos; funds are first deposited into a target vault or staking pool. </Text>
                            <Text>2. &nbsp;&nbsp;The target platform utilizes yield-optimizing strategies to enhance returns which increases the value of deposits. </Text>
                        </Flex>
                        <Flex flexDirection='column' alignItems='flex-start'>
                            <Text fontSize="18px" style={{ alignSelf: 'center' }}>Fee Distribution Strategy</Text>
                            <Text>1. &nbsp;&nbsp;Fee charged on every deposit is re-distributed back to the players in the pool. </Text>
                            <Text>2. &nbsp;&nbsp;Early depositors earn 3% fee share from every new deposit and also their own self deposit </Text>
                            <Text>3. &nbsp;&nbsp;Longer you stay in the pool more chances of earning a flat 3% share from each deposit. No brainer. </Text>
                            <Text>4. &nbsp;&nbsp;1% Fee goes to the Jackpot pool and 1% goes to CROX treasury for buyback and CROX liquidity.</Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            <Flex id="claimSuccessModal" flexDirection='column'>
                <Flex alignItems='center'>
                    <Success />
                    <Flex flexDirection='column'>
                        <Text color="lightgreen" fontSize="20px" bold>Success</Text>
                        <Flex alignItems='center'>
                            <Link href={`https://bscscan.com/tx/${transactionHash}`} fontSize="16" color='white' mr='3px' style={{ fontWeight: 'normal' }}>View on Bscscan</Link>
                            <Icon icon="akar-icons:link-out" width='16px' height='16px' />
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            <Flex id="claimFailModal" flexDirection='column'>
                <Flex alignItems='center'>
                    <Fail />
                    <Flex flexDirection='column'>
                        <Text color="#f44260" fontSize="20px" bold>Failed</Text>
                        {transactionHash && <Flex alignItems='center'>
                            <Link href={`https://bscscan.com/tx/${transactionHash}`} fontSize="16" color='white' mr='3px' style={{ fontWeight: 'normal' }}>View on Bscscan</Link>
                            <Icon icon="akar-icons:link-out" width='16px' height='16px' />
                        </Flex>}
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default VaultBody
