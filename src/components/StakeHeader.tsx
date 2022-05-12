import classNames from 'classnames'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import commas from 'comma-number'
import useFarmData from '../hooks/useFarmData'
import useMarkets from '../hooks/useMarkets'
import usePrice from '../hooks/usePrice'

export default function StakeHeader({ veScreamData }: any) {
    const [countdown, setCountdown] = useState({
        days: 3 - new Date().getUTCDay() >= 0 ? 3 - new Date().getUTCDay() : 7 + (3 - new Date().getUTCDay()),
        hours: 23 - new Date().getUTCHours(),
        mins: 59 - new Date().getUTCMinutes(),
        secs: 59 - new Date().getUTCSeconds()
    })
    const { screamPrice } = usePrice()
    const { farmData } = useFarmData()

    const { refreshing } = useMarkets()

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCountdown({
                days: 3 - new Date().getUTCDay() >= 0 ? 3 - new Date().getUTCDay() : 7 + (3 - new Date().getUTCDay()),
                hours: 23 - new Date().getUTCHours(),
                mins: 59 - new Date().getUTCMinutes(),
                secs: 59 - new Date().getUTCSeconds()
            })
        }, 1000)

        return () => clearInterval(intervalId)
    }, [])

    const maxApr = ((+veScreamData?.rewardsLastWeek * 52) / +veScreamData?.screamAmountLocked) * 100

    return (
        <div className="relative">
            <div className="absolute z-0 inset-0 bg-gray-100 transform -translate-y-1/4" />
            <div className="relative max-w-5xl mx-auto px-6 pt-6 md:px-12 md:pt-12 space-y-6">
                <div className="flex items-center space-x-2">
                    {/* {account && (
                        <>
                            <Button type="secondary" onClick={() => setShowSidebar(true)} size="small" auto>
                                Your Overview
                            </Button>
                        </>
                    )} */}

                    <div className="flex-1" />
                    <div className="flex justify-end items-center space-x-4">
                        <img className="hidden sm:block w-40" src="https://scream.sh/img/scream-logotype.png" alt="" />
                        <img className={classNames('w-8', refreshing && 'animate-spin')} src="https://scream.sh/img/scream-multi.png" alt="" />
                    </div>
                </div>
                <motion.div className="relative bg-white rounded-xl p-6 shadow-xl space-y-6">
                    <div>
                        <p className="text-5xl font-extrabold">Use Your SCREAM.</p>
                        <p className="text-4xl lg:mb-6">Get votes to boost your pools and earn rewards.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-1/2 lg:px-3">
                            <div className="flex flex-col md:flex-row md:justify-between lg:flex-col xl:flex-row">
                                <div className="rounded-xl shadow-xl p-6 md:w-1/2 lg:w-full">
                                    <p>Total Rewards Last Week</p>
                                    <p className="text-xs py-1">By Locking</p>
                                    <p className="text-2xl font-extrabold text-right">${commas((+veScreamData?.rewardsLastWeek * screamPrice).toFixed(2))}</p>
                                    <p className="text-xs py-1">By Staking</p>
                                    <p className="text-2xl font-extrabold text-right">${farmData && farmData[0] ? commas(((parseFloat(farmData[0]?.apy[3]) * farmData[0].tvl) / 5200).toFixed(2)) : 0}</p>
                                </div>
                                <div className="p-6 whitespace-nowrap md:w-1/2 lg:w-full">
                                    <p>Estimated APR</p>
                                    <p className="text-xs py-1">By Locking</p>
                                    <p className="text-2xl font-extrabold text-right">{maxApr.toFixed(2)}%</p>
                                    <p className="text-xs py-1">By Staking LP</p>
                                    <p className="text-2xl font-extrabold text-right">{farmData[0] ? parseFloat(farmData[0]?.apy[3]).toFixed(2) : '0.00'}%</p>
                                </div>
                            </div>
                            <div className="rounded-xl shadow-xl p-6">
                                <p>Total Locked SCREAM</p>
                                <p className="text-2xl font-extrabold text-right">${commas((veScreamData?.screamAmountLocked * screamPrice).toFixed(2))}</p>
                                <p className="text-right">{commas((+veScreamData?.screamAmountLocked).toFixed(2))}</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center rounded-xl shadow-xl p-6 lg:w-1/2">
                            <p>Next Distribution Countdown</p>
                            <div className="flex flex-col items-center pt-14">
                                <div className="border-4 border-babyblue rounded-full flex justify-center items-center mb-2" style={{ height: 64, width: 64 }}>
                                    {countdown.days}
                                </div>
                                d
                            </div>
                            <div className="flex w-full justify-around mt-10 max-w-xs">
                                <div className="flex flex-col items-center">
                                    <div className="border-4 border-babypink rounded-full flex justify-center items-center mb-2" style={{ height: 60, width: 60 }}>
                                        {countdown.hours}
                                    </div>
                                    h
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="border-4 border-babyyellow rounded-full flex justify-center items-center mb-2" style={{ height: 60, width: 60 }}>
                                        {countdown.mins}
                                    </div>
                                    m
                                </div>
                                <div className="flex flex-col items-center">
                                    <div className="border-4 border-babypurple rounded-full flex justify-center items-center mb-2" style={{ height: 60, width: 60 }}>
                                        {countdown.secs}
                                    </div>
                                    s
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
