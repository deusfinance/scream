import { Button } from '@geist-ui/react'
import { useContext } from 'react'
import useRewards from '../hooks/useRewards'
import { LendingContext } from '../pages/lend'
import Sidebar from './Sidebar'

export default function StakingSidebar({ open, hide }) {
    const { stakingSidebarData } = useContext(LendingContext)

    const { claimReward, rewardValue, lendingApy, borrowApy } = useRewards(stakingSidebarData)

    return (
        <Sidebar {...{ open, hide }} className="z-50">
            <div className="min-h-full overflow-auto">
                <div className="p-6 space-y-8 md:p-12 h-full flex flex-col">
                    <div className="flex-1" />
                    <div className="space-y-1">
                        <p className="text-4xl font-extrabold">Rewards</p>
                        <p className="text-xl font-medium opacity-50">
                            Claim your rewards on your sc
                            {stakingSidebarData.underlyingSymbol}. Earn SCREAM.
                        </p>
                    </div>

                    {/* comment this out */}
                    {/* <div className="flex flex-col items-center justify-center space-y-2 text-white bg-pink-500 rounded-2xl h-60">
                        <p className="text-xl font-medium opacity-50">You've earned...</p>
                        <p className="text-4xl font-extrabold">{rewardValue}</p>
                        <p className="text-xl font-extrabold opacity-75">
                            sc
                            {stakingSidebarData.underlyingSymbol}
                        </p>
                    </div> */}
                    {/* comment this out */}

                    <div className="space-y-1 font-mono opacity-75">
                        <div className="flex items-center space-x-2">
                            <p>Borrow APY</p>
                            <span className="flex-1 border border-black border-dotted" />
                            <p> {borrowApy} % </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <p>Lending APY</p>
                            <span className="flex-1 border border-black border-dotted" />
                            <p> {lendingApy} %</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex md:col-span-2">
                            <Button onClick={claimReward} className="flex-1" type="secondary">
                                Claim Rewards
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Sidebar>
    )
}
