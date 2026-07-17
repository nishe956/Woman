import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const replays = await prisma.session.findMany({
      where: {
        replayUrl: { not: null },
      },
      orderBy: { date: 'desc' },
    })
    return NextResponse.json(replays)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const session = await prisma.session.update({
      where: { id: body.sessionId },
      data: { replayUrl: body.replayUrl },
    })
    return NextResponse.json(session)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
export async function DELETE(request: Request) {
  try {
    const body = await request.json()
    const session = await prisma.session.update({
      where: { id: body.sessionId },
      data: { replayUrl: null },
    })
    return NextResponse.json(session)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}