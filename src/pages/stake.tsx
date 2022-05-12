import { Button, Input } from '@geist-ui/react'
import { useEffect, useRef, useState } from 'react'
import commas from 'comma-number'
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/solid'
import dayjs from 'dayjs'
import LockedEarningsChart from '../components/LockedEarningsChart'
import Footer from '../components/Footer'
import Header from '../components/Header'
import StakeHeader from '../components/StakeHeader'
import useStake from '../hooks/useStake'
import useFarmData from '../hooks/useFarmData'
import useFarm from '../hooks/useFarm'
import useVeScream from '../hooks/useVeScream'
import usePrice from '../hooks/usePrice'
import { toEth } from '../utils'

export const SECONDS_PER_WEEK = 60 * 60 * 24 * 7

// Time will always roundown to nearest week, use this to calculate the expected epoch unlock date
const calculateUnlockEpoch = (time, date) => {
    const lockDate = date + time
    const roundedLockDateEpoch = Math.floor(lockDate / SECONDS_PER_WEEK) * SECONDS_PER_WEEK
    return roundedLockDateEpoch
}

// general utility
const epochToDate = (epoch) => dayjs(new Date(epoch * 1000)).format('MM/DD/YYYY')

export default function App() {
    const { status, unstake, screamBalance, xscreamBalance, totalSupply, shareValue } = useStake()
    const { farmData } = useFarmData()
    const { screamPrice } = usePrice()
    const { deposit, withdraw, claim } = useFarm()
    const loading = status === 'loading'

    const [depositInput, setDepositInput] = useState<any>('')
    const [withdrawInput, setWithdrawInput] = useState<any>('')

    const [lockInput, setLockInput] = useState('')
    const [timeInput, setTimeInput] = useState('')
    const [showModifyLock, setShowModifyLock] = useState(false)
    const [lockOrStake, setLockOrStake] = useState<'lock' | 'stake'>('lock')
    const [claimableRewards, setClaimableRewards] = useState('')

    const timeInputRef = useRef(0) // for updating timeInput through buttons. should always be in sync with timeInput

    const xScreamInScream = Number(xscreamBalance) * shareValue

    // When wallet connected: allowance, lockend, tokenBal, veScreamBal, veScreamTotalSupply, screamLocked, screamAmount
    // When wallet not connected: veScreamTotalSupply
    // increaseAmount, increaseLockTime are used when initialDeposit has already occured
    const { approve, initialDeposit, increaseAmount, increaseLockTime, unlock, getClaimableRewards, isLoading, veScreamData } = useVeScream()
    const veClaim = useVeScream().claim

    const maxApr = ((+veScreamData?.rewardsLastWeek * 52) / +veScreamData?.screamAmountLocked) * 100

    const getChartData = () => {
        const res = []
        for (let i = 2; i < 53; i += 1) {
            res.push({ week: i, val: (maxApr / 52) * i, isActiveDot: i === +timeInput })
        }
        return res
    }

    const shouldDisableUpdate = () => {
        // disable if lock exists and has ended
        if (veScreamData?.lockEnd && veScreamData?.lockEnd < Date.now() / 1000) {
            return true
        }

        // check that lockInput exists, is a valid decimal number, and not greater than user's balance
        const isLockInputValid = lockInput && !!lockInput.match(/\d+\.*\d*/) && +lockInput <= +screamBalance
        const isTimeInputValid = timeInput && parseFloat(timeInput) >= 2 && parseFloat(timeInput) <= 52

        // initial deposit or increasing both amount/time => check for all inputs
        if (!veScreamData?.lockEnd || (timeInput && lockInput)) {
            return !isTimeInputValid || !isLockInputValid
        }

        // only increasing amount => must have enough screamBalance
        if (lockInput) {
            return !isLockInputValid
        }

        // extending time => check that lock time is valid
        if (timeInput) {
            return !isTimeInputValid || veScreamData?.lockEnd > calculateUnlockEpoch(+timeInput * SECONDS_PER_WEEK, +new Date() / 1000)
        }

        // should never reach this line
        return true
    }

    useEffect(() => {
        getClaimableRewards().then((r) => {
            setClaimableRewards(toEth(r))
        })
    }, [])

    useEffect(() => {
        // geist ui doesn't allow for handling clicks on an input with both left/right icons so we attach eventListeners manually
        const icons = document.querySelectorAll('.input-icon')
        const handleClick = (_event: Event, i: number) => {
            if (i && timeInputRef.current < 52) {
                timeInputRef.current += 1
            } else if (!i && timeInputRef.current > 2) {
                timeInputRef.current -= 1
            }
            setTimeInput(`${timeInputRef.current}`)
        }
        icons.forEach((el, i) => el.addEventListener('click', (event) => handleClick(event, i)))
        return () => icons.forEach((el, i) => el.removeEventListener('click', (event) => handleClick(event, i)))
    }, [showModifyLock])

    return (
        <>
            <Header />
            <StakeHeader veScreamData={veScreamData} />

            <div className="flex justify-between my-16 shadow-xl md:my-12 xl:rounded-xl xl:mx-auto xl:max-w-5xl">
                <button type="button" className="flex flex-col items-center w-1/2" onClick={() => setLockOrStake('lock')}>
                    <div className="py-2">Lock</div>
                    {lockOrStake === 'lock' && <div className="w-full h-2 bg-animated-rainbow xl:rounded-bl-xl" />}
                </button>
                <button type="button" className="flex flex-col items-center w-1/2" onClick={() => setLockOrStake('stake')}>
                    <div className="py-2">Stake</div>
                    {lockOrStake === 'stake' && <div className="w-full h-2 bg-animated-rainbow xl:rounded-br-xl" />}
                </button>
            </div>

            <div className="max-w-5xl px-6 pb-12 mx-auto md:px-12 md:pb-24">
                <div className="space-y-6 md:space-y-12">
                    {lockOrStake === 'lock' ? (
                        <>
                            {xScreamInScream > 0 && (
                                <div className="w-full p-6 bg-white border border-gray-100 shadow-xl rounded-xl">
                                    <div className="flex flex-col">
                                        <div className="space-y-1">
                                            <p className="font-mono text-xs">SCREAM value of staked xSCREAM</p>
                                            <p className="text-4xl">{xScreamInScream.toFixed(5)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="w-full">
                                <div className="">
                                    <div className="flex-1 p-2 shadow-xl md:col-span-2 rounded-xl bg-animated-rainbow">
                                        <div className="flex flex-col justify-between p-6 bg-white rounded-xl">
                                            <div className="mb-8">
                                                <p className="text-lg">Lock SCREAM, Get veSCREAM and Voting Power</p>
                                                <p className="text-4xl font-extrabold">
                                                    {(maxApr / 52).toFixed(2)}% ~ {maxApr.toFixed(2)}% APR
                                                </p>
                                            </div>

                                            <div className={`flex flex-col xl:flex-row md:items-center xl:items-start w-full ${showModifyLock ? 'justify-between' : 'justify-center'}`}>
                                                <div className="flex flex-col md:w-2/5">
                                                    <div className="flex justify-between space-y-1 text-sm">
                                                        <p>My Rewards</p>
                                                        <div className="flex flex-col text-right">
                                                            <p>{Number(claimableRewards).toFixed(6)} SCREAM</p>
                                                            <p className="text-xs text-gray-300">≈ ${((+claimableRewards || 0) * screamPrice).toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <p>My SCREAM Locked</p>
                                                        <div className="flex flex-col">
                                                            <p>{veScreamData?.screamLocked ? parseFloat(veScreamData?.screamLocked).toFixed(2) : '0.00'} SCREAM</p>
                                                            <p className="text-xs text-right text-gray-300">≈ ${((veScreamData?.screamLocked ? parseFloat(veScreamData?.screamLocked) : 0) * screamPrice).toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <p>veSCREAM Received</p>
                                                        <p>{veScreamData?.veScreamBal ? parseFloat(veScreamData?.veScreamBal).toFixed(5) : '0.00'}</p>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <p>Unlock Time</p>
                                                        <p>{veScreamData?.lockEnd ? epochToDate(veScreamData?.lockEnd) : '-'}</p>
                                                    </div>
                                                    <div className="flex flex-col mt-8 space-y-8">
                                                        {!!parseFloat(xscreamBalance) && (
                                                            <div className="flex flex-col items-center">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        clipRule="evenodd"
                                                                        d="M9.0185 4.66519C9.18499 3.16592 10.4564 2 12 2C13.5437 2 14.8151 3.16592 14.9816 4.6652C17.3554 5.78439 19 8.19905 19 11V14.1585C19 14.4321 19.1087 14.6945 19.3022 14.888L20.7071 16.2929C20.9931 16.5789 21.0787 17.009 20.9239 17.3827C20.7691 17.7564 20.4045 18 20 18L16 18C16 20.2091 14.2092 22 12 22C9.79089 22 8.00003 20.2091 8.00003 18L4.00003 18C3.59557 18 3.23093 17.7564 3.07615 17.3827C2.92137 17.009 3.00692 16.5789 3.29292 16.2929L4.69785 14.888C4.89133 14.6945 5.00003 14.4321 5.00003 14.1585V11C5.00003 8.19905 6.64464 5.78439 9.0185 4.66519ZM10 18C10 19.1046 10.8955 20 12 20C13.1046 20 14 19.1046 14 18H10ZM12 4C11.4477 4 11 4.44772 11 5V5.34142C11 5.76523 10.7329 6.14302 10.3333 6.28426C8.38994 6.97113 7.00003 8.82453 7.00003 11V14.1585C7.00003 14.8277 6.77872 15.4742 6.37664 16H17.6234C17.2213 15.4742 17 14.8277 17 14.1585V11C17 8.82453 15.6101 6.97113 13.6668 6.28426C13.2672 6.14302 13 5.76523 13 5.34142V5C13 4.44772 12.5523 4 12 4Z"
                                                                        fill="black"
                                                                    />
                                                                </svg>
                                                                <p className="mt-2 text-sm text-center">
                                                                    You have xSCREAM that is currently earning 0% APR!
                                                                    <br />
                                                                    <button type="button" style={{ textDecoration: 'underline' }} onClick={() => setLockOrStake('stake')}>
                                                                        Unstake
                                                                    </button>{' '}
                                                                    your xSCREAM and lock your SCREAM here to start earning.
                                                                </p>
                                                            </div>
                                                        )}

                                                        <div className="self-center w-full lg:w-3/4">
                                                            <Button disabled={false} loading={loading} onClick={async () => veClaim()} style={{ width: '100%' }} auto type="secondary">
                                                                Claim Rewards
                                                            </Button>
                                                        </div>
                                                        <div className="self-center w-full lg:w-3/4">
                                                            <Button
                                                                disabled={!veScreamData?.lockEnd || veScreamData?.lockEnd > Date.now() / 1000}
                                                                loading={loading}
                                                                onClick={() => unlock()}
                                                                style={{ width: '100%' }}
                                                                auto
                                                                type="secondary"
                                                            >
                                                                Withdraw Unlocked SCREAM
                                                            </Button>
                                                        </div>
                                                        <div className="self-center w-full lg:w-3/4">
                                                            <Button loading={loading} onClick={() => setShowModifyLock(!showModifyLock)} style={{ width: '100%' }} auto type="default">
                                                                ✎ Modify Lock
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {showModifyLock && (
                                                    <div className="flex flex-col mt-5 xl:mt-0">
                                                        <div className="flex flex-col space-y-8">
                                                            <div className="flex flex-col self-center w-full max-w-md md:flex-row md:justify-between">
                                                                <div className="text-sm md:w-1/4">Enter Amount</div>
                                                                <div className="flex flex-col space-y-2 md:w-64 md:self-end">
                                                                    <p className="text-xs overflow-ellipsis">SCREAM Balance: {screamBalance}</p>
                                                                    <div className="flex">
                                                                        <Input
                                                                            style={{ textAlign: 'right' }}
                                                                            width="100%"
                                                                            value={lockInput}
                                                                            onChange={(e) => setLockInput(String(e.target.value))}
                                                                            placeholder="Lock Amount SCREAM"
                                                                            size="small"
                                                                        />
                                                                        <Button style={{ marginLeft: 8 }} onClick={() => setLockInput(veScreamData ? screamBalance : '0.00')} type="secondary" auto size="small">
                                                                            Max
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col self-center w-full max-w-md md:flex-row md:justify-between">
                                                                <div className="text-sm md:w-1/4">Enter Period</div>
                                                                <div className="flex flex-col space-y-2 md:w-64">
                                                                    <p className="text-xs">Must be between 2 and 52 weeks</p>
                                                                    <div className="flex">
                                                                        <Input
                                                                            width="100%"
                                                                            style={{ textAlign: 'right' }}
                                                                            icon={<MinusIcon />}
                                                                            iconRight={<PlusIcon />}
                                                                            iconClickable
                                                                            value={timeInput}
                                                                            onChange={(e) => {
                                                                                // we need to keep timeInput and its ref in sync
                                                                                const val = String(e.target.value)
                                                                                setTimeInput(val)
                                                                                timeInputRef.current = +val
                                                                            }}
                                                                            min={2}
                                                                            max={52}
                                                                            placeholder="Lock Period week(s)"
                                                                            size="small"
                                                                        />
                                                                        <Button style={{ marginLeft: 8 }} onClick={() => setTimeInput('52')} type="secondary" auto size="small">
                                                                            Max
                                                                        </Button>
                                                                    </div>
                                                                    <p className="text-xs text-right">
                                                                        Unlock date: {timeInput ? epochToDate(calculateUnlockEpoch(+timeInput * SECONDS_PER_WEEK, +new Date() / 1000)) : '--'}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex">
                                                                <div className="w-full">
                                                                    <LockedEarningsChart data={getChartData()} />
                                                                    <p className="flex justify-center pt-2 text-xs">Weeks</p>
                                                                </div>
                                                                <p className="flex justify-center text-xs rotate-90" style={{ writingMode: 'vertical-lr', marginTop: -40 }}>
                                                                    APR %
                                                                </p>
                                                            </div>

                                                            <div className="flex flex-col px-8 md:flex-row md:space-x-5">
                                                                <div className="flex flex-col items-center">
                                                                    <p>Lock SCREAM</p>
                                                                    <p className="text-2xl text-babypurple">{lockInput || 0}</p>
                                                                </div>
                                                                <p className="self-center hidden md:block">→</p>
                                                                <p className="self-center block md:hidden">↓</p>
                                                                <div className="flex flex-col items-center">
                                                                    <p className="text-center">Receive Voting Power</p>
                                                                    <p className="text-2xl text-babypurple">{(((+lockInput || 0) * (+timeInput || 0)) / 52).toFixed(4)}</p>
                                                                </div>
                                                                <div className="flex flex-col items-center">
                                                                    <p>APR</p>
                                                                    <p className="text-2xl text-babypurple">{(maxApr * (+timeInput / 52)).toFixed(2)}</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex justify-between xl:px-8">
                                                                <Button
                                                                    style={{ minWidth: 'min-content' }}
                                                                    loading={loading}
                                                                    onClick={() => {
                                                                        setTimeInput(undefined)
                                                                        setLockInput('')
                                                                        setShowModifyLock(false)
                                                                    }}
                                                                    type="secondary"
                                                                >
                                                                    <TrashIcon className="w-4" /> Discard
                                                                </Button>

                                                                <Button
                                                                    style={{ minWidth: 'auto' }}
                                                                    disabled={shouldDisableUpdate()}
                                                                    loading={isLoading}
                                                                    onClick={async () => {
                                                                        if (parseFloat(veScreamData?.allowance) < Number(lockInput)) {
                                                                            await approve(lockInput)
                                                                        } else if (!veScreamData?.lockEnd) {
                                                                            await initialDeposit(lockInput, calculateUnlockEpoch(+timeInput * SECONDS_PER_WEEK, +new Date() / 1000))
                                                                        } else {
                                                                            if (lockInput) {
                                                                                await increaseAmount(lockInput)
                                                                            }
                                                                            if (timeInput) {
                                                                                await increaseLockTime(calculateUnlockEpoch(+timeInput * SECONDS_PER_WEEK, +new Date() / 1000))
                                                                            }
                                                                        }
                                                                    }}
                                                                    type="secondary"
                                                                >
                                                                    {parseFloat(veScreamData?.allowance) < Number(lockInput) ? 'Approve' : 'Update Lock'}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col w-full p-6 bg-white border border-gray-100 shadow-xl rounded-xl">
                                <div className="flex-1 space-y-1">
                                    <p className="text-lg">Stake SCREAM for xSCREAM</p>
                                    <p className="text-4xl font-extrabold">0% APR</p>
                                    <p>
                                        Your SCREAM staked in this pool is currently earning 0% APR!
                                        <br />
                                        Unstake here, then{' '}
                                        <button type="button" style={{ textDecoration: 'underline' }} onClick={() => setLockOrStake('lock')}>
                                            lock
                                        </button>{' '}
                                        your SCREAM to start earning.
                                    </p>
                                    <p className="font-mono text-xs">xSCREAM Supply: {totalSupply}</p>
                                </div>
                                <div className="h-60 lg:h-auto" />
                                <div className="flex flex-col max-w-sm ml-auto space-y-2">
                                    <p className="font-mono text-xs">xSCREAM Balance: {xscreamBalance}</p>

                                    <Button loading={loading} onClick={() => unstake(xscreamBalance)} className="flex-1" auto type="secondary">
                                        Unstake xSCREAM
                                    </Button>
                                </div>
                            </div>
                            <div className="w-full p-6 bg-white border border-gray-100 shadow-xl rounded-xl">
                                <div className="flex flex-col items-center justify-between space-y-12 md:flex-row">
                                    <div className="flex flex-col space-y-1">
                                        <div className="flex flex-row items-center space-x-2 text-lg">
                                            <img src="/img/tokens/scream.png" alt="scream" className="w-10 h-10" />
                                            <div className="flex flex-col">
                                                <p className="font-extrabold"> SCREAM-FTM LP Farm</p>
                                                <a href={farmData[0]?.buyLink} className="text-xs underline" onClick={(e) => e.stopPropagation()} target="_blank" rel="noreferrer">
                                                    <i className="mr-1 duration-150 ease-in-out transform fas fa-link" />
                                                    Get {farmData[0]?.name}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="text-sm">TVL: ${farmData[0] ? commas(parseFloat(farmData[0]?.tvl).toFixed(0)) : '0.00'}</div>
                                        <div className="text-sm">APR: {farmData[0] ? parseFloat(farmData[0]?.apy[3]).toFixed(2) : '0.00'}%</div>
                                        <div className="text-sm">User Deposit Value: ${farmData[0] ? parseFloat(farmData[0]?.userLpValue).toFixed(2) : '0.00'}</div>
                                        <div className="text-sm">Earnings: {farmData[0] ? parseFloat(farmData[0]?.earnings[3]).toFixed(2) : '0.00'} SCREAM</div>
                                        <Button loading={loading} onClick={() => claim(farmData[0]?.pid)}>
                                            Claim SCREAM
                                        </Button>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <p className="font-mono text-xs">LP Balance: {farmData[0] ? farmData[0]?.depositTokenBalance : '0.00'}</p>
                                        <div className="flex items-center space-x-2">
                                            <Input width="100%" value={depositInput} onChange={(e) => setDepositInput(String(e.target.value))} type="number" placeholder="0.00" size="small" />
                                            <Button onClick={() => setDepositInput(farmData[0] ? farmData[0]?.depositTokenBalance : '0.00')} type="secondary" auto size="small">
                                                Max
                                            </Button>
                                        </div>
                                        <Button loading={loading} onClick={() => deposit(farmData[0].pid, depositInput)} type="secondary">
                                            {parseFloat(farmData[0]?.allowance) <= Number(depositInput) ? 'Approve' : 'Stake LP'}
                                        </Button>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        <p className="font-mono text-xs">LP Staked: {farmData[0] ? farmData[0]?.deposited : '0.00'}</p>
                                        <div className="flex items-center space-x-2">
                                            <Input width="100%" value={withdrawInput} onChange={(e) => setWithdrawInput(String(e.target.value))} type="number" placeholder="0.00" size="small" />
                                            <Button onClick={() => setWithdrawInput(farmData[0] ? farmData[0]?.deposited : '0.00')} type="secondary" auto size="small">
                                                Max
                                            </Button>
                                        </div>
                                        <Button loading={loading} onClick={() => withdraw(farmData[0].pid, withdrawInput)} className="flex-1" auto type="secondary">
                                            Unstake LP
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

// :)
