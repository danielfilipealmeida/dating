'use client'

import Button from "../components/Button"
import { logout } from "../actions"
import { useRouter } from "next/router"
import { useContext } from "react"
import AppDataContext from "../context/appData"

/*
type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
  }
*/

//export default function Page({params, searchParams} : Props) {
export default function Page() {
  //const {appData, setAppData} = useContext(AppDataContext)
  const router = useRouter()
    //console.log (params)
    //console.log(searchParams)
    const handleLogout = async () => {
      await logout()
      /*\
      .then(() => {
        router.push('/edit')
      })
      */
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">  
      <Button label={"Logout"} onClick={handleLogout}/>
    </main>
  )
}