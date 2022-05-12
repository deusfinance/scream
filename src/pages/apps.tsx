import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import ParticlesBackground from '../components/ParticlesBackground'
import SubscribeModal from '../components/SubscriberModal'

export default function LaunchPad() {
    const [comingSoon, setComingSoon] = useState(false)
    return (
        <>
            <SubscribeModal visible={comingSoon} hide={() => setComingSoon(false)} />
            <div className="relative min-h-full w-full overflow-hidden flex items-center justify-center bg-rainbow">
                {/* <BackgroundGlobe /> */}
                <ParticlesBackground />
                <div className="relative max-w-2xl w-full space-y-4 px-6 py-12 md:px-0">
                    <div className="flex items-center">
                        <Link href="/">
                            <a className="block flex-1">
                                <motion.img animate={{ rotate: ['0deg', '360deg'] }} transition={{ duration: 5, loop: Infinity }} className="w-12" src="/img/scream-blue-pink.png" alt="" />
                            </a>
                        </Link>
                        <div className="space-y-1 text-right">
                            <p className="text-xs font-medium ">Launch an App</p>
                            <h1 className="text-2xl font-bold flex-1">Launch pad</h1>
                        </div>
                    </div>
                    {/* <div>
                        <Link href="/dashboard">
                            <motion.a
                                initial={{ opacity: 0, x: '40%', y: '-40%' }}
                                animate={{ opacity: [0, 1], x: ['-40%', '0%'], y: ['-40%', '0%'] }}
                                href="# "
                                className="block bg-white rounded-xl shadow-xl hover:shadow border-4 border-white hover:border-pink-200 transition ease-in-out duration-300 p-6 space-y-2"
                            >
                                <p className="text-xl font-extrabold">Dashboard</p>
                                <p className="">View Scream stats, prices, charts, and more in one snapshot.</p>
                            </motion.a>
                        </Link>
                    </div> */}
                    <div>
                        <Link href="/lend" passHref>
                            <motion.a
                                initial={{ opacity: 0, x: '-40%', y: '-40%' }}
                                animate={{ opacity: [0, 1], x: ['-40%', '0%'], y: ['-40%', '0%'] }}
                                className="block bg-white rounded-xl shadow-xl hover:shadow border-4 border-white hover:border-pink-200 transition ease-in-out duration-300 p-6 space-y-2"
                            >
                                <p className="text-xl font-extrabold">Lending</p>
                                <p className="">Borrow & lend the most popular tokens on Fantom.</p>
                            </motion.a>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <Link href="/stake" passHref>
                            <motion.a
                                initial={{ opacity: 0, x: '-40%', y: '-40%' }}
                                animate={{ opacity: [0, 1], x: ['-40%', '0%'], y: ['-40%', '0%'] }}
                                className="block bg-white rounded-xl shadow-xl hover:shadow border-4 border-white hover:border-pink-200 transition ease-in-out duration-300 p-6 space-y-2"
                            >
                                <p className="text-xl font-extrabold">Staking</p>
                                <p className="">Stake your SCREAM tokens. Earn sweet SCREAM rewards.</p>
                            </motion.a>
                        </Link>

                        {/* <Link href="/farms">
                            <motion.a
                                initial={{ opacity: 0, x: '40%', y: '40%' }}
                                animate={{ opacity: [0, 1], x: ['40%', '0%'], y: ['40%', '0%'] }}
                                href="# "
                                onClick={() => setComingSoon(true)}
                                className="block bg-white rounded-xl shadow-xl hover:shadow border-4 border-white hover:border-pink-200 transition ease-in-out duration-300 p-6 space-y-2"
                            >
                                <p className="text-xl font-extrabold">Farming</p>
                                <p className="">Stake your tokens to earn Scream, with the best returns available.</p>
                            </motion.a>
                        </Link> */}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <motion.a
                            initial={{ opacity: 0, x: '-40%', y: '-40%' }}
                            animate={{ opacity: [0, 1], x: ['-40%', '0%'], y: ['-40%', '0%'] }}
                            href="http://scream.monster/"
                            className="sm:col-span-1 block bg-white rounded-xl shadow-xl hover:shadow border-4 border-white hover:border-pink-200 transition ease-in-out duration-300 p-6 space-y-2"
                        >
                            <p className="text-xl font-extrabold">Events</p>
                            <p className="">SCREAMO minting site is live.</p>
                        </motion.a>

                        <motion.a
                            initial={{ opacity: 0, x: '40%', y: '40%' }}
                            animate={{ opacity: [0, 1], x: ['40%', '0%'], y: ['40%', '0%'] }}
                            href="# "
                            onClick={() => setComingSoon(true)}
                            className="sm:col-span-2 block bg-white rounded-xl shadow-xl hover:shadow border-4 border-white hover:border-pink-200 transition ease-in-out duration-150 p-6 space-y-2"
                        >
                            <p className="text-xl font-extrabold">Scream Merch</p>
                            <p className="">Love Scream? Show your support and rock some icey colors with Scream Merch. All sizes available.</p>
                        </motion.a>

                        {/* <motion.a
                            initial={{ opacity: 0, x: '40%', y: '40%' }}
                            animate={{ opacity: [0, 1], x: ['40%', '0%'], y: ['40%', '0%'] }}
                            href="# "
                            onClick={() => setComingSoon(true)}
                            className="sm:col-span-2 block bg-white rounded-xl shadow-xl hover:shadow border-4 border-white hover:border-pink-200 transition ease-in-out duration-150 p-6 space-y-2"
                        >
                            <p className="text-xl font-extrabold">Scream, the Game</p>
                            <p className="">Join in on the fun in the Scream RPF and earn real crypto competing against other members of the Scream community.</p>
                        </motion.a> */}
                    </div>

                    {/* <div>
                        <motion.a
                            initial={{ opacity: 0, x: '40%', y: '40%' }}
                            animate={{ opacity: [0, 1], x: ['40%', '0%'], y: ['40%', '0%'] }}
                            href="# "
                            onClick={() => setComingSoon(true)}
                            className="block bg-white rounded-xl shadow-xl hover:shadow border-4 border-white hover:border-pink-200 transition ease-in-out duration-150 p-6 space-y-2"
                        >
                            <p className="text-xl font-extrabold">Scream Merch</p>
                            <p className="">Love Scream? Show your support and rock some icey colors with Scream Merch. All sizes available.</p>
                        </motion.a>
                    </div> */}
                    <div className="flex whitespace-no-wrap overflow-auto ">
                        <div className="space-x-4">
                            <a href="https://docs.scream.sh/" target="_blank" rel="noreferrer">
                                Documentation
                            </a>
                            {/* <a href="https://docs.scream.sh/" target="_blank" rel="noreferrer"> */}
                            {/* </a> */}
                            {/* <a className="font-medium" href="# ">
                                Contact Us
                            </a> */}
                        </div>
                        <span className="flex-1" />
                        <div className="space-x-2">
                            <a href={process.env.NEXT_PUBLIC_TWITTER_URL} target="_blank" rel="noreferrer">
                                <i className="fab fa-twitter" />
                            </a>
                            <a href={process.env.NEXT_PUBLIC_TELEGRAM_URL} target="_blank" rel="noreferrer">
                                <i className="fab fa-telegram" />
                            </a>
                            <a href={process.env.NEXT_PUBLIC_DISCORD_URL} target="_blank" rel="noreferrer">
                                <i className="fab fa-discord" />
                            </a>
                            <a href={process.env.NEXT_PUBLIC_GITHUB_URL} target="_blank" rel="noreferrer">
                                <i className="fab fa-github" />
                            </a>
                            <a href={process.env.NEXT_PUBLIC_MEDIUM_URL} target="_blank" rel="noreferrer">
                                <i className="fab fa-medium" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
