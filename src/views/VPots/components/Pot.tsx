import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Flex, Text, Button } from "crox-new-uikit";
import ReactTooltip from 'react-tooltip';
import { BsPatchQuestion } from "react-icons/bs";
import ExpandableSectionButton from "components/ExpandableSectionButton";
import PiggyBank from "../animation/PiggyBank";

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? "100%" : "0px")};
  overflow: hidden;
`;

interface PotProps {
    index: number;
    feeUSDValue: number[];
    jackpotCounters: number[];
    vpotData: any;
}

const Pot: React.FC<PotProps> = ({
    feeUSDValue,
    jackpotCounters,
    vpotData,
    index
}) => {
    const [showExpandableSection, setShowExpandableSection] = useState(false);
    const history = useHistory()
    return (
        <Flex className='vpotsfooter__borderCard orangeCard'>
            <Text className='vpotsfooter__borderCard__badge orangeBadge' style={{ letterSpacing: '1px' }} fontSize='18px' bold>{vpotData.vaultCurrency.toUpperCase()} POT</Text>
            <Flex flexDirection='column' className="vpotsfooter__borderCard__body">
                <Flex justifyContent='space-between'>
                    <Flex flexDirection='column' alignItems='center'>
                        {/* <Text style={{ letterSpacing: '1px' }} fontSize="25px" color='white' bold><span style={{ color: 'orange' }}>0</span> Players</Text> */}
                        <Text style={{ letterSpacing: '1px' }} fontSize="25px" color='white' bold><span style={{ color: 'orange' }}>{jackpotCounters[index]}</span> Players</Text>
                        <Text style={{ letterSpacing: '1px' }} fontSize="15px" color='lightgrey' mt='-10px'>in the pool</Text>
                        <Text style={{ letterSpacing: '1px' }} fontSize="20px" color='lightgrey'>Total Prize</Text>
                        <Flex alignItems='center' mt='-10px'>
                            <Text style={{ letterSpacing: '1px' }} fontSize="25px" color='orange' mr='3px' bold>${(feeUSDValue[index] / 3).toFixed(3)}</Text>
                            {/* <Text style={{ letterSpacing: '1px' }} fontSize="25px" color='orange' mr='3px' bold>TBA</Text> */}
                            <BsPatchQuestion style={{ fontSize: '20px' }} data-tip data-for='tip1' />
                            <ReactTooltip id='tip1' aria-haspopup='true' backgroundColor='#264e7c' className="tooltip" >
                                <Text bold color="white">Prize Split</Text>
                                <Text fontSize="14px" color="white" mt='5px'>70%: One Winner</Text>
                                <Text fontSize="14px" color="white">20%: Distributed to all Players</Text>
                                <Text fontSize="14px" color="white">10%: Monthly Grand Pool</Text>
                            </ReactTooltip>
                        </Flex>
                        <Text style={{ letterSpacing: '1px' }} fontSize="15px" color='lightgrey' mt='-10px'>in {vpotData.vaultCurrency.toUpperCase()}</Text>
                    </Flex>
                    <PiggyBank />
                </Flex>
                <Flex alignItems='center' flexDirection='column' mr='12px' mt='-10px'>
                    <Button className='vpotsfooter__borderCard__body__btn' mt={10} onClick={() => {
                        history.push(`/vpots/pot/${vpotData.vaultCurrency}`)
                    }}>Play with {vpotData.jackpotCurrency.toUpperCase()}</Button>
                    <Text fontSize="15px" color='lightgrey'>No minimum deposit</Text>
                </Flex>
                <Flex flexDirection='column' mt='10px' p='10px' pt='5px' style={{ borderTop: '1px solid #ec366e', borderTopStyle: 'dotted' }}>
                    <Flex alignItems='center' justifyContent='space-between' style={{ cursor: 'pointer' }} onClick={() => setShowExpandableSection(!showExpandableSection)}>
                        <Text fontSize="18px" color='lightgrey' mr='3px' bold>No Loss Pot </Text>
                        <ExpandableSectionButton
                            onClick={() => setShowExpandableSection(!showExpandableSection)}
                            expanded={showExpandableSection}
                        />
                    </Flex>
                    <ExpandingWrapper expanded={showExpandableSection}>
                        <Text color="lightgrey" fontSize="14px">20% of the prize pool is shared with all players in the pool</Text>
                        <Text color="lightgrey" fontSize="18px" bold>No Deposit Fee</Text>
                    </ExpandingWrapper>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Pot;