import { useEffect, useState } from 'react'
import { useActiveWeb3React } from '.'

const useBlock = () => {
    const [block, setBlock] = useState(0)
    const { library } = useActiveWeb3React()

    useEffect(() => {
        if (!library) return

        const interval = setInterval(async () => {
            const latestBlockNumber = library.blockNumber
            if (block !== latestBlockNumber) {
                setBlock(latestBlockNumber)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [library, block])

    return block
}

export default useBlock
