import { upperCaseFirstLetter } from "../utils"
import { H2, H3, H4 } from "./Headers"
import PictureGallery from "./PictureGallery"
import { TextBlock } from "./TextBlock"
import { UserData } from "../types/user"

interface ProfileProps {
    data: UserData
}

/**
 * This is the Profile component that displays a user's profile information.
 * It includes a picture gallery, the user's name, and their bio.
 * @param {data: UserData} - An object containing user data.
 * The user data includes the user's
 * @returns 
 */
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