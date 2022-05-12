import { motion } from 'framer-motion'
import Typed from 'react-typed'
import { getFtmScanLink } from '../utils'

interface LoaderModalProps {
    complete?: boolean
    tx: string
}

export default function LoaderModal({ complete, tx }: LoaderModalProps) {
    const gotoTx = (e) => {
        e.preventDefault()
        if (tx) window.open(getFtmScanLink(tx, 'transaction'), '_blank')
    }

    return (
        <motion.div initial={{ x: '100%' }} animate={{ x: '0' }} exit={{ x: '100%' }} onClick={(e) => gotoTx(e)} className="relative z-50 w-full bg-animated-rainbow rounded-2xl shadow-xl p-1">
            <div className="bg-white rounded-2xl p-4">
                <div className="flex items-center space-x-4">
                    <div className="flex-1 space-y-1 overflow-hidden">
                        <p className="font-extrabold text-lg truncate">
                            {complete ? (
                                'Complete.'
                            ) : (
                                <>
                                    <Typed strings={['Transacting...']} typeSpeed={40} loop />
                                </>
                            )}
                        </p>
                        <p className="text-xs font-mono truncate opacity-50">TX: {tx}</p>
                    </div>
                    {!complete && (
                        <div>
                            <div className="bg-rainbow h-4 w-6 rounded-full shadow-xl animate-spin" />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
