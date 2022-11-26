import React from 'react'
import styled from 'styled-components'
import { Text, Link, Flex } from 'crox-new-uikit'
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import LaunchIcon from '@mui/icons-material/Launch';
import IcoJson from '../../../config/Ico/Ico-detail.json'

const DescriptionContainer = styled.div`
  width: 35%;
  background-color: #15161c;
  margin-right: 3%;
  padding: 30px;
  @media screen and (max-width: 1000px) {
    margin: auto;
    width: 100%;
    margin: 0;
  }
`

interface SaleTabCardProps {
  tokenName?: string
  tokenSymbol?: string
  backColor?: string
  liveId?: number
}

const SaleTabCard: React.FC<SaleTabCardProps> = ({ tokenName, tokenSymbol, backColor, liveId }) => {

  const loadedData = JSON.stringify(IcoJson);
  const Icodata = JSON.parse(loadedData);
  const liveCard = Icodata.liveCards[liveId - 1]

  return (
    <DescriptionContainer>
      <Text fontSize="24px" color="white" mb='15px' p="15px" bold style={{ backgroundColor: '#5774ae' }}>Project Description</Text>
      <Text color="white" p="5px 15px 20px" style={{ borderBottom: '1px solid #343542', lineHeight: '24px' }}>Introducing SOW and Wrapped Token WSOW – the first crypto currency of compassion helping to solve human crises and feed human potential by helping to finance cutting edge blockchain business solutions that lower costs, increase resilience, provide transparency and utility while also providing real humanitarian relief that changes lives for the better.</Text>
      <Flex justifyContent='center'>
        <Link external href={`${liveCard.visit}`} bold={false} color="white">
          <Text color="#4583C9" m='15px 0' style={{ textDecoration: "underline" }}>Visit Project Website</Text>
          <LaunchIcon sx={{ color: '#4583C9' }} />
        </Link>
      </Flex>
      <Link external href={`${liveCard.audit}`} bold={false} color="white">
        <Flex mb='10px'>
          <Text fontSize="15px" color="white" mr='10px'>Audit Report: </Text>
          <SimCardDownloadIcon />
        </Flex>
      </Link>
      <div style={{ width: "100%", display: "flex" }}>
        <Link external href={`${liveCard.whitepaper}`} bold={false} color="white" mr='10px'>
          <Flex>
            <Text fontSize="15px" color="white" style={{ margin: "1%" }}>WhitePaper</Text>
            <LaunchIcon />
          </Flex>
        </Link>
        <Link external href={`${liveCard.tokenomics}`} bold={false} color="white">
          <div style={{ display: "flex", margin: "0 5%" }}>
            <Text fontSize="15px" color="white">Tokenomics:</Text>
            <LaunchIcon />
          </div>
        </Link>
      </div>
    </DescriptionContainer>
  )
}

export default SaleTabCard