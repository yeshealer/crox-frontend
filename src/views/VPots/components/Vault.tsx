import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import Countdown, { zeroPad } from 'react-countdown';
import { Flex, Text, Button } from "crox-new-uikit";
import ReactTooltip from 'react-tooltip';
import { BsPatchQuestion } from "react-icons/bs";
import ExpandableSectionButton from "components/ExpandableSectionButton";

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? "100%" : "0px")};
  overflow: hidden;
`;

interface VaultProps {
    stakerCount: number[];
    feeDistributed: number[];
    APY: number[];
    totalFeeReward: number[];
    pendingRewardPerUser: number[];
    vpotData: any;
    isUpcoming?: boolean;
    index: number;
}

const Vault: React.FC<VaultProps> = ({
    stakerCount,
    feeDistributed,
    APY,
    totalFeeReward,
    pendingRewardPerUser,
    vpotData,
    isUpcoming,
    index
}) => {
    const [showExpandableSection, setShowExpandableSection] = useState(false);
    const clockStartRef = useRef(null)
    const handleStartGroup = () => clockStartRef.current.start()

    useEffect(() => {
        if (isUpcoming) {
            handleStartGroup()
        }
    })

    const history = useHistory();
    const renderer = ({ hours, minutes, seconds, days }) => {
        return <span>{zeroPad(days)}d:{zeroPad(hours)}h:{zeroPad(minutes)}m:{zeroPad(seconds)}s</span>;
    };
    return (
        <Flex className='vpotsfooter__borderCard'>
            <Text className='vpotsfooter__borderCard__badge' style={{ letterSpacing: '1px' }} fontSize='18px' bold>{vpotData.vaultCurrency.toUpperCase()} VAULT</Text>
            {isUpcoming && <Text className='vpotsfooter__borderCard__timeBadge' fontSize='16px' bold><Countdown date={vpotData.startDate} renderer={renderer} ref={clockStartRef} autoStart={false} /></Text>}
            <Flex flexDirection='column' className="vpotsfooter__borderCard__body">
                <Flex justifyContent='space-between'>
                    <Flex flexDirection='column' alignItems='center'>
                        <Text style={{ letterSpacing: '1px' }} fontSize="25px" color='white' bold><span style={{ color: 'orange' }}>{stakerCount[index]}</span> Players</Text>
                        <Text style={{ letterSpacing: '1px' }} fontSize="15px" color='lightgrey' mt='-10px'>in the pool</Text>
                        <Text style={{ letterSpacing: '1px' }} fontSize="20px" color='lightgrey'>Auto-Compound</Text>
                        <Flex alignItems='center' mt='-10px' style={{ position: 'relative' }}>
                            <Text style={{ letterSpacing: '1px' }} fontSize="25px" color='white' mr='3px' bold><span style={{ color: 'orange' }}>{APY[index].toFixed(2)}%</span> APY</Text>
                            <BsPatchQuestion style={{ fontSize: '20px' }} data-tip data-for='tip4' />
                            <ReactTooltip id='tip4' aria-haspopup='true' backgroundColor='#264e7c' className="tooltip" >
                                <Text fontSize="14px" color="white">This vault auto-compounds your {vpotData.vaultCurrency.toUpperCase()} to acheive maximum APY</Text>
                            </ReactTooltip>
                        </Flex>
                        <Text fontSize="15px" color='lightgrey' mt='-10px'>uses {vpotData.vaultSite}</Text>
                    </Flex>
                    <img alt='baker' src={`/images/vpots/bakerblue_${vpotData.vaultCurrency}.png`} className='vpotsfooter__borderCard__img' />
                </Flex>
                <Flex alignItems='center' justifyContent='center' mr='12px' style={{ position: 'relative' }}>
                    <Text fontSize="20px" color='white' mr='3px'>Fee Distributed:</Text>
                    <Text fontSize="25px" color='white' mr='3px' bold><span style={{ color: 'orange' }}>{totalFeeReward[index].toFixed(3)}</span> {vpotData.vaultCurrency.toUpperCase()}</Text>
                    <BsPatchQuestion style={{ fontSize: '20px' }} data-tip data-for='tip2' />
                    <ReactTooltip id='tip2' aria-haspopup='true' backgroundColor='#264e7c' className="tooltip" >
                        <Text fontSize="14px" color="white">3% of the deposit fee is distributed among all players in the pool proportional to their staked amount.</Text>
                        <Text fontSize="14px" color="orange">The longer you stay and the more you stake, higher the rewards.</Text>
                    </ReactTooltip>
                </Flex>
                <Flex alignItems='center' justifyContent='center' mr='12px' mt='-10px' style={{ position: 'relative' }}>
                    <Text fontSize="20px" color='white' mr='3px'>Deposit Fee:</Text>
                    <Text fontSize="25px" color='orange' mr='3px' bold>5%</Text>
                    <BsPatchQuestion style={{ fontSize: '20px' }} data-tip data-for='tip3' />
                    <ReactTooltip id='tip3' aria-haspopup='true' backgroundColor='#264e7c' className="tooltip" >
                        <Text bold color="white">Deposit Fee Split (5%)</Text>
                        <Text fontSize="14px" color="white" mt='5px'>3%: Rewards to staked players</Text>
                        <Text fontSize="14px" color="white">1%: Jackpot Pool</Text>
                        <Text fontSize="14px" color="white">1%: CROX Treasury</Text>
                    </ReactTooltip>
                </Flex>
                {!isUpcoming && <Flex alignItems='center' flexDirection='column' mr='12px' mt='-10px'>
                    <Button className='vpotsfooter__borderCard__body__btn' mt={10} onClick={() => {
                        history.push(`/vpots/vault/${vpotData.vaultCurrency}`)
                    }}>View Vault</Button>
                    <Text fontSize="15px" color='lightgrey'>No minimum deposit</Text>
                </Flex>}
                <Flex flexDirection='column' mt='10px' p='10px' pt='5px' style={{ borderTop: '1px solid #0e48de', borderTopStyle: 'dotted' }}>
                    <Flex alignItems='center' justifyContent='space-between' style={{ cursor: 'pointer' }} onClick={() => setShowExpandableSection(!showExpandableSection)}>
                        <Flex>
                            <Text fontSize="18px" color='lightgrey' mr='3px' bold>My {vpotData.vaultCurrency.toUpperCase()} Earnings: </Text>
                            <Text fontSize="18px" color='lightgrey' mr='3px' bold><span style={{ color: 'orange' }}>{(feeDistributed[index] + pendingRewardPerUser[index]).toFixed(3)}</span> {vpotData.vaultCurrency.toUpperCase()}</Text>
                        </Flex>
                        <ExpandableSectionButton
                            onClick={() => setShowExpandableSection(!showExpandableSection)}
                            expanded={showExpandableSection}
                        />
                    </Flex>
                    <ExpandingWrapper expanded={showExpandableSection}>
                        <Flex>
                            <Text color="lightgrey" mr='3px'>Auto-Compound Rewards:</Text>
                            <Text color="lightgrey"><span style={{ color: 'orange' }}>{feeDistributed[index].toFixed(3)}</span> {vpotData.vaultCurrency.toUpperCase()}</Text>
                        </Flex>
                        <Flex>
                            <Text color="lightgrey" mr='3px'>Fee Rewards:</Text>
                            <Text color="lightgrey"><span style={{ color: 'orange' }}>{pendingRewardPerUser[index].toFixed(3)}</span> {vpotData.vaultCurrency.toUpperCase()}</Text>
                        </Flex>
                    </ExpandingWrapper>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Vault;