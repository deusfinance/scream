import { createChart } from 'lightweight-charts'
import { useEffect, useRef } from 'react'
import useSWR from 'swr'

let chart = null
let areaSeries = null
export default function TVChartContainer({ setHoveredParam }) {
    const ref = useRef()

    const { data } = useSWR('https://api.coingecko.com/api/v3/coins/scream/market_chart?vs_currency=usd&days=max')

    useEffect(() => {
        if (chart) return
        chart = createChart(ref.current, {
            rightPriceScale: {
                borderVisible: false,
                visible: false
            },
            timeScale: {
                visible: false,
                borderVisible: false
            },
            layout: {
                backgroundColor: 'transparent',
                lineColor: '#2B2B43',
                textColor: '#D9D9D9'
            },
            watermark: {
                color: 'rgba(0, 0, 0, 0)'
            },
            crosshair: {
                color: '#758696'
            },
            grid: {
                visible: false,
                vertLines: {
                    visible: false,
                    color: '#2B2B43'
                },
                horzLines: {
                    visible: false,
                    color: '#363C4E'
                }
            }
        })

        areaSeries = chart.addAreaSeries({
            topColor: 'rgba(140, 0, 169, 0.5)',
            bottomColor: 'rgba(224, 108, 222, 0.5)',
            lineColor: 'rgb(185, 7, 224)',
            lineWidth: 2
        })
        return () => (chart = null)
    }, [])

    useEffect(() => {
        if (!data) return
        data.prices.map((candle) => {
            try {
                const priceTime = candle[0] / 1000
                areaSeries.update({ time: priceTime, value: candle[1] })
                chart.timeScale().fitContent()
            } catch (error) {
                console.log(error)
            }
        })
    }, [data])

    useEffect(() => {
        if (!chart) return

        function handleCrosshairMoved(param) {
            if (!param.point) return
            setHoveredParam({ price: param.seriesPrices.get(areaSeries)?.toFixed(2), time: param.time })
        }

        chart.subscribeCrosshairMove(handleCrosshairMoved)
        return () => {
            if (!chart) return
            chart.unsubscribeCrosshairMove(handleCrosshairMoved)
        }
    }, [chart])

    useEffect(() => {
        if (!chart) return

        const handler = () => {
            chart.resize(ref.current.clientWidth, ref.current.clientHeight)
        }
        window.addEventListener('resize', handler)
        return () => window.removeEventListener('resize', handler)
    }, [])

    return <div ref={ref} className="absolute inset-0" />
}
