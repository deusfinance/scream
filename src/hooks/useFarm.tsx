import { getFarmsContract, getTokenContractByAddress } from '../utils/ContractService'
import { toEth, toWei, MAX_UINT256 } from '../utils'
import useFarmData from './useFarmData'
import * as constants from '../constants'
import { ethers } from 'ethers'
import { useActiveWeb3React } from '.'

const farms = constants.CONTRACT_SCREAM_FARMS[250].tokens

export default function useFarm() {
    const { account, library } = useActiveWeb3React()

    const farmContract = getFarmsContract(library.getSigner())

    const { update } = useFarmData()

    const deposit = async (pid, amount) => {
        if (!account) return
        try {
            const farmData = farms.filter((farm) => farm.pid === pid)[0]
            const tokenContract = getTokenContractByAddress(farmData.depositToken, library.getSigner())
            let tx
            const allowance = await tokenContract.allowance(account, farmContract.address)
            if (Number(amount) > Number(toEth(allowance))) {
                tx = await tokenContract.approve(farmContract.address, MAX_UINT256)
                await tx.wait(1)
            }
            tx = await farmContract.deposit(pid, toWei(amount))
            await tx.wait(1)
            console.log(tx)
            update()
        } catch (ex) {
            console.error(ex)
        }
    }

    const claim = async (pid) => {
        if (!account) return
        try {
            let tx
            tx = await deposit(pid, '0')
            await tx.wait(1)
            console.log(tx)
            update()
        } catch (ex) {
            console.error(ex)
        }
    }

    const withdraw = async (pid, amount) => {
        if (!account) return
        try {
            let withdrawAmount = toWei(amount)
            let tx = await farmContract.withdraw(pid, withdrawAmount)
            await tx.wait(1)
            console.log(tx)
            update()
        } catch (ex) {
            console.error(ex)
        }
    }

    return {
        deposit,
        withdraw,
        claim
    }
}
