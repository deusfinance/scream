import dynamic from 'next/dynamic'
import { useState } from 'react'
import Header from '../components/Header'

const TVChartContainer = dynamic(() => import('../components/TVChartContainer'), { ssr: false })

export default function Dashboard() {
    const [hoveredParam, setHoveredParam] = useState(null)

    return (
        <>
            <Header />
            <div className="flex flex-col h-full w-full bg-gray-100 over p-6 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="bg-white rounded-xl p-2 md:p-4">
                        <p className="text-xs font-medium">Market Cap</p>
                        <p className="text-2xl font-extrabold">$23,313,123.32</p>
                    </div>
                    <div className="bg-white rounded-xl p-2 md:p-4">
                        <p className="text-xs font-medium">Current Price</p>
                        <p className="text-2xl font-extrabold">$23</p>
                    </div>
                    <div className="bg-white rounded-xl p-2 md:p-4 flex items-center">
                        <div className="flex-1">
                            <p className="text-xs font-medium">Your Balance</p>
                            <p className="text-2xl font-extrabold">413 $SCREAM</p>
                        </div>
                        {/* <Button onClick={() => wallet.connect()} auto size="mini" type={wallet.account ? 'default' : 'secondary'}>
                            {wallet.account ? 'Connected' : 'Connect Wallet'}
                        </Button> */}
                    </div>
                </div>

                <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-5 gap-2">
                    <div className="min-h-screen md:min-h-0 md:col-span-4 bg-white rounded-xl overflow-hidden">
                        <TVChartContainer setHoveredParam={setHoveredParam} />
                    </div>

                    <div className="bg-white relative rounded-xl p-6 overflow-hidden flex flex-col space-y-4">
                        <div className="flex-1 overflow-scroll space-y-4">
                            {new Array(100).fill(4).map(() => (
                                <div className="flex items-center border-gray-100 border-b pb-2">
                                    <div className="flex-1">
                                        <p className="text-xs font-bold">June 31st, 12:37 PM</p>
                                        <p className="font-medium">12,000 SCREAM</p>
                                        <p className="text-xs opacity-50 font-medium">@ 1232 FTM/SCREAM</p>
                                    </div>
                                    {/* <p className="text-green-400 text-xs font-extrabold uppercase">+ Buy</p> */}
                                    <p className="text-red-400 text-xs font-extrabold uppercase">- Sell</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
