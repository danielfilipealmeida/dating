import { FieldCaption } from "./Fields"

interface SectionProps {
    title: string
    name: string
    children: React.ReactNode
}

export default function Section({title,name, children, ...props}: SectionProps) {
    return (
        <>
            <FieldCaption name={name}>{title}</FieldCaption>
            <div className="border-orange-600 border rounded p-4" {...props}>
                {children}
            </div>
        </>
    )
}