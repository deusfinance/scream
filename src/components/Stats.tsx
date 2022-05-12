import { Button } from '@geist-ui/react'
import BigNumber from 'bignumber.js'
import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useActiveWeb3React } from '../hooks'
import useMarkets from '../hooks/useMarkets'
import { currencyFormatter } from '../utils'
import LiqudityTable from './LiqudityTable'
import TokenPercentageBar from './TokenPercentageBar'

export default function Stats() {
    const { markets, refreshing, openSidebar } = useMarkets()
    const { account } = useActiveWeb3React()

    const [expand, setExpand] = useState(false)
    const [totalSupply, setTotalSupply] = useState(0)
    const [totalBorrows, setTotalBorrows] = useState(0)
    const [sortedBySupply, setSortedBySupply] = useState([])
    const [sortedByBorrows, setSortedByBorrows] = useState([])

    useEffect(() => {
        if (markets && markets?.length) {
            const tempTS = (markets || []).reduce((accumulator, market) => new BigNumber(accumulator).plus(new BigNumber(market.totalSupplyUsd)), new BigNumber(0))
            const tempTB = (markets || []).reduce((accumulator, market) => new BigNumber(accumulator).plus(new BigNumber(market.totalBorrowsUsd)), new BigNumber(0))
            setTotalBorrows(tempTB?.dp(2, 1).toString(10))
            setTotalSupply(tempTS?.dp(2, 1).toString(10))

            setSortedBySupply([...markets].sort((a, b) => b?.totalSupplyUsd - a?.totalSupplyUsd))
            setSortedByBorrows([...markets].sort((a, b) => b?.totalBorrowsUsd - a?.totalBorrowsUsd))
        }
    }, [markets])

    return (
        <div className="relative">
            <div className="absolute z-0 inset-0 bg-gray-100 transform -translate-y-1/4" />
            <div className="relative max-w-5xl mx-auto px-6 pt-6 md:px-12 md:pt-12 space-y-6">
                <div className="flex space-x-8">
                    {account && (
                        <div className="space-y-2">
                            <div>
                                <Button type="secondary" onClick={openSidebar} size="small" auto>
                                    Your Overview
                                </Button>
                            </div>
                            {/* <div className="hidden md:block">
                                <HealthFactor />
                            </div> */}
                        </div>
                    )}

                    <div className="flex-1" />

                    <div>
                        <div className="space-x-4">
                            <img className="hidden sm:inline-block w-40" src="https://scream.sh/img/scream-logotype.png" alt="" />
                            <img className={classNames('w-8 inline-block', refreshing && 'animate-spin')} src="https://scream.sh/img/scream-multi.png" alt="" />
                        </div>
                        {/* <p className="text-right">
                            <a href="https://docs.scream.sh/" target="_blank" className="text-xs font-mono opacity-50 underline hover:no-underline" rel="noreferrer">
                                Documentation
                            </a>
                        </p> */}
                    </div>
                </div>
                <motion.div className="relative bg-white rounded-xl p-6 shadow-xl space-y-6">
                    <div className="p-2 absolute top-0 right-0">
                        <Button onClick={() => setExpand((_) => !_)} size="mini" auto>
                            Expand
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-lg font-bold">Total Supply</p>
                                <p className="text-3xl">${`${currencyFormatter(totalSupply)}`}</p>
                            </div>
                            <div className="space-y-1">
                                {sortedBySupply &&
                                    sortedBySupply.length > 0 &&
                                    sortedBySupply
                                        .slice(0, 3)
                                        .map((market, index) => (
                                            <TokenPercentageBar
                                                key={index}
                                                src={`/img/tokens/${market?.icon}`}
                                                name={market?.underlyingSymbol}
                                                value={+totalSupply == 0 ? 0 : ((market?.totalSupplyUsd / totalSupply) * 100).toFixed(2)}
                                            />
                                        ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-lg font-bold">Total Borrow</p>
                                <p className="text-3xl">${`${currencyFormatter(totalBorrows)}`}</p>
                                <div />
                            </div>
                            <div className="space-y-1">
                                {sortedByBorrows &&
                                    sortedByBorrows.length > 0 &&
                                    sortedByBorrows
                                        .slice(0, 3)
                                        .map((market, index) => (
                                            <TokenPercentageBar
                                                key={index}
                                                src={`/img/tokens/${market?.icon}`}
                                                name={market?.underlyingSymbol}
                                                value={+totalBorrows == 0 ? 0 : ((market?.totalBorrowsUsd / totalBorrows) * 100).toFixed(2)}
                                            />
                                        ))}
                            </div>
                        </div>
                    </div>
                    <div className="overflow-hidden">
                        <AnimatePresence>
                            {expand && (
                                <motion.div
                                    className="overflow-hidden"
                                    key="content"
                                    initial="collapsed"
                                    animate="open"
                                    exit="collapsed"
                                    variants={{
                                        open: { opacity: 1, height: 'auto' },
                                        collapsed: { opacity: 0, height: 0 }
                                    }}
                                >
                                    <LiqudityTable markets={markets} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
