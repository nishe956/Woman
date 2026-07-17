import { prisma } from '@/lib/prisma'
import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const clerkUser = await currentUser()
    if (!clerkUser) {
      return NextResponse.json({ error: 'Non connecte' }, { status: 401 })
    }

    const existing = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    })

    if (existing) return NextResponse.json(existing)

    const user = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        nom: clerkUser.lastName || '',
        prenom: clerkUser.firstName || '',
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}