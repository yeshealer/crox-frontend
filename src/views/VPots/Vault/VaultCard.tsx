import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Flex, Text, Button, useWalletModal, ConnectorId, useMatchBreakpoints, Link } from "crox-new-uikit";
import ReactTooltip from 'react-tooltip';
import { BsPatchQuestion } from "react-icons/bs";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import ReactModal from 'react-modal';
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";

let IsConnected = false;

interface VaultCardProps {
    stakedAmountStr: string;
    isApproved: boolean;
    handleApprove: any;
    stakedBalance: number;
    totalFeeReward: number;
    isHomepage?: boolean;
    nativeTokenPrice: number;
    vaultContract: string;
    nativeToken: string;
    APY: number;
    vpotInfo?: any;
}

const VaultCard: React.FC<VaultCardProps> = ({
    stakedAmountStr,
    isApproved,
    handleApprove,
    stakedBalance,
    totalFeeReward,
    isHomepage,
    nativeTokenPrice,
    vaultContract,
    nativeToken,
    APY,
    vpotInfo
}) => {
    const { account, connect, reset } = useWallet();
    const history = useHistory()
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [isApproving, setIsApproving] = useState(false)

    function closeModal() {
        setIsDepositModalOpen(false);
        setIsWithdrawModalOpen(false);
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

    const { isSm } = useMatchBreakpoints();

    return (
        <Flex className={isHomepage ? "vaultCard homeCard" : "vaultCard"} flexDirection='column'>
            <Text className={isHomepage ? 'vaultCard__badge homeCard__badge' : 'vaultCard__badge'} style={{ letterSpacing: '1px' }} fontSize='18px'>{vpotInfo.vaultCurrency.toUpperCase()} VAULT</Text>
            <Flex justifyContent='space-between' alignItems='center' className={isHomepage ? "vaultCard__first homeCard__first" : "vaultCard__first"}>
                <Flex flexDirection={!isHomepage ? 'row' : 'column'} justifyContent="space-between" style={{ width: '100%' }}>
                    <Flex flexDirection='column' alignItems={isHomepage && !isSm ? 'flex-start' : 'center'}>
                        <Text style={{ letterSpacing: '1px' }} fontSize="18px" color='white'>Auto-Compound</Text>
                        <Flex alignItems='center' mt='-10px' style={{ position: 'relative' }}>
                            <Text style={{ letterSpacing: '1px' }} fontSize="25px" color='white' mr='3px' bold><span style={{ color: 'orange' }}>46.58%</span> APY</Text>
                            {/* <Text style={{ letterSpacing: '1px' }} fontSize="25px" color='white' mr='3px' bold><span style={{ color: 'orange' }}>{APY.toFixed(2)}%</span> APY</Text> */}
                            <BsPatchQuestion style={{ fontSize: '20px' }} data-tip data-for='tip4' />
                            <ReactTooltip id='tip4' aria-haspopup='true' backgroundColor='#264e7c' className="tooltip" >
                                <Text fontSize="14px" color="white">This vault auto-compounds your {vpotInfo.vaultCurrency.toUpperCase()} to acheive maximum APY</Text>
                            </ReactTooltip>
                        </Flex>
                        <Text fontSize="15px" color='white' mt='-10px'>uses {vpotInfo.vaultSite}</Text>
                    </Flex>
                    {!isHomepage ? <img alt='baker' src={`/images/vpots/bakerblue_${vpotInfo.vaultCurrency}.png`} className='vaultCard__img' /> :
                        <Flex alignItems='center' justifyContent='center' style={{ position: 'relative' }}>
                            <Text fontSize="18px" color='white' mr='3px'>Deposit Fee:</Text>
                            <Text fontSize="25px" color='orange' mr='3px' bold>5%</Text>
                            <BsPatchQuestion style={{ fontSize: '20px' }} data-tip data-for='tip3' />
                            <ReactTooltip id='tip3' aria-haspopup='true' backgroundColor='#264e7c' className="tooltip" >
                                <Text bold color="white">Deposit Fee Split (5%)</Text>
                                <Text fontSize="14px" color="white" mt='5px'>3%: Rewards to staked players</Text>
                                <Text fontSize="14px" color="white">1%: Jackpot Pool</Text>
                                <Text fontSize="14px" color="white">1%: CROX Treasury</Text>
                            </ReactTooltip>
                        </Flex>
                    }
                </Flex>
                {isHomepage && !isSm && <img alt='baker' src={`/images/vpots/bakerblue_${vpotInfo.vaultCurrency}.png`} className='vaultCard__img' />}
            </Flex>
            {!isHomepage && <Flex alignItems='center' justifyContent='center' mr='12px' style={{ position: 'relative' }}>
                <Text fontSize="18px" color='white' mr='3px'>Deposit Fee:</Text>
                <Text fontSize="25px" color='orange' mr='3px' bold>5%</Text>
                <BsPatchQuestion style={{ fontSize: '20px' }} data-tip data-for='tip3' />
                <ReactTooltip id='tip3' aria-haspopup='true' backgroundColor='#264e7c' className="tooltip" >
                    <Text bold color="white">Deposit Fee Split (5%)</Text>
                    <Text fontSize="14px" color="white" mt='5px'>3%: Rewards to staked players</Text>
                    <Text fontSize="14px" color="white">1%: Jackpot Pool</Text>
                    <Text fontSize="14px" color="white">1%: CROX Treasury</Text>
                </ReactTooltip>
            </Flex>}
            <Flex alignItems='center' flexDirection='column' mr='12px'>
                {isHomepage ? (
                    <Flex alignItems="center" justifyContent='space-between' flexDirection={!isSm ? 'row' : 'column'} style={{ width: '100%', padding: '0 10px 0 20px' }}>
                        <Flex flexDirection='column' alignItems='center' className="statsCard" mt={10}>
                            <Text fontSize="15px">Next DRAW</Text>
                            <Text fontSize="20px" bold><span style={{ color: 'orange' }}>${(nativeTokenPrice * totalFeeReward / 3).toFixed(3)}</span> Prize Pool</Text>
                            <Button className="vaultCard__btn win_cake" onClick={() => {
                                history.push(`/vpots/pot/${vpotInfo.vaultCurrency}`)
                            }}>Win {vpotInfo.vaultCurrency.toUpperCase()}</Button>
                        </Flex>
                        <Button className='vaultCard__btn view_vault' mt={0} onClick={() => {
                            history.push(`/vpots/vault/${vpotInfo.vaultCurrency}`)
                        }}>View Vault</Button>
                    </Flex>
                ) : (account ? (isApproved ? (stakedBalance > 0 ? (
                    <Flex className="btn_group">
                        <button type="button" onClick={() => setIsWithdrawModalOpen(true)}>Withdraw {vpotInfo.vaultCurrency.toUpperCase()}</button>
                        <button type="button" onClick={() => setIsDepositModalOpen(true)}>+</button>
                    </Flex>
                ) : (
                    <Button className='vaultCard__btn' onClick={() => setIsDepositModalOpen(true)}>Deposit {vpotInfo.vaultCurrency.toUpperCase()}</Button>
                )) : (
                    <Button className='vaultCard__btn' onClick={async () => {
                        setIsApproving(true)
                        await handleApprove()
                        setIsApproving(false)
                    }}>{isApproving ? 'Approving...' : 'Approve'}</Button>
                )) : (
                    <Button className='vaultCard__btn' onClick={onPresentNewConnectModal}>Connect Wallet</Button>
                ))}
                {/* <Button className='vaultCard__btn' disabled>Deposit {vpotInfo.vaultCurrency.toUpperCase()}</Button> */}
                {!isHomepage && <Text fontSize="14px" color='white' mb='20px'>No minimum deposit</Text>}
            </Flex>
            <ReactModal isOpen={isDepositModalOpen} style={customStyles} bodyOpenClassName="modalBody">
                <DepositModal onDismiss={() => closeModal()} vaultContract={vaultContract} nativeToken={nativeToken} vpotInfo={vpotInfo} />
            </ReactModal>
            <ReactModal isOpen={isWithdrawModalOpen} style={customStyles} bodyOpenClassName="modalBody">
                <WithdrawModal onDismiss={() => closeModal()} stakedBalance={stakedBalance} stakedAmountStr={stakedAmountStr} vaultContract={vaultContract} vpotInfo={vpotInfo} />
            </ReactModal>
        </Flex >
    )
}

export default VaultCard