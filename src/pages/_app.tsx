import { GeistProvider } from '@geist-ui/react'
import { Web3ReactProvider } from '@web3-react/core'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Meta from '../components/Meta'
import Web3ReactManager from '../components/Web3ReactManager'
import { UseAlertsWrapper } from '../hooks/useAlerts'
import { MarketsWrapper } from '../hooks/useMarkets'
import { GoogleAnalytics } from '../lib/ga'
import '../styles/global.css'
import getLibrary from '../utils/getLibrary'
import { FarmDataWrapper } from '../hooks/useFarmData'

const Web3ReactProviderDefault = dynamic(() => import('../components/Provider'), { ssr: false })

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
                    integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
                    crossOrigin="anonymous"
                />
                <script src="/js/three.min.js" />
                <script src="/js/p5.min.js" />
            </Head>
            <Meta />

            <GoogleAnalytics />

            <GeistProvider>
                <Web3ReactProvider getLibrary={getLibrary}>
                    <Web3ReactProviderDefault getLibrary={getLibrary}>
                        <Web3ReactManager>
                            <MarketsWrapper>
                                <FarmDataWrapper>
                                    <UseAlertsWrapper>
                                        <Component {...pageProps} />
                                    </UseAlertsWrapper>
                                </FarmDataWrapper>
                            </MarketsWrapper>
                        </Web3ReactManager>
                    </Web3ReactProviderDefault>
                </Web3ReactProvider>
            </GeistProvider>
        </>
    )
}
