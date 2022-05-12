import { useEffect, useState } from 'react'
import * as constants from '../constants'
import { toEth, toWei } from '../utils'
import { getTokenContractByAddress, getVescreamContract, getFeeDistributionContract } from '../utils/ContractService'
import { useActiveWeb3React } from '.'
import { SECONDS_PER_WEEK } from '../pages/stake'
import multicall from '../utils/multicall'

interface VeScreamData {
    screamAmountLocked: string
    veScreamTotalSupply: string
    rewardsLastWeek: string
    allowance?: string
    tokenBal?: string
    lockEnd?: number
    veScreamBal?: string
    screamLocked?: string
}

const veScreamAddress = constants.CONTRACT_VESCREAM_ADDRESS
const screamAddress = constants.CONTRACT_SCREAM_TOKEN_ADDRESS

export default function useVeScream() {
    const [veScreamData, setVeScreamData] = useState<VeScreamData>()
    const [isLoading, setIsLoading] = useState(false)
    const { account, library } = useActiveWeb3React()

    const veScreamContract = getVescreamContract(library.getSigner())
    const feeDistributionContract = getFeeDistributionContract(library.getSigner())
    const screamContract = getTokenContractByAddress(screamAddress, library.getSigner())

    const fetchData = async () => {
        try {
            const feeDistributionContractNS = getFeeDistributionContract()
            const rewardsLastWeek = await feeDistributionContractNS['tokens_per_week(uint256)'](Math.floor(Date.now() / 1000 / SECONDS_PER_WEEK) * SECONDS_PER_WEEK - SECONDS_PER_WEEK)

            if (account) {
                const [[allow, tokenBal, screamAmountLocked], [veScreamBal, veScreamTotalSupply, screamLocked]] = await Promise.all([
                    multicall(JSON.parse(constants.CONTRACT_SCREAM_TOKEN_ABI), [
                        { address: screamAddress, name: 'allowance', params: [account, veScreamAddress] },
                        { address: screamAddress, name: 'balanceOf', params: [account] },
                        { address: screamAddress, name: 'balanceOf', params: [veScreamAddress] }
                    ]),
                    multicall(JSON.parse(constants.CONTRACT_VESCREAM_ABI), [
                        { address: veScreamAddress, name: 'balanceOf(address)', params: [account] },
                        { address: veScreamAddress, name: 'totalSupply()' },
                        { address: veScreamAddress, name: 'locked', params: [account] }
                    ])
                ])

                setVeScreamData({
                    allowance: toEth(allow[0]),
                    tokenBal: toEth(tokenBal[0]),
                    lockEnd: screamLocked.end.toNumber(),
                    veScreamBal: toEth(veScreamBal[0]),
                    veScreamTotalSupply: toEth(veScreamTotalSupply[0]),
                    screamLocked: toEth(screamLocked.amount),
                    screamAmountLocked: toEth(screamAmountLocked[0]),
                    rewardsLastWeek: toEth(rewardsLastWeek)
                })
            } else {
                const veScreamContractNS = getVescreamContract()
                const [veScreamTotalSupply, screamAmountLocked] = await Promise.all([veScreamContractNS['totalSupply()'](), veScreamContractNS.supply()])
                setVeScreamData({
                    veScreamTotalSupply: toEth(veScreamTotalSupply),
                    screamAmountLocked: toEth(screamAmountLocked),
                    rewardsLastWeek: toEth(rewardsLastWeek)
                })
            }
        } catch (e) {
            console.log(e)
        }

        return {}
    }

    useEffect(() => {
        fetchData()
    }, [account])

    const approve = async (amount) => {
        if (!account) return
        setIsLoading(true)
        try {
            const tx = await screamContract.approve(veScreamAddress, toWei(amount))
            await tx.wait()
        } catch (ex) {
            console.error(ex)
        } finally {
            await fetchData()
            setIsLoading(false)
        }
    }

    // First time locking token, use this function
    async function initialDeposit(amount, time) {
        if (!account || amount === '0') return
        setIsLoading(true)
        let tx = null
        try {
            tx = await veScreamContract.create_lock(toWei(amount), time, {
                gasLimit: 1_000_000
            })
            await tx.wait()
            console.log(tx)
        } catch (error) {
            console.log(error)
        } finally {
            await fetchData()
            setIsLoading(false)
        }
    }

    // If already have locked some token, use this function
    async function increaseAmount(amount) {
        if (!account || amount === '0') return
        setIsLoading(true)
        let tx = null
        try {
            // may need allowance
            tx = await veScreamContract.increase_amount(toWei(amount), {
                gasLimit: 1_000_000
            })
            await tx.wait()
            console.log(tx)
        } catch (error) {
            console.log(error)
        } finally {
            await fetchData()
            setIsLoading(false)
        }
    }

    // increases lock time
    async function increaseLockTime(time) {
        if (!account || time === '0') return
        setIsLoading(true)
        let tx = null
        try {
            tx = await veScreamContract.increase_unlock_time(time, {
                gasLimit: 1_000_000
            })
            await tx.wait()
            console.log(tx)
        } catch (error) {
            console.log(error)
        } finally {
            await fetchData()
            setIsLoading(false)
        }
    }

    // withdraw only if lock time is over
    async function unlock() {
        if (!account) return
        setIsLoading(true)
        let tx = null
        try {
            tx = await veScreamContract.withdraw({ gasLimit: 500_000 })
            await tx.wait()
            console.log(tx)
        } catch (error) {
            console.log(error)
        } finally {
            await fetchData()
            setIsLoading(false)
        }
    }

    async function claim() {
        if (!account) return
        setIsLoading(true)
        let tx = null
        try {
            tx = await feeDistributionContract['claim(address)'](account)
            await tx.wait()
            console.log(tx)
        } catch (error) {
            console.error(error)
        } finally {
            await fetchData()
            setIsLoading(false)
        }
    }

    async function getClaimableRewards() {
        if (!account) return '0'
        let tx = null
        try {
            tx = await feeDistributionContract.callStatic['claim(address)'](account)
            console.log(toEth(tx))
            return tx
        } catch (error) {
            console.error(error)
        }
        return '0'
    }

    return {
        approve,
        initialDeposit,
        increaseAmount,
        increaseLockTime,
        unlock,
        claim,
        getClaimableRewards,
        isLoading,
        veScreamData
    }
}
