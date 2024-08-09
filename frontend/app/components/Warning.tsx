interface WarningProps {
    children: any
}

export default function Warning({children} : WarningProps) {
    return (
        <div
            className="box-decoration-slice bg-gradient-to-r from-orange-500 to-blue-500 text-white m-2 px-4 py-3 text-md font-bold rounded"
        >
            {children}
        </div>
    )
}