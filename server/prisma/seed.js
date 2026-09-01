const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || "admin@wololocrm.local";
  const password = process.env.SEED_ADMIN_PASSWORD || "admin1234";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Seed: user ${email} already exists, skipping.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      firstname: "Admin",
      lastname: "CRM",
      email,
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log(`Seed: created admin user ${email} / ${password}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
