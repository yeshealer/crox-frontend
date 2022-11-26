import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import { Flex, Text } from 'crox-new-uikit'
import Countdown, { zeroPad } from 'react-countdown';
import { useMediaQuery } from '@mui/material'
import Vault from './components/Vault';
import Pot from './components/Pot';
import Switch from './components/Switch';
import Select from './components/Select';
import SelectOrange from './components/SelectOrange';
import RightArrow from './animation/RightArrow';
import DownArrow from './animation/DownArrow';
import ComingSoon from './animation/ComingSoon';
import vpotsInfo from './VpotsInfo.json'

interface VPotsFooterProps {
    stakerCount: number[];
    feeDistributed: number[];
    feeUSDValue: number[];
    jackpotCounters: number[];
    totalValueLocked: number[];
    APY: number[];
    totalFeeReward: number[];
    // endTime: number[];
    // jackpotTotalReward: number[];
    // rewardDebt: number[];
    // userStartTime: number[];
    pendingRewardPerUser: number[];
}

const VPotsFooter: React.FC<VPotsFooterProps> = ({
    stakerCount,
    feeDistributed,
    feeUSDValue,
    jackpotCounters,
    totalValueLocked,
    APY,
    totalFeeReward,
    pendingRewardPerUser
}) => {
    const [blockFlag, setBlockFlag] = useState(false)
    const [estimateTime, setEstimateTime] = useState(Date.now())
    const [totalStakers, setTotalStakers] = useState(0)
    const [totalValues, setTotalValues] = useState(0)

    const vpotsData = JSON.parse(JSON.stringify(vpotsInfo)).vpotsInfo;
    const upcomingData = JSON.parse(JSON.stringify(vpotsInfo)).upcoming;

    const clockStartRef = useRef(null)
    const handleStartGroup = () => clockStartRef.current.start()

    const ismobile = useMediaQuery("(max-width: 600px)")
    const renderer = ({ hours, minutes, seconds, days }) => {
        return <span>{zeroPad(days)}d:{zeroPad(hours)}h:{zeroPad(minutes)}m:{zeroPad(seconds)}s</span>;
    };

    useEffect(() => {
        axios.get("https://api.bscscan.com/api?module=block&action=getblockcountdown&blockno=20995099&apikey=XBAWBXPCJB2UNBI7JAAE14AANNMPMEERSC").then(res => {
            if ((res.data as any).result === 'Max rate limit reached') {
                setBlockFlag(blockFlag ? false : true)
            } else {
                const date = Date.now() + (res.data as any).result.EstimateTimeInSec * 1000 - 1600000
                setEstimateTime(date > 0 ? date : Date.now())
                handleStartGroup()
            }
        })
    }, [blockFlag])

    useEffect(() => {
        let stakersCount = 0;
        stakerCount.map(stakerCountOne => {
            stakersCount += stakerCountOne
            return false;
        })
        jackpotCounters.map(jackpotCounter => {
            stakersCount += jackpotCounter
            return false;
        })
        setTotalStakers(stakersCount)
    })

    useEffect(() => {
        let totalValue = 0;
        totalValueLocked.map(totalValueLockedOne => {
            totalValue += totalValueLockedOne
            return false;
        })
        setTotalValues(totalValue)
    })

    return (
        <Flex flexDirection='column' className='vpotsfooter' alignItems='center'>
            <Flex flexDirection={ismobile ? 'column' : 'row'} justifyContent="space-around" style={{ width: '100%' }}>
                <Flex flexDirection='column' alignItems='center'>
                    <Flex flexDirection='column' className='vpotsfooter__card' alignItems='center'>
                        <Text fontSize='18px' color='white' bold>TotalPlayers</Text>
                        <Text fontSize='18px' color='white' bold>{totalStakers}</Text>
                        <Text fontSize='14px' color='lightgrey'>Across all Vaults and Pots</Text>
                    </Flex>
                    {/* {!ismobile && <Switch />} */}
                </Flex>
                <Flex flexDirection='column' alignItems='center'>
                    <Flex flexDirection='column' className='vpotsfooter__card' alignItems='center'>
                        <Text fontSize='18px' color='white' bold>Total Value Locked</Text>
                        <Text fontSize='18px' color='white' bold>${totalValues.toFixed(3)}</Text>
                        <Text fontSize='14px' color='lightgrey'>Across all Vaults and Pots</Text>
                    </Flex>
                    {/* {!ismobile && <Select options={[
                        {
                            label: 'All Token',
                            value: 'all'
                        }
                    ]} />} */}
                </Flex>
                {/* <Flex flexDirection='column' alignItems='center'>
                    <Flex flexDirection='column' className='vpotsfooter__cardTotal' alignItems='center'>
                        <Flex justifyContent='space-between'>
                            <Flex flexDirection='column' alignItems='center' mr={40}>
                                <Text fontSize='18px' color='white' bold>Total Won</Text>
                                <Text fontSize='18px' color='white' mt='2px' bold>$500,895.44</Text>
                            </Flex>
                            <Flex flexDirection='column' alignItems='center'>
                                <Text fontSize='18px' color='white' bold>Current Prizes</Text>
                                <Text fontSize='18px' color='white' mt='2px' bold>$55,987.00</Text>
                            </Flex>
                        </Flex>
                        <Text fontSize='15px' color='white'>Across all Vaults and Pots</Text>
                    </Flex>
                    {!ismobile && <SelectOrange options={[
                        {
                            label: 'Prize',
                            value: 'prize'
                        },
                        {
                            label: 'APY',
                            value: 'apy'
                        },
                        {
                            label: 'Next Draw',
                            value: 'nextdraw'
                        }
                    ]} />}
                </Flex> */}
            </Flex>
            <Flex mt={20} alignItems='center' flexDirection="column">
                {vpotsData.map((vpotData, index) => {
                    return (
                        <Flex alignItems='center' flexDirection={ismobile ? "column" : "row"} mb="20px">
                            <Vault
                                index={index}
                                stakerCount={stakerCount}
                                feeDistributed={feeDistributed}
                                APY={APY}
                                totalFeeReward={totalFeeReward}
                                pendingRewardPerUser={pendingRewardPerUser}
                                vpotData={vpotData}
                            />
                            <Flex flexDirection='column' alignItems='center' className='vpotsfooter__middle'>
                                {!ismobile && (
                                    <>
                                        <Text fontSize='20px' bold>POT opens in</Text>
                                        <Text fontSize='20px' color='orange' bold>
                                            {vpotData.isFinished ? 'TBA' : <Countdown date={estimateTime} renderer={renderer} ref={clockStartRef} autoStart={false} />}
                                            {/* TBA */}
                                        </Text>
                                    </>
                                )}
                                {ismobile && (
                                    <Flex flexDirection='column' alignItems='center' className='vpotsfooter__middle'>
                                        <Text fontSize={ismobile ? '27px' : '20px'} bold>POT opens in</Text>
                                        <Text fontSize={ismobile ? '27px' : '20px'} color='orange' bold>
                                            {vpotData.isFinished ? 'TBA' : <Countdown date={estimateTime} renderer={renderer} ref={clockStartRef} autoStart={false} />}
                                            {/* TBA */}
                                        </Text>
                                    </Flex>
                                )}
                                <Flex mt={!ismobile && 20}>
                                    {ismobile ? <DownArrow /> : <RightArrow />}
                                </Flex>
                            </Flex>
                            <Pot
                                index={index}
                                feeUSDValue={feeUSDValue}
                                jackpotCounters={jackpotCounters}
                                vpotData={vpotData}
                            />
                        </Flex>
                    )
                })}
            </Flex>
            {/* <Flex alignSelf='flex-start' flexDirection='column'>
                <Flex alignItems='center'>
                    <ComingSoon />
                    <Text fontSize='30px' bold>Upcoming Vpots</Text>
                </Flex>
                {upcomingData.map((vpotData, index) => {
                    return (
                        <Vault
                            stakerCount={0}
                            feeDistributed={0}
                            APY={40.59}
                            totalFeeReward={0}
                            pendingRewardPerUser={0}
                            vpotData={vpotData}
                            isUpcoming
                        />)
                })}
            </Flex> */}
        </Flex>
    )
}

export default VPotsFooter