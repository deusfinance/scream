import { Input } from '@geist-ui/react'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'

export default function SubscribePopup({ visible, hide }) {
    const [message, setMessage] = useState('')
    const [subscribeInput, setSubscribeInput] = useState('')

    // useEffect(() => setTimeout(() => setHide(true), 3000), [])

    const onSubmit = async () => {
        try {
            await axios.post('/api/subscribe', { email: subscribeInput })
            setMessage('You have been added to whitelist.')
            alert('You have been added to whitelist.')
            setSubscribeInput('')
        } catch (error) {
            console.log(error)
            // setMessage('An error occurred. Either you are already subscribed, or a problem occuured. Try with another email or come back later!')
            alert('An error occurred. Either you are already subscribed, or a problem occuured. Try with another email or come back later!')
        }
    }

    return (
        <>
            <AnimatePresence>
                {visible && (
                    <div className="z-1000 absolute inset-0 pointer-events-none">
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: ['100%', '0%'] }}
                            exit={{ y: ['0%', '100%'] }}
                            transition={{ duration: 0.2 }}
                            className="absolute  bottom-0 right-0 px-6 md:px-12 pointer-events-auto"
                        >
                            <div className="bg-white rounded-b-none overflow-hidden sm:max-w-xs border-rainbow border-2 border-b-0">
                                <div className="bg-animated-rainbow px-4 py-2 flex items-center text-white">
                                    <p className="font-bold text-xs flex-1">Subscribe</p>
                                    <button type="submit" onClick={hide}>
                                        <i className="fas fa-times" />
                                    </button>
                                </div>
                                <form
                                    className="p-4 space-y-2"
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        onSubmit()
                                    }}
                                >
                                    <p className="text-sm">
                                        <span className="font-medium">
                                            Be the first to know when the <span className="font-extrabold text-rainbow">SCREAM</span> protocol is live.{' '}
                                        </span>
                                        <span>Join to become whitelisted.</span>
                                    </p>
                                    <Input width="100%" type="email" value={subscribeInput} onChange={(e) => setSubscribeInput(e.target.value)} label="Email" placeholder="Enter your email" a />
                                    {/* <p className="text-xs">Or join us on Discord</p> */}
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
