export default function Footer() {
    return (
        <>
            <svg className="h-16 w-full transform rotate-180" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path
                    d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                    opacity=".25"
                    className="shape-fill"
                    style={{ fill: '#ff89d9' }}
                />
                <path
                    d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                    opacity=".5"
                    className="shape-fill"
                    style={{ fill: '#ff52f2' }}
                />
                <path
                    d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                    style={{ fill: '#F472B6' }}
                />
            </svg>

            <div className="bg-pink-400">
                <div className="max-w-7xl mx-auto p-6 py-12 md:p-12 md:py-24 space-y-12">
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                        <div className="space-y-4 text-white">
                            <img className="w-60" src="/img/scream-logotype.png" alt="" />
                            <p className="opacity-50 text-lg">Scream was established in 2021 by a team of passionate engineers spread across the globe to empower financial freedom.</p>
                        </div>
                        <div />
                    </div>
                </div>
            </div>
            <div className="bg-pink-600 text-pink-300">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-end">
                    <div className="text-lg space-x-2">
                        <a className="opacity-50 hover:opacity-75" href={process.env.NEXT_PUBLIC_TWITTER_URL} target="_blank" rel="noreferrer">
                            <i className="fab fa-twitter" />
                        </a>
                        <a className="opacity-50 hover:opacity-75" href={process.env.NEXT_PUBLIC_TELEGRAM_URL} target="_blank" rel="noreferrer">
                            <i className="fab fa-telegram" />
                        </a>
                        <a className="opacity-50 hover:opacity-75" href={process.env.NEXT_PUBLIC_DISCORD_URL} target="_blank" rel="noreferrer">
                            <i className="fab fa-discord" />
                        </a>
                        <a className="opacity-50 hover:opacity-75" href={process.env.NEXT_PUBLIC_GITHUB_URL} target="_blank" rel="noreferrer">
                            <i className="fab fa-github" />
                        </a>
                        <a className="opacity-50 hover:opacity-75" href={process.env.NEXT_PUBLIC_MEDIUM_URL} target="_blank" rel="noreferrer">
                            <i className="fab fa-medium" />
                        </a>
                        <a href="https://docs.scream.sh" target="_blank" className="text-xs font-mono underline hover:no-underline opacity-50 hover:opacity-75 md:ml-4" rel="noreferrer">
                            Documentation
                        </a>
                    </div>
                    <div className="flex-1" />
                    <p className="text-xs font-mono whitespace-nowrap text-center">
                        Scream &copy;&nbsp;
                        {new Date().getFullYear()}
                    </p>
                </div>
            </div>
        </>
    )
}
