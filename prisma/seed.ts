import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.admin.upsert({
    where: { email: 'gavinarori@gmail.com' },
    update: {},
    create: {
      email: 'gavinarori@gmail.com',
      password: 'g123456',
    },
  });
  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });