'use client'

import Button from "../components/Button"
import { getUserData, logout } from "../actions"
import { useContext, useEffect, useState } from "react"
import AppDataContext from "../context/appData"
import Profile from "../components/Profile"
import Warning from "../components/Warning"
import { AppDataContextType  } from "../types/context";


/**
 * This is the profile page of the dating site application.
 * It retrieves the user's profile data and displays it.
 * The user can also log out from this page.
 * @returns A page that displays the user's profile and allows them to log out.
 */
export default function Page() {
  const {appData, setAppData} = useContext(AppDataContext) as AppDataContextType
  const [data, setData] = useState({})
  const [error, setError] = useState<string|null>(null)
  const [isLoading, setLoading] = useState(true)
      
  const handleLogout = async () => {
    await logout()
  }

  useEffect(() => {
    setError(null)
    
    getUserData(appData.currentUser, appData.token).then((res) => {
      console.log(res)
        setData(res)
        setLoading(false)
    })
    .catch(err => {
      setError(err.message || "An error occurred while fetching user data.")
    })
}, [appData])
  
if(isLoading) return <p>Loading...</p>

return (
  <main className="flex min-h-screen flex-col items-center justify-between p-24">  
    {error && (
        <Warning>{error}</Warning>
    )}
    <Profile data={data}/>
    <Button label={"Logout"} onClick={handleLogout}/>
  </main>
  )
}