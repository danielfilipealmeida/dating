'use client'

import Button from "../components/Button"
import { getUserData, logout } from "../actions"
import { useContext, useEffect, useState } from "react"
import AppDataContext from "../context/appData"
import Profile from "../components/Profile"


export default function Page() {
  const {appData, setAppData} = useContext(AppDataContext)
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
      
      setError(error)
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

  </main>)
}