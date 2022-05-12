import { Button, Input } from '@geist-ui/react'
import { useState } from 'react'

export default function Locker() {
    const [locked, setLocked] = useState(true)
    const [input, setInput] = useState('')

    const password = 'superscreamers'

    const onSubmit = () => {
        if (input === password) setLocked(false)
    }

    if (!locked) return null
    return (
        <div className="z-50 bg-white fixed inset-0 top-0 left-0 flex justify-center items-center p-12">
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    onSubmit()
                }}
                className="space-y-4 max-w-sm text-center"
            >
                <img className="animate-spin mx-auto w-16" src="/img/scream-pink-yellow.png" alt="" />
                <p>Enter the passphrase to access this page.</p>
                <Input type="password" label="Passphrase" placeholder="Enter the passphrase" value={input} onChange={(e) => setInput(e.target.value)} />
                <Button disabled={!input} htmlType="submit">
                    Enter
                </Button>
            </form>
        </div>
    )
}
