export const SHARED_FIELD_CLASSES = "font-normal py-2 px-4 rounded background-white text-gray-500 border border-orange-500 rounded m-1"

export interface TextInputProps {
    placeholder?: string
    type: string
    name: string
    value?: string
    required: boolean
    fullWidth?: boolean
}

export default function TextInput({
    placeholder, 
    type, 
    name, 
    value,
    required, 
    fullWidth, 
    ...props
} : TextInputProps) {
    let classNames = SHARED_FIELD_CLASSES
    if (fullWidth) {
        classNames += " w-full"
    }
    return (
        <input 
            className={classNames}
            type={type} 
            name={name} 
            placeholder={placeholder} 
            required={required}
            defaultValue={value}
        />   
    )
}