import { Button, Input, Select, Slider, useToasts } from '@geist-ui/react'
import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { CONTRACT_TOKEN_ADDRESS } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import useAlerts from '../../hooks/useAlerts'
import useBlock from '../../hooks/useBlock'
import useMarkets from '../../hooks/useMarkets'
import useTotalBorrowLimit from '../../hooks/useTotalBorrowLimit'
import { formatter } from '../../utils'
import { getSctokenContract } from '../../utils/ContractService'
import ConnectWalletButton from '../WalletConnect/ConnectWalletButton'

export default function WithdrawTab() {
    const { markets, update } = useMarkets()

    const [asset, setAsset] = useState(null)
    const [amount, setAmount] = useState('')
    const [showSlider, setShowSlider] = useState(false)
    const [withdrawPercent, setWithdrawPercent] = useState(0)

    const [isLoading, setIsLoading] = useState(false)
    const [limit, setLimit] = useState(new BigNumber(0))
    const { account, library } = useActiveWeb3React()
    const [, setToast] = useToasts()
    const { triggerTransactionAlert, deleteTransactionAlert } = useAlerts()
    const { totalBorrowLimit, totalBorrowBalance } = useTotalBorrowLimit(markets)
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
            const temp = BigNumber.min(asset.supplyBalance, totalBorrowLimit.minus(totalBorrowBalance).div(asset.collateralFactor).div(asset.underlyingPriceUSD))
            setLimit(temp)
        }
    }, [totalBorrowLimit, asset])

    const onChangeAsset = async (value) => {
        setAsset((markets || []).find((item) => item.id == value))
    }

    const onChangeAmount = async (e) => {
        const tempAmount = e.target.value
        const tempPercent = isNaN(parseFloat(tempAmount)) || limit.isZero() ? 0 : BigNumber.min(new BigNumber(100), new BigNumber(tempAmount).div(limit).times(100)).dp(0).toNumber()
        if (asset && !limit?.isZero()) {
            setWithdrawPercent(tempPercent)
            setAmount(tempAmount)
        } else {
            setWithdrawPercent(0)
            setAmount('0')
        }
    }

    const onChangePercent = (value) => {
        if (asset && !limit?.isZero()) {
            setWithdrawPercent(value)
            setAmount(limit.times(value).div(100).toString())
        } else {
            setWithdrawPercent(0)
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

    const withdraw = async () => {
        const id = asset?.symbol?.toLowerCase()
        if (!id) {
            setToast({ text: 'Invalid Asset', type: 'error' })
            return
        }

        if (+amount <= 0 || +amount > limit.toNumber()) {
            setToast({ text: `Invalid Amount! Your Withdraw Limit is ${limit.dp(8, 1).toString(10)} ${asset.underlyingSymbol.toUpperCase()}`, type: 'error' })
            return
        }

        const scTokenContract = getSctokenContract(id, library.getSigner())
        const token = CONTRACT_TOKEN_ADDRESS?.[asset.underlyingSymbol.toLowerCase()]
        const withdrawAmount = new BigNumber(amount)
        if (token && account) {
            setIsLoading(true)

            try {
                let tx = null
                if (asset.supplyBalance.eq(withdrawAmount)) {
                    const cTokenBalance = await scTokenContract.balanceOf(account)
                    tx = await scTokenContract.redeem(cTokenBalance)
                } else {
                    tx = await scTokenContract.redeemUnderlying(withdrawAmount.times(new BigNumber(10).pow(token.decimals)).integerValue().toString(10))
                }
                triggerTransactionAlert(tx.hash)
                await tx.wait(1)
                deleteTransactionAlert(tx.hash)
                update()
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
                <p className="flex-1 text-xl font-bold">Withdraw Assets</p>

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
                    <Slider step={1} max={100} min={0} initialValue={0} value={withdrawPercent} onChange={onChangePercent} />
                </div>
            )}
            <div className="flex">
                {!account && <ConnectWalletButton className="flex-1" type="secondary" />}
                {account && asset && (
                    <Button loading={isLoading} className="flex-1" type="secondary" onClick={withdraw}>
                        {isLoading ? 'Loading...' : 'Withdraw'}
                    </Button>
                )}
            </div>

            <div className="p-4 text-xs text-white bg-black rounded-xl">
                <p className="flex">
                    <span className="flex-1 opacity-50">Supply Balance</span>
                    <span className="">{formatter(asset?.supplyBalance, 6, asset?.underlyingSymbol?.toUpperCase()) || '-'}</span>
                </p>
                <p className="flex">
                    <span className="flex-1 opacity-50">Deposit APY</span>
                    <span className="">{formatter(asset?.supplyAPY, 2, '%') || '-'}</span>
                </p>
            </div>
        </div>
    )
}
