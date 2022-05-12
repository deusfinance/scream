import { Modal } from '@geist-ui/react'
import classNames from 'classnames'

export default function SafetyModal({ open, hide }) {
    return (
        <Modal open={open} onClose={hide}>
            <Modal.Content>
                <div className="space-y-2">
                    <div className="flex items-center">
                        <p className="text-2xl font-extrabold">Notice</p>
                        <div className="flex-1" />
                        <img className={classNames('w-8 inline-block')} src="https://scream.sh/img/scream-multi.png" alt="" />
                    </div>
                    <p>
                        As pursuant to US law, users located in the US are <b>not permitted</b> to use Scream. Only users located outside of the US are permitted to use Scream.
                    </p>
                </div>
            </Modal.Content>
            <Modal.Action onClick={hide}>I Understand</Modal.Action>
        </Modal>
    )
}
