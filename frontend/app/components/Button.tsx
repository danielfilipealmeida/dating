
export interface ButtonProps {
    label: string,
}

export default function Button({label, ...props} : ButtonProps) {
    return (
        <button 
            type="submit"
            className="font-bold py-2 px-4 rounded box-decoration-slice bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-700 hover:to-blue-700 text-white border border-orange-500 rounded mx-1" 
            {...props}
        >{label}</button>
        
    )
}