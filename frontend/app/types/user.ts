export interface UserPicture {
    path: string
    id?: string | null;
}

export interface UserData {
    id: string,
    name: string,
    sex: string,
    bio: string,
    pictures: Array<UserPicture>
}  


