import { prisma } from '@/lib/db'

export async function createAdmin(email: string, password: string) {
  return prisma.admin.create({
    data: {
      email,
      password,
    },
  })
}

export async function getAdminByEmail(email: string) {
  return prisma.admin.findUnique({
    where: { email },
  })
}

export async function updateAdminPassword(id: string, newPassword: string) {
  return prisma.admin.update({
    where: { id },
    data: { password: newPassword },
  })
}

