import React, { useEffect, useState, useCallback } from 'react'
import { Flex, Text, Link } from 'crox-new-uikit'
import { Icon } from '@iconify/react';
import { Player } from '@lottiefiles/react-lottie-player';
import { useWallet } from "@binance-chain/bsc-use-wallet";
import { useMediaQuery } from '@mui/material';
import BigNumber from "bignumber.js";
import { getFullDisplayBalance } from "utils/formatBalance";
import { useVaultContract } from 'hooks/useContract';

interface WithdrawModalProps {
    onDismiss: any;
    stakedBalance: number;
    stakedAmountStr: string;
    vaultContract: string;
    vpotInfo: any;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
    onDismiss,
    stakedBalance,
    stakedAmountStr,
    vaultContract,
    vpotInfo
}) => {
    const { account } = useWallet();
    const [inputValue, setInputValue] = useState(null)
    const [isWaiting, setIsWaiting] = useState(false)
    const [isFail, setIsFail] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [headerText, setHeaderText] = useState(`Withdraw ${vpotInfo.vaultCurrency.toUpperCase()}`)
    const [transactionHash, setTransactionHash] = useState("")

    const setValue = useCallback((percent: BigNumber) => {
        setInputValue(getFullDisplayBalance((new BigNumber(stakedAmountStr).times(percent))))
    }, [stakedAmountStr])

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

    const handleWithdraw = async () => {
        try {
            const inputAmount = new BigNumber(inputValue).times(new BigNumber(10).pow(18)).toString();
            const txHash = await contract.methods.withdraw(inputAmount).send({ from: account });
            return txHash;
        } catch (error) {
            return error;
        }
    }

    const onConfirmResult = (res) => {
        if (res.status) {
            setTransactionHash(res.transactionHash)
            return setIsSuccess(true)
        }
        return setIsFail(true)
    }

    useEffect(() => {
        if (isWaiting) {
            setHeaderText(`Withdrawing ${vpotInfo.vaultCurrency.toUpperCase()}`)
        } else if (isFail) {
            setHeaderText("Failed")
        } else if (isSuccess) {
            setHeaderText("Success!")
        }
    }, [isWaiting, isFail, isSuccess])

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
                        <Text fontSize='18px'>Withdrawing {inputValue} {vpotInfo.vaultCurrency.toUpperCase()}</Text>
                    </Flex>
                ) : (isFail ? (
                    <Flex flexDirection='column' alignItems="center">
                        <Player
                            autoplay
                            loop
                            src="https://assets6.lottiefiles.com/temp/lf20_yYJhpG.json"
                            style={{ height: '250px', width: '300px' }}
                        />
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
                        <Text fontSize='14px'>{getFullDisplayBalance(new BigNumber(stakedAmountStr))} {vpotInfo.vaultCurrency.toUpperCase()} Available</Text>
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
                        <Flex mt='25px' className='action_btnGroup' justifyContent='space-around'>
                            {inputValue > stakedBalance || inputValue === 0 || !inputValue ? (
                                <button type="button" disabled>Withdraw</button>
                            ) : (
                                <button type="button" onClick={async () => {
                                    setIsWaiting(true)
                                    const res = await handleWithdraw()
                                    console.log(res)
                                    setIsWaiting(false)
                                    onConfirmResult(res)
                                }
                                }>Withdraw</button>
                            )}
                            <button type="button" onClick={() => onDismiss()}>Cancel</button>
                        </Flex>
                    </Flex>
                )))}
            </div >
        </Flex >
    )
}

export default WithdrawModal