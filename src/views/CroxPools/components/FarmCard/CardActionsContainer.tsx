import React, { useMemo, useState, useCallback } from "react";
import { Button, Flex, Text, Link, LinkExternal } from "crox-uikit";
import BigNumber from "bignumber.js";
import styled, { keyframes } from "styled-components";
import { provider } from "web3-core";
import { getContract } from "utils/erc20";
import contracts from "config/constants/contracts";
import { Farm } from "state/types";
import { useCroxPoolFromPid, useCroxPoolUser } from "state/hooks";
import useI18n from "hooks/useI18n";
import UnlockButton from "components/UnlockButton";
import { useApprove } from "hooks/useApprove";

import StakeAction from "./StakeAction";
import HarvestAction from "./HarvestAction";

const Action = styled.div`
  margin-top: 1%;
  padding-bottom: 1%;
  display: -webkit-box;
  width: 100%;
  @media screen and (max-width: 1000px) {
    padding: 0 5%;
    text-align: -webkit-center;
    width: 100%;
    display: inline-block;
  } 
`;


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
  border-radius: 16px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`;

const HarvestContainer = styled.div`
  width: 35%;
  border: 1px solid #2c2d3a;
  border-radius: 10px;
  padding: 10px;
  margin: 0 2%;
  @media screen and (max-width: 1000px) {
    width: 98%;
    margin: 0.8%;
  } 
`;

const StakeContainer = styled.div`
  width: 35%;
  border: 1px solid #2c2d3a;
  border-radius: 10px;
  padding: 10px;
  margin: 0 1%;
  @media screen and (max-width: 1000px) {
    width: 98%;
    margin: 1%;
  } 
`;

const MultiplierTag = styled.div`
  display: none;
  @media screen and (max-width: 1000px) {
    display: block;
  }
`;

const Fee = styled.div`
  display: none;
  @media screen and (max-width: 1000px) {
    display: block;
  }
`;

const Detailsection = styled.div`
  display: none;
  @media screen and (max-width: 1000px) {
    width: 98%;
    margin: 5% 1% 1.2% 1%;
    border: 1px solid #2c2d3a;
    padding: 15px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
  }
`;

const DetailSectionsContainer = styled.div`
  margin: 0 2%;
  @media screen and (max-width: 1000px) {
    text-align: center;
    width: 98%;
    margin: 1%;
  } 
`;

const StyledLinkExternal = styled(LinkExternal)`
  text-decoration: none;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.textSubtle};
  display: flex;
  align-items: center;

  svg {
    padding-left: 4px;
    height: 18px;
    width: auto;
    fill: ${({ theme }) => theme.colors.primary};
  }
`;

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber;
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue;
  ethereum?: provider;
  account?: string;
  lpLabel?: string;
  bscScanAddress?: string;
  removed?: boolean;
  harvestInterval?: any;
  tokenSymbol?: string;
}

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;

const CardActions: React.FC<FarmCardActionsProps> = ({
  farm,
  ethereum,
  account,
  lpLabel,
  bscScanAddress,
  removed,
  harvestInterval,
  tokenSymbol,
}) => {
  const TranslateString = useI18n();
  const [requestedApproval, setRequestedApproval] = useState(false);
  const {
    pid,
    lpAddresses,
    tokenAddresses,
    depositFeeBP,
  } = useCroxPoolFromPid(farm.pid);
  const {
    allowance,
    tokenBalance,
    stakedBalance,
    earnings,
    nextHarvestUntil,
  } = useCroxPoolUser(pid);
  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID];
  const tokenAddress = tokenAddresses[process.env.REACT_APP_CHAIN_ID];
  const lpName = farm.lpSymbol.toUpperCase();
  const isApproved = account && allowance && allowance.isGreaterThan(0);
  const isCroxPool =
    String(farm.lpAddresses[CHAIN_ID]).toLowerCase() ===
    String(contracts.cake[CHAIN_ID]).toLowerCase();

  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, lpAddress);
  }, [ethereum, lpAddress]);

  const { onApprove } = useApprove(lpContract);

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      await onApprove();
      setRequestedApproval(false);
    } catch (e) {
      console.error(e);
    }
  }, [onApprove]);

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <>
        <StakeAction
          stakedBalance={stakedBalance}
          tokenBalance={tokenBalance}
          tokenName={lpName}
          pid={pid}
          farm={farm}
          depositFeeBP={depositFeeBP}
          tokenDecimal={(farm as any).tokenDecimals}
          lpLabel={lpLabel}
          lpAddresses={lpAddresses}
          lpWorth={farm.tokenPrice}
        />
      </>
    ) : (
      <>
        <Flex>
          <Text
            bold
            textTransform="uppercase"
            color="#2d74c4"
            fontSize="15px"
            pr="3px"
          >
            {lpName}
          </Text>
          <Text bold textTransform="uppercase" fontSize="15px" color="textSubtle">
            {TranslateString(999, "Staked")}
          </Text>
        </Flex>
        <Button
          mt="8px"
          disabled={requestedApproval}
          onClick={handleApprove}
          style={{ fontSize: "18px", width: "100%", borderRadius: "5px", backgroundColor: '#2d74c4' }}
        >
          {requestedApproval ? "Approving..." : TranslateString(999, "Approve Contract")}
        </Button>
      </>
    );
  };

  return (
    <>
      <Action>
        {lpLabel === "CROX" && <StyledCardAccent />}
        {(tokenSymbol === "CROX") ? (
          <StyledCardAccent />
        ) : (<div />)}
        {removed ? (<div />) : (
          <Detailsection>
            <MultiplierTag>
              <Text fontSize="15px" bold color="#2d74c4">
                Multiplier
              </Text>
              <Text fontSize="15px" bold>
                {farm.multiplier}
              </Text>
            </MultiplierTag>
            <Fee>
              <Text fontSize="15px" bold color="#2d74c4">
                Fee
              </Text>
              <Text bold fontSize="15px">
                {farm.depositFeeBP / 100}%
              </Text>
            </Fee>
          </Detailsection>
        )}
        <HarvestContainer>
          <HarvestAction
            pid={pid}
            harvestInterval={harvestInterval}
            earnings={earnings}
            compound={isCroxPool}
            nextHarvestUntil={Number(nextHarvestUntil)}
          />
        </HarvestContainer>
        <StakeContainer>
          {!account ? (
            <>
              <Flex>
                <Text
                  bold
                  textTransform="uppercase"
                  color="#2d74c4"
                  fontSize="15px"
                  pr="3px"
                >
                  {lpName}
                </Text>
                <Text bold textTransform="uppercase" fontSize="15px" color="textSubtle">
                  {TranslateString(999, "Staked")}
                </Text>
              </Flex>
              <UnlockButton mt="8px" fullWidth style={{ borderRadius: '5px' }} />
            </>
          ) : (
            renderApprovalOrStakeButton()
          )}
        </StakeContainer>
        <DetailSectionsContainer>
          <Flex justifyContent="space-between">
            <StyledLinkExternal
              href={`https://exchange.croxswap.com/#/swap/${lpAddresses[process.env.REACT_APP_CHAIN_ID]}`}
            >
              <Text fontSize="18px" color="primary" bold>Get {lpLabel}</Text>
            </StyledLinkExternal>
          </Flex>
          <Flex justifyContent="flex-start">
            <Link external href={bscScanAddress} bold={false}>
              <Text fontSize="18px" color="primary" bold>{TranslateString(356, "View on BscScan")}</Text>
            </Link>
          </Flex>
        </DetailSectionsContainer>
      </Action>
    </>
  );
};

export default CardActions;
