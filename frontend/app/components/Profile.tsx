import { upperCaseFirstLetter } from "../utils"
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
            <div className="flex justify-center" style={{height: '800px'}}>
                <PictureGallery pictures={data.pictures } />
            </div>
            <H2>{data.name}</H2>
            <H3>{upperCaseFirstLetter(data.sex)}</H3>
            <TextBlock>{data.bio}</TextBlock>
        
        </div>
    )
} 