import { Button } from '@geist-ui/react'
import { useState } from 'react'
import { useActiveWeb3React } from '../../hooks'
import useAuth from '../../hooks/useAuth'
import AccountModal from './AccountModal'
import ConnectModal from './ConnectModal'

export default function ConnectWalletButton(props) {
    const { account } = useActiveWeb3React()
    const { login, logout } = useAuth()
    const [connectModalOpen, setConnectModalOpen] = useState(false)
    const [accountModalOpen, setAccountModalOpen] = useState(false)

    const shortAddress = account ? `${account.slice(0, 6)}...${account.slice(-6)}` : null
    const onClickConnect = () => {
        if (account) {
            setAccountModalOpen(true)
        } else {
            setConnectModalOpen(true)
        }
    }

    return (
        <>
            {props.type === 'rainbow' && (
                <button
                    onClick={() => onClickConnect()}
                    type="button"
                    className="block bg-animated-rainbow-dark text-center font-bold rounded-3xl px-4 py-2 text-xs w-full animate-ping text-white transition ease-in-out duration-150"
                >
                    {account ? shortAddress : 'Connect Wallet'}
                </button>
            )}
            {props.type !== 'rainbow' && (
                <Button className="text-shadow-lg" onClick={() => onClickConnect()} auto {...props} size={props.size}>
                    {account ? shortAddress : 'Connect Wallet'}
                </Button>
            )}
            <ConnectModal open={connectModalOpen} login={login} onDismiss={() => setConnectModalOpen(false)} />
            <AccountModal open={accountModalOpen} logout={logout} account={account} onClose={() => setAccountModalOpen(false)} />
        </>
    )
}
