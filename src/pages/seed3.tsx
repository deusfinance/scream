import { Button, Input, Modal, Note, useToasts } from '@geist-ui/react'
import { useEffect, useState } from 'react'
import Typed from 'react-typed'
import Web3 from 'web3'
import ConnectWalletButton from '../components/WalletConnect/ConnectWalletButton'
import erc721 from '../data/erc721.json'
import waterJugAbi from '../data/water-jug-abi.json'
import { useActiveWeb3React } from '../hooks'
import { toWei } from '../utils'
import { getContract } from '../utils/ContractService'

export default function PresalePage() {
    const [amount, setAmount] = useState(0)
    const [status, setStatus] = useState('idle')
    const [pastelCount, setPastelCount] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [tx, setTx] = useState(null)
    // const [ftmPrice, setFtmPrice] = useState(0.18)

    const fixedDayString = 'Jul 23st, 4:44PM (EST)'
    const ftmPrice = 0.182
    const usdPerScream = 7
    const allotmentPerPastel = 31
    const ftmPerScream = usdPerScream / ftmPrice
    const maxAllotment = allotmentPerPastel * pastelCount

    const [, setToast] = useToasts()
    const { account, library } = useActiveWeb3React()

    const onSubmit = async () => {
        try {
            // if (amount > maxAllotment * pastelCount) {
            //     return setToast({ text: `You can only claim up to ${maxAllotment * pastelCount} SCREAM.`, type: 'error' })
            // }

            const web3 = new Web3(library.provider)
            const contract = new web3.eth.Contract(waterJugAbi as any, '0x9fe9b37527CC7ae86053da844e24BC010D4Cc413')

            const deposit = await contract.methods.deposit().send({ from: account, value: toWei((amount * ftmPerScream).toString()) })

            setShowModal(false)
            setStatus('complete')
            setToast({ text: 'Success! You have claimed your allotment.' })
        } catch (error) {
            console.log(error)
            setToast({ text: 'An error occurred while processing the transaction.', type: 'error' })
        }
    }

    useEffect(() => {
        if (!account) return
        if (pastelCount) return

        const func = async () => {
            setStatus('loading')
            try {
                const contract = getContract(`${process.env.NEXT_PUBLIC_CONTRACT_PASTEL_TICKET}`, erc721, library)
                const balance = await contract.balanceOf(account)

                setPastelCount(balance.toNumber())
            } catch (error) {
                console.log(error)
            }
            setStatus('idle')
        }
        func()
    }, [account])

    useEffect(() => {
        setAmount(maxAllotment)
    }, [pastelCount])

    return (
        <>
            <Modal open={status === 'complete'} onClose={() => setStatus('idle')} disableBackdropClick>
                <Modal.Content>
                    <div className="space-y-4">
                        <img
                            className="block w-full border border-gray-100 rounded-2xl shadow-xl"
                            src="https://media0.giphy.com/media/3o6fJ1BM7R2EBRDnxK/giphy.gif?cid=ecf05e47iz5ewkl56f80j1bpi7d496q6r9dtl0c5jzlshm0w&rid=giphy.gif&ct=g"
                            alt=""
                        />
                        <p className="text-xl font-bold">Welcome to Scream. It is an honor to have you in our first wave of users. Thank you for your continued support.</p>
                        <div className="space-y-2">
                            <p className="text-xs">Please confirm your payment want sent by viewing it on the scan: </p>
                            <p className="rounded bg-gray-100 whitespace-nowrap overflow-scroll hide-scroll-bars px-2">
                                <a href={`http://ftmscan.com/address/${account}`} target="_blank" className="text-xs opacity-50 font-mono" rel="noreferrer">
                                    Your address: {account}
                                </a>
                            </p>
                        </div>
                    </div>
                </Modal.Content>
            </Modal>

            <Modal open={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content>
                    <div className="space-y-2">
                        <p className="text-2xl font-bold">Are you sure you want to proceed?</p>
                        <p>
                            You can only particpate 1 time this round. If you have already particpated, proceeding will lead to a loss of funds. Be sure to{' '}
                            <a href="https://docs.scream.sh/" target="_blank" className="underline hover:no-underline" rel="noreferrer">
                                read the docs &rarr;
                            </a>{' '}
                            before proceeding.
                        </p>
                        <p className="text-xs font-mono text-red-500">You should only proceed if you have under the risks.</p>
                    </div>
                </Modal.Content>
                <Modal.Action passive onClick={() => setShowModal(false)}>
                    Cancel
                </Modal.Action>
                <Modal.Action onClick={() => onSubmit()}>Proceed</Modal.Action>
            </Modal>

            <div className="min-h-full flex flex-col bg-animated-rainbow">
                <div className="absolute inset-0 opacity-10">
                    <video autoPlay loop muted playsInline className="object-cover h-screen w-screen fixed top-0 left-0" poster="/img/vid.jpg">
                        <source src="/img/vid.mp4" type="video/mp4" />
                    </video>
                </div>
                <div className="relative flex-1 flex items-center justify-center p-6 md:p-12">
                    <div className="max-w-5xl w-full  space-y-8">
                        {/* <div>
                            <Button auto size="mini">
                                Scream Home
                            </Button>
                        </div> */}
                        <div className="text-white space-y-2">
                            <h1 className="text-4xl font-extrabold text-shadow-lg">Community Seed 🌱</h1>
                            <h2 className="text-2xl text-shadow-lg">Only available to Pastel Ticket Holders.</h2>
                        </div>
                        <div className="gap-6 md:gap-12 grid grid-cols-1 md:grid-cols-2">
                            <div className="bg-white shadow-xl w-full rounded-2xl space-y-8 p-6 md:p-12 flex items-center">
                                <div className="space-y-4 w-full">
                                    <div className="space-y-4">
                                        <div>
                                            <Note type="success">
                                                The <b>third</b> round has started. Pastel holders may claim an uncapped alottment until sold out in this round.
                                            </Note>
                                        </div>

                                        <div className="text-white flex flex-col md:flex-row md:space-x-2 md:space-y-2 space-y-0">
                                            <div className="flex-1 rounded-2xl bg-blue-400 p-4">
                                                <p className="font-medium">SCREAM</p>
                                                <p className="text-4xl uppercase font-extrabold">1</p>
                                            </div>
                                            <div className="flex items-center justify-center">
                                                <p className="text-gray-300 text-3xl">=</p>
                                            </div>
                                            <div className="flex-1 rounded-2xl bg-red-400 p-4">
                                                <p className="font-medium">FTM</p>
                                                <p className="text-4xl uppercase font-extrabold">{ftmPerScream.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-4">
                                        <p className="text-xs font-mono opacity-50 text-center">
                                            Price fixed to FTM at date of launch:
                                            <br /> {fixedDayString}
                                        </p>
                                        <Input width="100%" label="Fixed FTM Price" disabled value={`$${ftmPrice.toFixed(2)}`} />
                                        {/* <Input width="100%" label="Your Pastel Count" disabled value={pastelCount} /> */}
                                        {/* <Input width="100%" label="Alottment per Pastel" disabled value="Uncapped SCREAM" /> */}
                                        <Input width="100%" label="Price Per Scream" disabled value="$7" />
                                        {/* <Input width="100%" label="Your Alottment" disabled value="Uncapped" /> */}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6 md:space-y-12">
                                <div className="relative bg-white shadow-xl w-full rounded-2xl p-6 md:p-12 space-y-2">
                                    <div className="flex space-x-4">
                                        <p className="text-xl font-medium">
                                            <span>Things you need to know before participating:</span>
                                        </p>
                                        <i className="text-2xl text-red-500 animate-pulse fas fa-exclamation-triangle" />
                                    </div>
                                    <p className="h-16 flex items-center">
                                        <Typed
                                            strings={[
                                                'You can only participate once.',
                                                'Sending more funds than your allotment allows will lead to loss of funds.',
                                                'DeFi has inherent risks of loss.',
                                                'You should only invest money you are comfortable loosing.',
                                                'Tokens will be distrubted following the public IDO next week.'
                                            ]}
                                            typeSpeed={80}
                                            loop
                                        />
                                    </p>
                                    <p>
                                        <a target="_blank" href="https://docs.scream.sh/" className="underline hover:no-underline" rel="noreferrer">
                                            Read the Docs &rarr;
                                        </a>
                                    </p>
                                </div>
                                <div className="bg-white shadow-xl w-full rounded-2xl p-6 md:p-12">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault()
                                            setShowModal(true)
                                        }}
                                        className="flex h-full flex-col justify-center space-y-4 relative"
                                    >
                                        {!account && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95 z-20">
                                                <ConnectWalletButton />
                                                {/* <Button
                                                    auto
                                                    onClick={async () => {
                                                        await wallet.connect()
                                                    }}
                                                    type={wallet.status === 'error' ? 'error' : 'default'}
                                                >
                                                    {wallet.status === 'error' ? 'Error (Wrong Chain?)' : 'Connect Wallet'}
                                                </Button> */}
                                            </div>
                                        )}
                                        <p className="text-3xl text-center font-extrabold text-shadow-lg">Swap</p>
                                        <p className="text-xs font-mono text-center">Enter an amount to purchase (in SCREAM).</p>
                                        <div className="flex space-x-4">
                                            {/* <Button disabled={!pastelCount} size="small" auto onClick={() => setAmount(maxAllotment)}>
                                                Max
                                            </Button> */}
                                            <Input
                                                size="small"
                                                type="number"
                                                width="100%"
                                                disabled={!pastelCount}
                                                // label="Amount in SCREAM"
                                                placeholder="Enter an amount"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex">
                                            <Button className="flex-1" auto disabled={!amount || !pastelCount} htmlType="submit" type="secondary">
                                                Deposit
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
