import { Table } from '@geist-ui/react'
import { CONTRACT_SCTOKEN_ADDRESS, CONTRACT_TOKEN_ADDRESS } from '../constants'
import { currencyFormatter, getFtmScanLink } from '../utils'

export default function LiqudityTable({ markets }) {
    const getToken = (market) => CONTRACT_TOKEN_ADDRESS[market?.underlyingSymbol?.toLowerCase()]

    const filteredMarkets = (markets || [])
        .filter((market) => Object.keys(CONTRACT_SCTOKEN_ADDRESS).find((token) => token === market.symbol.toLowerCase()))
        .map((market) => ({
            ...market,
            name: (
                <div className="flex items-center space-x-2">
                    <div className="w-5">
                        <img className="h-4" src={`/img/tokens/${getToken(market)?.asset}`} alt="" />
                    </div>
                    <a href={getFtmScanLink(market.id, 'address')}>
                        {getToken(market)?.id.toUpperCase()} ($
                        {getToken(market)?.symbol})
                    </a>
                </div>
            ),
            liquidity: `$${currencyFormatter(market.liquidityUsd)}`,
            supply: `$${currencyFormatter(market.totalSupplyUsd)}`,
            borrows: `$${currencyFormatter(market.totalBorrowsUsd)}`,
            utilization: `${market.utilizationRate.toFixed(0)}%`,
            collateral: `${(market.collateralFactor * 100).toFixed(0)}%`
            // reserve: `$${(market.reserves * market.underlyingPriceUSD).toFixed(0)}`
        }))

    return (
        <div className="space-y-4">
            <div className="overflow-auto hide-scroll-bars">
                <Table data={filteredMarkets} className="whitespace-nowrap">
                    <Table.Column prop="name" label="asset" />
                    <Table.Column prop="liquidity" label="total liquidity" />
                    <Table.Column prop="supply" label="total supply" />
                    <Table.Column prop="borrows" label="total borrow" />
                    <Table.Column prop="utilization" label="utilization" />
                    <Table.Column prop="collateral" label="collateral factor" />
                    {/* <Table.Column prop="reserve" label="reserves" /> */}
                </Table>
            </div>
        </div>
    )
}
