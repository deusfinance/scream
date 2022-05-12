import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

export default function LockedEarningsChart({ data }: any) {
    const renderDot = ({ cx, cy, payload }) => {
        if (payload.isActiveDot) {
            return (
                <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="black" viewBox="0 0 1024 1024">
                    <circle cx="50%" cy="50%" r="300" />
                </svg>
            )
        }

        return null
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart width={400} height={400} data={data}>
                <YAxis orientation="right" />
                <XAxis dataKey="week" interval={12} />
                <Line type="monotone" dataKey="val" stroke="#000000" dot={renderDot} />
                <CartesianGrid stroke="#ccc" />
            </LineChart>
        </ResponsiveContainer>
    )
}
