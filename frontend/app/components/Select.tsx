import { SHARED_FIELD_CLASSES } from "./TextInput"

export interface SelectProps {
    name: string
    value: string
    options: object
    fullWidth?: boolean
}

export default function Select({
    name,
    value,
    options,
    fullWidth
} : SelectProps) {
    let classNames = SHARED_FIELD_CLASSES
    if (fullWidth) {
        classNames += " w-full"
    }

    return (
        <select name={name} defaultValue={value} className={classNames}>
            {Object.keys(options).map((option:string) => {
                return (
                    <option value={option}>{options[option]}</option>
                )
            })}

        </select>
    )
}