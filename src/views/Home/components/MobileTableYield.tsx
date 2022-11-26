import React, { useState } from 'react'
import { Text, Flex } from 'crox-new-uikit'
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import BigNumber from 'bignumber.js';
import Collapse from '@mui/material/Collapse';
import { getAPYAndTVLOfFarm, getAPYAndTVLOfDualFarm, getAPYAndTVLOfPool, getAPYAndTVLOfNGPool } from "utils/defi";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDualHarvest, useHarvest } from 'hooks/useHarvest';
import { getBalanceNumber } from "../../../utils/formatBalance";
import { usePriceCakeBusd, usePriceBnbBusd } from "../../../state/hooks";

interface MobileTableYieldProps {
  stakedFarmList?: any
  stakedDualFarmList?: any
  stakedPoolList?: any
  stakedNextGenList?: any
}

const MobileTable: React.FC<MobileTableYieldProps> = ({
  stakedFarmList,
  stakedDualFarmList,
  stakedPoolList,
  stakedNextGenList
}) => {
  const [expandCollapse, setExpandCollapse] = useState([]);

  const handleExpandClick = (e) => {
    const newArr = expandCollapse;
    newArr[e] = !newArr[e];
    setExpandCollapse(newArr);
  }

  const eggPrice = usePriceCakeBusd().toNumber();

  const cakePrice = usePriceCakeBusd();
  const bnbPrice = usePriceBnbBusd();

  const farmImage = []
  const farmApy = []
  const farmLpWorth = []
  for (let i = 0; i < stakedFarmList.length; i++) {
    farmImage[i] = stakedFarmList[i].isTokenOnly
      ? stakedFarmList[i].tokenSymbol.toLowerCase()
      : `${stakedFarmList[i].tokenSymbol.toLowerCase()}-${stakedFarmList[i].quoteTokenSymbol.toLowerCase()}`;
    farmApy[i] = getAPYAndTVLOfFarm(stakedFarmList[i], { cakePrice, bnbPrice });
    farmLpWorth[i] = new BigNumber(farmApy[i].totalValue)
      .div(new BigNumber(stakedFarmList[i].lpBalance))
      .toFixed(2);
  }
  const dualFarmImage = []
  const dualFarmApyGroup = []
  const dualFarmApy = []
  const dualFarmLpWorth = []
  for (let i = 0; i < stakedDualFarmList.length; i++) {
    dualFarmImage[i] = stakedDualFarmList[i].lpSymbol.split(" ")[0].toLowerCase()
    dualFarmApyGroup[i] = getAPYAndTVLOfDualFarm(stakedDualFarmList[i], { cakePrice, bnbPrice })
    dualFarmApy[i] = (dualFarmApyGroup[i].apy1).plus(dualFarmApyGroup[i].apy2)
    dualFarmLpWorth[i] = new BigNumber(dualFarmApyGroup[i].totalValue)
      .div(new BigNumber(stakedDualFarmList[i].lpBalance))
      .toFixed(2);
  }
  const poolImage = []
  const poolApy = []
  const poolLpWorth = []
  for (let i = 0; i < stakedPoolList.length; i++) {
    poolImage[i] = stakedPoolList[i].lpSymbol
    poolApy[i] = getAPYAndTVLOfPool(stakedPoolList[i], { cakePrice, bnbPrice })
    if (stakedPoolList[i].lpSymbol === 'CROX') {
      poolLpWorth[i] = cakePrice
    } else {
      poolLpWorth[i] = stakedPoolList[i].tokenPrice
    }
  }
  const nextgenImage = []
  const nextgenApyGroup = []
  const nextgenApy = []
  const nextgenLpWorth = []
  for (let i = 0; i < stakedNextGenList.length; i++) {
    nextgenImage[i] = stakedNextGenList[i].tokenSymbol
    nextgenApyGroup[i] = getAPYAndTVLOfNGPool(stakedNextGenList[i], { cakePrice, bnbPrice })
    nextgenApy[i] = (nextgenApyGroup[i].apy1).plus(nextgenApyGroup[i].apy2)
    nextgenLpWorth[i] = new BigNumber(nextgenApyGroup[i].totalValue)
      .div(new BigNumber(stakedNextGenList[i].lpBalance))
      .toFixed(2);
  }

  const ismobile = useMediaQuery("(max-width: 520px)")

  const RenderClaimButton = (pid) => {
    const { onReward } = useHarvest(pid)
    return (
      <Button variant="contained" style={{ padding: '0px 12px', backgroundColor: '#2d74c4' }} onClick={() => onReward()}>Claim</Button>
    )
  }

  const RenderDualClaimButton = (address) => {
    const { onReward } = useDualHarvest(address)
    return (
      <Button variant="contained" style={{ padding: '0px 12px', backgroundColor: '#2d74c4' }} onClick={() => onReward()}>Claim</Button>
    )
  }

  return (
    <Flex justifyContent='center' style={{ margin: '5px' }} className="MobileTable" flexDirection='column'>
      {stakedFarmList && stakedFarmList.map((list, index) => (
        <Card style={{ backgroundColor: '#242542', marginBottom: '5px' }} onClick={() => handleExpandClick(`${list.pid}farm`)}>
          <CardContent style={{ padding: 5, backgroundColor: '#242542' }}>
            <Flex justifyContent='space-between' alignItems='center' p={!ismobile ? '5px 10px' : '5px 0'}>
              <div>
                <Flex alignItems="center" justifyContent="center">
                  <img
                    src={`/images/farms/${farmImage[index]}.svg`}
                    alt={`${farmImage[index]}`}
                    width={35}
                    height={35}
                    style={{ margin: "0 5px" }}
                  />
                  <div>
                    <Text color="white">{list.lpSymbol}</Text>
                    <Text fontSize="14px" color="#2d74c4" className="farm_type">Farm</Text>
                  </div>
                </Flex>
              </div>
              <div>
                <Text color='white' fontSize="14px">${(getBalanceNumber(list.userData.earnings) * eggPrice).toFixed(2)}</Text>
                {/* <Button variant="contained" style={{ padding: '0px 12px', backgroundColor: '#2d74c4' }}>Claim</Button> */}
                {RenderClaimButton(list.pid)}
              </div>
              <div>
                <Text color='white'>{getBalanceNumber(list.userData.stakedBalance).toFixed(2)}LP</Text>
                <Button color="error" variant="contained" style={{ padding: '0px 12px', backgroundColor: '#2D3748' }}>Unstake</Button>
              </div>
              <div>
                {list.multiplier === '0X' ? <Text className='finished_farm'>{ismobile ? '' : 'Finished'}</Text> : <Text className='farming_farm'>{ismobile ? '' : 'Farming'}</Text>}
              </div>
            </Flex>
          </CardContent>
          <Collapse in={expandCollapse[`${list.pid}farm`]} timeout="auto" unmountOnExit sx={{ backgroundColor: 'rgb(55, 55, 100)' }}>
            <Flex justifyContent='space-between' alignItems='center' p='5px 10px'>
              <div>
                <Text color="#2d74c4">APR:</Text>
                <Text color="white">{farmApy[index].apy.times(new BigNumber(100)).toNumber().toFixed(2)}%</Text>
              </div>
              <div>
                <Text color='#2d74c4'>Staked Token:</Text>
                <Text color='white'>{getBalanceNumber(list.userData.stakedBalance).toFixed(2)}LP</Text>
                <Text color='white'>${(getBalanceNumber(list.userData.stakedBalance) * farmLpWorth[index]).toFixed(2)}</Text>
              </div>
              <div>
                <Text color='#2d74c4'>Rewards:</Text>
                <Flex alignItems='center' justifyContent='center'><Text fontSize="14px" color='white' >{getBalanceNumber(list.userData.earnings).toFixed(2)}</Text><Text fontSize="14px" color='white' ml='2px'>CROX</Text></Flex>
                <Text fontSize="14px" color='white'>${(getBalanceNumber(list.userData.earnings) * eggPrice).toFixed(2)}</Text>
              </div>
            </Flex>
          </Collapse>
        </Card>
      ))}
      {stakedDualFarmList && stakedDualFarmList.map((list, index) => (
        <Card style={{ backgroundColor: '#242542', marginBottom: '5px' }} onClick={() => handleExpandClick(`${list.pid}dual`)}>
          <CardContent style={{ padding: 5, backgroundColor: '#242542' }}>
            <Flex justifyContent='space-between' alignItems='center' p={!ismobile ? '5px 10px' : '5px 0'}>
              <div>
                <Flex alignItems="center" justifyContent="center">
                  <img
                    src={`/images/farms/${dualFarmImage[index]}.svg`}
                    alt={`${dualFarmImage[index]}`}
                    width={35}
                    height={35}
                    style={{ margin: "0 5px" }}
                  />
                  <div>
                    <Text color="white">{list.lpSymbol}</Text>
                    <Text fontSize="14px" color="#2d74c4" className="farm_type">DualFarm</Text>
                  </div>
                </Flex>
              </div>
              <div>
                <Text fontSize="14px" color='white'>${((getBalanceNumber(list.userData.earnings[0]) * eggPrice) + (getBalanceNumber(list.userData.earnings[1]) as any * list.tokenPrice)).toFixed(2)}</Text>
                {/* <Button variant="contained" style={{ padding: '0px 12px', backgroundColor: '#2d74c4' }}>Claim</Button> */}
                {RenderDualClaimButton(list.poolAddress)}
              </div>
              <div>
                <Text color='white'>{getBalanceNumber(list.userData.stakedBalance).toFixed(2)}LP</Text>
                <Button color="error" variant="contained" style={{ padding: '0px 12px', backgroundColor: '#2D3748' }}>Unstake</Button>
              </div>
              <div>
                {!list.active ? <Text className='finished_farm'>{ismobile ? '' : 'Finished'}</Text> : <Text className='farming_farm'>{ismobile ? '' : 'Farming'}</Text>}
              </div>
            </Flex>
          </CardContent>
          <Collapse in={expandCollapse[`${list.pid}dual`]} timeout="auto" unmountOnExit sx={{ backgroundColor: 'rgb(55, 55, 100)' }}>
            <Flex justifyContent='space-between' alignItems='center' p='5px 10px'>
              <div>
                <Text color="#2d74c4">APR:</Text>
                <Text color='white'>{dualFarmApy[index].times(new BigNumber(100)).toNumber().toFixed(2)}%</Text>
              </div>
              <div>
                <Text color='#2d74c4'>Staked Token:</Text>
                <Text color='white'>{getBalanceNumber(list.userData.stakedBalance).toFixed(2)}LP</Text>
                <Text color='white'>${(getBalanceNumber(list.userData.stakedBalance) * dualFarmLpWorth[index]).toFixed(2)}</Text>
              </div>
              <div>
                <Text color='#2d74c4'>Rewards:</Text>
                <Flex justifyContent='center' alignItems='center'><Text fontSize="14px" color='white'>{getBalanceNumber(list.userData.earnings[0]).toFixed(2)}</Text><Text fontSize="14px" color='#2d74c4'>CROX</Text><Text fontSize='14px' color='white'> + {getBalanceNumber(list.userData.earnings[1]).toFixed(2)}</Text><Text fontSize='14px' color='#2d74c4'>{list.tokenSymbol}</Text></Flex>
                <Text fontSize="14px" color='white'>${(getBalanceNumber(list.userData.earnings[0]) as any * eggPrice).toFixed(2)} + ${(getBalanceNumber(list.userData.earnings[1]) as any * list.tokenPrice).toFixed(2)}</Text>
                <Text fontSize="14px" color='white'>(A) + (B)</Text>
              </div>
            </Flex>
          </Collapse>
        </Card>
      ))}
      {stakedPoolList && stakedPoolList.map((list, index) => (
        <Card style={{ backgroundColor: '#242542', marginBottom: '5px' }} onClick={() => handleExpandClick(`${list.pid}pool`)}>
          <CardContent style={{ padding: 5, backgroundColor: '#242542' }}>
            <Flex justifyContent='space-between' alignItems='center' p={!ismobile ? '5px 10px' : '5px 0'}>
              <div>
                <Flex alignItems="center" justifyContent="center">
                  <img
                    src={`/images/farms/${poolImage[index]}.svg`}
                    alt={`${poolImage[index]}`}
                    width={35}
                    height={35}
                    style={{ margin: "0 5px" }}
                  />
                  <div>
                    <Text color="white">{list.lpSymbol}</Text>
                    <Text fontSize="14px" color="#2d74c4" className="farm_type" style={{ minWidth: '100px' }}>Pool</Text>
                  </div>
                </Flex>
              </div>
              <div>
                <Text fontSize="14px" color='white'>${(getBalanceNumber(list.userData.earnings) * eggPrice).toFixed(2)}</Text>
                {/* <Button variant="contained" style={{ padding: '0px 12px', backgroundColor: '#2d74c4' }}>Claim</Button> */}
                {RenderClaimButton(list.pid)}
              </div>
              <div>
                <Text color='white'>{list.lpSymbol === 'CNR' ? getBalanceNumber(list.userData.stakedBalance, 8).toFixed(2) : getBalanceNumber(list.userData.stakedBalance).toFixed(2)}</Text>
                <Button color="error" variant="contained" style={{ padding: '0px 12px', backgroundColor: '#2D3748' }}>Unstake</Button>
              </div>
              <div>
                {list.multiplier === '0X' ? <Text className='finished_farm'>{ismobile ? '' : 'Finished'}</Text> : <Text className='farming_farm'>{ismobile ? '' : 'Farming'}</Text>}
              </div>
            </Flex>
          </CardContent>
          <Collapse in={expandCollapse[`${list.pid}pool`]} timeout="auto" unmountOnExit sx={{ backgroundColor: 'rgb(55, 55, 100)' }}>
            <tbody className="tbody_wallet tbody_wallet_yield_expand">
              <Flex justifyContent='space-between' alignItems='center' p='5px 10px'>
                <div>
                  <Text color="#2d74c4">APR:</Text>
                  <Text color='white'>{poolApy[index].apy.times(new BigNumber(100)).toNumber().toFixed(2)}%</Text>
                </div>
                <div>
                  <Text color='#2d74c4'>Staked Token:</Text>
                  <Text color='white'>{list.lpSymbol === 'CNR' ? getBalanceNumber(list.userData.stakedBalance, 8).toFixed(2) : getBalanceNumber(list.userData.stakedBalance).toFixed(2)}LP</Text>
                  <Text>${list.lpSymbol === 'CNR' ? (getBalanceNumber(list.userData.stakedBalance, 8) * poolLpWorth[index]).toFixed(2) : (getBalanceNumber(list.userData.stakedBalance) * poolLpWorth[index]).toFixed(2)}</Text>
                </div>
                <div>
                  <Text color='#2d74c4'>Rewards:</Text>
                  <Flex justifyContent='center' alignItems='center'><Text fontSize="14px" color='white'>{getBalanceNumber(list.userData.earnings).toFixed(2)}</Text><Text fontSize='14px' color='#2d74c4'>{list.lpSymbol}</Text></Flex>
                  <Text fontSize="14px">${(getBalanceNumber(list.userData.earnings) * eggPrice).toFixed(2)}</Text>
                </div>
              </Flex>
            </tbody>
          </Collapse>
        </Card>
      ))}
      {stakedNextGenList && stakedNextGenList.map((list, index) => (
        <Card style={{ backgroundColor: '#242542', marginBottom: '5px' }} onClick={() => handleExpandClick(`${list.pid}next`)}>
          <CardContent style={{ padding: 5, backgroundColor: '#242542' }}>
            <Flex justifyContent='space-between' alignItems='center' p={!ismobile ? '5px 10px' : '5px 0'}>
              <div>
                <Flex alignItems="center" justifyContent="center">
                  <img
                    src={`/images/farms/${nextgenImage[index]}.svg`}
                    alt={`${nextgenImage[index]}`}
                    width={35}
                    height={35}
                    style={{ margin: "0 5px" }}
                  />
                  <div>
                    <Text color="white">{list.tokenSymbol}</Text>
                    <Text fontSize="14px" color="#2d74c4" className="farm_type" style={{ minWidth: '100px' }}>NextGen</Text>
                  </div>
                </Flex>
              </div>
              <div>
                <Text fontSize="14px" color='white'>${(getBalanceNumber(list.userData.earnings[0]) * list.tokenPrice).toFixed(2)}</Text>
                {/* <Button variant="contained" style={{ padding: '0px 12px', backgroundColor: '#2d74c4' }}>Claim</Button> */}
                {RenderDualClaimButton(list.poolAddress)}
              </div>
              <div>
                <Text color='white'>{list.lpSymbol === 'CNR' ? getBalanceNumber(list.userData.stakedBalance, 8).toFixed(2) : getBalanceNumber(list.userData.stakedBalance).toFixed(2)}</Text>
                <Button color="error" variant="contained" style={{ padding: '0px 12px', backgroundColor: '#2D3748' }}>Unstake</Button>
              </div>
              <div>
                {!list.active ? <Text className='finished_farm'>{ismobile ? '' : 'Finished'}</Text> : <Text className='farming_farm'>{ismobile ? '' : 'Farming'}</Text>}
              </div>
            </Flex>
          </CardContent>
          <Collapse in={expandCollapse[`${list.pid}next`]} timeout="auto" unmountOnExit sx={{ backgroundColor: 'rgb(55, 55, 100)' }}>
            <Flex justifyContent='space-between' alignItems='center' p='5px 10px'>
              <div>
                <Text color="#2d74c4">APR:</Text>
                <Text color='white'>{nextgenApy[index].times(new BigNumber(100)).toNumber().toFixed(2)}%</Text>
              </div>
              <div>
                <Text color='#2d74c4'>Staked Token:</Text>
                <Text color='white'>{list.lpSymbol === 'CNR' ? getBalanceNumber(list.userData.stakedBalance, 8).toFixed(2) : getBalanceNumber(list.userData.stakedBalance).toFixed(2)}LP</Text>
                <Text>${list.lpSymbol === 'CNR' ? (getBalanceNumber(list.userData.stakedBalance, 8) * nextgenLpWorth[index]).toFixed(2) : (getBalanceNumber(list.userData.stakedBalance) * poolLpWorth[index]).toFixed(2)}</Text>
              </div>
              <div>
                <Text color='#2d74c4'>Rewards:</Text>
                <Flex justifyContent='center' alignItems='center'><Text fontSize="14px" color='white'>{getBalanceNumber(list.userData.earnings[0]).toFixed(2)}</Text><Text fontSize='14px' color='#2d74c4'>{list.tokenSymbol}</Text></Flex>
                <Text fontSize="14px" color='white'>${(getBalanceNumber(list.userData.earnings[0]) * list.tokenPrice).toFixed(2)}</Text>
              </div>
            </Flex>
          </Collapse>
        </Card>
      ))}
    </Flex>
  )
}

export default MobileTable