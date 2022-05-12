import { HomeIcon, MenuAlt3Icon } from '@heroicons/react/solid'
import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import ConnectWalletButton from './WalletConnect/ConnectWalletButton'

interface ButtonProps {
    href: string
    children: any
}

export function Button({ href, children }: ButtonProps) {
    const router = useRouter()

    const isActive = router.pathname.endsWith(href.slice(-6))

    return (
        <Link href={href}>
            <a>
                <p className={classNames('font-medium text-xs opacity-75', isActive && 'text-pink-600')}>{children}</p>
            </a>
        </Link>
    )
}

export default function Header() {
    const [isExpanded, setIsExpanded] = useState(false)

    const { data } = useSWR('https://api.coingecko.com/api/v3/coins/scream')
    const screamPrice = data?.market_data?.current_price?.usd

    return (
        <>
            <div className="relative z-10 pb-1 bg-animated-rainbow">
                <a
                    href="https://pro.olympusdao.finance/?utm_source=scream&utm_medium=affiliate&utm_campaign=op-affiliate"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center max-w-5xl px-6 py-2 mx-auto font-mono text-xs font-extrabold md:px-12 md:py-0 group "
                >
                    <img className="hidden w-10 mr-4 md:block" src="/img/olympus.png" alt="" />
                    <p>
                        <span className="group-hover:underline">Click here</span> to obtain SCREAM at a discount by bonding SCREAM-FTM LP tokens at Olympus Pro!
                    </p>
                </a>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="flex flex-col overflow-hidden bg-white border-b md:hidden border-color-100">
                            <div className="p-6 space-y-4">
                                <div className="flex flex-col space-y-2">
                                    <Link href="/apps" passHref>
                                        <a className="text-3xl font-extrabold">All Apps</a>
                                    </Link>
                                    {/* <Link href="/" passHref> */}
                                    <a
                                        href="https://spookyswap.finance/swap?inputCurrency=FTM&outputCurrency=0xe0654c8e6fd4d733349ac7e09f6f23da256bf475"
                                        target="_blank"
                                        className="text-3xl font-extrabold text-rainbow"
                                        rel="noreferrer"
                                    >
                                        Buy SCREAM
                                    </a>
                                    {/* </Link> */}
                                </div>
                                <div className="">
                                    <ConnectWalletButton type="rainbow" />
                                </div>
                                <div className="flex items-center">
                                    <img className="h-6 mr-2" src="/img/tokens/scream.png" alt="" />
                                    <p className="font-mono text-xs text-center">${screamPrice}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="bg-white">
                    <div className="flex items-center max-w-5xl p-6 py-4 mx-auto space-x-2 md:px-12 whitespace-nowrap">
                        <Button href="/">
                            <HomeIcon className="w-4" />
                        </Button>
                        <Button href="/apps">Apps</Button>
                        <Button href="/dashboard">Dashboard</Button>
                        <Button href="https://analytics.scream.sh">Analytics</Button>
                        <Button href="/lend">Lending</Button>
                        <Button href="/stake">Staking</Button>

                        <div className="hidden md:block text-shadow text-rainbow">
                            <a href="https://spookyswap.finance/swap?inputCurrency=FTM&outputCurrency=0xe0654c8e6fd4d733349ac7e09f6f23da256bf475" target="_blank" className="font-extrabold text-rainbow" rel="noreferrer">
                                Buy SCREAM
                            </a>
                        </div>

                        <div className="flex-1" />

                        <div className="items-center hidden md:flex">
                            <img className="h-5 mr-2" src="/img/tokens/scream.png" alt="" />
                            <p className="font-mono text-xs">${screamPrice}</p>
                        </div>

                        <div className="hidden md:block">
                            <ConnectWalletButton type="rainbow" />
                        </div>

                        <button className="md:hidden" type="button" onClick={() => setIsExpanded((_) => !_)}>
                            <MenuAlt3Icon className={classNames('w-4 transform ease-in-out duration-300', isExpanded && 'rotate-90')} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
