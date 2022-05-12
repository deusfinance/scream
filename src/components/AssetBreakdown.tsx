import { Modal } from '@geist-ui/react'
import { currencyFormatter, formatter } from '../utils'

export default function AssetBreakdown({ open, asset, hide, token }) {
    return (
        <Modal open={open} onClose={hide} width="400px">
            <Modal.Content>
                <div className="space-y-8">
                    <div className="flex items-center space-x-2">
                        <img className="h-12" src={`/img/tokens/${token?.asset}`} alt="" />
                        <div className="text-4xl font-extrabold">{token?.id?.toUpperCase()}</div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <p className="font-medium text-blue-400">Available Liquidity</p>
                            <p className="text-xl">${`${currencyFormatter(asset?.liquidityUsd)}`}</p>
                        </div>
                        <div>
                            <p className="font-medium text-blue-400">Utilization Rate</p>
                            <p className="text-xl">{`${asset?.utilizationRate}`}%</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-400">Market Details</p>

                        <div className="flex items-center">
                            <p className="flex-1">Price</p>
                            <p>${currencyFormatter(asset?.underlyingPriceUSD)}</p>
                        </div>

                        <div className="flex items-center">
                            <p className="flex-1">Market Liquidity</p>
                            <p>{`${currencyFormatter(asset?.liquidity)} ${asset?.underlyingSymbol}`}</p>
                        </div>

                        <div className="flex items-center">
                            <p className="flex-1">{token?.id?.toUpperCase()} Supply Cap</p>
                            <p>{token?.id?.toUpperCase() == 'FUSD' ? '10 mil' : 'Unlimited'}</p>
                        </div>

                        <div className="flex items-center">
                            <p className="flex-1">{token?.id?.toUpperCase()} Borrow Cap</p>
                            <p>Unlimited</p>
                        </div>

                        <div className="flex items-center">
                            <p className="flex-1">Reserves</p>
                            <p>{`${currencyFormatter(asset?.reserves)} ${asset?.underlyingSymbol}`}</p>
                        </div>

                        <div className="flex items-center">
                            <p className="flex-1">Reserve Factor</p>
                            <p>{`${currencyFormatter(asset?.reserveFactor * 100)} %`}</p>
                        </div>

                        <div className="flex items-center">
                            <p className="flex-1">Collateral Factor</p>
                            <p>{`${currencyFormatter(asset?.collateralFactor * 100)} %`}</p>
                        </div>

                        <div className="flex items-center">
                            <p className="flex-1">Utilization Rate</p>
                            <p>{`${currencyFormatter(asset?.utilizationRate)} %`}</p>
                        </div>

                        <div className="flex items-center">
                            <p className="flex-1">Exchange Rate</p>
                            <p>{formatter(asset?.exchangeRate, 4)}</p>
                        </div>
                    </div>
                </div>
            </Modal.Content>
        </Modal>
    )
}
