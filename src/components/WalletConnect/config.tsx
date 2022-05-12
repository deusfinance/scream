import { Config, ConnectorNames } from './types'

const connectors: Config[] = [
    {
        title: 'Metamask',
        icon: '/img/metamask.png',
        connectorId: ConnectorNames.Injected
    },
    {
        title: 'TrustWallet',
        icon: '/img/trust-wallet.png',
        connectorId: ConnectorNames.Injected
    },
    {
        title: 'WalletConnect',
        icon: '/img/wallet-connect.png',
        connectorId: ConnectorNames.WalletConnect
    },
    {
        title: 'Coinbase Wallet',
        icon: '/img/coinbase.jpeg',
        connectorId: ConnectorNames.WalletLink
    }
]

export default connectors
export const connectorLocalStorageKey = 'connectorId'
