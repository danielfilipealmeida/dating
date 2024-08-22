'use client'

import { useRouter } from "next/navigation"
import { logout } from "../actions"

export default function Logout() {
    const router = useRouter()
    logout()
    router.push("/")
}