import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function requireSession() {
  if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET) return null

  try {
    const session = await auth.api.getSession({ headers: await headers() })
    return session?.user ? session : null
  } catch {
    // The preview should remain usable when its optional auth database is unavailable.
    return null
  }
}
