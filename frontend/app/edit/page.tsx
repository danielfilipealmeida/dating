'use client'

import { useContext, useEffect, useState } from "react"
import AppDataContext from "../context/appData"
import Warning from "../components/Warning";
import TextInput from "../components/TextInput"
import { H1 } from "../components/Headers"
import TextArea from "../components/TextArea";
import { TextAreaField, TextField } from "../components/Fields";
import Button from "../components/Button";
import { getUserData } from "../actions";



export default function Edit() {
    const [error, setError] = useState<string|null>(null)
    const {appData, setAppData} = useContext(AppDataContext)
    const [data, setData] = useState({})
    const [isLoading, setLoading] = useState(true)
  
    useEffect(() => {
        getUserData(appData.currentUser).then((res) => {
            setData(res)
            setLoading(false)
        })
    }, [appData])
    
    
    const handleForm = async (formData: FormData) => {
        
    }

    if(isLoading) return <p>Loading...</p>

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <H1>Edit profile</H1>
       
        <form action={handleForm} className="w-full">
            {error && (
                <Warning>{error}</Warning>
            )}
        
            <TextField type="text" name="name" title="Name" value={data?.name} required />
            <TextAreaField name="bio" title="Bio" value={data?.bio} required />

            <Button label="Save profile data" /> 
        </form>
        </main>
    )
}