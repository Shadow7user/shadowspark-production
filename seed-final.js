const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Starting database seed...');
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const admin = await prisma.user.upsert({
      where: { email: 'admin@shadowspark.test' },
      update: {},
      create: {
        email: 'admin@shadowspark.test',
        name: 'ShadowSpark Admin',
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });

    console.log('Admin user created:', admin.email);
    console.log('Password: admin123');

    const course = await prisma.course.create({
      data: {
        slug: 'ai-prompting-mastery',
        title: 'AI Prompting Mastery',
        description: 'Master ChatGPT, Claude, and Midjourney for business automation.',
        category: 'AI_PROMPTING',
        level: 'BEGINNER',
        price: 15000,
        currency: 'NGN',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
        published: true,
        studentCount: 0,
      },
    });

    console.log('Sample course created:', course.title);
  } catch (error) {
    console.error('Seed error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
