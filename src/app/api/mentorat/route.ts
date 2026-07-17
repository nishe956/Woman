import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { getAuth } = await import('@clerk/nextjs/server')
    const { userId: clerkId } = getAuth(request as any)

    if (!clerkId) {
      return NextResponse.json({ error: 'Non connecte' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    const mentorals = await prisma.mentorat.findMany({
      where: {
        OR: [
          { mentorId: user.id },
          { menteeId: user.id },
        ],
      },
      include: {
        mentor: true,
        mentee: true,
      },
    })

    const tousLesUsers = await prisma.user.findMany({
      where: {
        id: { not: user.id },
      },
    })

    return NextResponse.json({ user, mentorals, tousLesUsers })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
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

    const existing = await prisma.mentorat.findFirst({
      where: {
        mentorId: body.mentorId,
        menteeId: user.id,
      },
    })

    if (existing) {
      return NextResponse.json({ message: 'Demande deja envoyee' })
    }

    const mentorat = await prisma.mentorat.create({
      data: {
        mentorId: body.mentorId,
        menteeId: user.id,
      },
      include: {
        mentor: true,
        mentee: true,
      },
    })

    return NextResponse.json(mentorat)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()

    const mentorat = await prisma.mentorat.update({
      where: { id: body.mentoratId },
      data: { statut: body.statut },
    })

    return NextResponse.json(mentorat)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}