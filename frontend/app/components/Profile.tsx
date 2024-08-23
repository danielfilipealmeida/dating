import { H2, H3, H4 } from "./Headers"
import { TextBlock } from "./TextBlock"

interface ProfileProps {
    data: object
}

export default function Profile({
    data
}: ProfileProps) {

    return (
        <div>
            <H2>{data.name}</H2>
            <TextBlock>{data.bio}</TextBlock>


        </div>
    )
} 