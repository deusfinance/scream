export default function CoinListItem({ coin }) {
    return (
        <div className="bg-pink-50 rounded-xl shadow-xl p-6">
            <div className="flex items-center space-x-2">
                <p className="text-3xl font-extrabold">{coin.name}</p>
                <p className="opacity-75">{coin.ticker}</p>
            </div>
            <p className="text-xs">{coin.url}</p>
        </div>
    )
}
