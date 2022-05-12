import { useEffect, useState } from 'react'
import Typed from 'react-typed'

export default function Loader() {
    const [hide, setHide] = useState(false)

    useEffect(() => setTimeout(() => setHide(true), 3000), [])

    if (hide) return null
    return (
        <div className="z-100 absolute w-full h-full top-0 left-0 inset-0 bg-white flex items-center justify-center">
            <div className="space-y-8">
                <div>
                    <img className="block w-16 animate-spin mx-auto" src="/img/scream-multi.png" alt="" />
                </div>
                <div>
                    <Typed className="text-rainbow font-mono text-center" strings={['Scream is loading...']} typeSpeed={40} />
                </div>
            </div>
        </div>
    )
}
