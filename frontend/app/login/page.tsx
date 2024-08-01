import { authenticate } from "@/app/lib/actions"
import Button from "@/app/components/Button"
import TextInput from "@/app/components/TextInput"
import {H1} from "@/app/components/Headers"

export default function Login() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <H1>Login</H1>
            <form action={authenticate}>
                <TextInput type="email" name="email" placeholder="Email" required />
                <TextInput type="password" name="password" placeholder="Password" required />
                <Button 
                    label="Login"
                />
            </form>
        </main>
    )

}