import { debug } from "console"

type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
  }

export default function Page({params, searchParams} : Props) {
    console.log (params)
    console.log(searchParams)
    return <h1>Profile</h1>
}