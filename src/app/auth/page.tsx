'use client'

import { useEffect, useState } from 'react'
import AuthForm from '@/components/AuthForm'

export default function AuthPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#f8f2e9] text-blackish flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red mx-auto mb-4"></div>
          <p className="text-mid">Loading...</p>
        </div>
      </main>
    )
  }

  return <AuthForm />
}
