import bcrypt from 'bcrypt';
import prisma from './client';

async function main() {
  const username = 'admin';
  const email = 'orangegames16@gmail.com';

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });

  if (existing) {
    console.log('Admin already exists');
    return;
  }
const adminPass = process.env.ADMIN_PASSWORD!;

  const passwordHash = await bcrypt.hash(adminPass, 10);

  await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
      role: 'ADMIN',
      isEmailVerified: true, // مهم: خليه مفعل مباشرة
    },
  });

  console.log('Admin created ✅');
}

main().finally(() => prisma.$disconnect());
