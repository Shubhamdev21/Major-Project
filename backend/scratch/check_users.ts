import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.user.count();
  const users = await prisma.user.findMany({ select: { email: true, name: true } });
  console.log(`Total users: ${count}`);
  console.log('Users:', JSON.stringify(users, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
