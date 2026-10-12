import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { incidents } from '@/lib/db/schema'
import { z } from 'zod'

const eventSchema = z.object({ id: z.string().min(1), cameraId: z.string().optional(), type: z.enum(['fight', 'traffic', 'fall', 'suspicious']), severity: z.enum(['police', 'medical', 'suspicious', 'resolved']), agency: z.enum(['interior', 'ambulance']), title: z.string().min(3), location: z.string().min(1), confidence: z.number().int().min(0).max(100), metadata: z.record(z.string(), z.unknown()).default({}) })
export async function POST(request: Request) { try { const event = eventSchema.parse(await request.json()); const [row] = await db.insert(incidents).values({ ...event, status: event.confidence < 70 ? 'filtered' : 'ongoing' }).onConflictDoUpdate({ target: incidents.id, set: { confidence: event.confidence, metadata: event.metadata, updatedAt: new Date() } }).returning(); return NextResponse.json(row, { status: 202 }) } catch (error) { return NextResponse.json({ error: error instanceof z.ZodError ? 'حدث AI غير صالح' : 'تعذر تسجيل الحدث' }, { status: error instanceof z.ZodError ? 400 : 500 }) } }
