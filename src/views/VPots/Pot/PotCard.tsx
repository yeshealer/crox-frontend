import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { Flex, Text, Button, ConnectorId, useWalletModal } from "crox-new-uikit";
import ReactTooltip from 'react-tooltip';
import { BsPatchQuestion } from "react-icons/bs";
import ReactModal from 'react-modal';
import { Icon } from '@iconify/react';
import ExpandableSectionButton from "components/ExpandableSectionButton";
import PiggyBank from "../animation/PiggyBank";
import Congratulation from "../animation/Congratulation"
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";
import vpotsInfo from "../VpotsInfo.json"

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? "100%" : "0px")};
  overflow: hidden;
`;

let IsConnected = false;

interface PotCardProps {
    isApproved: boolean;
    handleApprove: any;
    stakedBalance: number;
    jackpotCounters: number;
    totalPrize: number;
    stakedAmountStr: string;
    winners: any;
    claimHistory: any;
    vpotType: string;
}

const PotCard: React.FC<PotCardProps> = ({
    isApproved,
    handleApprove,
    stakedBalance,
    jackpotCounters,
    totalPrize,
    stakedAmountStr,
    winners,
    claimHistory,
    vpotType
}) => {
    const { account, connect, reset } = useWallet()
    const [showExpandableSectionDescription, setShowExpandableSectionDescription] = useState(false);
    const [showExpandableSectionWinner, setShowExpandableSectionWinner] = useState(false);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const [congWinner, setCongWinner] = useState(false);

    function closeModal() {
        setIsDepositModalOpen(false);
        setIsWithdrawModalOpen(false);
        setCongWinner(false);
    }

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: "transparent",
            border: 'none',
            overflow: 'hidden',
        },
    };

    ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(0, 0, 0, 0.5)';

    const handleLogin = (connectorId: ConnectorId) => {
        IsConnected = true;
        switch (connectorId) {

            case "bsc":
                {
                    connect("bsc");
                    break;
                }
            case "walletconnect":
                {
                    connect("walletconnect");
                    break;
                }
            default:
                connect("injected");
        }
    }

    const { onPresentNewConnectModal } = useWalletModal(
        handleLogin,
        reset,
        account as string
    );

    useEffect(() => {
        if (Date.now() > 1659114000000 && Date.now() < 1659546000000) {
            setDisableButton(true)
        } else {
            setDisableButton(false)
        }
    })

    useEffect(() => {
        for (let j = 0; j < winners.length; j++) {
            if (account === winners[j].winnerWallet) {
                setCongWinner(true);
            }
        }
    }, [account])

    return (
        <Flex className='potCard' mb='10px'>
            <Text className='potCard__badge' style={{ letterSpacing: '1px' }} fontSize='18px'>{vpotType.toUpperCase()} POT</Text>
            <Flex flexDirection='column' className="vpotsfooter__borderCard__body">
                <Flex justifyContent='space-between'>
                    <Flex flexDirection='column' alignItems='center'>
                        {/* <Text style={{ letterSpacing: '1px' }} fontSize="25px" color='white' bold><span style={{ color: 'orange' }}>0</span> Players</Text> */}
                        <Text style={{ letterSpacing: '1px' }} fontSize="25px" color='white' bold><span style={{ color: 'orange' }}>{jackpotCounters}</span> Players</Text>
                        <Text style={{ letterSpacing: '1px' }} fontSize="15px" color='white' mt='-10px'>in the pool</Text>
                        <Text style={{ letterSpacing: '1px' }} fontSize="20px" color='white'>Total Prize</Text>
                        <Flex alignItems='center' mt='-10px'>
                            {/* <Text style={{ letterSpacing: '1px' }} fontSize="25px" color='orange' mr='3px' bold>TBA</Text> */}
                            <Text style={{ letterSpacing: '1px' }} fontSize="25px" color='orange' mr='3px' bold>${(totalPrize / 3).toFixed(3)}</Text>
                            <BsPatchQuestion style={{ fontSize: '20px' }} data-tip data-for='tip1' />
                            <ReactTooltip id='tip1' aria-haspopup='true' backgroundColor='#264e7c' className="tooltip" >
                                <Text bold color="white">Prize Split</Text>
                                <Text fontSize="14px" color="white" mt='5px'>70%: One Winner</Text>
                                <Text fontSize="14px" color="white">20%: Distributed to all Players</Text>
                                <Text fontSize="14px" color="white">10%: Monthly Grand Pool</Text>
                            </ReactTooltip>
                        </Flex>
                        <Text style={{ letterSpacing: '1px' }} fontSize="15px" color='white' mt='-10px'>in {vpotType.toUpperCase()}</Text>
                    </Flex>
                    <PiggyBank />
                </Flex>
                <Flex alignItems='center' flexDirection='column' mr='12px'>
                    {!disableButton && (account ? (isApproved ? (stakedBalance > 0 ? (
                        <Flex className="btn_group">
                            <button type="button" onClick={() => setIsWithdrawModalOpen(true)}>Unstake CROX</button>
                            {!(Date.now() > 1659546000000) && <button type="button" onClick={() => setIsDepositModalOpen(true)}>+</button>}
                        </Flex>
                    ) : (
                        <Button className='vaultCard__btn' onClick={() => setIsDepositModalOpen(true)}>Stake CROX</Button>
                    )) : (
                        <Button className='vaultCard__btn' onClick={handleApprove}>Approve</Button>
                    )) : (
                        <Button className='vaultCard__btn' onClick={onPresentNewConnectModal}>Connect Wallet</Button>
                    ))}
                    <Text style={{ letterSpacing: '1px' }} fontSize="15px" color='white'>No minimum deposit</Text>
                    <Flex flexDirection='column'>
                        <Text color='yellow'><li>Unstake CROX to claim rewards.</li></Text>
                        <Text color='yellow'><li>Earned rewards are claimed automatically when you unstake CROX.</li></Text>
                    </Flex>
                </Flex>
                <Flex flexDirection='column' mt='10px' p='10px' pt='5px' style={{ borderTop: '1px solid #ec366e', borderTopStyle: 'dotted' }}>
                    <Flex alignItems='center' justifyContent='space-between' style={{ cursor: 'pointer' }} onClick={() => setShowExpandableSectionDescription(!showExpandableSectionDescription)}>
                        <Text fontSize="18px" color='white' mr='3px' bold>No Loss Pot </Text>
                        <ExpandableSectionButton
                            onClick={() => setShowExpandableSectionDescription(!showExpandableSectionDescription)}
                            expanded={showExpandableSectionDescription}
                        />
                    </Flex>
                    <ExpandingWrapper expanded={showExpandableSectionDescription}>
                        <Text fontSize="14px">20% of the prize pool is shared with all players in the pool</Text>
                        <Text fontSize="18px" bold>No Deposit Fee</Text>
                    </ExpandingWrapper>
                </Flex>

                <Flex flexDirection='column' mt='10px' p='10px' pt='5px' style={{ borderTop: '1px solid #ec366e', borderTopStyle: 'dotted' }}>
                    <Flex alignItems='flex-start' justifyContent='space-between' style={{ cursor: 'pointer' }} onClick={() => setShowExpandableSectionWinner(!showExpandableSectionWinner)}>
                        <Text fontSize="18px" bold>Winners</Text>
                        <ExpandableSectionButton
                            onClick={() => setShowExpandableSectionWinner(!showExpandableSectionWinner)}
                            expanded={showExpandableSectionWinner}
                        />
                    </Flex>
                    <ExpandingWrapper expanded={showExpandableSectionWinner}>
                        <div style={{ marginBottom: '10px' }}>
                            {winners.map((winner) => {
                                return (
                                    <Flex style={{ marginBottom: 0 }} justifyContent="space-between" alignItems='center'>
                                        <Text color="lightgrey">{winner.winningDate}</Text>
                                        <Text color="lightgrey">{winner.winnerWallet.slice(0, 4)}...{winner.winnerWallet.slice(-4)}</Text>
                                        <Flex alignItems='center' onClick={() => window.open(`https://bscscan.com/tx/${winner.transactionHash}`, '_blank')} style={{ cursor: 'pointer' }}>
                                            <Text color="lightgrey">{winner.winAmount} {vpotType.toUpperCase()}</Text>
                                            <Icon icon="line-md:external-link-rounded" color="lightgrey" />
                                        </Flex>
                                    </Flex>
                                )
                            })}
                        </div>
                    </ExpandingWrapper>
                </Flex>
            </Flex>
            <ReactModal isOpen={isDepositModalOpen} style={customStyles} bodyOpenClassName="modalBody">
                <DepositModal onDismiss={() => closeModal()} />
            </ReactModal>
            <ReactModal isOpen={isWithdrawModalOpen} style={customStyles} bodyOpenClassName="modalBody">
                <WithdrawModal onDismiss={() => closeModal()} stakedBalance={stakedBalance} stakedAmountStr={stakedAmountStr} />
            </ReactModal>
            <ReactModal isOpen={congWinner} style={customStyles} onRequestClose={() => closeModal()} bodyOpenClassName="modalBody">
                <Flex flexDirection='column' alignItems='center' justifyContent="center" className="congratulation">
                    <Congratulation />
                    <Text fontSize="30px" color="yellow" bold>Congratulations!</Text>
                    <Text fontSize="20px">You have won <span style={{ color: 'yellow', fontWeight: 'bold' }}>12.616 {vpotType.toUpperCase()}</span> on Aug 3th, 2022.</Text>
                </Flex>
            </ReactModal>
        </Flex>
    )
}

export default PotCard;
