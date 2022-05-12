import { Progress } from '@geist-ui/react'

interface TokenPercentageBarProps {
    src: String
    name: String
    value: Number
    percentage: String
    icon: string
}

export default function TokenPercentageBar({ src, name, value, percentage, icon }: TokenPercentageBarProps) {
    return (
        <div className="flex items-center space-x-2">
            <img className="h-4 w-4 bg-gray-100 rounded-full" src={src} alt="" />
            <p className="text-xs font-bold">{name}</p>
            <Progress className="flex-1" type="secondary" value={value} />
            <p className="text-xs font-medium">{value}%</p>
        </div>
    )
}
