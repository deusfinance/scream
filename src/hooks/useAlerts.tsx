import { AnimatePresence } from 'framer-motion'
import { createContext, useContext, useEffect, useState } from 'react'
import LoaderModal from '../components/LoaderModal'
import useMarkets from './useMarkets'

const AlertsContext = createContext({})

export function UseAlertsWrapper({ children }) {
    const [transactions, setTransactions] = useState([])
    const { refreshing } = useMarkets()

    useEffect(() => {
        if (refreshing) {
            console.log('market refreshing ================================')
        }
    }, [refreshing])

    const triggerTransactionAlert = (tx) => {
        const newTransaction = {
            tx
        }

        setTransactions((currentTransactions) => [...currentTransactions, newTransaction])
    }

    const completeTransactionAlert = (tx) => {
        const find = transactions.find((transaction) => transaction.tx === tx)
        if (!find) return

        find.complete = true
        const filtered = transactions.filter((transaction) => transaction.tx !== tx)

        setTransactions([...filtered, find])
    }
    const deleteTransactionAlert = (tx) => {
        completeTransactionAlert(tx)

        // setTimeout(() => {
        const filtered = transactions.filter((transaction) => transaction.tx !== tx)
        setTransactions(filtered)
        // }, 2000)
    }

    return (
        <AlertsContext.Provider
            value={{
                transactions,
                setTransactions,
                triggerTransactionAlert,
                deleteTransactionAlert,
                completeTransactionAlert
            }}
        >
            <>
                <AnimatePresence>
                    <div className="z-50 space-y-2 max-w-xs w-full fixed bottom-6 right-6">
                        {transactions.map((transaction, index) => (
                            <LoaderModal tx={transaction.tx} complete={transaction.complete} key={index} />
                        ))}
                    </div>
                </AnimatePresence>

                {children}
            </>
        </AlertsContext.Provider>
    )
}

export default function useAlerts() {
    const context = useContext(AlertsContext)
    return { ...context }
}
