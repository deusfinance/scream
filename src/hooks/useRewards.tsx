import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useActiveWeb3React } from '.'
import { getLensContract, getUnitrollerContract } from '../utils/ContractService'
import useBlock from './useBlock'
import usePrice from './usePrice'

export default function useRewards(tokenData?) {
    const [rewardValue, setRewardValue] = useState("0")
    const [lendingApy, setLendingApy] = useState("0")
    const [borrowApy, setBorrowApy] = useState("0")
    const [compSpeeds, setCompSpeeds] = useState("0")
    const { account, library } = useActiveWeb3React()
    const { screamPrice } = usePrice()
    const block = useBlock()

    const calculateAPY = async () => {
        if (!tokenData) return
        const totalSupply = tokenData.totalSupplyUsd
        const totalBorrow = tokenData.totalBorrowsUsd
        try {
            const blocksPerDay = 86400 // 1 seconds per block
            const daysPerYear = 365
            const screamPerYear = Number(compSpeeds) * blocksPerDay * daysPerYear * screamPrice
            const lendingAPY = (screamPerYear * 100) / totalSupply
            const borrowAPY = (screamPerYear * 100) / totalBorrow
            if (lendingAPY) {
                setLendingApy(lendingAPY.toFixed(2))
            } else {
                setLendingApy("0")
            }
            if (borrowAPY) {
                setBorrowApy(borrowAPY.toFixed(2))
            } else {
                setBorrowApy("0")
            }
        } catch (error) {
            console.log(error)
            setLendingApy("0")
            setBorrowApy("0")
        }
    }

    const claimReward = async () => {
        if (!tokenData) return
        if (!account) return
        const appContract = getUnitrollerContract(library?.getSigner())
        let tx = null
        try {
            tx = await appContract['claimComp(address,address[])'](account, [tokenData.id])
            console.log(tx)
        } catch (error) {
            console.log(error)
        }
    }

    const claimAll = async () => {
        try {
            if (!account) return
            const appContract = getUnitrollerContract(library?.getSigner())
            await appContract['claimComp(address)'](account)
            setRewardValue("0")
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const onLoad = async () => {
            const fetchReward = async () => {
                if (account) {
                    const appContract = await getUnitrollerContract(library?.getSigner())
                    const lensContract = await getLensContract(library?.getSigner())
                    const compAccrued = await lensContract.callStatic.getCompBalanceMetadataExt('0xe0654C8e6fd4D733349ac7E09f6f23DA256bF475', appContract.address, account)
                    if (compAccrued) {
                        const compReward = ethers.utils.formatEther(compAccrued[3])
                        setRewardValue(compReward)
                    } else {
                        setRewardValue("0")
                    }
                }
            }

            const fetchSpeeds = async () => {
                const appContract = await getUnitrollerContract(library)
                if (tokenData) {
                    const speeds = await appContract.compSpeeds(tokenData.id)
                    if (speeds) {
                        const speed = ethers.utils.formatEther(speeds)
                        setCompSpeeds(speed)
                    } else {
                        setCompSpeeds("0")
                    }
                }
                await calculateAPY()
            }

            await fetchSpeeds()
            await fetchReward()
        }
        onLoad()

        // const interval = setInterval(() => onLoad(), 2000)
        // return () => clearInterval(interval)
    }, [account, library, tokenData, screamPrice, compSpeeds, block])

    return {
        claimAll,
        claimReward,
        rewardValue,
        lendingApy,
        borrowApy
    }
}
