export interface ButtonProps {
    label: string,
    disabled: boolean
}

export default function SubmitButton({label, disabled, ...props} : ButtonProps) {
    let classes = "font-bold py-2 px-4 rounded box-decoration-slice  text-white border border-orange-500 rounded mx-1 flex flex-row items-center "
        
    classes += !disabled ? "bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-700 hover:to-blue-700":"bg-orange-800 hover:bg-orange-900"
    return (
        <button 
            type="submit"
            className={classes} 
            disabled={disabled}
            {...props}
        >
            {disabled && (
                <div className="">
                    <svg className="animate-spin h-5 w-5 mr-3 " viewBox="0 0 24 24">
                        <path xmlns="http://www.w3.org/2000/svg" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" fill="white"/>
                        <path xmlns="http://www.w3.org/2000/svg" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" fill="white">
                            <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12" repeatCount="indefinite"/>
                        </path>
                    </svg>
                </div>
            )}
            <div className="">{label}</div>
            </button>
        
    )
}