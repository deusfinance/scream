import { Button, Input, Select, Slider, useToasts } from '@geist-ui/react'
import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import { CONTRACT_TOKEN_ADDRESS } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import useAlerts from '../../hooks/useAlerts'
import useBlock from '../../hooks/useBlock'
import useMarkets from '../../hooks/useMarkets'
import useRewards from '../../hooks/useRewards'
import { formatter } from '../../utils'
import { getSctokenContract, getTokenContract } from '../../utils/ContractService'
import ConnectWalletButton from '../WalletConnect/ConnectWalletButton'

export default function SupplyTab() {
    const { markets, update } = useMarkets()
    const [asset, setAsset] = useState(null)
    const [amount, setAmount] = useState('')
    const [isEnabled, setIsEnabled] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showSlider, setShowSlider] = useState(false)
    const [supplyPercent, setSupplyPercent] = useState(0)
    const { lendingApy } = useRewards(asset)
    const block = useBlock()

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
    }, [markets, block, asset])

    useEffect(() => {
        setIsEnabled(asset?.allowBalance?.gt(0))
    }, [asset])

    const onChangeAsset = async (value) => {
        setAsset((markets || []).find((item) => item.id == value))
    }

    const onChangeAmount = async (e) => {
        const tempAmount = e.target.value
        const tempPercent = isNaN(parseFloat(tempAmount)) ? 0 : BigNumber.min(new BigNumber(100), new BigNumber(tempAmount).div(asset.walletBalance).times(100)).dp(0).toNumber()
        if (asset && !asset?.walletBalance?.isZero()) {
            setSupplyPercent(tempPercent)
            setAmount(tempAmount)
        } else {
            setSupplyPercent(0)
            setAmount('0')
        }
    }

    const onChangePercent = (value) => {
        if (asset && !asset?.walletBalance?.isZero()) {
            setSupplyPercent(value)
            setAmount(asset.walletBalance.times(value).div(100).toString())
        } else {
            setSupplyPercent(0)
            setAmount('0')
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
                deleteTransactionAlert(tx.hash)
                setIsEnabled(true)
                update()
            }
        } catch (e) {
            console.log(e)
        }
        setIsLoading(false)
    }

    const handleMax = () => {
        setAmount(asset ? asset.walletBalance.toString() : 0)
    }

    const supply = async () => {
        const id = asset?.symbol?.toLowerCase()
        if (!id) {
            setToast({ text: 'Invalid Asset', type: 'error' })
            return
        }
        const scTokenContract = getSctokenContract(id, library.getSigner())
        const token = CONTRACT_TOKEN_ADDRESS?.[asset.underlyingSymbol.toLowerCase()]

        const amountBig = new BigNumber(amount)
        if (+amount <= 0 || amountBig.gt(asset.walletBalance)) {
            setToast({ text: `Invalid Amount. Your Supply Limit is ${asset.walletBalance.dp(8, 1).toString()} ${token.symbol.toUpperCase()}`, type: 'error' })
            return
        }

        if (token && account) {
            setIsLoading(true)

            try {
                const tx = await scTokenContract.mint(amountBig.times(new BigNumber(10).pow(token?.decimals)).toString(10))
                triggerTransactionAlert(tx?.hash)
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
                <p className="flex-1 text-xl font-bold">Lend Assets</p>

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
                    <Slider step={1} max={100} min={0} initialValue={0} value={supplyPercent} onChange={onChangePercent} />
                </div>
            )}
            <div className="flex">
                {!account && <ConnectWalletButton className="flex-1" type="secondary" />}
                {account && asset && isEnabled && (
                    <Button loading={isLoading} className="flex-1" type="secondary" onClick={supply}>
                        {isLoading ? 'Loading...' : 'Supply'}
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
                    <span className="flex-1 opacity-50">Deposit APY</span>
                    <span className="">{formatter(asset?.supplyAPY, 2, '%') || '-'}</span>
                </p>
                <p className="flex">
                    <span className="flex-1 opacity-50">Reward APY</span>
                    <span className="">{formatter(lendingApy, 2, '%') || '??'}</span>
                </p>
            </div>
        </div>
    )
}
