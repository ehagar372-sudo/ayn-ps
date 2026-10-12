import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { analyticsSnapshots, incidents } from '@/lib/db/schema'
import { desc, sql } from 'drizzle-orm'
import { requireSession } from '@/lib/auth-guard'
export async function GET() { try { const session = await requireSession(); if (!session) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 }) const [trend, totals] = await Promise.all([db.select().from(analyticsSnapshots).orderBy(desc(analyticsSnapshots.metricDate)).limit(30), db.select({ total: sql<number>`count(*)`, ongoing: sql<number>`count(*) filter (where ${incidents.status} = 'ongoing')`, handled: sql<number>`count(*) filter (where ${incidents.status} = 'handled')`, filtered: sql<number>`count(*) filter (where ${incidents.status} = 'filtered')` }).from(incidents)]); return NextResponse.json({ trend, totals: totals[0] ?? { total: 0, ongoing: 0, handled: 0, filtered: 0 } }) } catch { return NextResponse.json({ error: 'تعذر تحميل التحليلات' }, { status: 500 }) } }
