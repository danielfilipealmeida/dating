'use client'

import { useRouter } from "next/navigation"
import { logout } from "../actions"
import { useEffect } from "react"

export default function Logout() {
    const router = useRouter()
    //logout()
    
    //router.push("/")
    useEffect(() => {
        const performLogout = async () => {
            await logout()
            router.push('/')
        }
        performLogout()
    }, [router])

}