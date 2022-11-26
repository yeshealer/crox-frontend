import React, { useState, useEffect } from "react";
import { Flex } from "crox-new-uikit";
import { useLocation } from 'react-router-dom';
import BigNumber from "bignumber.js";
import axios from 'axios'
import { useERC20 } from "hooks/useContract";
import { ethers } from "ethers";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import erc20ABI from "config/abi/erc20.json";
import cakevaultABI from "config/abi/vault.json"
import multicall from "utils/multicall";
import cakejackPotABI from 'config/abi/jackpot.json'
import masterChefABI from 'config/abi/masterchefv2.json'
import cakePoolABI from 'config/abi/cakePool.json'
import babyjackpotABI from 'config/abi/babyjackpot.json'
import babyvaultABI from 'config/abi/babyvpot.json'
import { getBalanceNumber } from "utils/formatBalance";
import VPotsHeader from "../VPotsHeader";
import VaultBody from "./VaultBody";
import vpotsInfo from '../VpotsInfo.json'
import LeaderBoard from "../components/LeaderBoard";
import '../vpots.scss'
import './vault.scss'

const Vault = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const vpotType = pathname.slice(pathname.lastIndexOf("/") + 1, pathname.length);
    const vpotsData = JSON.parse(JSON.stringify(vpotsInfo)).vpotsInfo;
    const vpotInfo = vpotsData.filter(vpotData => vpotData.vaultCurrency === vpotType)[0];

    const { account } = useWallet();
    const [isAllowance, setIsAllowance] = useState<number>(0)
    const [pendingAmount, setPendingAmount] = useState<number>(0)
    const [stakerCount, setStakerCount] = useState<number>(0)
    const [stakedAmount, setStakedAmount] = useState<number>(0)
    const [stakedAmountStr, setStakedAmountStr] = useState<string>('')
    const [cakePerBlock, setCakePerBlock] = useState<number>(0)
    const [allocPoint, setAllocPoint] = useState<number>(0)
    const [totalSpecialAllocPoint, setTotalSpecialAllocPoint] = useState<number>(0)
    const [pricePerFullShare, setPricePerFullShare] = useState<number>(0)
    const [totalShares, setTotalShares] = useState<number>(0)
    const [totalFeeReward, setTotalFeeReward] = useState<number>(0)
    const [nativeTokenPrice, setNativeTokenPrice] = useState<number>(0)
    const [jackpotEndTime, setJackpotEndTime] = useState<number>(0)
    const [pendingRewardPerUser, setPendingRewardPerUser] = useState<number>(0)
    const [claimedAmount, setClaimedAmount] = useState<number>(0)
    const [claimHistory, setClaimHistory] = useState([])
    const [feeReward, setFeeReward] = useState<number>(0)

    const vaultContract = vpotInfo.vaultContractAddress;
    const jackpotContract = vpotInfo.jackpotContractAddress;
    const pancakeMasterChef = vpotInfo.pancakeMasterChefAddress;
    const apyCalc = vpotInfo.apyCalcAddress;
    const nativeToken = vpotInfo.nativeTokenAddress;
    const totalAllocPoint = vpotInfo.totalAllocPoint;
    const defaultWallet = "0x2B1158A279Fb4731497E72D6163E24aDEe9C0eF4";

    useEffect(() => {
        axios.get(`https://openapi.debank.com/v1/token?chain_id=bsc&id=${nativeToken}`).then(res => {
            setNativeTokenPrice((res.data as any).price)
        })
    }, [account])

    const ContractCalls = [
        {
            address: vaultContract,
            name: 'userInfo',
            params: [account || defaultWallet]
        },
        {
            address: vaultContract,
            name: 'totalStakers'
        },
        {
            address: vaultContract,
            name: 'totalReward'
        },
        {
            address: vaultContract,
            name: 'pendingReward',
            params: [account || defaultWallet]
        }
    ]

    const APYContractCall = [
        {
            address: pancakeMasterChef,
            name: 'cakePerBlock',
            params: [false]
        },
        {
            address: pancakeMasterChef,
            name: 'poolInfo',
            params: [0]
        },
        {
            address: pancakeMasterChef,
            name: totalAllocPoint
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

    const jackPotContractCalls = [
        {
            address: jackpotContract,
            name: 'endTime'
        },
        {
            address: jackpotContract,
            name: 'totalRewards'
        }
    ]

    const cakeTokenCalls = [
        {
            address: nativeToken,
            name: "allowance",
            params: [account || defaultWallet, vaultContract]
        }
    ]

    useEffect(() => {
        (async () => {
            const [
                userInformation,
                // pendingAmountContract,
                stakersCount,
                totalRewardAmount,
                pendingReward
            ] = await multicall(vpotType === 'cake' ? cakevaultABI : babyvaultABI, ContractCalls)
            setStakedAmount(getBalanceNumber(userInformation[0]._hex))
            setStakedAmountStr((new BigNumber(userInformation[0]._hex).toJSON()).toString())
            setPendingAmount(getBalanceNumber(userInformation.babyAtLastUserAction._hex))
            setFeeReward(getBalanceNumber(userInformation.accShare._hex))
            setStakerCount(getBalanceNumber(stakersCount, 0))
            setTotalFeeReward(getBalanceNumber(totalRewardAmount))
            setPendingRewardPerUser(getBalanceNumber(pendingReward))
            setClaimedAmount(parseInt(userInformation[3]._hex) / 10 ** 18)
        })();
    })

    useEffect(() => {
        (async () => {
            const [
                cakePerBlock1,
                poolInfo1,
                totalAllocSpecialPoint1
            ] = await multicall(masterChefABI, APYContractCall)
            setCakePerBlock(parseInt(cakePerBlock1[0]._hex))
            setAllocPoint(parseInt(poolInfo1.allocPoint._hex))
            setTotalSpecialAllocPoint(parseInt(totalAllocSpecialPoint1[0]._hex))
        })()
    })

    useEffect(() => {
        (async () => {
            const [getPricePerFullShare1, totalShares1] = await multicall(cakePoolABI, APYContractCall1)
            setPricePerFullShare(parseInt(getPricePerFullShare1[0]._hex))
            setTotalShares(parseInt(totalShares1[0]._hex))
        })()
    })

    useEffect(() => {
        (async () => {
            const rawAllowance = await multicall(erc20ABI, cakeTokenCalls)
            setIsAllowance(new BigNumber(rawAllowance[0]).toNumber())
        })();
    })

    useEffect(() => {
        (async () => {
            const [endTime] = await multicall(vpotType === 'cake' ? cakejackPotABI : babyjackpotABI, jackPotContractCalls)
            setJackpotEndTime(parseInt(endTime[0]._hex))
        })()
    })

    let isApproved = false;
    if (account && isAllowance > 0) {
        isApproved = true
    }

    const contract = useERC20(nativeToken)

    const handleApprove = async () => {
        await contract.methods.approve(vaultContract, ethers.constants.MaxUint256).send({ from: account });
    }

    const BSC_BLOCK_TIME = 3;
    const BLOCK_PER_YEAR = (60 / BSC_BLOCK_TIME) * 60 * 24 * 289;
    const totalCakePoolEmissionPerYear = cakePerBlock * allocPoint / totalSpecialAllocPoint * BLOCK_PER_YEAR
    const WeiPerEther = 10 ** 18
    const APY = totalCakePoolEmissionPerYear * WeiPerEther / pricePerFullShare / totalShares * 100;

    useEffect(() => {
        axios.get(`https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${nativeToken}&address=${account}&startblock=19491000&apikey=AHCXXG173BJJR2NQJKVTAPNX6ZBXRCFSWQ`).then(res => {
            const finalResults = []
            const resultHashes = []
            const results = (res.data as any).result.filter(transaction => transaction.from.toUpperCase() === vaultContract.toUpperCase() && (parseInt(transaction.value) / 10 ** parseInt(transaction.tokenDecimal)) < (pendingRewardPerUser + claimedAmount))
            results.map((result) => (
                !resultHashes.includes(result.hash) && (
                    resultHashes.push(result.hash),
                    finalResults.push(result)
                )
            ))
            setClaimHistory(finalResults)
        })
    }, [account, claimedAmount, pendingRewardPerUser])

    return (
        <Flex justifyContent='center' flexDirection='column' alignItems='center'>
            <VPotsHeader title="VAULT" />
            <VaultBody
                isApproved={isApproved}
                handleApprove={handleApprove}
                stakedBalance={stakedAmount}
                stakerCount={stakerCount}
                feeDistributed={feeReward}
                totalPrize={nativeTokenPrice * totalFeeReward}
                totalFeeReward={totalFeeReward}
                jackpotEndTime={jackpotEndTime}
                pendingRewardPerUser={pendingRewardPerUser}
                claimedAmount={claimedAmount}
                stakedAmountStr={stakedAmountStr}
                claimHistory={claimHistory}
                vaultContract={vaultContract}
                nativeTokenPrice={nativeTokenPrice}
                nativeToken={nativeToken}
                vpotInfo={vpotInfo}
                APY={APY}
            />
            {/* <LeaderBoard isPot={false} claimHistory={claimHistory} /> */}
        </Flex>
    )
}

export default Vault