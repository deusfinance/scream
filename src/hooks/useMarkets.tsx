import axios from 'axios'
import BigNumber from 'bignumber.js'
import { createContext, useContext, useEffect, useState } from 'react'
import { useActiveWeb3React } from '.'
import AssetSidebar from '../components/AssetSidebar'
import { CONTRACT_PRICE_ORACLE_ABI, CONTRACT_PRICE_ORACLE_ADDRESS, CONTRACT_SCTOKEN_ABI, CONTRACT_SCTOKEN_ADDRESS, CONTRACT_TOKEN_ADDRESS, GRAPHQL_URL } from '../constants'
import { fetchBalances, getUnitrollerContract } from '../utils/ContractService'
import multicall from '../utils/multicall'
import useRefresh from './useRefresh'

const calculateAPY = async (market, supplyRate, borrowRate, underlyingPrice, balances, assetsIn, account, provider) => {
    if (!market) {
        return false
    }

    const scToken = CONTRACT_SCTOKEN_ADDRESS?.[market?.symbol?.toLowerCase()]
    const token = CONTRACT_TOKEN_ADDRESS?.[market?.underlyingSymbol?.toLowerCase()]

    const borrows = new BigNumber(market?.totalBorrows)
    const reserves = new BigNumber(market.reserves || 0)
    const reserveFactor = new BigNumber(market.reserveFactor).div(new BigNumber(10).pow(18))
    const underlyingPriceUSD = new BigNumber(underlyingPrice.toString()).div(new BigNumber(10).pow(18 + 18 - token.decimals))
    const total_borrows_usd = borrows.times(underlyingPriceUSD).dp(2, 1).toNumber()
    const total_supply_usd = new BigNumber(market.totalSupply).times(market.exchangeRate).times(underlyingPriceUSD).dp(2, 1).toNumber()
    const collateral = assetsIn.map((item) => item.toLowerCase()).includes(scToken.address.toLowerCase())

    try {
        const supplyRatePerBlock = new BigNumber(supplyRate.toString())
        const borrowRatePerBlock = new BigNumber(borrowRate.toString())
        const cash = new BigNumber(market?.cash || 0)
        const currentUtilizationRate = borrows.eq(0) ? new BigNumber(0) : borrows.div(cash.plus(borrows).minus(reserves))

        const ethMantissa = new BigNumber(10).pow(18)
        const blocksPerDay = 86400
        const daysPerYear = 365

        const supplyAPY = supplyRatePerBlock.div(ethMantissa).times(blocksPerDay).plus(1).pow(daysPerYear).minus(1)
        const borrowAPY = borrowRatePerBlock.div(ethMantissa).times(blocksPerDay).plus(1).pow(daysPerYear).minus(1)

        return {
            ...market,
            underlyingPriceUSD: underlyingPriceUSD.toNumber(),
            reserveFactor: reserveFactor.toNumber(),
            liquidity: cash.toNumber(),
            borrowAPY: borrowAPY.times(100).dp(2, 1).toNumber(),
            supplyAPY: supplyAPY.times(100).dp(2, 1).toNumber(),
            utilizationRate: currentUtilizationRate.times(100).dp(2, 1).toNumber(),
            totalBorrowsUsd: total_borrows_usd,
            totalSupplyUsd: total_supply_usd,
            liquidityUsd: cash.times(underlyingPriceUSD).dp(2, 1).toNumber(),
            ...balances,
            collateral,
            icon: token.asset
        }
    } catch (e) {
        console.log(e)
        return {
            ...market,
            underlyingPriceUSD: underlyingPriceUSD.toNumber(),
            reserveFactor: reserveFactor.toNumber(),
            liquidity: 0,
            borrowAPY: 0,
            supplyAPY: 0,
            utilizationRate: 0,
            totalBorrowsUsd: total_borrows_usd,
            totalSupplyUsd: total_supply_usd,
            liquidityUsd: 0,
            collateral,
            borrowBalance: new BigNumber(0),
            supplyBalance: new BigNumber(0),
            icon: token.asset
        }
    }
}

