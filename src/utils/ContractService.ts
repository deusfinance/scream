import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import * as constants from '../constants'
import multicall from './multicall'

export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_NETWORK_URL)

const TOKEN_ABI = {
    wftm: constants.CONTRACT_WFTM_TOKEN_ABI,
    usdc: constants.CONTRACT_USDC_TOKEN_ABI,
    dai: constants.CONTRACT_DAI_TOKEN_ABI,
    scream: constants.CONTRACT_SCREAM_TOKEN_ABI,
    fbtc: constants.CONTRACT_FBTC_TOKEN_ABI,
    btc: constants.CONTRACT_WBTC_TOKEN_ABI,
    eth: constants.CONTRACT_WETH_TOKEN_ABI,
    feth: constants.CONTRACT_FETH_TOKEN_ABI,
    fusdt: constants.CONTRACT_FUSDT_TOKEN_ABI,
    sushi: constants.CONTRACT_SUSHI_TOKEN_ABI,
    band: constants.CONTRACT_BAND_TOKEN_ABI,
    yfi: constants.CONTRACT_YFI_TOKEN_ABI,
    crv: constants.CONTRACT_CRV_TOKEN_ABI,
    frax: constants.CONTRACT_FRAX_TOKEN_ABI,
    snx: constants.CONTRACT_SNX_TOKEN_ABI,
    fusd: constants.CONTRACT_FUSD_TOKEN_ABI,
    link: constants.CONTRACT_LINK_TOKEN_ABI,
    dola: constants.CONTRACT_DOLA_TOKEN_ABI,
    mim: constants.CONTRACT_MIM_TOKEN_ABI,
    bifi: constants.CONTRACT_BIFI_TOKEN_ABI,
    tusd: constants.CONTRACT_TUSD_TOKEN_ABI,
    spell: constants.CONTRACT_SPELL_TOKEN_ABI,
    boo: constants.CONTRACT_FRAX_TOKEN_ABI
}

export const getContract = (address: string, abi: any, signer?: ethers.Signer | ethers.providers.Provider) => {
    const signerOrProvider = signer ?? simpleRpcProvider
    return new ethers.Contract(address, abi, signerOrProvider)
}

export const getTokenContractByAddress = (address, provider?: ethers.Signer | ethers.providers.Provider) => getContract(address, JSON.parse(TOKEN_ABI.scream), provider)

export const getTokenContract = (name, provider?: ethers.Signer | ethers.providers.Provider) =>
    getContract(constants.CONTRACT_TOKEN_ADDRESS[name || 'usdc'] ? constants.CONTRACT_TOKEN_ADDRESS[name || 'usdc'].address : constants.CONTRACT_TOKEN_ADDRESS.usdc.address, JSON.parse(TOKEN_ABI[name]), provider)

export const getSctokenContract = (name, provider?: ethers.Signer | ethers.providers.Provider) =>
    getContract(
        constants.CONTRACT_SCTOKEN_ADDRESS[name || 'scusdc'] ? constants.CONTRACT_SCTOKEN_ADDRESS[name || 'scusdc'].address : constants.CONTRACT_SCTOKEN_ADDRESS.scusdc.address,
        JSON.parse(constants.CONTRACT_SCTOKEN_ABI),
        provider
    )

export const getUnitrollerContract = (provider?: ethers.Signer | ethers.providers.Provider) => getContract(constants.CONTRACT_UNITROLLER_ADDRESS, JSON.parse(constants.CONTRACT_UNITROLLER_ABI), provider)

export const getXscreamContract = (provider?: ethers.Signer | ethers.providers.Provider) => getContract(constants.CONTRACT_XSCREAM_ADDRESS, JSON.parse(constants.CONTRACT_XSCREAM_ABI), provider)

export const getVescreamContract = (provider?: ethers.Signer | ethers.providers.Provider) => getContract(constants.CONTRACT_VESCREAM_ADDRESS, JSON.parse(constants.CONTRACT_VESCREAM_ABI), provider)

