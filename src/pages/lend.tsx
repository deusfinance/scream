import { createContext } from 'react'
import AssetTable from '../components/AssetTable'
import BorrowTool from '../components/BorrowTool'
import Footer from '../components/Footer'
import Header from '../components/Header'
import LendTool from '../components/LendTool'
import RewardsBubble from '../components/RewardsBubble'
import Stats from '../components/Stats'

export const LendingContext = createContext({})

export default function App() {
    return (
        <>
            <Header />
            <Stats />

            <div className="max-w-5xl p-6 pb-12 mx-auto md:p-12 md:pb-24">
                <div className="space-y-6 md:space-y-12">
                    <RewardsBubble />

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-12">
                        <LendTool />
                        <BorrowTool />
                    </div>

                    <AssetTable />
                </div>
            </div>
            <Footer />
        </>
    )
}
