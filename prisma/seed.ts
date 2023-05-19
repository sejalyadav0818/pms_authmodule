import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  const plainPassword = 'admin@123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10); // Hash the password with salt rounds of 10

  await prisma.user.create({
    data: {
      name: 'admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      googleid: null,
      hashedRt: null,
      isadmin: true,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
