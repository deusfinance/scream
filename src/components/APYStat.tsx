import useRewards from '../hooks/useRewards'

interface APYStat {
    market: any
    type?: 'lend' | 'borrow'
}

export default function APYStat({ market, type }: APYStat) {
    const { lendingApy, borrowApy } = useRewards(market)

    return (
        <div>
            <p>{type == 'lend' ? market.supplyAPY?.toFixed(2) : market.borrowAPY?.toFixed(2)}%</p>
            <div className="flex items-center space-x-1">
                <p className="font-mono text-xs opacity-50">{type == 'lend' ? lendingApy : borrowApy}%</p>
                <img className="w-3" src="/img/tokens/scream.png" alt="" />
            </div>
        </div>
    )
}
