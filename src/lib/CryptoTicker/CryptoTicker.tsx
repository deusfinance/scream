import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import Ticker from 'react-ticker'
import useTicker from './useTicker'

export function TickerItem({ name, symbol, logo, quote }) {
    const percentage = quote.USD.percent_change_24h
    const isPositive = percentage >= 0

    return (
        <div className="inline-block text-xs">
            <div className="flex items-center space-x-4 p-2 px-4 ">
                {/* <div>
                    <div className="w-5 h-5 rounded-full bg-gray-200" />
                </div> */}
                <div className="flex space-x-2">
                    <div>
                        <img className="h-5" src={logo} alt="" />
                    </div>
                    <div>
                        <p className="">
                            <span className="font-medium">{name} </span>
                            <span className="font-medium">${symbol}</span>
                        </p>
                        <div className="flex space-x-2 items-center">
                            <p>${quote.USD.price.toFixed(5)}</p>
                            {/* <p>{price}</p> */}
                            <p className={classNames('', isPositive ? 'text-green-500' : 'text-red-500')}>{percentage.toFixed(2)}%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function CryptoTicker({ visible }) {
    const { data: coins } = useTicker()

    useEffect(() => {
        console.log(coins)
    }, [coins])

    return (
        <>
            <AnimatePresence>
                {coins && visible && (
                    <>
                        <motion.div animate={{ y: ['-100%', '0%'] }} className="border-b-2 border-rainbow">
                            <div className="w-full h-full whitespace-nowrap">
                                <Ticker>{({ index }) => coins.map((coin) => <TickerItem key={coin.ticker} {...coin} />)}</Ticker>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
