import ParticlesBackground from '../components/ParticlesBackground'

export default function BlockedPage({ ip }) {
    return (
        <>
            <ParticlesBackground />

            <div className="w-full min-h-full bg-black text-white font-mono flex items-center justify-center ">
                <div className="max-w-3xl mx-auto p-6 py-12 font-extrabold">
                    <div className="">
                        <div className="space-y-12 border-b-4 border-white border-opacity-10 pb-12 mb-12">
                            <div className="space-y-1">
                                <p className="text-xl opacity-75">Error 1006</p>
                                <p className="text-3xl">Access Denied</p>
                            </div>
                            <p className="text-2xl">Your country has been blocked from accessing the SCREAM Protocol.</p>
                            <div className="max-w-lg space-y-2">
                                <p className="text-2xl">Why?</p>
                                <p>In an effort to respect US laws and protect the privacy of our users, we have blocked your country from acessing the tools hosted at https://scream.sh/.</p>
                            </div>
                        </div>
                        <p className="text-xs text-center opacity-50 font-extralight">Your IP: {ip}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

BlockedPage.getInitialProps = async ({ req, res }: any) => {
    const ip = req.headers['x-real-ip'] || req.connection.remoteAddress
    return { ip }
}
