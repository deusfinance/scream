import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Typed from 'react-typed'
import ParticlesBackground from '../components/ParticlesBackground'
import SubscribePopup from '../components/SubscribePopup'
import CryptoTicker from '../lib/CryptoTicker/CryptoTicker'

const Tilt = dynamic(import('react-parallax-tilt'), { ssr: false })

export default function App() {
    const [subscribe, setSubscribe] = useState(false)
    const [hide, setHide] = useState(false)

    useEffect(() => setTimeout(() => setHide(true), 3000), [])

    return (
        <>
            {/* <CryptoTicker visible={hide} /> */}
            <SubscribePopup visible={subscribe} hide={() => setSubscribe(false)} />
            <div className="h-full flex flex-col overflow-hidden">
                <Tilt className="tilt relative z-30 flex flex-col flex-1">
                    <div className="p-12 flex-1 flex items-center justify-center tilt-inner">
                        <motion.div layout className="max-w-xl w-full space-y-8">
                            {!hide && (
                                <div className="space-y-8 text-center">
                                    <div>
                                        <img className="block w-16 animate-spin mx-auto" src="/img/scream-multi.png" alt="" />
                                    </div>
                                    <div>
                                        <Typed className="text-rainbow font-mono text-center" strings={['Scream is loading...']} typeSpeed={40} />
                                    </div>
                                </div>
                            )}
                            <AnimatePresence>
                                {hide && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1] }} className="space-y-8">
                                        <div className="">
                                            <img className="w-auto" src="/img/scream-logotype.png" alt="" />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div>
                                                <div className="text-2xl sm:text-4xl font-bold ">
                                                    <p className="text-rainbow">Scream is a highly scalable decentralized lending protocol powered by </p>
                                                    <a href="https://fantom.foundation" target="_blank" rel="noreferrer" className="inline whitespace-nowrap hover:underline" style={{ color: '#13b5ec' }}>
                                                        <img className="inline-block align-middle h-6 mr-1" src="/img/fantom-logo.svg" alt="" />
                                                        fantom.
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="text-left sm:text-right space-y-4">
                                                <div>
                                                    <Link href="/apps">
                                                        <a className="block bg-animated-rainbow text-center font-bold rounded-3xl px-8 py-4 text-2xl w-full animate-ping text-white hover:shadow-xl transition ease-in-out duration-150 ">
                                                            <i className="fas fa-ghost mr-2 " />
                                                            <span>Open App</span>
                                                        </a>
                                                    </Link>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <a
                                                        href="https://docs.scream.sh/"
                                                        target="_blank"
                                                        className="bg-animated-rainbow font-medium rounded-3xl px-4 py-2 w-full animate-ping text-white hover:shadow-xl transition ease-in-out duration-150 text-center"
                                                        rel="noreferrer"
                                                    >
                                                        <span>Docs</span>
                                                    </a>
                                                    <button
                                                        onClick={() => setSubscribe((_) => !_)}
                                                        type="button"
                                                        className="bg-animated-rainbow font-medium rounded-3xl px-4 py-2 w-full animate-ping text-white hover:shadow-xl transition ease-in-out duration-150"
                                                    >
                                                        <span>Subscribe</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xl space-x-2">
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
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                    <ParticlesBackground />
                </Tilt>
            </div>
        </>
    )
}
