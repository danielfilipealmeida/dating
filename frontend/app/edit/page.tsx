'use client'

import { useContext, useState } from "react"
import AppDataContext from "../context/appData"
import Warning from "../components/Warning";
import TextInput from "../components/TextInput"
import { H1 } from "../components/Headers"
import TextArea from "../components/TextArea";
import { TextAreaField, TextField } from "../components/Fields";
import Button from "../components/Button";

export default function Edit() {
    const [error, setError] = useState<string|null>(null)
    const {appData, setAppData} = useContext(AppDataContext)
    console.log(appData)

    const handleForm = async (formData: FormData) => {
        
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <H1>Edit profile</H1>
       
        <form action={handleForm} className="w-full">
            {error && (
                <Warning>{error}</Warning>
            )}
        
            <TextField type="text" name="name" title="Name" value="" required />
            <TextAreaField name="bio" title="Bio" value="" required />

            <Button label="Save profile data" /> 
        </form>
        </main>
    )
}