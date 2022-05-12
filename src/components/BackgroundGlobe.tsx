import { useEffect } from 'react'
import DOTS from 'vanta/dist/vanta.globe.min'

export default function BackgroundGlobe() {
    useEffect(() => {
        if (!window) return
        const effect = DOTS({
            el: '#qisnasssdfas',
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: '#ceb3dd',
            color2: '#ec7cff',
            size: 1.3,
            backgroundColor: '#f2e4ff'
        })

        return () => {
            effect.destroy()
        }
    }, [])

    return <div id="qisnasssdfas" className="fixed inset-0 z-0" />
}
