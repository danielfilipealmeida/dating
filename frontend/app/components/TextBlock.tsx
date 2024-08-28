export interface Props {
    children: string
}

export const TextBlock = ({children, ...props} : Props) => {
    return (
        <div
            className="text-base font-regular text-gray-700 py-1"
            {...props}
        >
            {children}
        </div>
    )
    
}
