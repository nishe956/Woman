import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      include: { reponses: true },
    })
    return NextResponse.json(questions)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { getAuth } = await import('@clerk/nextjs/server')
    const { userId: clerkId } = getAuth(request as any)

    if (!clerkId) {
      return NextResponse.json({ error: 'Non connecte' }, { status: 401 })
    }

    const body = await request.json()

    const user = await prisma.user.findUnique({
      where: { clerkId },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    const question = await prisma.question.create({
      data: {
        contenu: body.contenu,
        userId: user.id,
      },
      include: { reponses: true },
    })

    return NextResponse.json(question)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}