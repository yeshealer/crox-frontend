import React from 'react'
import { Flex, Text, Button } from 'crox-new-uikit'
import { useHistory } from 'react-router-dom';
import Countdown, { zeroPad } from 'react-countdown';
import { Icon } from '@iconify/react';
import { useMediaQuery } from '@mui/material'
import Fire from './animation/Fire'
import PiggyBank from './animation/PiggyBank';

interface VPotsBodyProps {
    APY: number;
}

const VPotsBody: React.FC<VPotsBodyProps> = ({ APY }) => {
    const history = useHistory()
    const ismobile = useMediaQuery("(max-width: 600px)")
    const renderer = ({ hours, minutes, seconds, days }) => {
        return <span>{zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
    };
    const Grandrenderer = ({ hours, minutes, seconds, days }) => {
        return (
            <Flex alignItems='center'>
                <Text fontSize={ismobile ? '20px' : '24px'} mr={!ismobile ? '25px' : '5px'} mt='-30px' color='lightgrey' bold>in</Text>
                <Flex flexDirection='column' alignItems='center' mr={!ismobile ? '25px' : '5px'}>
                    <Text fontSize={ismobile ? '30px' : '36px'} className='counter' bold>{zeroPad(days)}</Text>
                    <Text fontSize={ismobile ? '20px' : '24px'} color='lightgrey' bold>Days</Text>
                </Flex>
                <Text fontSize={ismobile ? '20px' : '24px'} mr={!ismobile ? '25px' : '5px'} mt='-30px' color='lightgrey' bold>:</Text>
                <Flex flexDirection='column' alignItems='center' mr={!ismobile ? '25px' : '5px'}>
                    <Text fontSize={ismobile ? '30px' : '36px'} className='counter' bold>{zeroPad(hours)}</Text>
                    <Text fontSize={ismobile ? '20px' : '24px'} color='lightgrey' bold>Hours</Text>
                </Flex>
                <Text fontSize={ismobile ? '20px' : '24px'} mr={!ismobile ? '25px' : '5px'} mt='-30px' color='lightgrey' bold>:</Text>
                <Flex flexDirection='column' alignItems='center' mr={!ismobile ? '25px' : '5px'}>
                    <Text fontSize={ismobile ? '30px' : '36px'} className='counter' bold>{zeroPad(minutes)}</Text>
                    <Text fontSize={ismobile ? '20px' : '24px'} color='lightgrey' bold>Mins</Text>
                </Flex>
                <Text fontSize={ismobile ? '20px' : '24px'} mr={!ismobile ? '25px' : '5px'} mt='-30px' color='lightgrey' bold>:</Text>
                <Flex flexDirection='column' alignItems='center'>
                    <Text fontSize={ismobile ? '30px' : '36px'} className='counter' bold>{zeroPad(seconds)}</Text>
                    <Text fontSize={ismobile ? '20px' : '24px'} color='lightgrey' bold>Secs</Text>
                </Flex>
            </Flex>
        )
    };
    return (
        <Flex className='vpotsbody' justifyContent='center' flexDirection={ismobile ? 'column' : 'row'} alignItems='center'>
            <Flex flexDirection='column' mr={!ismobile && '100px'}>
                <Flex className='vpotsbody__card' alignItems='flex-start' justifyContent='space-between'>
                    <Flex alignItems='flex-start'>
                        <Fire />
                        <Flex flexDirection='column' alignItems='flex-start' mr={!ismobile && '50px'}>
                            <Text fontSize={ismobile ? '24px' : '24px'} color='white' bold>HOT VAULT</Text>
                            <Flex flexDirection='column' alignItems='center'>
                                <Text fontSize="18px" color='lightgrey' style={{ fontWeight: '500' }} mt='5px'>BABY <span style={{ color: 'orange' }}>{APY.toFixed(2)}%</span> APY</Text>
                                <Icon icon="akar-icons:plus" />
                                <Text fontSize="18px" color='lightgrey' style={{ fontWeight: '500' }} mt='5px'><span style={{ color: 'orange' }}>3%</span> Fee Rewards</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                    <img alt='baker' src='/images/vpots/bakerred_baby.png' className='vpotsbody__card__img' />
                </Flex>
                <Flex className='vpotsbody__card' alignItems='center' flexDirection='column' mt={20}>
                    <Flex alignItems='center' justifyContent='space-around' style={{ width: '100%' }}>
                        <Flex alignItems='flex-start' justifyContent='space-between'>
                            <Fire />
                            <Flex flexDirection='column' mr={!ismobile && '50px'}>
                                <Text fontSize={ismobile ? '22px' : '24px'} color='white' bold>HOT POT</Text>
                                {/* <Text fontSize={ismobile ? '22px' : '24px'} color='lightgrey' style={{ fontWeight: '500' }} mt='5px'><span style={{ color: 'orange' }}>${(feeUSDValue / 3).toFixed(3)}</span> Prize Pool</Text> */}
                                <Text fontSize='18px' color='lightgrey' style={{ fontWeight: '500' }} mt='5px'><span style={{ color: 'orange' }}>$0</span> Prize Pool</Text>
                                {/* <Text fontSize={ismobile ? '22px' : '24px'} color='orange' bold><Countdown date={endTime} renderer={renderer} /></Text> */}
                            </Flex>
                        </Flex>
                        <PiggyBank />
                    </Flex>
                    {/* <Button className='vpotsbody__card__btn' mt={10} onClick={() => {
                        history.push("/vpots/pot")
                    }}>Win Cake</Button> */}
                </Flex>
            </Flex>
            <Flex className='vpotsbody__grand' flexDirection='column' alignItems='center' mt={ismobile && 20}>
                <Text fontSize={ismobile ? '28px' : '32px'} color='orange' mb={25} mt={50} bold>GRAND POOL</Text>
                {/* <Countdown date={1649495562000} renderer={Grandrenderer} />
                <Flex flexDirection='column' justifyContent='flex-start' alignItems='flex-start' mt={45}>
                    <Flex>
                        <Text fontSize='20px' color='#fdcc1f' bold>Rewards</Text>
                    </Flex>
                    <Flex className='vpotsbody__grand__img'>
                        <img alt='grandImg' src='/images/farms/crox.svg' style={ismobile ? { width: '50px', marginRight: '-10px' } : { width: '50px', marginRight: '15px' }} />
                        <img alt='grandImg' src='/images/farms/crox.svg' style={ismobile ? { width: '50px', marginRight: '-10px' } : { width: '50px', marginRight: '15px' }} />
                        <img alt='grandImg' src='/images/farms/crox.svg' style={ismobile ? { width: '50px', marginRight: '-10px' } : { width: '50px', marginRight: '15px' }} />
                        <img alt='grandImg' src='/images/farms/crox.svg' style={ismobile ? { width: '50px', marginRight: '-10px' } : { width: '50px', marginRight: '15px' }} />
                        <img alt='grandImg' src='/images/farms/crox.svg' style={ismobile ? { width: '50px', marginRight: '-10px' } : { width: '50px', marginRight: '15px' }} />
                        <img alt='grandImg' src='/images/farms/crox.svg' style={ismobile ? { width: '50px', marginRight: '-10px' } : { width: '50px', marginRight: '15px' }} />
                    </Flex>
                </Flex> */}
                <Text fontSize='48px' color='lightgrey' mb={70} mt={30} bold>Coming Soon</Text>
                {/* <Flex flexDirection='column' mb={40} alignItems='center'>
                    <Text fontSize="40px" className="comming" bold>Launches in</Text>
                    <Text fontSize="60px" className="comming" color="#2D74C4" bold><Countdown date={1657645200000} renderer={renderer} autoStart /></Text>
                </Flex> */}
            </Flex>
        </Flex>
    )
}

export default VPotsBody