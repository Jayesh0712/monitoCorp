'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const router = useRouter()
  

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) router.replace('/dashboard');
  }, [router]);

  return null;
}