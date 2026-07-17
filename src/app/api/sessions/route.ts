import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { date: 'asc' },
    })
    return NextResponse.json(sessions)
  } catch (error) {
    console.error('ERREUR GET SESSIONS:', error)
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const session = await prisma.session.create({
      data: {
        titre: body.titre,
        description: body.description,
        date: new Date(body.date),
        duree: body.duree,
        intervenante: body.intervenante,
      },
    })
    return NextResponse.json(session)
  } catch (error) {
    console.error('ERREUR POST SESSIONS:', error)
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}