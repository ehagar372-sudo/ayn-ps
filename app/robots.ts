import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/report'],
        disallow: ['/supervisor', '/api/', '/sign-in', '/sign-up'],
      },
    ],
  }
}