function useMarketsInternal() {
    const { slowRefresh } = useRefresh()
    const [markets, setMarkets] = useState([])
    const [refreshing, setRefreshing] = useState(false)
    const { account, library } = useActiveWeb3React()

    const [refresh, setRefresh] = useState(0)
    const update = () => setRefresh((i) => i + 1)

    useEffect(() => {
        const fetchMarkets = async () => {
            setRefreshing(true)
            const marketData = await axios.post(GRAPHQL_URL, {
                query: `{
                    markets(first: 100) {
                      borrowRate
                      cash
                      collateralFactor
                      exchangeRate
                      interestRateModelAddress
                      name
                      reserves
                      supplyRate
                      symbol
                      id
                      totalBorrows
                      totalSupply
                      underlyingAddress
                      underlyingName
                      underlyingPrice
                      underlyingSymbol
                      underlyingPriceUSD
                      accrualBlockNumber
                      blockTimestamp
                      borrowIndex
                      reserveFactor
                      underlyingDecimals
                    }
                  }`
            })
            const allMarkets = marketData?.data?.data?.markets
            const appContract = getUnitrollerContract(library)
            
            if (allMarkets) {
                const allMarketSymbols = Object.values(CONTRACT_SCTOKEN_ADDRESS).map((item) => item.symbol.toLowerCase())
                let filteredMarkets = allMarkets.filter((market) => allMarketSymbols.find((token) => token === market.symbol.toLowerCase()))
                filteredMarkets = filteredMarkets.filter((market) => market.id !== "0x383d965c8d2ac0a9c1f6930ad10943606bca4cb7")
                filteredMarkets = filteredMarkets.filter((market) => market.id !== "0x56e828ab9dc9cb8c91c6d14ef705e61c7d1933a0")
                const assetsIn = account ? await appContract.getAssetsIn(account) : []

                const scTokenABI = JSON.parse(CONTRACT_SCTOKEN_ABI)
                const supplyRatePerBlockCalls = filteredMarkets.map((market) => ({
                    address: market.id,
                    name: 'supplyRatePerBlock'
                }))
                const borrowRatePerBlockCalls = filteredMarkets.map((market) => ({
                    address: market.id,
                    name: 'borrowRatePerBlock'
                }))
                const getUnderlyingPriceUsdCalls = filteredMarkets.map((market) => ({
                    address: CONTRACT_PRICE_ORACLE_ADDRESS,
                    name: 'getUnderlyingPrice',
                    params: [market.id]
                }))

                const [supplyRatePerBlocks, borrowRatePerBlocks, underlyingPriceUSDs] = await Promise.all([
                    multicall(scTokenABI, supplyRatePerBlockCalls),
                    multicall(scTokenABI, borrowRatePerBlockCalls),
                    multicall(JSON.parse(CONTRACT_PRICE_ORACLE_ABI), getUnderlyingPriceUsdCalls)
                ])

                let balances = null
                if (account) {
                    balances = await fetchBalances(account, filteredMarkets, library)
                }
                const promises = []
                for (let i = 0; i < filteredMarkets.length; i++) {
                    promises.push(calculateAPY(filteredMarkets[i], supplyRatePerBlocks[i][0], borrowRatePerBlocks[i][0], underlyingPriceUSDs[i][0], balances ? balances[i] : {}, assetsIn, account, library))
                }
                const calculatedMarkets = await Promise.all(promises)

                console.log('refreshing markets result ===== ')
                console.log(calculatedMarkets)
                setMarkets(calculatedMarkets)
            }
            setRefreshing(false)
        }
        fetchMarkets()
    }, [account, slowRefresh, refresh])

    return {
        markets,
        update,
        refreshing
    }
}

export const MarketContext = createContext({})
export function MarketsWrapper({ children }: any) {
    const markets = useMarketsInternal()
    const [showSidebar, setShowSidebar] = useState(false)
    const openSidebar = () => setShowSidebar(true)
    const closeSidebar = () => setShowSidebar(false)
    return (
        <>
            <MarketContext.Provider value={{ ...markets, openSidebar, closeSidebar }}>
                <AssetSidebar open={showSidebar} hide={closeSidebar} />
                <>{children}</>
            </MarketContext.Provider>
        </>
    )
}

export default function useMarkets() {
    return useContext(MarketContext) as any
}
