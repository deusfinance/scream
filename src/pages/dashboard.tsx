import commaNumber from 'comma-number'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import shortNumber from 'short-number'
import useSWR from 'swr'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Stats from '../components/Stats'
import useMarkets from '../hooks/useMarkets'

const TVChartContainer = dynamic(() => import('../components/TVChartContainer'), { ssr: false })

const DataPoint = ({ label, value }: any) => (
    <div className="flex items-center space-x-4">
        <p className="flex-1 md:flex-grow-0">{label}</p>
        <div className="flex-1 hidden border-t-4 border-dotted opacity-50 lg:block" />
        <p>{value}</p>
    </div>
)

export default function Dashboard() {
    const { data } = useSWR('https://api.coingecko.com/api/v3/coins/scream')

    const { markets } = useMarkets()

    const [hoveredParam, setHoveredParam] = useState({})
    const price = Number(data?.market_data?.current_price?.usd)
    const priceChangePercentage = (time: string) => Number(data?.market_data?.[`price_change_percentage_${time}`])
    const tvl = Number(data?.market_data?.total_value_locked?.usd)

    const [calcModeToUSD, setCalcModeToUSD] = useState(true)
    const [calc, setCalc] = useState(2)
    const calculatedPrice = calcModeToUSD ? calc * price : calc / price

    return (
        <>
            <Header />
            <Stats />

            <div className="max-w-5xl p-6 pb-12 mx-auto md:p-12 md:pb-24">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-12">
                    <div className="p-1 shadow-xl md:col-span-2 bg-animated-rainbow rounded-2xl">
                        <div className="flex items-center justify-center h-full p-6 bg-white border border-gray-100 shadow-xl rounded-xl">
                            <div className="space-y-1 text-center">
                                <p className="font-mono text-xs opacity-75">Total Value Locked (TVL)</p>
                                <p className="font-mono text-5xl font-extrabold md:text-6xl">${shortNumber(tvl)}</p>
                                <p className="font-mono text-xl opacity-50">${commaNumber(tvl)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-4 font-mono bg-white border border-gray-100 shadow-xl rounded-xl">
                        <a
                            href="https://spookyswap.finance/swap?inputCurrency=FTM&outputCurrency=0xe0654c8e6fd4d733349ac7e09f6f23da256bf475"
                            target="_blank"
                            className="block w-full p-2 text-center text-white bg-animated-rainbow-dark rounded-xl text-shadow-lg"
                            rel="noreferrer"
                        >
                            Buy Scream
                        </a>

                        <div>
                            <p className="text-3xl font-extrabold">${price.toFixed(2)}</p>

                            <p className="text-xs opacity-75 ">SCREAM Token Price</p>
                        </div>
                        <div className="flex space-x-3 text-xs">
                            <p>
                                <span className="opacity-50">24h: </span>
                                <span>{priceChangePercentage('24h').toFixed(2)}%</span>
                            </p>
                            <p>
                                <span className="opacity-50">7d: </span>
                                <span>{priceChangePercentage('7d').toFixed(2)}%</span>
                            </p>
                            <p>
                                <span className="opacity-50">30d: </span>
                                <span>{priceChangePercentage('30d').toFixed(2)}%</span>
                            </p>
                        </div>
                    </div>

                    <div className="relative overflow-hidden bg-white border border-gray-100 shadow-xl md:col-span-3 rounded-xl h-96">
                        <div className="flex-1 overflow-hidden">
                            <div className="absolute p-6">
                                <p className="text-2xl font-extrabold">{hoveredParam.price ? `$${hoveredParam.price}` : null}</p>
                                {hoveredParam.time && <p className="font-mono text-sm opacity-50">{dayjs.unix(hoveredParam.time).format('DD/MM/YYYY')}</p>}
                            </div>
                            <TVChartContainer setHoveredParam={setHoveredParam} />
                        </div>
                    </div>

                    <div className="relative p-6 overflow-hidden font-mono text-xs bg-white border border-gray-100 shadow-xl md:col-span-3 rounded-xl md:p-12 whitespace-nowrap sm:text-base">
                        <DataPoint label="All-time High" value={`$${commaNumber(data?.market_data?.ath?.usd)}`} />
                        <DataPoint label="Total Supply" value={commaNumber(data?.market_data?.total_supply)} />
                        <DataPoint label="Circulating Supply" value={commaNumber(data?.market_data?.circulating_supply)} />
                        <DataPoint label="Total Volume" value={`$${shortNumber(data?.market_data?.total_volume?.usd || 0)}`} />
                        <DataPoint label="Fully Diluted Valuation" value={`$${shortNumber(data?.market_data?.fully_diluted_valuation?.usd || 0)}`} />
                        <DataPoint label="Market Cap" value={`$${shortNumber(data?.market_data?.market_cap?.usd || 0)}`} />
                        <DataPoint label="CoinGecko Rank" value={`#${commaNumber(data?.coingecko_rank)}`} />
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}
