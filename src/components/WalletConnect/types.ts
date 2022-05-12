export enum ConnectorNames {
    Injected = 'injected',
    WalletConnect = 'walletconnect',
    WalletLink = 'walletlink'
}

export type Login = (connectorId: ConnectorNames) => void

export interface Config {
    title: string
    icon: any
    connectorId: ConnectorNames
}

export type Handler = () => void
