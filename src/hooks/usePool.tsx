import { useState } from 'react'
import { getFarmsContract, getTokenContractByAddress } from '../utils/ContractService'
import { useActiveWeb3React } from '.'
import usePrice from './usePrice'
import { toEth, SECONDS_PER_YEAR } from '../utils'
import * as constants from '../constants'

export default function usePool() {
    const { library } = useActiveWeb3React()
    const { getPrice } = usePrice()
    const [earnTokenPrices, setEarnTokenPrices] = useState([])

    const earnTokens = constants.CONTRACT_SCREAM_FARMS[250].earnTokens

    const farmContract = getFarmsContract(library)

    const handleEarnTokenPrices = async () => {
        const earnTokenCalls = earnTokens.map((earnToken) => {
            return getPrice(earnToken.address)
        })
        const prices = await Promise.all(earnTokenCalls)
        setEarnTokenPrices(prices)
        return prices
    }

    const calculateApy = async (farmData, tvl) => {
        let prices = earnTokenPrices
        if (prices.length === 0) {
            prices = await handleEarnTokenPrices()
        }
        let apy = []
        for (let i = 0; i < earnTokens.length; i++) {
            const adjustedRewards = farmData.poolWeight[i] * earnTokens[i].rps * SECONDS_PER_YEAR
            const rewardsValuePerYear = adjustedRewards * prices[i]
            const calc = (rewardsValuePerYear * 100) / tvl
            apy.push(calc)
        }
        return apy
    }

    const calculateUni = async (farmData) => {
        const token0Contract = getTokenContractByAddress(farmData.uniLpTokenAddresses.token0, library)
        const token1Contract = getTokenContractByAddress(farmData.uniLpTokenAddresses.token1, library)
        const lpContract = getTokenContractByAddress(farmData.depositToken, library)

        const [lpContractToken0BalData, farmLpBalData, lpTotalSupplyData, lpContractToken1BalData, token1Price] = await Promise.all([
            token0Contract.balanceOf(lpContract.address),
            lpContract.balanceOf(farmContract.address),
            lpContract.totalSupply(),
            token1Contract.balanceOf(lpContract.address),
            getPrice(farmData.uniLpTokenAddresses.token1)
        ])

        const lpContractToken0Bal = Number(toEth(lpContractToken0BalData))

        // Get the share of lpContract that masterChefContract owns
        const farmLpBal = Number(toEth(farmLpBalData))

        // Convert that into the portion of total lpContract = p1
        const lpTotalSupply = Number(toEth(lpTotalSupplyData))

        // Get total wftm value for the lpContract = w1
        const lpContractToken1Bal = Number(toEth(lpContractToken1BalData))

        const portionLp = farmLpBal / lpTotalSupply
        const totalLpToken1Value = portionLp * lpContractToken1Bal * 2
        const tvl = totalLpToken1Value * token1Price

        const apy = await calculateApy(farmData, tvl)

        const userBalance = parseFloat(farmData.deposited)
        const userPortionLp = userBalance / lpTotalSupply
        const _userToken0Amount = userPortionLp * lpContractToken0Bal
        const _userToken1Amount = userPortionLp * lpContractToken1Bal
        const userLpValue = userPortionLp * lpContractToken1Bal * token1Price * 2

        const userTokens = [
            { token: farmData.token0Symbol, amount: _userToken0Amount },
            { token: farmData.token1Symbol, amount: _userToken1Amount }
        ]

        return {
            tvl,
            apy,
            userTokens,
            userLpValue
        }
    }

    return { calculateUni }
}
