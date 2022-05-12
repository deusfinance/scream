import { Progress, useTheme } from '@geist-ui/react'
import Tippy from '@tippyjs/react'
import useMarkets from '../hooks/useMarkets'
import useTotalBorrowLimit from '../hooks/useTotalBorrowLimit'

export default function HealthFactor() {
    const theme = useTheme()

    const { markets } = useMarkets()
    const { health } = useTotalBorrowLimit(markets)

    return (
        <div className="w-auto">
            {/* <p className="text-xs font-mono whitespace-nowrap">Health Factor</p> */}
            <Tippy
                placement="right"
                content={
                    <div className="p-2 bg-white shadow-xl max-w-xs w-full rounded-xl space-y-1">
                        {/* <p className="text-xs">Your Account Health</p> */}
                        {/* <p className="text-4xl font-extrabold">{health}</p> */}
                        <p className="text-xs">Your accounts health is derived from your current loans and borrows. Keep your account's health factor above 1 to stay risk-free from liquidations.</p>
                    </div>
                }
            >
                <div className="flex space-x-2 items-center">
                    <div className="flex items-center space-x-1">
                        <i className="fas fa-heartbeat" />
                        <div className="text-sm font-mono">{health.toFixed(2)}</div>
                    </div>
                    <Progress
                        className="w-full"
                        value={health}
                        max={2}
                        colors={{
                            50: theme.palette.error,
                            80: theme.palette.warning,
                            100: theme.palette.cyan
                        }}
                    />
                </div>
            </Tippy>
        </div>
    )
}
