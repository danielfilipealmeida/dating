'use client'

import { H1 } from "./components/Headers";
import Button from "./components/Button";
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const handleGotoLogin = () => {
    router.push('/login')
  }
  
  const handleGotoSignup = () => {
    router.push('/signup')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">  
      <H1>Dating Site</H1>
      <div className="bg-orange-600 text-white px-4 py-3 text-md font-normal w-1/2">
        <p className="m-2">This is the frontend of the dating site project, built using Next.js.</p>
        <p className="m-2">The frontend includes various pages and components for user interaction, allowing users to sign up, log in, edit profiles, view other profiles, vote on potential matches, and see their matches.</p>   
        <p className="m-2">You'll need an account to be able to enter the site. Use the link below for that</p>
        <p className="m-2">After your account is created, you'll be able to login and vote on profiles matching your preferences</p>
      </div>

      <div>
        <Button label="Signup" onClick={handleGotoSignup} />
        <Button label="Login" onClick={handleGotoLogin} />
      </div>
      
      
    </main>
  );
}
