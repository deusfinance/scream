import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { useActiveWeb3React } from '.'
import useBlock from './useBlock'

export default function useTotalBorrowLimit(markets) {
    const { account } = useActiveWeb3React()
    const [health, setHealth] = useState<any>(new BigNumber(0))
    const [totalBorrowLimit, setTotalBorrowLimit] = useState(new BigNumber(0))
    const [totalBorrowBalance, setTotalBorrowBalance] = useState(new BigNumber(0))
    const block = useBlock()

    useEffect(() => {
        if (!account) return
        if (totalBorrowLimit.isZero() || totalBorrowBalance.isZero()) {
            return setHealth(new BigNumber(2))
        }

        const healthFactor = totalBorrowLimit.div(totalBorrowBalance).toNumber()
        setHealth(healthFactor > 2 ? 2 : healthFactor)
    }, [account, totalBorrowLimit, totalBorrowBalance])

    useEffect(() => {
        if (markets && account) {
            let tempBorrowLimit = new BigNumber(0)
            let tempBorrowBalance = new BigNumber(0)
            for (const market of markets) {
                // console.log(market)
                // if (market?.collateral) {
                // console.log(market.supplyBalance.toString())
                tempBorrowLimit = tempBorrowLimit.plus((market?.supplyBalance || new BigNumber(0)).times(+market?.collateralFactor || 0).times(market?.underlyingPriceUSD))
                // }

                tempBorrowBalance = tempBorrowBalance.plus((market?.borrowBalance || new BigNumber(0)).times(market?.underlyingPriceUSD))
            }
            setTotalBorrowLimit(tempBorrowLimit)
            setTotalBorrowBalance(tempBorrowBalance)
        } else {
            setTotalBorrowLimit(new BigNumber(0))
            setTotalBorrowBalance(new BigNumber(0))
        }
    }, [markets, account, block])

    return {
        health,
        totalBorrowLimit,
        totalBorrowBalance
    }
}
