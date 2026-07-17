import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { getAuth } = await import('@clerk/nextjs/server')
    const { userId: clerkId } = getAuth(request as any)

    const body = await request.json()

    let auteur = 'Anonyme'

    if (clerkId) {
      const user = await prisma.user.findUnique({
        where: { clerkId },
      })
      if (user) {
        auteur = `${user.prenom} ${user.nom}`.trim()
      }
    }

    const reponse = await prisma.reponse.create({
      data: {
        contenu: body.contenu,
        questionId: body.questionId,
        auteur,
      },
    })

    return NextResponse.json(reponse)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}