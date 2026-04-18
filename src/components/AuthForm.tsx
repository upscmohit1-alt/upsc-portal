'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signUp, signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName)
        if (error) {
          setError(error)
        } else {
          setError('Account created. Check your email for confirmation.')
        }
      } else {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error)
        } else {
          router.push('/')
        }
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f2e9] text-blackish">
      <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col justify-center px-6 py-12 md:px-12">
        <div className="grid gap-8 rounded-[2rem] border border-borderTone/80 bg-white/90 p-8 shadow-xl shadow-black/5 md:grid-cols-[1.3fr_1fr] lg:p-12">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-red/20 bg-red/10 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-red">
              {isSignUp ? 'Create account' : 'Student Login'}
            </div>
            <div className="space-y-4">
              <h1 className="max-w-lg font-serif text-4xl font-bold leading-tight text-blackish">
                {isSignUp ? 'Get started with UPSC preparation' : 'Welcome back to your UPSC study dashboard'}
              </h1>
              <p className="max-w-xl text-sm leading-7 text-mid">
                {isSignUp
                  ? 'Enroll free, save your progress, and practice MCQs tailored for the Civil Services exam.'
                  : 'Sign in to continue your daily current affairs review, MCQ practice, and progress tracking.'}
              </p>
            </div>

            <div className="grid gap-3 text-sm text-blackish/70">
              <div className="rounded-3xl border border-borderTone/80 bg-[#f8f2e9] p-4">
                <p className="font-semibold">Student profile</p>
                <p className="mt-1 text-xs text-mid">Use your email and name to store progress securely in Supabase.</p>
              </div>
              <div className="rounded-3xl border border-borderTone/80 bg-[#f8f2e9] p-4">
                <p className="font-semibold">Secure auth</p>
                <p className="mt-1 text-xs text-mid">Authentication is backed by Supabase and saved in a dedicated profile table.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-borderTone/80 bg-[#f7f1e8]/90 p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold text-blackish">{isSignUp ? 'Create your account' : 'Sign in to continue'}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-blackish">Full name</span>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-3xl border border-borderTone bg-white px-4 py-3 text-sm text-blackish outline-none transition focus:border-blackish focus:ring-2 focus:ring-blackish/10"
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-blackish">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full rounded-3xl border border-borderTone bg-white px-4 py-3 text-sm text-blackish outline-none transition focus:border-blackish focus:ring-2 focus:ring-blackish/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-blackish">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Enter password"
                  className="w-full rounded-3xl border border-borderTone bg-white px-4 py-3 text-sm text-blackish outline-none transition focus:border-blackish focus:ring-2 focus:ring-blackish/10"
                />
              </label>

              {error ? (
                <div className="rounded-3xl border border-red/20 bg-red/5 px-4 py-3 text-sm text-red">
                  {error}
                </div>
              ) : null}

              <Button type="submit" className="w-full rounded-3xl px-6 py-3 text-base font-semibold">
                {loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Log in'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-mid">
              <button
                type="button"
                onClick={() => setIsSignUp((current) => !current)}
                className="font-semibold text-blackish underline-offset-4 hover:text-blackish/80"
              >
                {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Enroll free'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}