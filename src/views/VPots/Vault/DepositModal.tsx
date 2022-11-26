import React, { useEffect, useState, useCallback } from 'react'
import { Flex, Text, Link, Button, Checkbox } from 'crox-new-uikit'
import axios from 'axios'
import { Icon } from '@iconify/react';
import ReactModal from 'react-modal';
import { Player } from '@lottiefiles/react-lottie-player';
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { useMediaQuery } from '@mui/material';
import BigNumber from "bignumber.js";
import { useVaultContract } from 'hooks/useContract';

const DepositModal = ({
    onDismiss,
    vaultContract,
    nativeToken,
    vpotInfo
}) => {
    const { account } = useWallet();
    const [cakeBalance, setCakeBalance] = useState(null)
    const [inputValue, setInputValue] = useState(null)
    const [isWaiting, setIsWaiting] = useState(false)
    const [isChecked, setIsChecked] = useState(false)
    const [isAccepted, setIsAccepted] = useState(false)
    const [isFail, setIsFail] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [headerText, setHeaderText] = useState(`Deposit ${vpotInfo.vaultCurrency.toUpperCase()}`)
    const [transactionHash, setTransactionHash] = useState("")
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(true)

    useEffect(() => {
        axios.get(`https://openapi.debank.com/v1/user/token?id=${account}&chain_id=bsc&token_id=${nativeToken}`).then(res => {
            setCakeBalance((Object.values(res.data)[14]) < 10 ** -5 ? '0' : (new BigNumber(Object.values(res.data)[14])).toJSON().toString())
        })
    }, [account])

    const setValue = useCallback((percent: BigNumber) => {
        setInputValue((new BigNumber(cakeBalance).times(percent)).toFixed())
    }, [cakeBalance])

    const handleChange = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            const RE = /^\d*\.?\d{0,18}$/
            if (RE.test(e.currentTarget.value)) {
                setInputValue((e.currentTarget.value as unknown) as number);
            }
        },
        [setInputValue]
    );

    const ismobile = useMediaQuery("(max-width: 600px)")

    const contract = useVaultContract(vaultContract)

    const handleDeposit = async () => {
        try {
            const inputAmount = new BigNumber(inputValue).times(new BigNumber(10).pow(18)).toString();
            const txHash = await contract.methods.deposit(inputAmount).send({ from: account });
            return txHash;
        } catch (error) {
            return error;
        }
    }

    const onConfirmResult = (res) => {
        setTransactionHash(res.transactionHash)
        if (res.status) {
            return setIsSuccess(true)
        }
        return setIsFail(true)
    }

    useEffect(() => {
        if (isWaiting) {
            setHeaderText(`Depositing ${vpotInfo.vaultCurrency.toUpperCase()}`)
        } else if (isFail) {
            setHeaderText("Failed")
        } else if (isSuccess) {
            setHeaderText("Success!")
        }
    }, [isWaiting, isFail, isSuccess])

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

    function closeModal() {
        setIsConfirmModalOpen(false);
    }

    const verifyCheck = () => {
        if (account) {
            if (isChecked && localStorage.getItem(`${vpotInfo.vaultCurrency}VaultStatus`) !== "true") {
                setIsChecked(false);
            }
            else {
                setIsChecked(true);
            }
        }
    }

    useEffect(() => {
        if (localStorage.getItem(`${vpotInfo.vaultCurrency}VaultStatus`) === "true" && account) {
            setIsChecked(true)
            setIsAccepted(true)
        }
    }, [account])

    return (
        <Flex className='depositModal' flexDirection="column" justifyContent="flex-start">
            <Flex className='modalHealer' justifyContent="space-between" alignItems='center' mb='25px'>
                <Text fontSize="20px" bold>{headerText}</Text>
                <Icon icon="eva:close-fill" width="27" height="27" style={{ cursor: 'pointer' }} onClick={() => onDismiss()} />
            </Flex>
            <div>
                {isWaiting ? (
                    <Flex flexDirection='column' alignItems="center">
                        <Player
                            autoplay
                            loop
                            src="https://assets8.lottiefiles.com/packages/lf20_rPGSco.json"
                            style={{ height: '200px', width: '300px' }}
                        />
                        <Text fontSize='18px'>Depositing {inputValue} {vpotInfo.vaultCurrency.toUpperCase()}</Text>
                    </Flex>
                ) : (isFail ? (
                    <Flex flexDirection='column' alignItems="center">
                        <Player
                            autoplay
                            loop
                            src="https://assets6.lottiefiles.com/temp/lf20_yYJhpG.json"
                            style={{ height: '250px', width: '300px' }}
                        />
                        {transactionHash && <Flex alignItems='center' mt='20px' mb='-10px'>
                            <Link href={`https://bscscan.com/tx/${transactionHash}`} fontSize="20px" color='white' mr='3px' style={{ fontWeight: 'normal' }}>View on Bscscan</Link>
                            <Icon icon="akar-icons:link-out" width='20px' height='20px' />
                        </Flex>}
                    </Flex>
                ) : (isSuccess ? (
                    <Flex flexDirection='column' alignItems="center" mb='10px'>
                        <Player
                            autoplay
                            loop
                            src="https://assets1.lottiefiles.com/packages/lf20_ya4ycrti.json"
                            style={{ height: '250px', width: '300px' }}
                        />
                        <Flex alignItems='center' mt='20px' mb='-10px'>
                            <Link href={`https://bscscan.com/tx/${transactionHash}`} fontSize="20px" color='white' mr='3px' style={{ fontWeight: 'normal' }}>View on Bscscan</Link>
                            <Icon icon="akar-icons:link-out" width='20px' height='20px' />
                        </Flex>
                    </Flex>
                ) : (
                    <Flex flexDirection='column' justifyContent='flex-end' alignItems='end'>
                        <Text fontSize='14px'>{cakeBalance} {vpotInfo.vaultCurrency.toUpperCase()} Available</Text>
                        <Flex className='deposit_group'>
                            <input className='deposit_balance' size={ismobile ? 20 : 30} value={inputValue} onChange={handleChange} />
                            <button type='button' className='max_btn' onClick={() => setValue(new BigNumber(1))}>max</button>
                        </Flex>
                        <div className='percent_btnGroup'>
                            <button type='button' className='percent_btn' onClick={() => setValue(new BigNumber(0))}>0%</button>
                            <button type='button' className='percent_btn' onClick={() => setValue(new BigNumber(.25))}>25%</button>
                            <button type='button' className='percent_btn' onClick={() => setValue(new BigNumber(.5))}>50%</button>
                            <button type='button' className='percent_btn' onClick={() => setValue(new BigNumber(.75))}>75%</button>
                        </div>
                        {!isChecked && <Flex alignItems='center' alignSelf='flex-start' mt='10px'>
                            <Icon icon="emojione:warning" width={14} />
                            <Text color='yellow' ml='3px'>You have to confirm Risk Warning</Text>
                        </Flex>}
                        <Flex mt={!isChecked ? '10px' : '25px'} className='action_btnGroup' justifyContent='space-around'>
                            {!isChecked || cakeBalance < inputValue || inputValue === '0' || !inputValue ? (
                                <button type="button" disabled>Deposit</button>
                            ) : (
                                <button type="button"
                                    onClick={async () => {
                                        setIsWaiting(true)
                                        const res = await handleDeposit()
                                        setIsWaiting(false)
                                        onConfirmResult(res)
                                    }}
                                // onClick={() => { setIsConfirmModalOpen(true) }}
                                >Deposit</button>
                            )}
                            <button type="button" onClick={() => onDismiss()}>Cancel</button>
                        </Flex>
                    </Flex>
                )))}
            </div >
            <ReactModal isOpen={isConfirmModalOpen && !isAccepted} style={customStyles} bodyOpenClassName="modalBody">
                <Flex className='depositModal' flexDirection='column' alignItems='center'>
                    <Icon icon="eva:close-fill" width="27" height="27" className='closeIcon' style={{ cursor: 'pointer' }} onClick={() => closeModal()} />
                    <Player
                        autoplay
                        loop
                        src="https://assets5.lottiefiles.com/packages/lf20_tk0uford.json"
                        style={{ height: '130px', width: '130px' }}
                    />
                    <Text fontSize='30px' color='yellow' style={{ fontWeight: '1000' }}>Risk Warning</Text>
                    <Text style={{ textAlign: 'center' }}><b style={{ color: 'yellow' }}>Croxswap VPOTS</b> smart contract uses external staking pools outside our ecosystem to maximize your earnings.
                        When you stake your <b>{vpotInfo.vaultCurrency.toUpperCase()}</b> token in to this vault your asset is being deposited into <b>{vpotInfo.vaultSite}</b> pool.</Text>
                    <Text mt='10px'>The vault is still in beta. Please use at your own risk.</Text>
                    <Flex alignItems='center' mt='10px'>
                        <Flex mr='3px'>
                            <Checkbox scale='sm' checked={isChecked} onClick={() => verifyCheck()} />
                        </Flex>
                        I confirm that I have read, understand, and agree to all the risks.
                    </Flex>
                    <Flex mt='25px' className='confirm_btnGroup' justifyContent='space-around'>
                        {!isChecked ? (
                            <button type="button" disabled>Confirm</button>
                        ) : (
                            <button type="button"
                                onClick={() => {
                                    closeModal()
                                    setIsAccepted(true)
                                    localStorage.setItem(`${vpotInfo.vaultCurrency}VaultStatus`, "true");
                                }}
                            >Confirm</button>
                        )}
                        <button type="button" onClick={() => closeModal()}>Cancel</button>
                    </Flex>
                </Flex>
            </ReactModal>
        </Flex >
    )
}

export default DepositModal