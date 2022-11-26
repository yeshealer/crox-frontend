import React, { useState, useEffect } from "react";
import axios from 'axios'
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { usePriceCakeBusd } from "state/hooks";
import multicall from "utils/multicall";
import { getBalanceNumber } from "utils/formatBalance";
import vaultABI from "config/abi/babyvpot.json"
import jackPotABI from 'config/abi/babyjackpot.json'
import masterChefABI from 'config/abi/babymasterchef.json'
import cakePoolABI from 'config/abi/babypool.json'
import vpotsInfo from './VpotsInfo.json'

// eslint-disable-next-line import/prefer-default-export
export const useFetchBabyVault = () => {
    const vpotsData = JSON.parse(JSON.stringify(vpotsInfo)).vpotsInfo;
    const vpotInfo = vpotsData.filter(vpotData => vpotData.vaultCurrency === 'baby')[0];

    const { account } = useWallet();
    const cakePriceUsd = usePriceCakeBusd();
    const [stakerCount, setStakerCount] = useState<number>(0)
    const [stakedAmount, setStakedAmount] = useState<number>(0)
    const [rewardDebt, setRewardDebt] = useState<number>(0)
    const [pendingAmount, setPendingAmount] = useState<number>(0)
    const [totalFeeReward, setTotalFeeReward] = useState<number>(0)
    const [cakePrice, setCakePrice] = useState<number>(0)
    const [jackpotCounters, setJackPotCounters] = useState<number>(0)
    const [vaultTVL, setVaultTVL] = useState<number>(0)
    const [jackPotTVL, setJackPotTVL] = useState<number>(0)
    const [cakePerBlock, setCakePerBlock] = useState<number>(0)
    const [allocPoint, setAllocPoint] = useState<number>(0)
    const [totalSpecialAllocPoint, setTotalSpecialAllocPoint] = useState<number>(0)
    const [pricePerFullShare, setPricePerFullShare] = useState<number>(0)
    const [totalShares, setTotalShares] = useState<number>(0)
    const [jackpotEndTime, setJackpotEndTime] = useState<number>(0)
    const [jackpotTotalReward, setJackpotTotalReward] = useState<number>(0)
    const [userStartTime, setUserStartTime] = useState<number>(Date.now())
    const [pendingRewardPerUser, setPendingRewardPerUser] = useState<number>(0)

    const vaultContract = vpotInfo.vaultContractAddress
    const jackpotContract = vpotInfo.jackpotContractAddress
    const pancakeMasterChef = vpotInfo.pancakeMasterChefAddress
    const apyCalc = vpotInfo.apyCalcAddress
    const nativeToken = vpotInfo.nativeTokenAddress;
    const defaultWallet = "0x2B1158A279Fb4731497E72D6163E24aDEe9C0eF4";

    useEffect(() => {
        axios.get(`https://openapi.debank.com/v1/token?chain_id=bsc&id=${nativeToken}`).then(res => {
            setCakePrice((res.data as any).price)
        })
    })

    const vaultContractCalls = [
        {
            address: vaultContract,
            name: 'totalStakers'
        },
        {
            address: vaultContract,
            name: 'userInfo',
            params: [account || defaultWallet]
        },
        {
            address: vaultContract,
            name: 'totalReward'
        },
        {
            address: vaultContract,
            name: 'totalStaked'
        },
        {
            address: vaultContract,
            name: 'pendingReward',
            params: [account || defaultWallet]
        }
    ]

    const jackPotContractCall1 = [
        {
            address: jackpotContract,
            name: 'totalStakers'
        },
        {
            address: jackpotContract,
            name: 'totalStaked'
        },
        {
            address: jackpotContract,
            name: 'endTime'
        },
        {
            address: jackpotContract,
            name: 'totalRewards'
        }
    ]

    const APYContractCall = [
        {
            address: pancakeMasterChef,
            name: 'cakePerBlock'
        },
        {
            address: pancakeMasterChef,
            name: 'poolInfo',
            params: [0]
        },
        {
            address: pancakeMasterChef,
            name: 'totalAllocPoint'
        }
    ]

    const APYContractCall1 = [
        {
            address: apyCalc,
            name: 'getPricePerFullShare'
        },
        {
            address: apyCalc,
            name: 'totalShares'
        }
    ]

    useEffect(() => {
        (async () => {
            const [
                stakersCount,
                userInformation,
                // pendingAmountContract,
                totalRewardAmount,
                vaultTotalStaked,
                pendingReward
            ] = await multicall(vaultABI, vaultContractCalls)
            setStakerCount(getBalanceNumber(stakersCount, 0))
            setStakedAmount(parseInt(userInformation[0]._hex) / 10 ** 18)
            setRewardDebt(parseInt(userInformation[2]._hex) / 10 ** 18)
            setPendingAmount(getBalanceNumber(userInformation.babyAtLastUserAction._hex))
            setTotalFeeReward(getBalanceNumber(totalRewardAmount))
            setVaultTVL(getBalanceNumber(vaultTotalStaked))
            setUserStartTime(parseInt(userInformation[1]._hex))
            setPendingRewardPerUser(getBalanceNumber(pendingReward))
        })()
    })

    useEffect(() => {
        (async () => {
            const [
                stakersCount,
                jackpotTotalStaked,
                endTime,
                totalReward
            ] = await multicall(jackPotABI, jackPotContractCall1)
            setJackPotCounters(parseInt(stakersCount[0]._hex))
            setJackPotTVL(getBalanceNumber(jackpotTotalStaked))
            setJackpotEndTime(parseInt(endTime[0]._hex))
            setJackpotTotalReward(parseInt(totalReward[0]._hex) / (10 ** 18))
        })()
    })

    useEffect(() => {
        (async () => {
            const [cakePerBlockContract, poolInfo, totalAllocSpecialPoint] = await multicall(masterChefABI, APYContractCall)
            setCakePerBlock(parseInt(cakePerBlockContract[0]._hex))
            setAllocPoint(parseInt(poolInfo.allocPoint._hex))
            setTotalSpecialAllocPoint(parseInt(totalAllocSpecialPoint[0]._hex))
        })()
    })

    useEffect(() => {
        (async () => {
            const [getPricePerFullShare1, totalShares1] = await multicall(cakePoolABI, APYContractCall1)
            setPricePerFullShare(parseInt(getPricePerFullShare1[0]._hex))
            setTotalShares(parseInt(totalShares1[0]._hex))
        })()
    })

    const BSC_BLOCK_TIME = 3;
    const BLOCK_PER_YEAR = (60 / BSC_BLOCK_TIME) * 60 * 24 * 289;
    const totalCakePoolEmissionPerYear = cakePerBlock * allocPoint / totalSpecialAllocPoint * BLOCK_PER_YEAR
    const WeiPerEther = 10 ** 18
    const APY = totalCakePoolEmissionPerYear * WeiPerEther / pricePerFullShare / totalShares * 100

    const result = {
        stakerCount: stakerCount,
        feeUSDValue: totalFeeReward * cakePrice,
        APY: APY,
        endTime: jackpotEndTime,
        jackpotCounters: jackpotCounters,
        feeDistributed: pendingAmount - stakedAmount,
        totalValueLocked: vaultTVL * cakePrice / .95 + jackPotTVL * cakePriceUsd.toNumber(),
        totalFeeReward: totalFeeReward,
        jackpotTotalReward: jackpotTotalReward,
        rewardDebt: rewardDebt,
        userStartTime: userStartTime * 1000 > Date.now() + 1296000000 ? userStartTime : userStartTime * 1000,
        pendingRewardPerUser: pendingRewardPerUser
    }

    return result
}