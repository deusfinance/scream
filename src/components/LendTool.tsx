import { useState } from 'react'
import SupplyTab from './SupplyTabs/SupplyTab'
import WithdrawTab from './SupplyTabs/WithdrawTab'
import ToolWrapper from './ToolWrapper'

export default function LendTool() {
    const tabs = [{ slug: 'lend' }, { slug: 'withdraw' }]
    const [tab, setTab] = useState(0)
    const activeTab = tabs[tab]

    return (
        <ToolWrapper title="Lend Assets">
            <div className="border-b border-gray-100 flex">
                <button onClick={() => setTab(0)} type="button" className={`flex-1 py-2 text-xs font-medium border-r ${activeTab.slug === 'lend' ? 'bg-white' : 'bg-gray-50'}`}>
                    Lend
                </button>
                <button onClick={() => setTab(1)} type="button" className={`flex-1 py-2 text-xs font-medium ${activeTab.slug === 'withdraw' ? 'bg-white' : 'bg-gray-100'}`}>
                    Withdraw
                </button>
            </div>
            <div className="p-6">
                {activeTab.slug === 'lend' && <SupplyTab />}
                {activeTab.slug === 'withdraw' && <WithdrawTab />}
            </div>
        </ToolWrapper>
    )
}
