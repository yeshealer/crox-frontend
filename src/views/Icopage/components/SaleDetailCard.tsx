import * as React from 'react';
import { Text, Flex } from 'crox-new-uikit'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useMediaQuery from "@mui/material/useMediaQuery";
import styled from "styled-components";
import IcoJson from '../../../config/Ico/Ico-detail.json'

function createData(calories, fat, carbs, protein) {
  return { calories, fat, carbs, protein };
}

const SaleCardContainer = styled.div`
    background-color: #15161C;
    width: 55%;
    margin-left: 3%;
    @media screen and (max-width: 1000px) {
      margin: auto;
      width: 100%;
      margin: 0;
    }
`


interface SaleDetailCardProps {
  liveId?: number
}

const SaleDetailCard: React.FC<SaleDetailCardProps> = ({ liveId }) => {
  const loadedData = JSON.stringify(IcoJson);
  const Icodata = JSON.parse(loadedData);
  const liveCard = Icodata.liveCards[liveId - 1];
  
  const progress1 = liveCard.tier1.progress;
  const progress2 = liveCard.tier2.progress;
  const hardcap1 = liveCard.tier1.hardcap;
  const minlimit1 = liveCard.tier1.minlimit;
  const maxlimit1 = liveCard.tier1.maxlimit;
  const tokenDistribution1 = liveCard.tier1.tokendistribution1;
  const hardcap2 = liveCard.tier2.hardcap;
  const minlimit2 = liveCard.tier2.minlimit;
  const maxlimit2 = liveCard.tier2.maxlimit;
  const tokenDistribution2 = liveCard.tier2.tokendistribution2;
  const isMobile = useMediaQuery("(max-width: 600px)");
  const rows = [
    createData('TIER 1', 'Completed', 'Hardcap : ', `$${hardcap1} (USD)`),
    createData('TIER 2', 'Completed', 'Hardcap : ', `$${hardcap2} (USD)`),
  ];
  return (
    !isMobile ? (<SaleCardContainer>
      <TableContainer style={{ borderRadius: '0', color: "white", padding: '50px 45px', backgroundColor: '#15161C' }} component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right" colSpan={5} style={{ padding: "1%" }}>
                <Text fontSize="18px" color="white" style={{ textAlign: 'center' }} bold>Sale  Details</Text>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.calories}
              >
                <TableCell align="right" style={{ padding: "10px 0" }}>
                  <Text fontSize="15px" color="white" style={{ textAlign: 'center' }}>
                    {row.calories}
                  </Text>
                </TableCell>
                <TableCell align="right" style={{ padding: "10px 0" }}>
                  <Text fontSize="15px" color="white" style={{ textAlign: 'center' }}>
                    {row.fat}
                  </Text>
                </TableCell>
                <TableCell align="right" style={{ padding: "10px 0" }}>
                  <Text fontSize="15px" color="white" style={{ textAlign: 'center' }}>
                    {row.carbs}
                  </Text>
                </TableCell>
                <TableCell align="right" style={{ padding: "10px 0" }}>
                  <Text fontSize="15px" color="white" style={{ textAlign: 'center' }}>
                    {row.protein}
                  </Text>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell align="right" colSpan={5} style={{ padding: "10px 0" }}>
                <Text fontSize="18px" color="white" style={{ textAlign: 'center' }} bold>Launch Details</Text>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="center" colSpan={2.5} style={{ padding: "1%", border: "none" }}>
                <Text fontSize="18px" color="white" style={{ textAlign: 'center' }} bold>CEX</Text>
                <div style={{ display: "flex", justifyContent: "center", margin: "4%" }}>
                  <img src="/images/ico/image164.png" width="20px" style={{ margin: "2px", marginRight: "10px", height: "20px" }} alt="" />
                  <Text fontSize="18px" color="white">Bitmart</Text>
                </div>
                <Text fontSize="15px" color="white" style={{ textAlign: 'center' }} bold>17th Jan, 10am EST</Text>
              </TableCell>
              <TableCell align="center" colSpan={2.5} style={{ padding: "1%", borderLeft: "1px solid white", border: "none" }}>
                <Text fontSize="18px" color="white" style={{ textAlign: 'center' }} bold>DEX</Text>
                <img src='https://honeyfarm.finance/images/partners/babyswap.png' width='120px' alt="babyswap" />
                <Text fontSize="15px" color="white" style={{ textAlign: 'center' }} bold>17th Jan, 10am EST</Text>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </SaleCardContainer>) : (
      <div className='sale_detail_mobile_header'>
        <Text style={{ textAlign: 'center', borderBottom: '1px solid lightgrey' }} fontSize='20px' bold color='lightgrey' mt='5px'>Sale Detail</Text>
        <Flex justifyContent='space-between' p='5px 5px 0'>
          <Text color='white' mr='5px'>TIER 1:</Text>
          <Text color='white'>Completed</Text>
        </Flex>
        <Flex style={{ borderBottom: '1px solid lightgrey' }} justifyContent='space-between' p='2.5px 5px'>
          <Text color='white' mr='5px'>Hardcap:</Text>
          <Text color='white'>${hardcap1} (USD)</Text>
        </Flex>
        <Flex justifyContent='space-between' p='5px 5px 0'>
          <Text color='white' mr='5px'>TIER 2:</Text>
          <Text color='white'>Completed</Text>
        </Flex>
        <Flex style={{ borderBottom: '1px solid lightgrey' }} justifyContent='space-between' p='2.5px 5px'>
          <Text color='white' mr='5px'>Hardcap:</Text>
          <Text color='white'>${hardcap2} (USD)</Text>
        </Flex>
        <Text style={{ textAlign: 'center', borderBottom: '1px solid lightgrey' }} fontSize='20px' p='10px 0' bold color='lightgrey'>Launch Detail</Text>
        <Flex justifyContent='space-between' p="15px">
          <div>
            <Text color='white' style={{ textAlign: 'center' }} fontSize='17px' mb='3px' bold>CEX</Text>
            <Flex justifyContent='center'>
              <img src="/images/ico/image164.png" width="20px" style={{ margin: "2px", marginRight: "10px", height: "20px" }} alt="" />
              <Text color='white' fontSize="18px">Bitmart</Text>
            </Flex>
            <Text color='white' style={{ textAlign: 'center' }} fontSize='15px' mt='3px'>17th Jan, 10am EST</Text>
          </div>
          <div>
            <Text color='white' style={{ textAlign: 'center' }} fontSize='17px' mb='3px' bold>DEX</Text>
            <img src='https://honeyfarm.finance/images/partners/babyswap.png' width='120px' alt="babyswap" style={{ margin: '-10.5px 0' }} />
            <Text color='white' style={{ textAlign: 'center' }} fontSize='15px' mt='3.5px'>17th Jan, 10am EST</Text>
          </div>
        </Flex>
      </div>
    )
  );
}

export default SaleDetailCard