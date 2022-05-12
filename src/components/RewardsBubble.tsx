import { Button } from '@geist-ui/react'
import useRewards from '../hooks/useRewards'

export default function RewardsBubble() {
    const { rewardValue, claimAll } = useRewards()

    return (
        <div className="p-1 shadow-xl bg-animated-rainbow rounded-2xl">
            <div className="p-6 bg-white shadow-xl rounded-2xl">
                <div className="flex flex-col flex-wrap items-center space-x-2 space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                    <div className="text-center md:text-left">
                        <p className="text-xs font-mono">Current Rewards</p>
                        <p className="">
                            <span className="inline font-mono text-xs sm:text-base font-extrabold">{Number(rewardValue).toFixed(8)} SCREAM</span>
                            <img className="inline w-6 ml-2 animate-spin" src="/img/tokens/scream.png" alt="" />
                        </p>
                    </div>
                    <div className="flex-1" />
                    <Button onClick={() => claimAll()} type="secondary" auto>
                        Claim Your Rewards
                    </Button>
                </div>
            </div>
        </div>
    )
}
