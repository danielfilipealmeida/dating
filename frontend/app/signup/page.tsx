'use client'

import Button from "@/app/components/Button"
import TextInput from "@/app/components/TextInput"
import { H1 } from "@/app/components/Headers"
import { useContext, useState } from "react";
import invariant from "tiny-invariant";
import { gql } from "@apollo/client";
import client from "@/app/lib/apolloClient";
import { useRouter } from "next/navigation";
import Warning from "../components/Warning";
import AppDataContext from "../context/appData";
import { signUp } from "../actions";
import Select from "../components/Select";
import { SelectField, TextField } from "../components/Fields";


export default function SignUp() {    
    const [error, setError] = useState<string|null>(null)
    const {appData, setAppData} = useContext(AppDataContext)
    const router = useRouter()

    const handleForm = async (formData: FormData) => {
        try {
            invariant(formData.get('password') == formData.get('password2'), "Passwords need to be the same.")
        
            const data = await signUp(formData)

            if (data.error) {
                setError(data.message)
                return
            }
            
            const newUserId = data['signupUser']['id']
            
            setAppData({
                userId: newUserId,
                loggedIn: true,
                ...data
            })
            
            router.push('/edit')
        }
        catch (err: any) {
            setError(err.message)
            console.log(err)
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <H1>Sign up</H1>
            <form action={handleForm}>
                {error && (
                    <Warning>{error}</Warning>
                )}
               
                <TextField type="email" name="email" title="Email" required />
                <SelectField 
                    title="Sex"
                    name="sex"
                    value="MALE"
                    options={{
                        "MALE": "Male",
                        "FEMALE": "Female"
                    }}
                />
                <TextField type="password" name="password" title="Password" required />
                <TextField type="password" name="password2" title="Repeat Password" required />
                <Button label="Sign up" />
            </form>
        </main>
    )
}