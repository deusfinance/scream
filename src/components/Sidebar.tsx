import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'

export default function Sidebar({ open, hide, children, className }) {
    return (
        <>
            <AnimatePresence>
                {open && (
                    <motion.div
                        onClick={hide}
                        initial={{ backgroundColor: 'rgba(255,255,255,0)' }}
                        animate={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                        exit={{ backgroundColor: 'rgba(255,255,255,0)' }}
                        className={classNames('fixed inset-0 z-30', className)}
                    >
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            initial={{ x: '100%' }}
                            animate={{ x: '0%' }}
                            exit={{ x: '100%' }}
                            className="absolute right-0 bg-white max-w-2xl h-full shadow-xl w-full max-h-full flex flex-col"
                        >
                            <button onClick={hide} type="button" className="p-6 absolute top-0 right-0 z-20">
                                <i className="fa fa-times" />
                            </button>
                            {children}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
