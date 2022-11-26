import * as React from 'react';
import { Text, Flex, Button } from 'crox-new-uikit'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useHistory } from "react-router-dom";
import Paper from '@mui/material/Paper';
import useMediaQuery from "@mui/material/useMediaQuery";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IcoDetail from '../../../config/Ico/Ico-detail.json';

export default function PastCard() {
  const loadedData = JSON.stringify(IcoDetail);
  const pastdatas = JSON.parse(loadedData);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [expanded, setExpanded] = React.useState('');
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : '');
  };
  const history = useHistory();
  return (
    !isMobile ? (<TableContainer style={{ borderRadius: "0", backgroundColor: "rgb(44 45 58)", color: "white" }} component={Paper}>
      <Table aria-label="simple table">
        <TableHead style={{ backgroundColor: "#5774ae" }}>
          <TableRow>
            <TableCell> </TableCell>
            <TableCell align="right" style={{ padding: "18px 0" }}>
              <Text fontSize="14px" color="white" style={{ textAlign: 'center' }} bold>Project</Text>
            </TableCell>
            <TableCell align="right" style={{ padding: "0" }}>
              <Text fontSize="14px" color="white" style={{ textAlign: 'center', borderBottom: '1px solid white' }} bold p="3px 0">For Sale</Text>
              <Text fontSize="14px" color="white" style={{ textAlign: 'center' }} bold p="3px 0">To Raise (USD)</Text>
            </TableCell>
            <TableCell align="right" style={{ padding: "18px 0" }}>
              <Text fontSize="14px" color="white" style={{ textAlign: 'center' }} bold>Date</Text>
            </TableCell>
            <TableCell align="right" style={{ padding: "18px 0" }}>
              <Text fontSize="14px" color="white" style={{ textAlign: 'center' }} bold>Detail</Text>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody style={{ backgroundColor: "#15161c" }}>
          {pastdatas.liveCards.map((pastdata) => (
            !pastdata.active && <TableRow
              key={pastdata.calories}
              sx={{ '&:last-child td, &:last-child th': { borderBottom: "1px solid #1a1b23" } }}
            >
              <TableCell component="th" scope="row" style={{ padding: "5px" }}>
                <img style={{ verticalAlign: "text-bottom", padding: "0" }} src={`/images/ico/livetoken/${pastdata.tokenName}.png`} width="40px" height="40px" alt="" />
              </TableCell>
              <TableCell align="right" style={{ padding: "18px 0px" }}>
                <Text fontSize="15px" color="white" style={{ textAlign: 'center' }}>
                  {pastdata.projectName}
                </Text>
              </TableCell>
              <TableCell align="right" style={{ padding: "0px" }}>
                <Text fontSize="15px" color="white" style={{ textAlign: 'center', borderBottom: '1px solid white' }} p="3px 0">
                  {pastdata.forsale.toLocaleString()} {pastdata.tokenname}
                </Text>
                <Text fontSize="15px" color="white" style={{ textAlign: 'center' }} p="3px 0">
                  ${pastdata.raise.toLocaleString()}
                </Text>
              </TableCell>
              <TableCell align="right" style={{ padding: "18px 0" }}>
                <Text fontSize="15px" color="white" style={{ textAlign: 'center' }}>
                  {pastdata.date}
                </Text>
              </TableCell>
              <TableCell align="right" style={{ padding: "0px", textAlign: 'center' }}>
                <Button style={{ fontSize: '15px', height: '30px', borderRadius: '0', backgroundColor: '#3399ff', padding: '0 10px', fontFamily: "'Baloo 2'" }} onClick={() => history.push(`/ico/${pastdata.liveId}/details`)}>View Pool</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>) : (
      pastdatas.liveCards.map((pastdata) => (
        !pastdata.active && <Accordion expanded={expanded === "panel1" ? true : false} onChange={handleChange('panel1')} style={{ backgroundColor: '#5774ae' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Flex alignItems='center'>
              <img style={{ verticalAlign: "text-bottom", padding: "0" }} src={`/images/ico/livetoken/${pastdata.tokenName}.png`} width="40px" height="40px" alt="" />
              <Text color='white' fontSize='18px' ml='5px' bold>{pastdata.projectName}</Text>
            </Flex>
          </AccordionSummary>
          <AccordionDetails style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", padding: '10px 20px' }}>
            <Flex justifyContent='space-between'>
              <Text mr='5px'>For sale:</Text>
              <Text>{pastdata.forsale.toLocaleString()} {pastdata.tokenname}</Text>
            </Flex>
            <Flex justifyContent='space-between'>
              <Text mr='5px'>To Raise (USD):</Text>
              <Text>${pastdata.raise.toLocaleString()}</Text>
            </Flex>
            <Flex justifyContent='space-between'>
              <Text mr='5px'>Date:</Text>
              <Text>{pastdata.date}</Text>
            </Flex>
            <Button style={{ fontSize: '15px', height: '30px', borderRadius: '0', backgroundColor: '#3399ff', padding: '0 10px', fontFamily: "'Baloo 2'" }} onClick={() => history.push(`/ico/${pastdata.liveId}/details`)}>View Pool</Button>
          </AccordionDetails>
        </Accordion>
      ))
    )
  );
}
