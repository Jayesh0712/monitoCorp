'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootRedirect() {
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    const user = stored ? JSON.parse(stored) : null
  
    if (user?.username) {
      router.replace('/dashboard')
    } else {
      router.replace('/login')
    }
  }, [router])
  
  return null
}