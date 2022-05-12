export default function ToolWrapper({ title, children }) {
    return (
        <div className="space-y-4">
            {/* <p className="text-xl font-bold">{title}</p> */}
            <div className="rounded-3xl border-gray-100 border shadow-xl overflow-hidden">{children}</div>
        </div>
    )
}
