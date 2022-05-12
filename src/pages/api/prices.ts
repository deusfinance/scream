import axios from 'axios'

export default async function (req, res) {
    try {
        const { data: coinData } = await axios.get('http://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?&limit=100&CMC_PRO_API_KEY=81eaa74c-e983-412b-83e6-1031d5333927')

        const coins = coinData.data
        const symbols = coins.map((coin) => coin.symbol)

        const { data: imageData } = await axios.get(`http://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=${symbols.join(',')}&CMC_PRO_API_KEY=81eaa74c-e983-412b-83e6-1031d5333927`)
        const coinsWithImages = coins.map((coin) => ({ ...coin, logo: imageData.data[coin.symbol].logo }))

        res.json(coinsWithImages)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
}
