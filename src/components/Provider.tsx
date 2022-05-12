import { createWeb3ReactRoot } from '@web3-react/core'
import { RefreshContextProvider } from '../contexts/RefreshContext'
import { NetworkContextName } from '../hooks'

const Web3ReactProviderDefault = createWeb3ReactRoot(NetworkContextName)

const Web3ReactProviderDefaultSSR = ({ children, getLibrary }) => (
    <Web3ReactProviderDefault getLibrary={getLibrary}>
        <RefreshContextProvider>{children}</RefreshContextProvider>
    </Web3ReactProviderDefault>
)

export default Web3ReactProviderDefaultSSR
