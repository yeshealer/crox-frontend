import React from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import {
  Button,
  Flex,
  IconButton,
  AddIcon,
  useModal,
  Text
} from "crox-new-uikit";
import { usePriceCakeBusd } from "state/hooks";
import useI18n from "hooks/useI18n";
import useStake from "hooks/useStake";
import useUnstake from "hooks/useUnstake";
import { getBalanceNumber } from "utils/formatBalance";
import DepositModal from "../DepositModal";
import WithdrawModal from "../WithdrawModal";

interface FarmCardActionsProps {
  farm?: any;
  stakedBalance?: BigNumber;
  tokenBalance?: BigNumber;
  tokenName?: string;
  pid?: number;
  depositFeeBP?: number;
  tokenDecimal?: number;
  lpLabel?: any
  lpWorth?: any
  lpAddresses?: any
}

const IconButtonWrapper = styled.div`
  width: 75%;
  margin-top: 5px;
  display: flex;
  text-align: left;
  svg {
    width: 20px;
  }
`;

const BtnGrp = styled.div`
  fontSize: "20px"; 
  width: "60%"; 
  marginLeft: "15%"; 
  text-align: "center";
  @media screen and (max-width: 1000px) {
    margin: -1%;
    text-align: left;
  } 
`;

const StakeAction: React.FC<FarmCardActionsProps> = ({
  farm,
  stakedBalance,
  tokenBalance,
  tokenName,
  pid,
  lpLabel,
  depositFeeBP,
  tokenDecimal,
  lpWorth,
  lpAddresses
}) => {
  const TranslateString = useI18n();
  const { onStake } = useStake(pid);
  const { onUnstake } = useUnstake(pid);

  const rawStakedBalance = getBalanceNumber(
    new BigNumber(stakedBalance),
    tokenDecimal
  );
  const displayBalance = rawStakedBalance.toLocaleString();

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={onStake}
      tokenName={tokenName}
      depositFeeBP={depositFeeBP}
      tokenDecimal={tokenDecimal}
      lpLabel={lpLabel}
      lpAddresses={lpAddresses}
    />
  );
  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={onUnstake}
      tokenName={tokenName}
      tokenDecimal={tokenDecimal}
    />
  );
  const cakePriceUsd = usePriceCakeBusd();
  let croxEarnedUsd = new BigNumber(lpWorth).multipliedBy(rawStakedBalance);
  if (tokenName === "CROX") {
    croxEarnedUsd = cakePriceUsd.multipliedBy(rawStakedBalance)
  }

  const renderStakingButtons = () => {
    return rawStakedBalance === 0 ? (
      <Button style={{ height: "32px", borderRadius: "5px", fontSize: '16px' }} onClick={onPresentDeposit}>{TranslateString(999, 'Stake')}</Button>
    ) : (
      <IconButtonWrapper>
        <Button size="sm" style={{ borderRadius: "5px", backgroundColor: "#483f5a", height: '32px', fontSize: '16px' }} onClick={onPresentWithdraw} mr="5px">
          Unstake
        </Button>
        <IconButton style={{ borderRadius: "5px", height: '32px', width: '32px', padding: 'revert' }} onClick={onPresentDeposit}>
          <AddIcon color="white" />
        </IconButton>
      </IconButtonWrapper>
    );
  };

  return (
    <Flex justifyContent='space-between' alignItems='center'>
      <Flex flexDirection='column'>
        <Flex>
          <Text
            bold
            textTransform="uppercase"
            color="#2d74c4"
            fontSize="15px"
            pr="3px"
          >
            {tokenName}
          </Text>
          <Text bold textTransform="uppercase" fontSize="15px" color="textSubtle">
            {TranslateString(999, "Staked")}
          </Text>
        </Flex>
        <Text style={{ fontSize: "18px" }} color='textSubtle' bold>{displayBalance}</Text>
        <Text style={{ fontSize: "18px" }} color='textSubtle' bold>${croxEarnedUsd.toFixed(3)}</Text>
      </Flex>
      <BtnGrp>
        {renderStakingButtons()}
      </BtnGrp>
    </Flex>
  );
};

export default StakeAction;
