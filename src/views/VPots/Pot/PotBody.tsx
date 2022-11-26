import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import { Flex, Text, Button } from "crox-new-uikit";
import ReactModal from 'react-modal';
import { useHistory, Link } from "react-router-dom";
import Countdown, { zeroPad } from 'react-countdown';
import { useMediaQuery } from "@mui/material";
import { Icon } from '@iconify/react';
// import LeaderBoard from "../components/LeaderBoard";
import ExpandableSectionButton from "components/ExpandableSectionButton";
import Finished from "../animation/Finished";
import PotCard from './PotCard'
import WithdrawModal from "./WithdrawModal";
import NotFound from "../animation/NotFound";
import './pot.scss'

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? "100%" : "0px")};
  overflow: hidden;
`;

interface PotBodyProps {
    isApproved: boolean;
    handleApprove: any;
    stakedBalance: number;
    jackpotCounters: number;
    vaultCounters: number;
    totalPrize: number;
    userStartTime: number;
    cakeEarned: number;
    stakedAmountStr: string;
    jackpotRewardEndTime: number;
    jackpotEntryDuration: number;
    jackpotEndTime: number;
    blockNum: number;
    jackpotData: any;
    winners: any;
    vpotType: string;
    claimHistory: any;
    vpotInfo: any;
    TVL: number;
    vpotsData: any;
}

const PotBody: React.FC<PotBodyProps> = ({ isApproved,
    handleApprove,
    stakedBalance,
    jackpotCounters,
    vaultCounters,
    totalPrize,
    userStartTime,
    cakeEarned,
    stakedAmountStr,
    jackpotRewardEndTime,
    jackpotEntryDuration,
    jackpotEndTime,
    blockNum,
    jackpotData,
    winners,
    vpotType,
    claimHistory,
    vpotInfo,
    TVL,
    vpotsData
}) => {
    const [blockFlag, setBlockFlag] = useState(false)
    const [showExpandableSectionClaimHistory, setShowExpandableSectionClaimHistory] = useState(false);
    const [showDrawDetail, setShowDrawDetail] = useState(false);
    const [estimateTime, setEstimateTime] = useState<number>(Date.now())
    const [endFlag, setEndFlag] = useState<boolean>(false)
    const [drawStats, setDrawStats] = useState<string>('show')
    const [drawNo, setDrawNo] = useState<string>((Math.abs(vpotInfo.no - vpotsData.length)).toString())
    const [tokenLogoList, setTokenLogoList] = useState<string>()
    const [forwardButton, setForwardButton] = useState(false)
    const [backwardButton, setBackwardButton] = useState(false)
    const [lastButton, setLastButton] = useState(false)
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

    const customStyles = {
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

    ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(0, 0, 0, 0.5)';

    const clockStartRef = useRef(null)
    const handleStartGroup = () => clockStartRef.current.start()

    const history = useHistory();
    const ismobile = useMediaQuery("(max-width: 600px)")
    const renderer = ({ hours, minutes, seconds, days }) => {
        return <span>{zeroPad(days)}d:{zeroPad(hours)}h:{zeroPad(minutes)}m:{zeroPad(seconds)}s</span>;
    };

    const month = new Date(jackpotEndTime).getUTCMonth() + 1 >= 10 ? new Date(jackpotEndTime).getUTCMonth() + 1 : `0${new Date(jackpotEndTime).getUTCMonth() + 1}`
    const day = new Date(jackpotEndTime).getDate() >= 10 ? new Date(jackpotEndTime).getDate() : `0${new Date(jackpotEndTime).getDate()}`

    function closeModal() {
        setIsWithdrawModalOpen(false);
    }

    useEffect(() => {
        axios.get(`https://api.bscscan.com/api?module=block&action=getblockcountdown&blockno=${blockNum}&apikey=XBAWBXPCJB2UNBI7JAAE14AANNMPMEERSC`).then(res => {
            if ((res.data as any).result === 'Max rate limit reached') {
                setBlockFlag(blockFlag ? false : true)
            } else {
                const date = Date.now() + ((res.data as any).result.EstimateTimeInSec) * 1000 - 1600000
                setEstimateTime((res.data as any).message === 'NOTOK' ? jackpotRewardEndTime : date)
                setEndFlag(date < 0 ? true : false)
                handleStartGroup()
            }
        })
    }, [blockFlag, endFlag])

    const renderDraw = (event) => {
        setTokenLogoList('')
        const inputValue = event.target.value;
        if (!inputValue || inputValue === '0') {
            setDrawStats('empty')
            setDrawNo('')
        } else if (parseInt(inputValue) > vpotsData.length) {
            axios.get(`https://openapi.debank.com/v1/token?chain_id=bsc&id=${vpotsData[vpotInfo.no].nativeTokenAddress}`).then(res => {
                setTokenLogoList((res.data as any).logo_url)
            })
            setDrawStats('show')
            setDrawNo((vpotsData.length).toString())
        } else {
            axios.get(`https://openapi.debank.com/v1/token?chain_id=bsc&id=${vpotsData[vpotInfo.no].nativeTokenAddress}`).then(res => {
                setTokenLogoList((res.data as any).logo_url)
            })
            setDrawStats('show')
            setDrawNo(inputValue)
        }
    }

    const handleShowBack = () => {
        setTokenLogoList('')
        setDrawNo((parseInt(drawNo) - 1).toString())
        axios.get(`https://openapi.debank.com/v1/token?chain_id=bsc&id=${vpotsData[parseInt(drawNo) - 2].nativeTokenAddress}`).then(res => {
            setTokenLogoList((res.data as any).logo_url)
        })
    }
    const handleShowForward = () => {
        setTokenLogoList('')
        if (drawNo === null || drawNo === '') {
            setDrawStats('show')
            setDrawNo('1')
            axios.get(`https://openapi.debank.com/v1/token?chain_id=bsc&id=${vpotsData[0].nativeTokenAddress}`).then(res => {
                setTokenLogoList((res.data as any).logo_url)
            })
        } else {
            setDrawNo((parseInt(drawNo) + 1).toString())
            axios.get(`https://openapi.debank.com/v1/token?chain_id=bsc&id=${vpotsData[parseInt(drawNo)].nativeTokenAddress}`).then(res => {
                setTokenLogoList((res.data as any).logo_url)
            })
        }
    }
    const handleShowLast = () => {
        setDrawStats('show')
        setTokenLogoList('')
        setDrawNo((vpotsData.length).toString())
        axios.get(`https://openapi.debank.com/v1/token?chain_id=bsc&id=${vpotsData[vpotsData.length - 1].nativeTokenAddress}`).then(res => {
            setTokenLogoList((res.data as any).logo_url)
        })
    }

    useEffect(() => {
        // if (!drawNo || drawNo === '1') {
        //     setBackwardButton(true)
        // } else {
        //     setBackwardButton(false)
        // }
        // if (drawNo >= (vpotsData.length).toString()) {
        //     setForwardButton(true)
        //     setLastButton(true)
        axios.get(`https://openapi.debank.com/v1/token?chain_id=bsc&id=${vpotsData[vpotInfo.no].nativeTokenAddress}`).then(res => {
            setTokenLogoList((res.data as any).logo_url)
        })
        // } else {
        //     setForwardButton(false)
        //     setLastButton(false)
        // }
    }, [drawNo])

    return (
        <Flex className="potBody" flexDirection='column' alignItems='center'>
            <Flex alignSelf='flex-start'>
                <Button onClick={() => {
                    history.push("/vpots")
                }}><Icon icon="bx:rotate-left" style={{ fontSize: '24px' }} />Go Back</Button>
            </Flex>
            <Flex flexDirection={ismobile ? "column" : "row"} justifyContent="space-between" className="topBody">
                <Flex justifyContent='center' className="left_body">
                    <Flex flexDirection="column">
                        {endFlag ? <Flex flexDirection='column' alignItems='center' className="statsCard" mb="10px">
                            <Text fontSize="20px">Next Draw opens in</Text>
                            <Text fontSize='20px' color='orange'><Countdown date={estimateTime} renderer={renderer} ref={clockStartRef} autoStart={false} /></Text>
                        </Flex> : <Flex flexDirection='column' alignItems='flex-start' className="statsCard" mb="10px">
                            <Flex justifyContent='space-between' style={{ width: '100%' }}>
                                <Text mr='3px'>Pot Start Date:</Text>
                                {/* <Text color="orange">TBA</Text> */}
                                <Text color="orange">{jackpotData.potStartDate}</Text>
                            </Flex>
                            <Flex justifyContent='space-between' style={{ width: '100%' }}>
                                <Text mr='3px'>Entry Period:</Text>
                                <Text color="orange">{jackpotData.entryPeriod}</Text>
                                {/* <Text color="orange">TBA</Text> */}
                            </Flex>
                            <Flex mt="5px" justifyContent='space-between' style={{ width: '100%' }}>
                                <Text mr='3px'>Farming Period:</Text>
                                {/* <Text color="orange">TBA</Text> */}
                                <Text color="orange">{jackpotData.farmingStartDate} {/* to {month}/{day} */} </Text>
                            </Flex>
                            <Flex justifyContent='space-between' style={{ width: '100%' }}>
                                <Text mr='3px'>Jackpot Draw Date:</Text>
                                {/* <Text color="orange">TBA</Text> */}
                                <Text color="orange">{jackpotData.jackpotDrawDate}</Text>
                            </Flex>
                        </Flex>
                        }
                        <PotCard
                            isApproved={isApproved}
                            handleApprove={handleApprove}
                            stakedBalance={stakedBalance}
                            jackpotCounters={jackpotCounters}
                            totalPrize={totalPrize}
                            stakedAmountStr={stakedAmountStr}
                            winners={winners[vpotInfo.no]}
                            claimHistory={claimHistory}
                            vpotType={vpotType}
                        />
                        <Flex flexDirection='column' className='eligibilityCard'>
                            <Flex flexDirection='column' alignItems='center' mb='5px' pb='5px'>
                                <Text fontSize="18px">Jackpot Eligibility</Text>
                                <Text>1. &nbsp;&nbsp;To get in to jackpot pool you need to stake in one of the vaults listed on <Link to={`/vpots/vault/${vpotType}`} style={{ color: 'yellow' }}>vpots page.</Link></Text>
                                <Text>2. &nbsp;&nbsp;Stake minimum of 1500 {vpotType.toUpperCase()} in the vault at least 7 days prior to the pot start date.</Text>
                                <Text>3. &nbsp;&nbsp;CROX tokens are required to enter the jackpot pool. </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex flexDirection='column' style={{ width: '355px' }}>
                    <Flex className="strategyCard" justifyContent='center' flexDirection='column' alignItems='center'>
                        <Text fontSize="18px">My Pot</Text>
                        <Text fontSize="18px">CROX Deposited: <span style={{ color: '#2d74c4', fontWeight: 'bold', fontSize: '22px' }}>{stakedBalance.toFixed(1)} CROX</span></Text>
                        <Text fontSize="18px">Earned: <span style={{ color: '#2d74c4', fontWeight: 'bold', fontSize: '22px' }}>{cakeEarned.toFixed(3)} {vpotType.toUpperCase()}</span></Text>

                        <Flex flexDirection='column' mt='10px' p='10px' pt='5px' style={{ borderTop: '1px dotted #2d74c4', width: '100%' }}>
                            <Flex alignItems='flex-start' justifyContent='space-between' style={{ cursor: 'pointer' }} onClick={() => setShowExpandableSectionClaimHistory(!showExpandableSectionClaimHistory)}>
                                <Text fontSize="18px" bold>Claim History</Text>
                                <ExpandableSectionButton
                                    onClick={() => setShowExpandableSectionClaimHistory(!showExpandableSectionClaimHistory)}
                                    expanded={showExpandableSectionClaimHistory}
                                />
                            </Flex>
                            <ExpandingWrapper expanded={showExpandableSectionClaimHistory}>
                                <div style={{ marginBottom: '10px' }}>
                                    {claimHistory.map((historyOne) => {
                                        const timeStamp = parseInt(historyOne.timeStamp) * 1000
                                        const date = new Date(timeStamp)
                                        const feeClaimed = parseInt(historyOne.value) / 10 ** parseInt(historyOne.tokenDecimal)
                                        return (
                                            <div style={{ marginBottom: '10px' }}>
                                                <Flex style={{ marginBottom: 0 }} justifyContent="space-between" alignItems='center'>
                                                    <Text color="lightgrey">{date.toLocaleString('default', { month: 'short' })} {date.getUTCDate()}th, {date.getFullYear()}</Text>
                                                    <Flex alignItems='center' onClick={() => window.open(`https://bscscan.com/tx/${historyOne.hash}`, '_blank')} style={{ cursor: 'pointer' }}>
                                                        <Text color="lightgrey">{feeClaimed.toFixed(3)} {vpotType.toUpperCase()}</Text>
                                                        <Icon icon="line-md:external-link-rounded" color="lightgrey" />
                                                    </Flex>
                                                </Flex>
                                            </div>
                                        )
                                    })}
                                </div>
                            </ExpandingWrapper>
                        </Flex>
                    </Flex>
                    <Flex flexDirection='column' className="strategyCard">
                        <Flex flexDirection='column' alignItems='center' mb='5px' pb='5px'>
                            <Text fontSize="18px">Jackpot Strategy</Text>
                            <Text>1. &nbsp;&nbsp;Stake CROX tokens into the pot to win the prize pool.</Text>
                            <Text>2. &nbsp;&nbsp;Chances of winning is random. Croxswap uses <a href="https://croxswap.medium.com/croxswap-integrates-chainlink-vrf-to-help-determine-lucky-draw-winners-e47f4a4926eb" target="_blank" rel="noreferrer" style={{ color: 'yellow' }}>Chainlink VRF v2</a> technology for fair game randomness. Number of CROX tokens deposited increases the chances of winning. More you deposit more chances to win. </Text>
                            <Text>3. &nbsp;&nbsp;It is a NO LOSS POT which means everyone earns a piece of pie during the farming period before the jackpot is drawn. </Text>
                            <Text>4. &nbsp;&nbsp;20% of the pot is distributed to all players as per their staked proportions during the farming period. 70% of the pot will go to ONE WINNER. Remaining 10% is reserved for GRAND POOL. </Text>
                            <Text>5. &nbsp;&nbsp;Jackpot pool is available to enter for 48 hrs from the start block. No new entries will be allowed after first 48 hrs and farming continues for 7 days. Jackpot is drawn on the 7th day. </Text>
                            <Text>6. &nbsp;&nbsp;Connect your wallet to check if you are a winner. </Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            {vpotInfo.winnerInfo.length > 0 && <Flex alignSelf="flex-start" flexDirection="column">
                <Flex alignItems='center'>
                    <Finished />
                    <Text fontSize="30px" bold>Finished Draws</Text>
                </Flex>
                <Flex className="finished_draw" flexDirection='column'>
                    <Flex className="finished_draw__header" flexDirection='column'>
                        <Flex alignItems='center'>
                            <Text fontSize="20px" bold>Draw</Text>
                            <input className="finished_draw__header__inputRound" maxLength={3} onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }} onChange={(event) => renderDraw(event)} value={drawNo} disabled />
                            {/* <button type="button" className="button-backward" disabled={backwardButton} onClick={() => handleShowBack()}> <Icon icon="eva:arrow-left-outline" width={27} className="arrow left-arrow" /></button>
                            <button type="button" className="button-forward" disabled={forwardButton} onClick={() => handleShowForward()}> <Icon icon="eva:arrow-right-outline" width={27} className="arrow right-arrow" /></button>
                            <button type="button" className="button-last" disabled={lastButton} onClick={() => handleShowLast()}> <Icon icon="ic:baseline-last-page" width={24} className="arrow final-arrow" /></button> */}
                        </Flex>
                        {/* {drawStats === 'show' && <Text color="lightgrey">Drawn {new Date(vpotInfo[drawNo - 1].jackpotInfo[drawNo - 1].jackpotDrawDate).toLocaleString()}</Text>} */}
                    </Flex>
                    {drawNo === (vpotsData.length).toString() && <div className="fork-me_container">
                        <div className="fork-me__header">
                            <span className="fork-me__text">
                                Latest
                            </span>
                        </div>
                    </div>}
                    <Flex className="finished_draw__body" alignItems='center' justifyContent={drawStats === 'empty' ? "center" : "flex-start"}>
                        {drawStats === 'empty' && <Flex flexDirection='column' alignItems='center'>
                            <Text fontSize="18px">Please specify Draw</Text>
                            <NotFound />
                        </Flex>}
                        {drawStats === 'show' && <Flex alignItems='flex-start' flexDirection='column' style={{ width: '100%' }}>
                            <Flex alignItems='center'>
                                {tokenLogoList && <img src={tokenLogoList} alt="token logo" draggable={false} className="token_logo" />}
                                <Text fontSize="20px" ml='5px' className="" bold>{vpotsData[vpotInfo.no].vaultCurrency.toUpperCase()} POT</Text>
                            </Flex>
                            <Flex flexDirection='column' p="10px 0 0 40px" style={{ width: '100%' }}>
                                <Text color="lightgreen" fontSize="20px" bold>Winner</Text>
                                {winners[vpotInfo.no].length > 0 && winners[vpotInfo.no].map((winner) => {
                                    return (
                                        <Flex justifyContent="space-between" flexDirection='column' mb='10px'>
                                            <Flex alignItems='center'>
                                                <Icon icon="fluent:wallet-28-filled" width={20} />
                                                <Text color="lightgrey" ml='3px'>{winner.winnerWallet.slice(0, 10)}...{winner.winnerWallet.slice(-10)}</Text>
                                            </Flex>
                                            <Flex alignItems='center' onClick={() => window.open(`https://bscscan.com/tx/${winner.transactionHash}`, '_blank')} style={{ cursor: 'pointer' }}>
                                                <Icon icon="fluent:reward-12-filled" width={20} />
                                                <Text color="lightgrey" ml='3px'>{winner.winAmount} {vpotType.toUpperCase()}</Text>
                                                <Icon icon="line-md:external-link-rounded" color="lightgrey" />
                                            </Flex>
                                        </Flex>
                                    )
                                })}
                                <Flex flexDirection='column' p='10px' pt='5px' style={{ borderTop: '1px dotted #2d74c4', width: '100%' }}>
                                    <Flex alignItems='flex-start' justifyContent='space-between' style={{ cursor: 'pointer' }} onClick={() => setShowDrawDetail(!showDrawDetail)}>
                                        <Text fontSize="18px" bold>Details</Text>
                                        <ExpandableSectionButton
                                            onClick={() => setShowDrawDetail(!showDrawDetail)}
                                            expanded={showDrawDetail}
                                        />
                                    </Flex>
                                    <ExpandingWrapper expanded={showDrawDetail}>
                                        <Flex flexDirection='column' p="0 5px 0 10px">
                                            <Flex justifyContent='space-between'>
                                                <Flex alignItems='center'>
                                                    <Icon icon="bi:cash-coin" width='18px' />
                                                    <Text ml='3px'>Staked:</Text>
                                                    <Text ml='3px'>{stakedBalance.toFixed(2)} CROX</Text>
                                                </Flex>
                                                {!ismobile && <button type="button" className="withdraw_btn" onClick={() => setIsWithdrawModalOpen(true)}>Withdraw</button>}
                                            </Flex>
                                            {ismobile && <button type="button" className="withdraw_btn" onClick={() => setIsWithdrawModalOpen(true)}>Withdraw</button>}
                                        </Flex>
                                    </ExpandingWrapper>
                                </Flex>
                            </Flex>
                        </Flex>}
                    </Flex>
                </Flex>
            </Flex>}
            {/* <LeaderBoard isPot /> */}
            <ReactModal isOpen={isWithdrawModalOpen} style={customStyles} bodyOpenClassName="modalBody">
                <WithdrawModal onDismiss={() => closeModal()} stakedBalance={stakedBalance} stakedAmountStr={stakedAmountStr} />
            </ReactModal>
        </Flex >
    )
}

export default PotBody
