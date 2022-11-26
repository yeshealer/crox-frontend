import React, { useState, useEffect } from "react";
import { Flex, Text } from "crox-new-uikit";
import { useHistory, useLocation } from "react-router-dom";
import axios from 'axios'
import Web3 from 'web3'
import BigNumber from "bignumber.js";
import { useCake, useJackPotContract } from "hooks/useContract";
import { usePriceCakeBusd } from "state/hooks";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import erc20ABI from "config/abi/erc20.json";
import vaultABI from 'config/abi/vault.json';
import jackPotABI from "config/abi/jackpot.json";
import multicall from "utils/multicall";
import { getBalanceNumber } from "utils/formatBalance";
import Warning from "../animation/Warning";
import VPotsHeader from "../VPotsHeader";
import vpotsInfo from '../VpotsInfo.json'
// eslint-disable-next-line import/no-named-as-default
import PotBody from "./PotBody";
import '../vpots.scss';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ethers } = require("ethers");

const Pot = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const vpotType = pathname.slice(pathname.lastIndexOf("/") + 1, pathname.length);
    const vpotsData = JSON.parse(JSON.stringify(vpotsInfo)).vpotsInfo;
    const vpotInfo = vpotsData.filter(vpotData => vpotData.vaultCurrency === vpotType)[0];

    const { account } = useWallet();
    const cakePriceUsd = usePriceCakeBusd();
    const history = useHistory();
    const [isAllowance, setIsAllowance] = useState<number>(0)
    const [stakedBalance, setStakedBalance] = useState<number>(0)
    const [stakedAmountStr, setStakedAmountStr] = useState<string>('')
    const [jackpotCounters, setJackPotCounters] = useState<number>(0)
    const [vaultCounters, setVaultCounters] = useState<number>(0)
    const [jackpotTVL, setJackpotTVL] = useState<number>(0)
    const [vaultTVL, setVaultTVL] = useState<number>(0)
    const [totalFeeReward, setTotalFeeReward] = useState<number>(0)
    const [nativeTokenPirce, setNativeTokenPrice] = useState<number>(0)
    const [cakeEarned, setCakeEarned] = useState<number>(0)
    const [userStartTime, setUserStartTime] = useState<number>(Date.now())
    const [vaultStakeAmount, setVaultStakeAmount] = useState<number>(0)
    const [jackpotRewardEndTime, setJackpotRewardEndTime] = useState<number>(Date.now())
    const [jackpotEntryDuration, setJackpotEntryDuration] = useState<number>(0)
    const [jackpotEndTime, setJackpotEndTime] = useState<number>(Date.now())
    const [jackpotEndBlock, setJackpotEndBlock] = useState<string>("")
    const [claimHistory, setClaimHistory] = useState([])

    const vaultContract = vpotInfo.vaultContractAddress;
    const jackpotContract = vpotInfo.jackpotContractAddress;
    const nativeToken = vpotInfo.nativeTokenAddress;
    const croxToken = vpotInfo.croxTokenAddress;
    const blockNum = vpotInfo.blockno;
    const jackpotData = vpotInfo.jackpotInfo[0];
    const winners = vpotsData.map(vpotData => {
        return vpotData.winnerInfo
    });
    const defaultWallet = "0x2B1158A279Fb4731497E72D6163E24aDEe9C0eF4";

    useEffect(() => {
        axios.get(`https://openapi.debank.com/v1/token?chain_id=bsc&id=${nativeToken}`).then(res => {
            setNativeTokenPrice((res.data as any).price)
        })
    }, [account])

    // const getCovalentApiUrl = (startBlock, endBlock) => {
    //     const covalentApiRootUrl = "https://api.covalenthq.com/v1";
    //     const networkId = "56";
    //     const topics = ethers.utils.id("Deposit(address,uint256,uint256)");
    //     const apiKey = "ckey_24dbbfa993f7428b8660b668e43";
    //     const pageSize = 100000;
    //     return `${covalentApiRootUrl}/${networkId}/events/topics/${topics}/?starting-block=${startBlock}&ending-block=${endBlock}&page-size=${pageSize}&key=${apiKey}&sender-address=${jackpotContract}`;
    // };

    // const web3 = new Web3("https://bsc-mainnet.gateway.pokt.network/v1/lb/6136201a7bad1500343e248d")

    // useEffect(() => {
    //     (async () => {
    //         const latestBlock = await web3.eth.getBlockNumber()
    //         setJackpotEndBlock(latestBlock.toString())
    //     })()
    // })

    // const covalentApiUrl = getCovalentApiUrl("19921233", jackpotEndBlock)
    // useEffect(() => {
    //     axios.get(covalentApiUrl).then(res => {
    //         const midResults = (res.data as any).data.items;
    //     })
    // })

    const jackPotContractCall = [
        {
            address: jackpotContract,
            name: 'totalStakers'
        },
        {
            address: jackpotContract,
            name: "userInfo",
            params: [account || defaultWallet]
        },
        {
            address: jackpotContract,
            name: "pendingReward",
            params: [account || defaultWallet]
        },
        {
            address: jackpotContract,
            name: "lastRewardTime"
        },
        {
            address: jackpotContract,
            name: "entryDuration"
        },
        {
            address: jackpotContract,
            name: "endTime"
        },
        {
            address: jackpotContract,
            name: 'totalStaked'
        },
    ]

    const vaultContractCalls = [
        {
            address: vaultContract,
            name: 'totalReward'
        },
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
            name: 'totalStaked'
        },
    ]

    useEffect(() => {
        (async () => {
            const cakeTokenCalls = [
                {
                    address: croxToken,
                    name: "allowance",
                    params: [account || defaultWallet, jackpotContract]
                }
            ]
            const rawAllowance = await multicall(erc20ABI, cakeTokenCalls)
            setIsAllowance(new BigNumber(rawAllowance[0]).toNumber())
        })();
    })

    useEffect(() => {
        (async () => {
            const [
                totalRewardAmount,
                userInformation,
                totalStakers,
                totalStaked
            ] = await multicall(vaultABI, vaultContractCalls)
            setTotalFeeReward(getBalanceNumber(totalRewardAmount))
            setUserStartTime(parseInt(userInformation[1]._hex))
            setVaultStakeAmount(parseInt(userInformation[0]._hex) / 10 ** 18)
            setVaultCounters(parseInt(totalStakers[0]._hex))
            setVaultTVL(getBalanceNumber(totalStaked))
        })();
    })

    useEffect(() => {
        (async () => {
            const [
                stakerCount,
                userInfo,
                pendingReward,
                lastRewardTime,
                entryDuration,
                endTime,
                totalStaked
            ] = await multicall(jackPotABI, jackPotContractCall);
            const newJackPotContractCall = [
                {
                    address: jackpotContract,
                    name: "stakedAmount",
                    params: [parseInt(userInfo.stakeId._hex)]
                }
            ]
            const stakedAmount = await multicall(jackPotABI, newJackPotContractCall)
            setStakedBalance(getBalanceNumber(stakedAmount[0]))
            setStakedAmountStr((new BigNumber(stakedAmount[0][0]._hex).toJSON()).toString())
            setJackPotCounters(parseInt(stakerCount[0]._hex))
            setCakeEarned(parseInt(pendingReward[0]._hex) / (10 ** 18))
            setJackpotRewardEndTime(parseInt(lastRewardTime[0]._hex) * 1000)
            setJackpotEntryDuration(parseInt(entryDuration[0]._hex))
            setJackpotEndTime(parseInt(endTime[0]._hex))
            setJackpotTVL(getBalanceNumber(totalStaked))
        })()
    })

    let isApproved = false
    if (account && isAllowance > 0) {
        isApproved = true;
    }

    const contract = useCake()

    const handleApprove = async () => {
        await contract.methods.approve(jackpotContract, ethers.constants.MaxUint256).send({ from: account });
    }

    useEffect(() => {
        axios.get(`https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${nativeToken}&address=${account}&startblock=19491000&apikey=AHCXXG173BJJR2NQJKVTAPNX6ZBXRCFSWQ`).then(res => {
            const finalResults = []
            const resultHashes = []
            const results = (res.data as any).result.filter(transaction => transaction.from.toUpperCase() === jackpotContract.toUpperCase())
            results.map((result) => (
                !resultHashes.includes(result.hash) && (
                    resultHashes.push(result.hash),
                    finalResults.push(result)
                )
            ))
            setClaimHistory(finalResults)
        })
    }, [account])

    return (
        <Flex justifyContent='center' flexDirection='column' alignItems='center'>
            <VPotsHeader title='POT' />
            <PotBody
                isApproved={isApproved}
                handleApprove={handleApprove}
                stakedBalance={stakedBalance}
                jackpotCounters={jackpotCounters}
                vaultCounters={vaultCounters}
                TVL={vaultTVL * nativeTokenPirce / .95 + jackpotTVL * cakePriceUsd.toNumber()}
                totalPrize={nativeTokenPirce * totalFeeReward}
                userStartTime={userStartTime * 1000}
                cakeEarned={cakeEarned}
                stakedAmountStr={stakedAmountStr}
                jackpotRewardEndTime={jackpotRewardEndTime}
                jackpotEntryDuration={jackpotEntryDuration / 3600}
                jackpotEndTime={jackpotEndTime * 1000}
                blockNum={blockNum}
                jackpotData={jackpotData}
                winners={winners}
                vpotType={vpotType}
                claimHistory={claimHistory}
                vpotInfo={vpotInfo}
                vpotsData={vpotsData}
            />
            {vaultStakeAmount <= 0 && <Flex id="claimWarningModal" flexDirection='column'>
                <Flex alignItems='center'>
                    <Warning />
                    <Flex flexDirection='column' justifyContent='flex-end' alignItems='flex-end'>
                        <Text color="#f44260" bold>Your wallet is not eligible for the Jackpot.</Text>
                        <button type="button" className="vaultDeposit" onClick={() => {
                            history.push(`/vpots/vault/${vpotType}`)
                        }}>Deposit now</button>
                    </Flex>
                </Flex>
            </Flex>}
        </Flex>
    )
}

export default Pot
