import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from 'crox-new-uikit'

export interface ExpandableSectionProps {
  farm?: number
  lpLabel?: string
  multiplier?: string
  risk?: number
  fee?: number
  farmImage?: string
  removed?: boolean
  tokenSymbol?: string
}

const TokenFee = styled.div`
  @media screen and (max-width: 1000px) {
    width: 100%;
    font-size: 12px;
  }
`;

const TokenName = styled.div`
  color: #c9c4d4;
  font-weight: bold;
  font-size: 20px;
  @media screen and (max-width: 1000px) {
    font-size: 18px;
    width: 100%;
  }
`;

const CakeBorder = styled.div`
    width: 70px;
    border-radius: 20px;
    color: #2d74c4;
    border: 2px solid #2d74c4;
`;

const CakeLP = styled.div`
  border: 2px solid #2d74c4;
  padding: 2px 10px;
  border-radius: 20px;
`;


const CardHeading: React.FC<ExpandableSectionProps> = ({
  fee,
  lpLabel,
  removed,
  farmImage,
  tokenSymbol,
  multiplier
}) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <img src={farmImage !== 'rasta' ? `/images/farms/rasta/${farmImage}.png` : `/images/farms/rasta/${farmImage}.png`} className="img" alt={tokenSymbol} width={50} height={50} />
      <Flex flexDirection="column">
        <Text fontSize='15px' color="#2d74c4">STAKE</Text>
        <TokenName>{lpLabel}</TokenName>
        <Text color="#2d74c4" fontSize='14px'>{multiplier}</Text>
      </Flex>
      {!removed && (
        <Flex flexDirection='column'>
          <CakeLP>
            <Text color="#2d74c4" fontSize='14px'>CORE</Text>
          </CakeLP>
          <Text color="#2d74c4" fontSize='14px'>FEE: {fee}%</Text>
        </Flex>
      )}
    </Flex>
  )
}

export default CardHeading
