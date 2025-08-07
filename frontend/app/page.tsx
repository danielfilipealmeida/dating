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

  const message = [
   "This is the frontend of the dating site project, built using Next.js.",
   "The frontend includes various pages and components for user interaction, allowing users to sign up, log in, edit profiles, view other profiles, vote on potential matches, and see their matches.",
   "You'll need an account to be able to enter the site. Use the link below for that",
   "After your account is created, you'll be able to login and vote on profiles matching your preferences"
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">  
      <H1 className="t-24">Dating Site</H1>
      <div className="bg-orange-600 text-white px-4 py-3 text-md font-normal w-1/2">
      {message.map((line, index) => (
        <p key={index} className="m-2">{line}</p>
      ))}
      </div>
      <div>
        <Button label="Signup" onClick={handleGotoSignup} />
        <Button label="Login" onClick={handleGotoLogin} />
      </div>
    </main>
  );
}
