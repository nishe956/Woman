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
      include: {
        inscriptions: {
          include: {
            session: true,
          },
        },
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { getAuth } = await import('@clerk/nextjs/server')
    const { userId: clerkId } = getAuth(request as any)

    if (!clerkId) {
      return NextResponse.json({ error: 'Non connecte' }, { status: 401 })
    }

    const body = await request.json()

    const user = await prisma.user.update({
      where: { clerkId },
      data: { bio: body.bio },
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}