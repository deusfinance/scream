import { Button, Table } from '@geist-ui/react'
import BigNumber from 'bignumber.js'
import { AnimatePresence } from 'framer-motion'
import { useContext, useEffect, useState } from 'react'
import { useActiveWeb3React } from '../hooks'
import useMarkets from '../hooks/useMarkets'
import useTxHistory from '../hooks/useTxHistory'
import { LendingContext } from '../pages/lend'
import { formatter } from '../utils'
import HealthFactor from './HealthFactor'
import Sidebar from './Sidebar'

export default function AssetSidebar({ open, hide }) {
    const [balances, setBalances] = useState([])
    const [summedSupply, setSummedSupply] = useState(0)
    const [summedBorrow, setSummedBorrow] = useState(0)
    const transactions = useTxHistory()
    const { account } = useActiveWeb3React()

    const { markets } = useMarkets()

    const { setShowStakingSidebar, setStakingSidebarData } = useContext(LendingContext)

    const openStaking = (slug) => {
        setStakingSidebarData(slug)
        setShowStakingSidebar(true)
    }

    const sortFunc = (a, b) => {
        if (!a?.borrowBalance || !b?.supplyBalance) {
            return 0
        }
        return b.borrowBalance.plus(b.supplyBalance).times(b.underlyingPriceUSD).minus(a.borrowBalance.plus(a.supplyBalance).times(a.underlyingPriceUSD)).toNumber()
    }

    const mySummedBorrow = () => {
        let value = new BigNumber(0)
        markets.map((market) => {
            value = value.plus((market.borrowBalance || new BigNumber(0)).times(market.underlyingPriceUSD))
        })
        setSummedBorrow(formatter(value, 2))
    }

    const mySummedSupply = () => {
        let value = new BigNumber(0)
        markets.map((market) => {
            value = value.plus((market.supplyBalance || new BigNumber(0)).times(market.underlyingPriceUSD))
        })
        setSummedSupply(formatter(value, 2))
    }

    useEffect(() => {
        if (markets && account) {
            const temp = markets /* filter(market => (market.borrowBalance.gt(0) || market.supplyBalance.gt(0))) */
                .sort(sortFunc)
                .map((elem) => ({
                    asset: (
                        <>
                            <div className="flex items-center space-x-2">
                                <img className="block w-4 h-4" src={`/img/tokens/${elem.icon}`} alt="" />
                                <p>{elem.underlyingSymbol}</p>
                            </div>
                        </>
                    ),
                    totalBorrowed: (
                        <div>
                            <p>{`$${formatter((elem.borrowBalance || new BigNumber(0)).times(elem.underlyingPriceUSD).toString(10), 2)}`}</p>
                            {elem.borrowBalance > 0 && (
                                <p className="font-mono text-xs opacity-50">
                                    {String(elem.borrowBalance.toFixed(2))}
                                    {elem.underlyingSymbol}
                                </p>
                            )}
                        </div>
                    ),
                    totalLent: (
                        <div>
                            <p>{`$${formatter((elem.supplyBalance || new BigNumber(0)).times(elem.underlyingPriceUSD).toString(10), 2)}`}</p>
                            {elem.supplyBalance > 0 && (
                                <p className="font-mono text-xs opacity-75">
                                    {String(elem.supplyBalance.toFixed(2))} {elem.underlyingSymbol}
                                </p>
                            )}
                        </div>
                    ),
                    stakeButton: (
                        <div className="flex w-full">
                            <Button onClick={() => openStaking(elem)} auto size="mini">
                                {elem.underlyingSymbol} Rewards
                            </Button>
                        </div>
                    )
                }))

            setBalances(temp)
            mySummedBorrow()
            mySummedSupply()
        }
    }, [markets, account])

    return (
        <>
            <AnimatePresence>
                <Sidebar {...{ open, hide }} className="z-30">
                    <div className="p-6 space-y-4 overflow-y-auto border-b md:p-12 md:space-y-8 h-2/3 whitespace-nowrap">
                        <div className="space-y-1">
                            <p className="text-xl font-extrabold md:text-3xl">Your Assets</p>
                            <p className="opacity-50">Track your coin flow on Scream.</p>
                        </div>

                        <div className="flex flex-col w-full space-x-0 space-y-4 md:flex-row md:space-y-0 md:items-center md:space-x-8">
                            <div className="flex flex-wrap items-center space-x-4 md:space-x-8">
                                <div>
                                    <p className="font-medium">
                                        ~$
                                        {summedSupply} USD
                                    </p>
                                    <p className="font-mono text-xs opacity-50">Total Supplied</p>
                                </div>
                                <div>
                                    <p className="font-medium">
                                        ~$
                                        {summedBorrow} USD
                                    </p>
                                    <p className="font-mono text-xs opacity-50">Total Borrowed</p>
                                </div>
                            </div>

                            <div className="flex-1 w-full">
                                <HealthFactor />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <Table data={balances}>
                                <Table.Column prop="asset" label="Asset" />
                                <Table.Column prop="totalBorrowed" label="Total Borrowed" />
                                <Table.Column prop="totalLent" label="Total Lent" />
                                {/* <Table.Column prop="stakeButton" label="Stake" /> */}
                            </Table>
                        </div>
                    </div>

                    <div className="p-6 space-y-4 overflow-y-auto border-b md:p-12 md:space-y-8 h-1/2 whitespace-nowrap">
                        <div className="space-y-1">
                            <p className="text-xl font-extrabold md:text-3xl">Your Transactions</p>
                            <p className="opacity-50">Track your activity on Scream.</p>
                        </div>

                        <div className="overflow-x-auto">
                            <Table data={transactions}>
                                <Table.Column prop="detail" label="Details" />
                                <Table.Column prop="date" label="Date" />
                                <Table.Column prop="txHash" label="Explorer" />
                            </Table>
                        </div>
                    </div>
                </Sidebar>
            </AnimatePresence>
        </>
    )
}
