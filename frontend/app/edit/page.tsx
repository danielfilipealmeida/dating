'use client'

import { useContext, useEffect, useState } from "react"
import AppDataContext from "../context/appData"
import Warning from "../components/Warning";
import TextInput from "../components/TextInput"
import { H1 } from "../components/Headers"
import TextArea from "../components/TextArea";
import { SelectField, TextAreaField, TextField } from "../components/Fields";
import Button from "../components/Button";
import { getUserData, updateUserData } from "../actions";
import SubmitButton from "../components/SubmitButton";
import Message from "../components/Message";
import Section from "../components/Section";



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
        setError(null)
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
        
            <Section title="User Information">
                <TextField type="text" name="name" title="Name" value={data?.name} required />
                <TextAreaField name="bio" title="Bio" value={data?.bio} required />
            </Section>

            <Section title="Search Preferences">
                <SelectField 
                        title="Sex"
                        name="preferences.sex"
                        value={data?.preferences.sex}
                        multiple={true}
                        options={{
                            "MALE": "Male",
                            "FEMALE": "Female"
                        }}
                    />
                <TextField 
                    name="preferences.distance" 
                    title={"Distance"} 
                    required={false} 
                    type={"range"} 
                    min="0" 
                    max="250"   
                    value={data?.preferences?.distance}
                />      
            </Section>

            <br />

            <SubmitButton label="Save profile data" disabled={submitting} /> 
        </form>
        </main>
    )
}