import React, { useState } from 'react'
import styled from "styled-components";
import { Flex, Text } from 'crox-new-uikit'
import { useMediaQuery } from '@mui/material'
import ExpandableSectionButton from "components/ExpandableSectionButton";

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? "100%" : "0px")};
  overflow: hidden;
  margin: ${(props) => (props.expanded ? "10px 20px" : "0px")};
  background-color: transparent;
  .description {
    text-align: center;
  }
  .step {
    padding: 0 100px;
    width: 100%;
    margin-top: 20px;
    .step_card {
        width: calc(100% / 3.5);
        background-color: #00000020;
        padding: 10px;
        border-radius: 20px;
        .card_header {
            width: 100%;
            .number {
                font-size: 27px;
                font-weight: bold;
                color: black;
                width: 40px;
                height: 40px;
                border-radius: 30px;
                background-color: white;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
  }
  @media screen and (max-width: 1600px) {
    .step {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: 50px;
        .step_card {
            width: 100%;
            margin-top: 10px;
        }
    }
  }
  @media screen and (max-width: 1000px) {
    .step {
        padding: 0;
        grid-template-columns: repeat(1, 1fr);
        .step_card {
            width: 100%;
        }
    }
  }
`;

const VPotsHeader = ({ title }) => {
    const [showExpandableSection, setShowExpandableSection] = useState(false);

    const ismobile = useMediaQuery("(max-width: 600px)")
    return (
        <Flex className='vpotsheader' flexDirection='column' justifyContent='center'>
            <Flex className='vpotsheader__title' flexDirection='column' alignItems='center' justifyContent='center'>
                <Text color='white' fontSize='32px' bold>{title}</Text>
                {title === "VPOTS" && <Text color='lightgrey' fontSize={ismobile ? '20px' : '24px'} style={{ fontWeight: '500' }}>Auto Compounding Vaults + Jackpots</Text>}
            </Flex>
            <Flex flexDirection='column' className='vpotsheader__sub'>
                <Flex alignItems='center' justifyContent='space-between' style={{ cursor: 'pointer', borderBottom: '1px dashed grey' }} onClick={() => setShowExpandableSection(!showExpandableSection)}>
                    <Text className='title' bold>How to Play, Earn & Win</Text>
                    <ExpandableSectionButton
                        onClick={() => setShowExpandableSection(!showExpandableSection)}
                        expanded={showExpandableSection}
                    />
                </Flex>
                <ExpandingWrapper expanded={showExpandableSection}>
                    <Flex justifyContent='center' flexDirection='column' alignItems='center'>
                        <Text className='description'>VPOTS is a unique strategy which creates a new use case for any onboarded project token. Earlier you enter, longer you stay in the pool earns you higher rewards (Unlimited).
                            To win massive jackpots, you need more odds. Staking more CROX gives you higher odds and also higher rewards from the pot.</Text>
                        <Flex flexDirection={ismobile ? 'column' : 'row'} justifyContent='space-between' className='step'>
                            <Flex className='step_card' flexDirection='column'>
                                <Flex alignItems='center' className='card_header'>
                                    <Text className='number'>1</Text>
                                    <Text ml="10px" fontSize='24px' bold>Deposit in VAULT</Text>
                                </Flex>
                                <Flex flexDirection='column' p="3px 0 0 20px" style={{ height: '100%' }}>
                                    <Text fontSize='14px'>Stake in any VPOTS vaults listed on the dapp and
                                        stand a chance to win a bi-weekly jackpot. Each vault is unique
                                        and has it’s own POT. Follow the minimum deposit eligibility criteria
                                        of each individual vpot.</Text>
                                    <Text fontSize='14px' mb='20px'>There is no minimum deposit requirements if you are not interested
                                        in entering the jackpot pool. You will still earn 3% Fee distribution rewards.</Text>
                                    <Flex flexDirection='column'>
                                        <Text fontSize='14px'>Depositing in vault will provide 2 types of passive income.</Text>
                                        <Flex flexDirection='column' p="0 0 0 10px">
                                            <Text fontSize='14px'>1. Fee rewards earned from every new deposit (unlimited earnings)</Text>
                                            <Text fontSize='14px'>2. Auto-compounding APY% from the staking pool</Text>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            </Flex>
                            <Flex className='step_card' flexDirection='column'>
                                <Flex alignItems='center' className='card_header'>
                                    <Text className='number'>2</Text>
                                    <Text ml="10px" fontSize='24px' bold>Claim & Re-invest </Text>
                                </Flex>
                                <Flex flexDirection='column' p="3px 0 0 20px" style={{ height: '100%' }}>
                                    <Text fontSize='14px'><li>Claim your fee rewards anytime instantly from each new deposit in to the vault.</li></Text>
                                    <Text fontSize='14px'><li>Re-invest your Fee rewards to increase your stake to earn more
                                        APY rewards and Fee rewards.</li></Text>
                                    <Text fontSize='14px'><li>No cap on earnings(Unlimited). Longer you stake more you earn from
                                        deposit fee rewards paid by new depositors. Infinite cycle of rewards. </li></Text>
                                </Flex>
                            </Flex>
                            <Flex className='step_card' flexDirection='column'>
                                <Flex alignItems='center' className='card_header'>
                                    <Text className='number'>3</Text>
                                    <Text ml="10px" fontSize='24px' bold>Stake CROX, Win a Jackpot</Text>
                                </Flex>
                                <Flex flexDirection='column' p="3px 0 0 20px" style={{ height: '100%' }}>
                                    <Text fontSize='14px' mb='20px'>There will be a jackpot draw for each associated vault every 15 days.
                                        To participate in this draw you need to stake CROX tokens and have a qualified
                                        deposit in the vault associated with the pot.</Text>
                                    <Text fontSize='14px'>Example: CAKE VPOT</Text>
                                    <Flex flexDirection='column' p="0 0 0 10px">
                                        <Text fontSize='14px'>1. You need to deposit minimum 20 CAKE into CAKE Vault listed on vpots</Text>
                                        <Text fontSize='14px'>2. You need to stake CROX in CAKE POT and wait until the draw date to win a jackpot</Text>
                                    </Flex>
                                    <Text fontSize='14px'>It is a NO LOSS POT, which means your 100% staked CROX can be withdrawn
                                        after the draw and also you will earn 20% share of prize pool rewards for staking CROX.</Text>
                                    <Text fontSize='14px'>Odds are calculated based on number of CROX tokens you stake.</Text>
                                    <Text fontSize='14px'>More CROX you stake, more chances to win the pot.</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                </ExpandingWrapper>
            </Flex>
        </Flex>
    )
}

export default VPotsHeader
