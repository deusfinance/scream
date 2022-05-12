import { Button, Modal } from '@geist-ui/react'

export default function ProductModal({ visible, hide }) {
    return (
        <Modal open={visible} width="1020px" className="">
            <Modal.Content>
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div>
                        <img src="" alt="" />
                    </div>
                    <div>
                        <Button shadow type="secondary" className="w-full">
                            Checkout
                        </Button>
                    </div>
                </div>
            </Modal.Content>
        </Modal>
    )
}
