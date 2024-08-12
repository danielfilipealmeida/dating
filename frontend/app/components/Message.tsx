interface MessageProps {
    children: any
}

export default function Message({children} : MessageProps) {
    return (
        <div
            className="box-decoration-slice border-orange-600 border rounded bg-white text-orange-600 m-2 px-4 py-3 text-md font-bold"
        >
            {children}
        </div>
    )
}