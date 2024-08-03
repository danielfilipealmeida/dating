'use client'

import Button from "@/app/components/Button"
import TextInput from "@/app/components/TextInput"
import { H1 } from "@/app/components/Headers"
import { useContext, useState } from "react";
import invariant from "tiny-invariant";
import { gql } from "@apollo/client";
import client from "@/app/lib/apolloClient";
//import { LoggedIn } from "@/stories/Header.stories";
//import { useRouter } from "next/router";
import Warning from "../components/Warning";
import AppDataContext from "../context/appData";


export default function SignUp() {    
    const [error, setError] = useState<string|null>(null)
    const [data, setData] = useContext(AppDataContext)

    console.log(data)

    //const [appData, setAppData] = useAppDataContext()
    //const router = useRouter()


    const handleForm = async (formData: FormData) => {
        try {
            invariant(formData.get('password') == formData.get('password2'), "Passwords need to be the same.")

            const { data } = await client.mutate({
                mutation: gql`mutation SignupUser($data: UserCreateInput!) {
                    signupUser(data: $data) {
                        id
                    }
                }`,
                variables: {
                    data: {
                        email: formData.get('email'),
                        password: formData.get('password')
                    }
                }        
            })
            
            const newUserId = data['signupUser']['id']
            
            setData({
                userId: newUserId,
                loggedIn: true,
                ...data
            })
            /*
            router.push('/edit')
            */
        }
        catch (err: any) {
            setError(err.message)
            console.log(error)
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <H1>Sign up</H1>
            <form action={handleForm}>
                {error && (
                    <Warning>{error}</Warning>
                )}
               
                <TextInput type="email" name="email" placeholder="Email" required />
                <TextInput type="password" name="password" placeholder="Password" required />
                <TextInput type="password" name="password2" placeholder="Repeat Password" required />
                <Button label="Sign up" />
            </form>
        </main>
    )
}