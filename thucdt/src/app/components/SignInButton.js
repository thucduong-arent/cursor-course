'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SignInButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User avatar'}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <span className="text-sm font-medium">{session.user?.name}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => signOut()}>
          Sign Out
        </Button>
        <Link href="/dashboards">
          <Button size="sm">Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => signIn('google')}>
        Sign In
      </Button>
      <Link href="/auth/signin">
        <Button size="sm">Sign Up</Button>
      </Link>
    </>
  )
} 