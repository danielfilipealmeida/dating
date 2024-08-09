'use client'

import { useContext, useEffect, useState } from "react"
import AppDataContext from "../context/appData"
import Warning from "../components/Warning";
import TextInput from "../components/TextInput"
import { H1 } from "../components/Headers"
import TextArea from "../components/TextArea";
import { TextAreaField, TextField } from "../components/Fields";
import Button from "../components/Button";
import { getUserData, updateUserData } from "../actions";
import SubmitButton from "../components/SubmitButton";
import Message from "../components/Message";



export default function Edit() {
    const [error, setError] = useState<string|null>(null)
    const {appData, setAppData} = useContext(AppDataContext)
    const [data, setData] = useState({})
    const [isLoading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState("")
  
    useEffect(() => {
        setError(null)
        getUserData(appData.currentUser).then((res) => {
            setData(res)
            setLoading(false)
        })
    }, [appData])
    
    
    const handleForm = async (formData: FormData) => {
        setSubmitting(true)
        
        try {
            formData.set('id', appData.currentUser)
            updateUserData(formData).then((result)=>{
                if (result.error) {
                    throw new Error(result.error)
                }
                setData(result)
                setMessage("User data updated!")
            }).catch(reason => {
                setError(reason.message)
            })
        }
        catch(err) {
            setError(err.message)
        }

        setSubmitting(false)
    }

    if(isLoading) return <p>Loading...</p>

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <H1>Edit profile</H1>
        {message && (
            <Message>{message}</Message>
        )}
       
        <form action={handleForm} className="w-full">
            {error && (
                <Warning>{error}</Warning>
            )}
        
            <TextField type="text" name="name" title="Name" value={data?.name} required />
            <TextAreaField name="bio" title="Bio" value={data?.bio} required />

            <SubmitButton label="Save profile data" disabled={submitting} /> 
        </form>
        </main>
    )
}