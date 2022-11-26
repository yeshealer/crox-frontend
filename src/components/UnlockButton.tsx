import React, { useEffect } from 'react'
import { Button, useWalletModal, ConnectorId } from 'crox-new-uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import getRpcUrl from "utils/getRpcUrl";
import useI18n from 'hooks/useI18n'

let IsConnected = false

const UnlockButton = (props) => {
  const TranslateString = useI18n()
  const { connect, reset, error, account, status } = useWallet()
  useEffect(() => {
    if (IsConnected && error) {
      if (error && error.name === "ChainUnsupportedError") {
        const { ethereum } = window as any;
        (async () => {
          try {
            await ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x38" }],
            });
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              try {
                await ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: "0x38",
                      chainName: "Binance Smart chain",
                      nativeCurrency: {
                        name: "BNB",
                        symbol: "BNB",
                        decimals: 18,
                      },
                      rpcUrls: [getRpcUrl()],
                      blockExplorerUrls: ["https://bscscan.com"],
                    },
                  ],
                });
              } catch (addError: any) {
                console.error(addError);
              }
            }
          }
          connect("injected");
        })();
      }
      IsConnected = false;
    }
  }, [account, status, error, connect]);
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
  const { onPresentNewConnectModal } = useWalletModal(handleLogin, reset)

  return (
    <Button onClick={onPresentNewConnectModal} {...props}>
      {TranslateString(292, 'Unlock Wallet')}
    </Button>
  )
}

export default UnlockButton
