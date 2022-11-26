import { useCallback, useEffect, useState } from 'react'
import { abi } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import useBlock from './useBlock'

// BUSD-RASTA
const ABI: any = abi
const web3 = new Web3('https://bsc-dataseed.binance.org/')
const bnbBusdPairContract = new web3.eth.Contract(ABI, '0x28cD92ED2bf6A5B665DFFB66c70572Ea58Ff8846')
const bnbRastaPairContract = new web3.eth.Contract(ABI, '0xe84413e4d2ce15dd89141c88e5f8e46eeb0de10c')
const mrastaRastaPairContract = new web3.eth.Contract(ABI, '0xbea61686d11aed2d078885d77ccaeda352bb1fe4')

const useRastaPrice = () => {
  const [price, setPrice] = useState(0)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    try {
      const bnbObj = await bnbBusdPairContract.methods.getReserves().call()
      if (!new BigNumber(bnbObj.reserve0).eq(new BigNumber(0))) {
        const bnbPrice = new BigNumber(bnbObj.reserve1).div(bnbObj.reserve0)
        const rastaObj = await bnbRastaPairContract.methods.getReserves().call()
        const rastaPrice = new BigNumber(rastaObj.reserve0).div(rastaObj.reserve1).times(bnbPrice)
        const mrastaObj = await mrastaRastaPairContract.methods.getReserves().call()
        const mrastaPrice = new BigNumber(mrastaObj.reserve0).div(mrastaObj.reserve1).times(rastaPrice)
        if (!mrastaPrice.isEqualTo(price)) {
          setPrice(mrastaPrice.toNumber())
        }
      }
    } catch (e) {
      setPrice(0)
    }
  }, [price])

  useEffect(() => {
    if (bnbBusdPairContract && bnbRastaPairContract && mrastaRastaPairContract) {
      fetchBalance()
    }
  }, [setPrice, fetchBalance, block])

  return price
}

export default useRastaPrice
