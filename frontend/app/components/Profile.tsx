import { H2, H3, H4 } from "./Headers"
import PictureGallery from "./PictureGallery"
import { TextBlock } from "./TextBlock"

interface ProfileProps {
    data: object
}

export default function Profile({
    data
}: ProfileProps) {
     return (
        <div>
            <div className="flex flex-cols w-64" style={{height: '300px'}}>
                <PictureGallery pictures={data.pictures } />
            </div>
            <H2>{data.name}</H2>
            <TextBlock>{data.bio}</TextBlock>
        
        </div>
    )
} 