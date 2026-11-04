import { desc, gte } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth-guard'
import { db } from '@/lib/db'
import { incidents } from '@/lib/db/schema'
import { AGENCY_LABEL, INCIDENT_TYPE_LABEL, LOG_STATUS_LABEL } from '@/lib/surveillance-data'

const MAX_ROWS = 5000
const lookup = (map: Record<string, string>, key: string) => map[key] ?? key

// Quote every cell and neutralise spreadsheet formulas (=, +, -, @).
function cell(value: unknown) {
  let text = value == null ? '' : String(value)
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return `"${text.replace(/"/g, '""')}"`
}

export async function GET(request: Request) {
  if (!(await requireSession())) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  try {
    const range = new URL(request.url).searchParams.get('range')
    const days = range === '7' ? 7 : range === '30' ? 30 : null
    const rows = await db
      .select()
      .from(incidents)
      .where(days ? gte(incidents.occurredAt, new Date(Date.now() - days * 86_400_000)) : undefined)
      .orderBy(desc(incidents.occurredAt))
      .limit(MAX_ROWS)

    const header = ['الرقم', 'النوع', 'العنوان', 'الموقع', 'الجهة', 'الخطورة', 'الحالة', 'نسبة التأكد', 'الوقت', 'المصدر', 'الوصف']
    const lines = rows.map((r) => {
      const meta = (r.metadata ?? {}) as Record<string, unknown>
      return [
        r.id,
        lookup(INCIDENT_TYPE_LABEL, r.type),
        r.title,
        r.location,
        lookup(AGENCY_LABEL, r.agency),
        r.severity,
        lookup(LOG_STATUS_LABEL, r.status),
        r.confidence,
        r.occurredAt.toISOString(),
        meta.source === 'citizen-report' ? 'مواطن' : 'النظام',
        typeof meta.description === 'string' ? meta.description : '',
      ]
        .map(cell)
        .join(',')
    })

    const csv = '﻿' + [header.map(cell).join(','), ...lines].join('\r\n')
    const stamp = new Date().toISOString().slice(0, 10)
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="incident-report-${stamp}.csv"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return NextResponse.json({ error: 'تعذر تصدير التقرير' }, { status: 500 })
  }
}
