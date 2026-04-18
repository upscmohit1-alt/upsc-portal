'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = ['Home', 'GS Notes', 'Current Affairs', 'MCQ Practice', 'PYQ', 'Test Series', 'Books & PDFs']

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [signOut, setSignOut] = useState(() => () => {})
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Only access useAuth after mounting to avoid prerendering issues
    const auth = useAuth()
    setUser(auth.user)
    setProfile(auth.profile)
    setSignOut(() => auth.signOut)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth')
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email

  if (!mounted) {
    // Render a loading state or simplified navbar during prerendering
    return (
      <header className="sticky top-0 z-50 border-b-[3px] border-blackish/90 bg-[#f7f1e8]/90 backdrop-blur-md">
        <div className="mx-auto flex h-[62px] max-w-[1200px] items-center px-6">
          <div className="mr-6 border-r border-borderTone pr-7">
            <div className="font-serif text-xl font-bold leading-none text-blackish">
              Crash Course <em className="not-italic text-red">Civil Services</em>
            </div>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">UPSC IAS Preparation</p>
          </div>

          <nav className="flex flex-1 items-center gap-1">
            {links.map((link, index) => (
              <a
                key={link}
                href="#"
                className={`rounded-sm px-3 py-1.5 text-[13px] font-medium ${
                  index === 0 ? 'text-red' : 'text-mid hover:bg-bg2 hover:text-blackish'
                }`}
              >
                {link}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2.5">
            <button className="p-1.5 text-mid hover:text-blackish" aria-label="Search">
              <Search className="h-4 w-4" />
            </button>
            <Button
              type="button"
              variant="outline"
              className="h-8 px-3.5 text-[13px] font-medium"
              onClick={() => window.location.href = '/auth'}
            >
              Log in
            </Button>
            <Button
              type="button"
              className="h-8 bg-red px-4 text-[13px] hover:bg-[#a0302a]"
              onClick={() => window.location.href = '/auth'}
            >
              Enroll Free →
            </Button>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-blackish/90 bg-[#f7f1e8]/90 backdrop-blur-md">
      <div className="mx-auto flex h-[62px] max-w-[1200px] items-center px-6">
        <div className="mr-6 border-r border-borderTone pr-7">
          <div className="font-serif text-xl font-bold leading-none text-blackish">
            Crash Course <em className="not-italic text-red">Civil Services</em>
          </div>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">UPSC IAS Preparation</p>
        </div>

        <nav className="flex flex-1 items-center gap-1">
          {links.map((link, index) => (
            <a
              key={link}
              href="#"
              className={`rounded-sm px-3 py-1.5 text-[13px] font-medium ${
                index === 0 ? 'text-red' : 'text-mid hover:bg-bg2 hover:text-blackish'
              }`}
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <button className="p-1.5 text-mid hover:text-blackish" aria-label="Search">
            <Search className="h-4 w-4" />
          </button>
          {user ? (
            <div className="flex items-center gap-2.5">
              <span className="text-[13px] text-mid">Welcome, {displayName}</span>
              <Button
                variant="outline"
                className="h-8 px-3.5 text-[13px] font-medium"
                onClick={handleSignOut}
              >
                Sign out
              </Button>
            </div>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                className="h-8 px-3.5 text-[13px] font-medium"
                onClick={() => router.push('/auth')}
              >
                Log in
              </Button>
              <Button
                type="button"
                className="h-8 bg-red px-4 text-[13px] hover:bg-[#a0302a]"
                onClick={() => router.push('/auth')}
              >
                Enroll Free →
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
