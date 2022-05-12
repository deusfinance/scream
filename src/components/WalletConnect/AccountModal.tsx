import { Button, Modal } from '@geist-ui/react'

export default function AccountModal({ open, account, logout, onClose }) {
    return (
        <Modal {...{ open, onClose }}>
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <p className="font-bold opacity-50 text-left text-xs">Logged in as:</p>
                    <p className="truncate font-mono text-left">{account}</p>
                </div>

                <a href={`https://ftmscan.com/address/${account}`} target="_blank" className="flex" rel="noreferrer">
                    <Button className="flex-1" type="secondary">
                        View on FTMScan
                    </Button>
                </a>
            </div>
        </Modal>
        // <Modal open={open} onClose={onDismiss}>
        //     <Modal.Title>Account</Modal.Title>
        //     <Modal.Subtitle>{account}</Modal.Subtitle>
        //     <Modal.Content style={{textAlign: 'center'}}>
        //         <Link href={`https://ftmscan.com/address/${account}`} target='_blank'>View on Ftmscan.</Link>
        //     </Modal.Content>
        //     <Modal.Action onClick={() => {
        //         logout();
        //         window.localStorage.removeItem(connectorLocalStorageKey);
        //         onDismiss();
        //     }}>Logout</Modal.Action>
        // </Modal>
    )
}
