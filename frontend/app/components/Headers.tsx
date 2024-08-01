

export interface HeaderProps {
    children: string
}

const H1 = ({children, ...props} : HeaderProps) => {
    return (
        <h1
        className="box-decoration-slice bg-gradient-to-r from-orange-500 to-blue-500 text-white px-4 py-3 text-4xl font-bold uppercase"
        >{children}</h1>
    )
}

export {
    H1
}