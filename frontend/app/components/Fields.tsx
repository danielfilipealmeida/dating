import Select from "./Select"
import TextArea from "./TextArea"
import TextInput from "./TextInput"

interface TextFieldProps {
    name: string
    title: string
    value?: string
    required: boolean
    type: string
}


export function FieldCaption({children} : {children: React.ReactNode}) {
    return (
        <div
            className="w-max font-medium  text-gray-800 px-1 mt-2"
        >{children}</div>
    )
}
export function TextField({name, title, value, required, type}: TextFieldProps) {
    return (
        <>
            <FieldCaption>{title}</FieldCaption>
            <TextInput
                name={name} 
                value={value || ""} 
                type={type}
                required={required} 
                fullWidth={true}
                />
        </>
    )
}

interface TextAreaFieldProps {
    title: string
    name: string
    value?: string
    required: boolean
}

export function TextAreaField({title, name, value, required} : TextAreaFieldProps) {
    return (
        <>
            <FieldCaption>{title}</FieldCaption>
            <TextArea
                name={name}
                value={value || ""}
                required={required}
                fullWidth={true}
            />
        </>
    )
}

export interface SelectFieldProps {
    title: string
    name: string
    value?: string
    options: object
}

export function SelectField({title, name, value, options}:SelectFieldProps) {
    return (
        <>
            <FieldCaption>{title}</FieldCaption>
            <Select
                name={name}
                value={value || ""}
                options={options}
                fullWidth={true}
            />
        </>
    )
}