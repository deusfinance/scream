import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useActiveWeb3React } from '.'
import { getTokenContract, getXscreamContract } from '../utils/ContractService'

export default function useStake() {
    const [status, setStatus] = useState('idle')
    const [allowance, setAllowance] = useState(0)
    const [screamBalance, setScreamBalance] = useState('0')
    const [xscreamBalance, setXscreamBalance] = useState('0')
    const [shareValue, setShareValue] = useState(0)
    const [totalSupply, setTotalSupply] = useState(0)
    const [xScreamAPY, setxScreamAPY] = useState(0)
    const { account, library } = useActiveWeb3React()

    const tokenContract = getTokenContract('scream', library?.getSigner())
    const xScreamContract = getXscreamContract(library?.getSigner())

    const stake = async (amount) => {
        setStatus('loading')
        let formatAmount
        if (amount > 0) {
            formatAmount = ethers.utils.parseEther(amount)
        } else {
            formatAmount = 0
        }
        if (account) {
            let tx = null
            try {
                if (allowance < amount) {
                    await tokenContract.approve('0xe3D17C7e840ec140a7A51ACA351a482231760824', ethers.utils.parseEther('9999999999'))
                    setAllowance(9999999999)
                }
                tx = await xScreamContract.deposit(formatAmount)
                console.log(tx)
            } catch (error) {
                console.log(error)
            }
        }
        setStatus('idle')
    }

    const unstake = async (amount) => {
        setStatus('loading')
        let formatAmount
        if (amount > 0) {
            formatAmount = ethers.utils.parseEther(amount)
        } else {
            formatAmount = 0
        }
        if (account) {
            let tx = null
            try {
                tx = await xScreamContract.withdraw(formatAmount)
                console.log(tx)
            } catch (error) {
                console.log(error)
            }
        }
        setStatus('idle')
    }

    const calculateAPY = () => {
        if (shareValue) {
            const difference = +new Date() - +new Date('August 3, 2021 07:00:00')

            const twelveHoursSinceLaunch = Math.floor(difference / (1000 * 60 * 60 * 12))

            const apy = ((shareValue - 1.054) * 730 * 100) / twelveHoursSinceLaunch

            setxScreamAPY(apy.toFixed(2))
        }
    }

    useEffect(() => {
        if (account) {
            const fetchData = async () => {
                const [allow, scream, xscream, share, supply] = await Promise.all([
                    tokenContract.allowance(account, '0xe3D17C7e840ec140a7A51ACA351a482231760824'),
                    tokenContract.balanceOf(account),
                    xScreamContract.balanceOf(account),
                    xScreamContract.getShareValue(),
                    xScreamContract.totalSupply()
                ])
                if (allow) {
                    const formatAllowance = ethers.utils.formatEther(allow)
                    setAllowance(Number(formatAllowance))
                }
                if (scream) {
                    const formatScream = ethers.utils.formatEther(scream)
                    setScreamBalance(formatScream)
                }
                if (xscream) {
                    const formatXscream = ethers.utils.formatEther(xscream)
                    setXscreamBalance(formatXscream)
                }
                if (share) {
                    const formatShare = ethers.utils.formatEther(share)
                    setShareValue(Number(formatShare))
                }
                if (supply) {
                    const formatSupply = ethers.utils.formatEther(supply)
                    setTotalSupply(Number(formatSupply))
                }
            }
            calculateAPY()
            fetchData()
        }
    }, [account, shareValue])

    return {
        stake,
        unstake,
        status,
        screamBalance,
        xscreamBalance,
        allowance,
        totalSupply,
        shareValue,
        xScreamAPY
    }
}

// :)
