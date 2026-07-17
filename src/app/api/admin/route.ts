import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { getAuth } = await import('@clerk/nextjs/server')
    const { userId: clerkId } = getAuth(request as any)

    if (!clerkId) {
      return NextResponse.json({ error: 'Non connecte' }, { status: 401 })
    }

    const currentUser = await prisma.user.findUnique({
      where: { clerkId },
    })

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acces refuse' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
      include: {
        inscriptions: { include: { session: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const sessions = await prisma.session.findMany({
      include: { inscriptions: true },
      orderBy: { date: 'desc' },
    })

    const questions = await prisma.question.findMany({
      include: { reponses: true },
    })

    const mentorals = await prisma.mentorat.findMany({
      include: { mentor: true, mentee: true },
    })

    return NextResponse.json({
      stats: {
        totalUsers: users.length,
        totalSessions: sessions.length,
        totalQuestions: questions.length,
        totalMentorals: mentorals.filter(m => m.statut === 'ACCEPTE').length,
      },
      users,
      sessions,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}