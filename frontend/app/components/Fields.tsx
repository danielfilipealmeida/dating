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


export function FieldCaption({name, children} : {name: string, children: React.ReactNode}) {
    return (
        <label
            className="w-max font-medium  text-gray-800 px-1 mt-3 block"
            htmlFor={name}
        >{children}</label>
    )
}
export function TextField({name, title, value, required, type}: TextFieldProps) {
    return (
        <>
            <FieldCaption name={name}>{title}</FieldCaption>
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
            <FieldCaption name={name}>{title}</FieldCaption>
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
    multiple?: boolean
}

export function SelectField({title, name, value, options, multiple}:SelectFieldProps) {
    return (
        <>
            <FieldCaption name={name}>{title}</FieldCaption>
            <Select
                name={name}
                value={value || ""}
                options={options}
                fullWidth={true}
                multiple={multiple}
            />
        </>
    )
}