'use client'

import Button from "@/app/components/Button"
import TextInput from "@/app/components/TextInput"
import {H1} from "@/app/components/Headers"
import { authenticate } from "../actions"
import { useRouter } from 'next/navigation'


export default function Login() {
    const router = useRouter()
    
    const handleForm = async (formData: FormData) => {
        debugger
        const result = await authenticate(formData)

        if (result.success) {
            router.push('/edit', { scroll: false })
        }
    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <H1>Login</H1>
            <form action={handleForm}>
                <TextInput type="email" name="email" placeholder="Email" required />
                <TextInput type="password" name="password" placeholder="Password" required />
                <Button 
                    label="Login"
                />
            </form>
        </main>
    )

}