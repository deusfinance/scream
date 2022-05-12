import { Button, Input, Select, Slider, useToasts } from '@geist-ui/react'
import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { CONTRACT_TOKEN_ADDRESS } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import useAlerts from '../../hooks/useAlerts'
import useBlock from '../../hooks/useBlock'
import useMarkets from '../../hooks/useMarkets'
import { formatter } from '../../utils'
import { getSctokenContract, getTokenContract } from '../../utils/ContractService'
import ConnectWalletButton from '../WalletConnect/ConnectWalletButton'

export default function RepayTab() {
    const { markets, update } = useMarkets()
    const [asset, setAsset] = useState(null)
    const [amount, setAmount] = useState('')
    const [limit, setLimit] = useState(new BigNumber(0))
    const [isEnabled, setIsEnabled] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showSlider, setShowSlider] = useState(false)
    const [repayPercent, setRepayPercent] = useState(0)

    const { account, library } = useActiveWeb3React()
    const [, setToast] = useToasts()
    const { triggerTransactionAlert, deleteTransactionAlert } = useAlerts()
    const block = useBlock()

    useEffect(() => {
        if (markets?.length) {
            if (!asset) {
                setAsset(markets[0])
            } else {
                setAsset((markets || []).find((item) => item.id == asset.id))
            }
        }
    }, [markets, block])

    useEffect(() => {
        if (asset) {
            setIsEnabled(asset?.allowBalance?.gt(0))
            setLimit(BigNumber.minimum(asset.borrowBalance, asset.walletBalance))
        } else {
            setIsEnabled(false)
            setLimit(new BigNumber(0))
        }
    }, [asset])

    const onChangeAsset = async (value) => {
        setAsset((markets || []).find((item) => item.id == value))
    }

    const onChangeAmount = async (e) => {
        const tempAmount = e.target.value
        const tempPercent = isNaN(parseFloat(tempAmount)) || limit.isZero() ? 0 : BigNumber.min(new BigNumber(100), new BigNumber(tempAmount).div(limit).times(100)).dp(0).toNumber()
        if (asset && !limit?.isZero()) {
            setRepayPercent(tempPercent)
            setAmount(tempAmount)
        } else {
            setRepayPercent(0)
            setAmount('0')
        }
    }

    const onChangePercent = (value) => {
        if (asset && !limit?.isZero()) {
            setRepayPercent(value)
            setAmount(limit.times(value).div(100).toString())
        } else {
            setRepayPercent(0)
            setAmount('0')
        }
    }

    const handleMax = () => {
        if (!asset || limit.isZero()) {
            setAmount('')
        } else {
            setAmount(limit.toString())
        }
    }

    const approve = async () => {
        setIsLoading(true)
        try {
            const tokenContract = getTokenContract(asset?.underlyingSymbol?.toLowerCase(), library?.getSigner())
            if (tokenContract) {
                const tx = await tokenContract.approve(asset?.id, new BigNumber(2).pow(256).minus(1).toString(10))
                triggerTransactionAlert(tx?.hash)
                await tx.wait(1)
                deleteTransactionAlert(tx?.hash)
                update()
                setIsEnabled(true)
            }
        } catch (e) {
            console.log(e)
        }
        setIsLoading(false)
    }

    const repay = async () => {
        const id = asset?.symbol?.toLowerCase()
        if (!id) {
            setToast({ text: 'Invalid Asset', type: 'error' })
            return
        }
        const scTokenContract = getSctokenContract(id, library.getSigner())
        const token = CONTRACT_TOKEN_ADDRESS?.[asset.underlyingSymbol.toLowerCase()]

        if (+amount <= 0 || new BigNumber(amount).gt(limit)) {
            setToast({ text: `Invalid Amount. Your Repay Limit is ${limit.dp(8, 1).toString(10)} ${token.symbol.toUpperCase()}`, type: 'error' })
            return
        }
        const repayAmount = new BigNumber(amount).times(new BigNumber(10).pow(token?.decimals))
        if (token && account) {
            setIsLoading(true)

            try {
                let tx = null
                tx = await scTokenContract.repayBorrow(repayAmount.toString(10))
                if (tx) {
                    triggerTransactionAlert(tx.hash)
                    await tx.wait(1)
                    deleteTransactionAlert(tx.hash)
                    update()
                }
            } catch (e) {
                console.log(e)
                setToast({ text: e?.data?.message || e?.message, type: 'error' })
            }

            setAmount('')
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center">
                <p className="flex-1 text-xl font-bold">Repay Assets</p>

                <Select placeholder="Assets" value={asset?.id} onChange={onChangeAsset}>
                    {markets &&
                        markets.map((market) => (
                            <Select.Option value={market.id} key={market.id}>
                                <div className="flex items-center space-x-2">
                                    <img className="block w-4 h-4" src={`/img/tokens/${market.icon}`} alt="" />
                                    <p>{market.underlyingSymbol}</p>
                                </div>
                            </Select.Option>
                        ))}
                </Select>
            </div>

            <div className="p-4 text-xs text-white bg-pink-500 rounded-xl">
                <p className="flex">
                    <span className="flex-1 opacity-50">You owe</span>
                    <span className="">{formatter(asset?.borrowBalance, 6, asset?.underlyingSymbol?.toUpperCase()) || '-'}</span>
                </p>
                <p className="flex">
                    <span className="flex-1 opacity-50">Your Collateral</span>
                    <span>{formatter(asset?.borrowBalance / asset?.collateralFactor, 6, asset?.underlyingSymbol?.toUpperCase()) || '-'}</span>
                </p>
            </div>

            <div className="flex space-x-2">
                <Button auto onClick={handleMax}>
                    Max
                </Button>

                <div className="flex-1">
                    <Input label="Amount" type="number" size="large" width="100%" placeholder="Enter an amount" value={amount} onChange={onChangeAmount} />
                </div>

                <Button onClick={() => setShowSlider((_) => !_)} auto>
                    <i className={`fas fa-chevron-circle-${showSlider ? 'up' : 'down'}`} />
                </Button>
            </div>

            {showSlider && (
                <div>
                    <Slider step={1} max={100} min={0} initialValue={0} value={repayPercent} onChange={onChangePercent} />
                </div>
            )}

            <div className="flex flex-1">
                {!account && <ConnectWalletButton className="flex-1" type="secondary" />}
                {account && asset && isEnabled && (
                    <Button className="flex-1" type="secondary" onClick={repay}>
                        {isLoading ? 'Loading...' : 'Repay'}
                    </Button>
                )}
                {account && asset && !isEnabled && (
                    <Button loading={isLoading} className="flex-1" type="secondary" onClick={approve}>
                        {isLoading ? 'Loading...' : 'Approve'}
                    </Button>
                )}
            </div>

            <div className="p-4 text-xs text-white bg-black rounded-xl">
                <p className="flex">
                    <span className="flex-1 opacity-50">Balance</span>
                    <span className="">{formatter(asset?.walletBalance, 6, asset?.underlyingSymbol?.toUpperCase()) || '-'}</span>
                </p>
                <p className="flex">
                    <span className="flex-1 opacity-50">Liquidity Available</span>
                    <span className="">{formatter(asset?.liquidity, 6, asset?.underlyingSymbol?.toUpperCase()) || '-'}</span>
                </p>
            </div>
        </div>
    )
}
