import { createContext, useContext, useEffect, useState } from 'react'
import * as constants from '../constants'
import multicall from '../utils/multicall'
import { toEth, EMPTY_ADDRESS } from '../utils'
import { useActiveWeb3React } from '.'
import useRefresh from './useRefresh'
import usePool from './usePool'
import { BigNumber } from 'ethers'
import { getFarmsContract } from '../utils/ContractService'

const farmABI = JSON.parse(constants.CONTRACT_FARMS_ABI)
const erc20ABI = JSON.parse(constants.CONTRACT_WFTM_TOKEN_ABI)
const farms = constants.CONTRACT_SCREAM_FARMS[250].tokens

const formatFarmData = (_farmInfo, _userInfo, _depositTokenBalance, _allowance) => {
    return {
        ..._farmInfo,
        deposited: toEth(_userInfo[0].amount, _farmInfo.decimals),
        depositTokenBalance: toEth(_depositTokenBalance[0], _farmInfo.decimals),
        allowance: toEth(_allowance[0], _farmInfo.decimals)
    }
}

function useFarmDataInternal() {
    const { slowRefresh } = useRefresh()
    const [refreshing, setRefreshing] = useState(false)
    const [farmData, setFarmData] = useState({})
    const { account, library } = useActiveWeb3React()
    const { calculateUni } = usePool()
    const farmsContract = getFarmsContract(library)

    const [refresh, setRefresh] = useState(0)
    const update = () => setRefresh((i) => i + 1)

    const handleTokenCalls = async (_farms) => {
        const farmStatCalls = _farms.map((farm) => {
            if (farm.uniLpTokenAddresses) {
                return calculateUni(farm)
            }
        })
        let earnings = []
        for (let i = 0; i < _farms.length; i++) {
            let poolRewards = ['0', '0', '0', '0', '0']
            if (_farms[i].deposited !== '0.0') {
                const rewardsData = await farmsContract.pendingRewards(_farms[i].pid, account)
                poolRewards = rewardsData.map((reward) => toEth(reward))
            }
            earnings.push(poolRewards)
        }
        const farmStats = await Promise.all(farmStatCalls)
        const formattedFarmData = _farms.map((farm, i) => {
            const _farmStats = farmStats[i]
            return { ..._farmStats, ...farm, earnings: earnings[i] }
        })
        return formattedFarmData
    }

    useEffect(() => {
        const fetchData = async () => {
            setRefreshing(true)

            const userAddress = account ? account : EMPTY_ADDRESS

            const userInfoCalls = farms.map((farm) => ({
                address: constants.CONTRACT_FARMS_ADDRESS,
                name: 'getUserInfo',
                params: [farm.pid, userAddress]
            }))
            const depositTokenBalanceCalls = farms.map((farm) => ({
                address: farm.depositToken,
                name: 'balanceOf',
                params: [userAddress]
            }))
            const allowanceCalls = farms.map((farm) => ({
                address: farm.depositToken,
                name: 'allowance',
                params: [userAddress, constants.CONTRACT_FARMS_ADDRESS]
            }))

            const [userInfo, depositTokenBalance, allowance] = await Promise.all([multicall(farmABI, userInfoCalls), multicall(erc20ABI, depositTokenBalanceCalls), multicall(erc20ABI, allowanceCalls)])

            let formattedFarmData = []
            for (let i = 0; i < farms.length; i++) {
                formattedFarmData.push(formatFarmData(farms[i], userInfo[i] ? userInfo[i] : null, depositTokenBalance[i] ? depositTokenBalance[i] : BigNumber.from(0), allowance[i] ? allowance[i] : BigNumber.from(0)))
            }

            formattedFarmData = await handleTokenCalls(formattedFarmData)
            console.log(formattedFarmData)

            console.log('refreshing farms result ===== ')
            setFarmData(formattedFarmData)
            setRefreshing(false)
        }
        fetchData()
    }, [account, slowRefresh, refresh])
    return {
        farmData,
        update,
        refreshing
    }
}

export const FarmContext = createContext({})

export function FarmDataWrapper({ children }: any) {
    const farmData = useFarmDataInternal()
    return (
        <>
            <FarmContext.Provider value={{ ...farmData }}>
                <>{children}</>
            </FarmContext.Provider>
        </>
    )
}

export default function useFarmData() {
    return useContext(FarmContext) as any
}
