import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'
import { getRouterContract } from '../utils/ContractService'

export default function usePrice() {
    const [screamPrice, setScreamPrice] = useState(0)

    // const { account, library } = useActiveWeb3React()
    const { library } = useWeb3React()
    const routerContract = getRouterContract(library?.getSigner())
    const screamAddress = '0xe0654C8e6fd4D733349ac7E09f6f23DA256bF475'
    const wftmAddress = '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'
    const usdcAddress = '0x04068da6c83afcfa0e13ba15a6696662335d5b75'

    const getPrice = async (tokenAddress) => {
        const path = [wftmAddress, usdcAddress]
        if (tokenAddress !== wftmAddress) {
            path.unshift(tokenAddress)
        }
        const prices = await routerContract.getAmountsOut('1000000000000000000', path)
        const priceData = Number(prices[prices.length - 1]) / 1000000
        return priceData
    }

    useEffect(() => {
        const fetchPrice = async () => {
            const prices = await routerContract.getAmountsOut('1000000000000000000', [screamAddress, wftmAddress, usdcAddress])
            const price = Number(prices[prices.length - 1]) / 1000000
            setScreamPrice(price)
        }

        fetchPrice()
    }, [])

    return {
        screamPrice,
        getPrice
    }
}
