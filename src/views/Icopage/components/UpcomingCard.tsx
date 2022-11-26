import * as React from 'react';
import { Text, Link, Flex } from 'crox-new-uikit'
import { useCountUp } from 'react-countup'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useMediaQuery from "@mui/material/useMediaQuery";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IcoDetail from '../../../config/Ico/Ico-detail.json';

export default function UpcomingCard() {
  const loadedData = JSON.stringify(IcoDetail);
  const upcomingdatas = JSON.parse(loadedData);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [expanded, setExpanded] = React.useState('');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : '');
  };
  return (
    !isMobile ? (<TableContainer style={{ color: "white", backgroundColor: "rgb(44 45 58)", borderRadius: '0' }} component={Paper}>
      <Table aria-label="simple table">
        <TableHead style={{ backgroundColor: "#5774ae", borderRadius: '0' }}>
          <TableRow>
            <TableCell> </TableCell>
            <TableCell align="right" style={{ padding: "18px 0%" }}>
              <Text fontSize="14px" color="white" style={{ textAlign: 'center' }} bold>Project</Text>
            </TableCell>
            <TableCell align="right" style={{ padding: "18px 0%" }}>
              <Text fontSize="14px" color="white" style={{ textAlign: 'center' }} bold>For Sale</Text>
            </TableCell>
            <TableCell align="right" style={{ padding: "18px 0%" }}>
              <Text fontSize="14px" color="white" style={{ textAlign: 'center' }} bold>To Raise (USD)</Text>
            </TableCell>
            <TableCell align="right" style={{ padding: "18px 0%" }}>
              <Text fontSize="14px" color="white" style={{ textAlign: 'center' }} bold>Date</Text>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody style={{ backgroundColor: "#15161c", borderRadius: '0' }}>
          {upcomingdatas.liveCards.map((upcomingdata) => (
            upcomingdata.active && (<TableRow
              key={upcomingdata.calories}
              sx={{ '&:last-child td, &:last-child th': { borderBottom: "1px solid #1a1b23" } }}
            >
              <TableCell component="th" scope="row" style={{ padding: "5px" }}>
                <img style={{ verticalAlign: "text-bottom", padding: "0" }} src={`/images/ico/livetoken/${upcomingdata.tokenName}.png`} width="40px" height="40px" alt="" />
              </TableCell>
              <TableCell align="right" style={{ padding: "18px 0px" }}>
                <Text fontSize="15px" color="white" style={{ textAlign: 'center' }}>
                  {upcomingdata.projectName}
                </Text>
              </TableCell>
              <TableCell align="right" style={{ padding: "18px 0px" }}>
                <Text fontSize="15px" color="white" style={{ textAlign: 'center' }}>
                  {upcomingdata.forsale.toLocaleString()}{upcomingdata.tokenname}
                </Text>
              </TableCell>
              <TableCell align="right" style={{ padding: "18px 0px" }}>
                <Text fontSize="15px" color="white" style={{ textAlign: 'center' }}>
                  ${upcomingdata.raise.toLocaleString()}
                </Text>
              </TableCell>
              <TableCell align="right" style={{ padding: "18px 0px" }}>
                <Text fontSize="15px" color="white" style={{ textAlign: 'center' }}>
                  {upcomingdata.date}
                </Text>
              </TableCell>
            </TableRow>)
          ))}
        </TableBody>
      </Table>
    </TableContainer>) : (
      upcomingdatas.liveCards.map((upcomingdata) => (
        upcomingdata.active && <Accordion expanded={expanded === "panel1" ? true : false} onChange={handleChange('panel1')} style={{ backgroundColor: '#5774ae' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Flex alignItems='center'>
              <img style={{ verticalAlign: "text-bottom", padding: "0" }} src={`/images/ico/livetoken/${upcomingdata.tokenName}.png`} width="40px" height="40px" alt="" />
              <Text color='white' fontSize='18px' ml='5px' bold>{upcomingdata.projectName}</Text>
            </Flex>
          </AccordionSummary>
          <AccordionDetails style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", padding: '10px 20px' }}>
            <Flex justifyContent='space-between'>
              <Text mr='5px'>For sale:</Text>
              <Text>{upcomingdata.forsale.toLocaleString()} {upcomingdata.tokenname}</Text>
            </Flex>
            <Flex justifyContent='space-between'>
              <Text mr='5px'>To Raise (USD):</Text>
              <Text>${upcomingdata.raise.toLocaleString()}</Text>
            </Flex>
            <Flex justifyContent='space-between'>
              <Text mr='5px'>Date:</Text>
              <Text>{upcomingdata.date}</Text>
            </Flex>
          </AccordionDetails>
        </Accordion>
      ))
    )
  );
}
