import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { getAuth } = await import('@clerk/nextjs/server')
    const { userId: clerkId } = getAuth(request as any)

    if (!clerkId) {
      return NextResponse.json({ error: 'Non connecte' }, { status: 401 })
    }

    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId manquant' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    const existing = await prisma.inscription.findUnique({
      where: {
        userId_sessionId: {
          userId: user.id,
          sessionId,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ message: 'Deja inscrite' })
    }

    const inscription = await prisma.inscription.create({
      data: {
        userId: user.id,
        sessionId,
      },
    })

    return NextResponse.json(inscription)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}