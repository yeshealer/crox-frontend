/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Card, CardBody, Text, Flex, Button, Link } from "crox-new-uikit";
import BigNumber from "bignumber.js";
import Countdown, { zeroPad } from "react-countdown";
import { ethers } from "ethers";
import multicall from "utils/multicall";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import styled from "styled-components";
import { GiThumbUp } from 'react-icons/gi'
import erc20ABI from "config/abi/erc20.json";
import { useERC20 } from "hooks/useContract";
import vaultABI from "config/abi/vault.json"
import masterChefABI from 'config/abi/masterchefv2.json'
import cakePoolABI from 'config/abi/cakePool.json'
import { getBalanceNumber } from "utils/formatBalance";
import VaultCard from "views/VPots/Vault/VaultCard";
import vpotsInfo from '../../VPots/VpotsInfo.json';
import 'views/VPots/Vault/vault.scss'
import "./TopFarm.scss";

const StyledCakeStats = styled(Card)`
  border: 2px solid #3b3c4e;
  background: #2c2d3a;
  margin: 10px;
  border-top-left-radius: 10px;
  border-bottom-right-radius: 10px;
  height: 100%;
  display: flex;
  align-item: center;
  justify-content: center;
  box-shadow: 0 3px 6px rgb(0 0 0 / 25%), 0 2px 2px rgb(0 0 0 / 22%);
  & .swiper-button-prev:after,
  & .swiper-button-next:after {
    opacity: 0.5 !important;
    font-size: 20px !important;
  }
  @media screen and (max-width: 800px) {
    margin: 0;
    margin-bottom: 20px;
    border: none;
  }
`;

export interface FarmsProps {
  tokenMode?: boolean;
}

const TwitterCard = () => {
  const vpotsData = JSON.parse(JSON.stringify(vpotsInfo)).Home[0];

  const vaultContract = vpotsData.vaultContractAddress;
  const nativeToken = vpotsData.nativeTokenAddress;
  const pancakeMasterChef = vpotsData.pancakeMasterChefAddress;
  const apyCalc = vpotsData.apyCalcAddress;
  const defaultWallet = "0x2B1158A279Fb4731497E72D6163E24aDEe9C0eF4";

  const { account } = useWallet();
  const [isAllowance, setIsAllowance] = useState<number>(0)
  const [stakedAmount, setStakedAmount] = useState<number>(0)
  const [cakePerBlock, setCakePerBlock] = useState<number>(0)
  const [allocPoint, setAllocPoint] = useState<number>(0)
  const [pricePerFullShare, setPricePerFullShare] = useState<number>(0)
  const [stakedAmountStr, setStakedAmountStr] = useState<string>('')
  const [totalShares, setTotalShares] = useState<number>(0)
  const [totalSpecialAllocPoint, setTotalSpecialAllocPoint] = useState<number>(0)
  const [totalFeeReward, setTotalFeeReward] = useState<number>(0)
  const [nativeTokenPrice, setNativeTokenPrice] = useState<number>(0)

  useEffect(() => {
    axios.get(`https://openapi.debank.com/v1/token?chain_id=bsc&id=${nativeToken}`).then(res => {
      setNativeTokenPrice((res.data as any).price)
    })
  }, [account])

  const cakeTokenCalls = [
    {
      address: nativeToken,
      name: "allowance",
      params: [account || defaultWallet, vaultContract]
    }
  ]

  const ContractCalls = [
    {
      address: vaultContract,
      name: 'userInfo',
      params: [account || defaultWallet]
    },
    {
      address: vaultContract,
      name: 'totalReward'
    },
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
      name: 'totalSpecialAllocPoint'
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
      const [cakePerBlock1, poolInfo1, totalAllocSpecialPoint1] = await multicall(masterChefABI, APYContractCall)
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
      const [
        userInformation,
        totalRewardAmount
      ] = await multicall(vaultABI, ContractCalls)
      setStakedAmount(parseInt(userInformation[0]._hex) / 10 ** 18)
      setStakedAmountStr((new BigNumber(userInformation[0]._hex).toJSON()).toString())
      setTotalFeeReward(getBalanceNumber(totalRewardAmount))
    })();
  })

  useEffect(() => {
    (async () => {
      const rawAllowance = await multicall(erc20ABI, cakeTokenCalls)
      setIsAllowance(new BigNumber(rawAllowance[0]).toNumber())
    })();
  })

  let isApproved = false;
  if (account && isAllowance > 0) {
    isApproved = true
  }

  const contract = useERC20("0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82")

  const handleApprove = async () => {
    await contract.methods.approve(vaultContract, ethers.constants.MaxUint256).send({ from: account });
  }

  const BSC_BLOCK_TIME = 3;
  const BLOCK_PER_YEAR = (60 / BSC_BLOCK_TIME) * 60 * 24 * 365;
  const totalCakePoolEmissionPerYear = cakePerBlock * allocPoint / totalSpecialAllocPoint * BLOCK_PER_YEAR;
  const WeiPerEther = 10 ** 18;
  const APY = totalCakePoolEmissionPerYear * WeiPerEther / pricePerFullShare / totalShares * 100;

  return (
    <Flex flex="auto" flexDirection="column" justifyContent="center">
      <div className="twitter">
        <div className="twitter__price-tag" style={{ top: "0px", left: "0px" }}>
          <GiThumbUp />
          <p className="twitter__price-tag-price">VAULTS & JACKPOTS</p>
        </div>
      </div>
      <StyledCakeStats>
        <CardBody className="card-body">
          <VaultCard
            isApproved={isApproved}
            handleApprove={handleApprove}
            stakedBalance={stakedAmount}
            stakedAmountStr={stakedAmountStr}
            totalFeeReward={totalFeeReward}
            nativeTokenPrice={nativeTokenPrice}
            vaultContract={vaultContract}
            nativeToken={nativeToken}
            isHomepage={true}
            APY={APY}
            vpotInfo={vpotsData}
          />
        </CardBody>
      </StyledCakeStats>
    </Flex>
  );
};

export default TwitterCard;
