import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { Button, Flex, Heading, Text } from "crox-uikit";
import useI18n from "hooks/useI18n";
import { usePriceCakeBusd } from "state/hooks";
import { useCompound, useHarvest } from "hooks/useHarvest";
import { getBalanceNumber } from "utils/formatBalance";
import styled from "styled-components";
import useStake from "../../../../hooks/useStake";

interface FarmCardActionsProps {
  earnings?: BigNumber;
  pid?: number;
  compound?: boolean;
  nextHarvestUntil?: number;
  harvestInterval?: number;
}

const BalanceAndCompound = styled.div`
  display: flex;
  flex-direction: column;
`;

const Harvest = styled.div`
  display: none;
  @media screen and (max-width: 1000px) {
    display: block;
  }
`;

const HarvestAction: React.FC<FarmCardActionsProps> = ({
  pid,
  earnings,
  compound,
  harvestInterval,
  nextHarvestUntil,
}) => {
  const TranslateString = useI18n();
  const [pendingTx, setPendingTx] = useState(false);
  const { onReward } = useHarvest(pid);
  const { onStake } = useStake(pid);
  const { onCompound } = useCompound(pid);

  const rawEarningsBalance = getBalanceNumber(earnings);
  const displayBalance = rawEarningsBalance.toLocaleString();

  const today = new Date().getTime() / 1000;
  const cakePriceUsd = usePriceCakeBusd();
  const croxEarnedUsd = cakePriceUsd.multipliedBy(rawEarningsBalance);

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Flex flexDirection='column'>
        <Flex>
          <Text
            bold
            textTransform="uppercase"
            color="#2d74c4"
            fontSize="15px"
            pr="3px"
          >
            CROX
          </Text>
          <Text bold textTransform="uppercase" fontSize="15px" color='textSubtle'>
            {TranslateString(999, "Earned")}
          </Text>
        </Flex>
        <Text>
          <Text fontSize="18px" color='textSubtle' bold>{displayBalance}</Text>
          <Text fontSize="18px" color='textSubtle' bold>${croxEarnedUsd.toFixed(4)}</Text>
        </Text>
      </Flex>
      <BalanceAndCompound>
        {compound ? (
          <Button
            disabled={rawEarningsBalance === 0 || pendingTx}
            size="sm"
            variant="secondary"
            onClick={async () => {
              setPendingTx(true);
              await onCompound();
              setPendingTx(false);
            }}
            mb='5px'
            style={{ borderRadius: '5px', borderColor: '#2d74c4', color: '#2d74c4', width: 'auto' }}
          >
            {TranslateString(999, "Compound")}
          </Button>
        ) : null}
        {(rawEarningsBalance === 0 || pendingTx || today < nextHarvestUntil) ? (
          <Button disabled style={{ borderRadius: '5px', height: '32px', width: 'auto' }}>Harvest</Button>
        ) : (
          <Button
            onClick={async () => {
              setPendingTx(true);
              await onReward();
              setPendingTx(false);
            }}
            style={{ borderRadius: "5px", height: '32px', width: 'auto' }}
          >
            Harvest
          </Button>
        )}
        <Harvest>
          <Text fontSize="12px">
            {TranslateString(10006, "Harvest Lock: ")}
            {harvestInterval} hours
          </Text>
        </Harvest>
      </BalanceAndCompound>
    </Flex>
  );
};

export default HarvestAction;
