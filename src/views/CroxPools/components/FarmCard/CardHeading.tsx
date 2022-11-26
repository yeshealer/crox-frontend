import React from 'react'
import styled from 'styled-components'
import { Flex,  Image } from 'crox-new-uikit'

export interface ExpandableSectionProps {
  lpLabel?: string
  risk?: number
  farmImage?: string
  tokenSymbol?: string
}

const Wrapper = styled(Flex)`
  width: 5%;
  font-weight: bold;
  float: left;
  display: flex;
  @media screen and (max-width: 700px) {
    width: 12%;
    display: inline-block;
  }
`

const CardHeading: React.FC<ExpandableSectionProps> = ({
  farmImage,
  tokenSymbol,
}) => {
  return (
    <Wrapper>
      <Image src={`/images/farms/${farmImage}.svg`} alt={tokenSymbol} width={50} height={50} />
    </Wrapper>
  )
}

export default CardHeading