export const getFeeDistributionContract = (provider?: ethers.Signer | ethers.providers.Provider) => getContract(constants.CONTRACT_FEE_DISTRIBUTION_ADDRESS, JSON.parse(constants.CONTRACT_FEE_DISTRIBUTION_ABI), provider)

export const getLensContract = (provider?: ethers.Signer | ethers.providers.Provider) => getContract(constants.CONTRACT_LENS_ADDRESS, JSON.parse(constants.CONTRACT_LENS_ABI), provider)

export const getFarmsContract = (provider?: ethers.Signer | ethers.providers.Provider) => getContract(constants.CONTRACT_FARMS_ADDRESS, JSON.parse(constants.CONTRACT_FARMS_ABI), provider)

export const getPriceOracleContract = (address, provider?: ethers.Signer | ethers.providers.Provider) =>
    getContract(address || constants.CONTRACT_PRICE_ORACLE_ADDRESS, JSON.parse(constants.CONTRACT_PRICE_ORACLE_ABI), provider)

export const getInterestModelContract = (address, provider?: ethers.Signer | ethers.providers.Provider) => getContract(address, JSON.parse(constants.CONTRACT_INTEREST_MODEL_ABI), provider)

export const getMulticallContract = (provider?: ethers.Signer | ethers.providers.Provider) => getContract(constants.CONTRACT_MULTICALL_ADDRESS, JSON.parse(constants.CONTRACT_MULTICALL_ABI), provider)

export const getRouterContract = (provider?: ethers.Signer | ethers.providers.Provider) => getContract(constants.CONTRACT_ROUTER_ADDRESS, JSON.parse(constants.CONTRACT_ROUTER_ABI), provider)

export const fetchBalances = async (account: string, markets: any, provider?: ethers.Signer | ethers.providers.Provider) => {
    if (markets) {
        const abi = [
            {
                constant: true,
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'balanceOf',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                payable: false,
                stateMutability: 'view',
                type: 'function'
            },
            {
                constant: true,
                inputs: [
                    { internalType: 'address', name: '', type: 'address' },
                    { internalType: 'address', name: '', type: 'address' }
                ],
                name: 'allowance',
                outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function'
            },
            {
                constant: true,
                inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
                name: 'getAccountSnapshot',
                outputs: [
                    { internalType: 'uint256', name: '', type: 'uint256' },
                    { internalType: 'uint256', name: '', type: 'uint256' },
                    { internalType: 'uint256', name: '', type: 'uint256' },
                    { internalType: 'uint256', name: '', type: 'uint256' }
                ],
                payable: false,
                stateMutability: 'view',
                type: 'function'
            }
        ]
        const walletBalanceCalls = markets.map((market) => ({
            address: market.underlyingAddress,
            name: 'balanceOf',
            params: [account]
        }))
        const allowanceCalls = markets.map((market) => ({
            address: market.underlyingAddress,
            name: 'allowance',
            params: [account, market.id]
        }))
        const snapshotCalls = markets.map((market) => ({
            address: market.id,
            name: 'getAccountSnapshot',
            params: [account]
        }))
        const [wallet, allow, snapshot] = await Promise.all([multicall(abi, walletBalanceCalls), multicall(abi, allowanceCalls), multicall(abi, snapshotCalls)])

        return markets.map((market, index) => ({
            walletBalance: new BigNumber(wallet[index].toString()).div(new BigNumber(10).pow(market.underlyingDecimals)),
            allowBalance: new BigNumber(allow[index].toString()).div(new BigNumber(10).pow(8)),
            supplyBalance: new BigNumber(snapshot[index][1].toString()).times(new BigNumber(snapshot[index][3].toString())).div(new BigNumber(10).pow(18 + +market.underlyingDecimals)),
            borrowBalance: new BigNumber(snapshot[index][2].toString()).div(new BigNumber(10).pow(+market.underlyingDecimals))
        }))
    }
    return null
}
