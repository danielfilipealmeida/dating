export interface TextInputProps {
    placeholder: string
    type: string
    name: string
    required: boolean
}

export default function TextInput({placeholder, type, name, required, ...props} : TextInputProps) {
    return (
        <input 
            className="font-normal py-2 px-4 rounded background-white text-gray-500 border border-orange-500 rounded mx-1"
            type={type} 
            name={name} 
            placeholder={placeholder} 
            required={required}
        />   
    )
}