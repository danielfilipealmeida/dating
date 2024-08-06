import { SHARED_FIELD_CLASSES } from "./TextInput"

export interface TextAreaProps {
    placeholder?: string
    name: string
    required: boolean
    value: string
    fullWidth: boolean
}

export default function TextArea({placeholder, name, required, value, fullWidth, ...props} : TextAreaProps) {
    let classNames = SHARED_FIELD_CLASSES
    if (fullWidth) {
        classNames += " w-full"
    }
    return (
        <textarea
        className={classNames}
        name={name}
        placeholder={placeholder}
        required={required}
        defaultValue={value}
        />
    )
}