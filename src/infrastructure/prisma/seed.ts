import bcrypt from "bcrypt";
import prisma from "./client"; // أو المسار الصحيح للـ prisma client عندك

async function main() {
  const username = "admin";
  const email = "orangegames16@gmail.com";

  const adminPass = process.env.ADMIN_PASSWORD;
  if (!adminPass) {
    throw new Error("ADMIN_PASSWORD is missing in environment variables");
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });

  if (existing) {
    console.log("Admin already exists");
    return;
  }

  const passwordHash = await bcrypt.hash(adminPass, 10);

  await prisma.user.create({
    data: {
      username,
      email,
      passwordHash,
      role: "ADMIN",
      isEmailVerified: true,
    },
  });

  console.log("Admin created ✅");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
