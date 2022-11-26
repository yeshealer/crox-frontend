import React from 'react'
import styled from 'styled-components'
import { useHistory } from "react-router-dom";
import { Text, Button, Flex } from 'crox-new-uikit'
import IcoJson from '../../../config/Ico/Ico-detail.json'

const CardForm = styled.div`
  border-radius: 0;
  width: 300px;
  color: white;
  margin: 0 3%;
  @media screen and (max-width: 850px) {
    margin: auto;
    width: 100%;
    margin: 0;
  }
`

const CardHeader = styled.div`
  background-color: #5774AE;
  padding: 10px;
`

const HeaderText = styled.div`
  width: 70%;
  display: inline-block;
`

interface DescriptionCardProps {
  LiveId?: number
  backColor?: string
}

const DescriptionCard: React.FC<DescriptionCardProps> = ({ backColor, LiveId }) => {

  const loadedData = JSON.stringify(IcoJson);
  const Icodata = JSON.parse(loadedData);
  const liveCard = Icodata.liveCards[LiveId - 1]
  const history = useHistory();

  return (
    <CardForm className='col-lg-2 col-md-6'>
      <CardHeader style={{ backgroundColor: `#${backColor}` }}>
        <HeaderText>
          <div>
            <Text fontSize="30px" color="white" bold>{liveCard.projectName}</Text>
          </div>
          <div>
            <Text fontSize="20px" color="white">Token: {liveCard.tokenName}</Text>
          </div>
        </HeaderText>
        <img style={{ verticalAlign: "text-bottom" }} src={`/images/ico/livetoken/${liveCard.tokenName}.png`} width="80px" height="80px" alt="" />
      </CardHeader>
      <div style={{ backgroundColor: '#15161c' }}>
        <Flex flexDirection='column' style={{ padding: '10px 15px' }}>
          <Flex justifyContent='space-between' mb='8px'>
            <Text>For Sale :</Text>
            <Text>{liveCard.forsale.toLocaleString()} {liveCard.tokenName}</Text>
          </Flex>
          <Flex justifyContent='space-between' mb='8px'>
            <Text>To Raise(USD) :</Text>
            <Text>${liveCard.raise.toLocaleString()}</Text>
          </Flex>
          <Flex justifyContent='space-between' mb='8px'>
            <Text>TIER 1(USD) :</Text>
            <Text>${liveCard.tier1.hardcap.toLocaleString()}</Text>
          </Flex>
          <Flex justifyContent='space-between' mb='8px'>
            <Text>TIER 2(USD) :</Text>
            <Text>${liveCard.tier2.hardcap.toLocaleString()}</Text>
          </Flex>
          <Flex justifyContent='space-between' style={{ borderBottom: '1px solid grey' }} pb='10px'>
            <Text>$CROX to Burn :</Text>
            <Text>${liveCard.burnCrox.toLocaleString()}</Text>
          </Flex>
        </Flex>
        <Flex justifyContent='center' mb='5px'>
          <Text>1 WSOW = </Text>
          <Text>$0.125 (TIER 1)</Text>
        </Flex>
        <Flex justifyContent='center' mb='5px'>
          <Text>1 WSOW = </Text>
          <Text>$0.15 (TIER 2)</Text>
        </Flex>
        <Flex justifyContent='center'>
          <Text style={{ marginBottom: "10px", textDecorationColor: "white" }}>
            <Button style={{ color: 'white', backgroundColor: '#3399FF', borderRadius: '0', height: '40px' }} onClick={() => history.push(`/ico/${LiveId}/details`)} >View Pool</Button>
          </Text>
        </Flex>
      </div>
    </CardForm>
  )
}

export default DescriptionCard