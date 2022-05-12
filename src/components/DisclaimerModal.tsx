import { Collapse, Modal, Note } from '@geist-ui/react'

export default function DisclaimerModal() {
    return (
        <Modal open>
            <Modal.Content>
                <div className="space-y-8">
                    <Note type="error">You need to know the risks.</Note>
                    <Collapse.Group>
                        <Collapse title="General DeFi Risks" initialVisible>
                            <p>
                                DeFi risks encapsulates a wide range of risks such as impermanent loss to risks of falling for scams such as wallet draining, private key being stolen, et cetera. Hence, DeFi users have to
                                be careful themselves and learn to educate themselves constantly in this space.
                            </p>
                        </Collapse>
                        <Collapse title="Allotment Rules">
                            <p>1 Pastel Ticket = 5 Scream Tokens (1500 FTM), It you have more Pastal Tickets just times the amount of Tickets by 5. Please visit out discord if you need help.</p>
                        </Collapse>
                    </Collapse.Group>
                </div>
            </Modal.Content>
        </Modal>
    )
}
