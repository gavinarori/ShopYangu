import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    

    const user = await prisma.admin.create({
      data: {
        email,
        password,
      },
    })

    return NextResponse.json({ user: { id: user.id, email: user.email, } })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

