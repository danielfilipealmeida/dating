import { FieldCaption } from "./Fields"

interface SectionProps {
    title: string
    children: React.ReactNode
}

export default function Section({title, children, ...props}: SectionProps) {
    return (
        <>
            <FieldCaption>{title}</FieldCaption>
            <div className="border-orange-600 border rounded p-4" {...props}>
                {children}
            </div>
        </>
    )
}