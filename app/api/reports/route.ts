import { randomBytes } from 'node:crypto'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { incidents } from '@/lib/db/schema'

/**
 * Public endpoint for citizen reports (no account required).
 * Reports are stored in `incidents` with metadata.source = 'citizen-report'
 * and confidence 0, because no AI model produced them.
 */

const CATEGORY = {
  traffic: { type: 'traffic', severity: 'police', agency: 'interior', title: 'بلاغ مواطن: حادث مروري' },
  emergency: { type: 'fall', severity: 'medical', agency: 'ambulance', title: 'بلاغ مواطن: حالة طارئة' },
  suspicious: { type: 'suspicious', severity: 'suspicious', agency: 'interior', title: 'بلاغ مواطن: سلوك مشبوه' },
  infrastructure: { type: 'suspicious', severity: 'suspicious', agency: 'interior', title: 'بلاغ مواطن: مشكلة في البنية التحتية' },
} as const

const reportSchema = z.object({
  type: z.enum(['traffic', 'emergency', 'suspicious', 'infrastructure']),
  location: z.string().trim().min(2).max(160),
  description: z.string().trim().min(10).max(1500),
  contact: z.string().trim().max(120).optional().default(''),
  // Honeypot: real users never see or fill this field.
  website: z.string().max(200).optional().default(''),
})

// Best-effort rate limit. Memory is per server instance, so this slows abuse
// but is not a substitute for a shared limiter (e.g. Vercel WAF / Upstash).
const WINDOW_MS = 10 * 60 * 1000
const MAX_REPORTS_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function rateLimited(key: string) {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_REPORTS_PER_WINDOW) {
    hits.set(key, recent)
    return true
  }
  recent.push(now)
  hits.set(key, recent)

  if (hits.size > 500) {
    for (const [k, list] of hits) {
      if (list.every((t) => now - t >= WINDOW_MS)) hits.delete(k)
    }
  }
  return false
}

function clientKey(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}

export async function POST(request: Request) {
  try {
    if (rateLimited(clientKey(request))) {
      return NextResponse.json({ error: 'تم تجاوز عدد البلاغات المسموح به. حاول بعد قليل.' }, { status: 429 })
    }

    const input = reportSchema.parse(await request.json())
    const reference = `AIN-${randomBytes(4).toString('hex').toUpperCase()}`

    // Bots filling the hidden field get a normal-looking answer, nothing is stored.
    if (input.website) return NextResponse.json({ reference }, { status: 201 })

    const category = CATEGORY[input.type]
    await db.insert(incidents).values({
      id: reference,
      type: category.type,
      severity: category.severity,
      agency: category.agency,
      title: category.title,
      location: input.location,
      status: 'ongoing',
      confidence: 0,
      metadata: {
        source: 'citizen-report',
        category: input.type,
        description: input.description,
        contact: input.contact || null,
      },
    })

    return NextResponse.json({ reference }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError) {
      return NextResponse.json({ error: 'بيانات البلاغ غير مكتملة أو غير صالحة.' }, { status: 400 })
    }
    return NextResponse.json({ error: 'تعذر إرسال البلاغ الآن. حاول مرة أخرى.' }, { status: 500 })
  }
}
