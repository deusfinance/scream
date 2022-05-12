import { Button, Input, Note, Select, Slider, useToasts } from '@geist-ui/react'
import Tippy from '@tippyjs/react'
import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { CONTRACT_TOKEN_ADDRESS } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import useAlerts from '../../hooks/useAlerts'
import useBlock from '../../hooks/useBlock'
import useMarkets from '../../hooks/useMarkets'
import useRewards from '../../hooks/useRewards'
import useTotalBorrowLimit from '../../hooks/useTotalBorrowLimit'
import { formatter } from '../../utils'
import { getSctokenContract } from '../../utils/ContractService'
import ConnectWalletButton from '../WalletConnect/ConnectWalletButton'

export default function BorrowTab() {
    const { markets, update } = useMarkets()
    const [asset, setAsset] = useState(null)
    const [amount, setAmount] = useState('')
    const [borrowLimit, setBorrowLimit] = useState(new BigNumber(0))
    const [borrowPercent, setBorrowPercent] = useState(new BigNumber(0))
    const [newBorrowPercent, setNewBorrowPercent] = useState(new BigNumber(0))
    const [isLoading, setIsLoading] = useState(false)
    const [showSlider, setShowSlider] = useState(false)
    const [borrowAmountPercent, setBorrowAmountPercent] = useState(0)

    const { borrowApy } = useRewards(asset)
    const block = useBlock()

    const { totalBorrowLimit, totalBorrowBalance } = useTotalBorrowLimit(markets)

    const { account, library } = useActiveWeb3React()
    const [, setToast] = useToasts()
    const { triggerTransactionAlert, deleteTransactionAlert } = useAlerts()

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
        if (asset && account) {
            calculateBorrowLimit()

            const amountBig = new BigNumber(parseFloat(amount) || 0)
            if (totalBorrowLimit.isZero()) {
                setBorrowLimit(new BigNumber(0))
                setNewBorrowPercent(new BigNumber(0))
            } else {
                setBorrowPercent(totalBorrowBalance.div(totalBorrowLimit).times(100))
                setNewBorrowPercent(totalBorrowBalance.plus(amountBig.times(asset.underlyingPriceUSD)).div(totalBorrowLimit).times(100))
            }
        }
    }, [asset, account, amount, totalBorrowLimit])

    const calculateBorrowLimit = async () => {
        let limit = new BigNumber(0)
        if (!account || !asset || !library) {
            setBorrowLimit(limit)
            return
        }

        limit = totalBorrowLimit.minus(totalBorrowBalance)
        setBorrowLimit(limit.div(asset?.underlyingPriceUSD))
    }

    const onChangeAsset = async (value) => {
        setAsset((markets || []).find((item) => item.id == value))
        setAmount('')
    }

    const onChangeAmount = async (e) => {
        const tempAmount = e.target.value
        const tempPercent = isNaN(parseFloat(tempAmount)) || borrowLimit.isZero() ? 0 : BigNumber.min(new BigNumber(100), new BigNumber(tempAmount).div(borrowLimit).times(100)).dp(0).toNumber()
        if (asset && !borrowLimit?.isZero()) {
            setBorrowAmountPercent(tempPercent)
            setAmount(tempAmount)
        } else {
            setBorrowAmountPercent(0)
            setAmount('0')
        }
    }

    const onChangePercent = (value) => {
        if (asset && !borrowLimit?.isZero()) {
            setBorrowAmountPercent(value)
            setAmount(borrowLimit.times(value).div(100).toString())
        } else {
            setBorrowAmountPercent(0)
            setAmount('0')
        }
    }

    const eightyPercentOfBorrowLimit = borrowLimit.multipliedBy(80).dividedBy(100)
    const isMoreThanEightyPercent = new BigNumber(amount).gt(eightyPercentOfBorrowLimit)
    const handleMax = () => {
        if (!asset || borrowLimit.isZero()) {
            setAmount('')
        } else {
            onChangePercent(80)
            // setAmount(eightyPercentOfBorrowLimit.toString())
        }
    }

    const borrow = async () => {
        const id = asset?.symbol?.toLowerCase()
        if (!id) {
            setToast({ text: 'Invalid Asset', type: 'error' })
            return
        }

        const scTokenContract = getSctokenContract(id, library.getSigner())
        const token = CONTRACT_TOKEN_ADDRESS?.[asset.underlyingSymbol.toLowerCase()]

        const borrowAmount = new BigNumber(parseFloat(amount) || 0).times(new BigNumber(10).pow(token?.decimals))
        if (borrowAmount.lte(0) || new BigNumber(amount).gt(borrowLimit)) {
            setToast({ text: `Invalid Amount! Your borrow Limit is ${borrowLimit.dp(8, 1).toString(10)} ${token.symbol.toUpperCase()}`, type: 'error' })
            return
        }

        if (token && account) {
            setIsLoading(true)
            try {
                const tx = await scTokenContract.borrow(borrowAmount.toString(10))
                triggerTransactionAlert(tx?.hash)
                await tx.wait(1)
                deleteTransactionAlert(tx?.hash)
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
                <p className="flex-1 text-xl font-bold">Borrow Assets</p>

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

            {isMoreThanEightyPercent && <Note type="error">Borrowing more than 80% of your total borrow limit can lead to risk of liquidation. Avoid it.</Note>}

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
                    <Slider step={1} max={100} min={0} initialValue={0} value={borrowAmountPercent} onChange={onChangePercent} />
                </div>
            )}

            <div className="flex">
                {!account && <ConnectWalletButton className="flex-1" type="secondary" />}
                {account && asset && (
                    <Button loading={isLoading} className="flex-1" type="secondary" onClick={borrow}>
                        {isLoading ? 'Loading...' : 'Borrow'}
                    </Button>
                )}
            </div>

            <div className="p-4 text-xs text-white bg-black rounded-xl">
                <p className="flex">
                    <span className="flex-1 opacity-50">Borrow Limit</span>
                    <span className="">${formatter(totalBorrowLimit, 2) || '-'}</span>
                </p>
                <p className="flex">
                    <span className="flex-1 opacity-50">
                        <span>Used Borrow Limit</span>
                        &nbsp;
                        <Tippy
                            content={
                                <p className="p-2 text-xs bg-white border border-gray-100 shadow-xl rounded-xl">This factor tells you the total percentage of your borrow limit used before and after this transaction.</p>
                            }
                        >
                            <i className="fas fa-info-circle" />
                        </Tippy>
                    </span>
                    <span className="">
                        {formatter(borrowPercent, 2, '%')}
                        &nbsp;
                        <i className="opacity-25 fas fa-caret-right" />
                        &nbsp;
                        {formatter(newBorrowPercent, 2, '%')}
                    </span>
                </p>

                <p className="flex">
                    <span className="flex-1 opacity-50">Reward APY</span>
                    <span className="">{formatter(borrowApy, 2, '%') || '??'}</span>
                </p>
            </div>
        </div>
    )
}
