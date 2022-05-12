import { Button, Input, Modal, useToasts } from '@geist-ui/react'
import axios from 'axios'
import { useState } from 'react'

export default function SubscribeModal({ visible, hide }) {
    const [email, setEmail] = useState('')
    const [, setToast] = useToasts()

    const onSubmit = async () => {
        try {
            await axios.post('/api/subscribe', { email })
            setToast({ text: 'You have been added to the whitelist.' })
            setTimeout(() => {
                setEmail('')
                hide()
            }, 2000)
            // setMessage('You have been added to whitelist.')
            // alert('You have been added to whitelist.')
            // setSubscribe(false)
            // setSubscribeInput('')
        } catch (error) {
            console.log(error)
            setToast({ text: 'An error occurred. Either you are already subscribed, or a problem occuured. Try with another email or come back later!', type: 'error' })
        }
    }

    return (
        <Modal open={visible} onClose={hide}>
            <Modal.Content>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-3xl font-extrabold text-center">Coming soon.</p>
                        <p>You can read more about our timeline on our documentation page. If you are interested in being notified about all the latest you need to know about Scream, subscribe below:</p>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            onSubmit()
                        }}
                        className="space-y-2"
                    >
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your Email Address" width="100%" />
                        <div className="flex">
                            <Button htmlType="submit" type="secondary" className="flex-1" disabled={!email}>
                                Subscribe
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal.Content>
        </Modal>
    )
}
