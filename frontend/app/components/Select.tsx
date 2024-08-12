import { SHARED_FIELD_CLASSES } from "./TextInput"

export interface SelectProps {
    name: string
    value: string
    options: object
    fullWidth?: boolean
    multiple?: boolean
}

export default function Select({
    name,
    value,
    options,
    fullWidth,
    multiple
} : SelectProps) {
    let classNames = SHARED_FIELD_CLASSES
    if (fullWidth) {
        classNames += " w-full"
    }

    return (
        <select name={name} defaultValue={value} className={classNames} multiple={multiple}>
            {Object.keys(options).map((option:string) => {
                return (
                    <option 
                    value={option}
                    key={option}
                    >{options[option]}</option>
                )
            })}

        </select>
    )
}