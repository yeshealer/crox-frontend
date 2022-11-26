import React from "react";
import BigNumber from "bignumber.js";
import { IconButton, useModal } from "crox-new-uikit";
import { AiOutlineCalculator } from 'react-icons/ai'
import { Address } from "config/constants/types";
import ApyCalculatorModal from "./ApyCalculatorModal";

export interface ApyButtonProps {
  lpLabel?: string;
  cakePrice?: BigNumber;
  apy?: BigNumber;
  quoteTokenAdresses?: Address;
  quoteTokenSymbol?: string;
  tokenAddresses: Address;
  symbol?: string;
}

const ApyButton: React.FC<ApyButtonProps> = ({
  lpLabel,
  quoteTokenAdresses,
  quoteTokenSymbol,
  tokenAddresses,
  cakePrice,
  apy,
  symbol,
}) => {
  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      lpLabel={lpLabel}
      quoteTokenAdresses={quoteTokenAdresses}
      quoteTokenSymbol={quoteTokenSymbol}
      tokenAddresses={tokenAddresses}
      cakePrice={cakePrice}
      apy={apy}
      symbol={symbol}
    />
  );

  return (
    <IconButton onClick={onPresentApyModal} variant="text" size="sm" ml="4px">
      <AiOutlineCalculator fontSize='20px' color='#2d74c4' />
    </IconButton>
  );
};

export default ApyButton;
