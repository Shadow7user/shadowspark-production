import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCourse() {
  try {
    const course = await prisma.course.create({
      data: {
        title: 'AI Prompting Mastery',
        slug: 'ai-prompting-mastery',
        description: 'Learn effective AI prompting techniques and best practices',
        price: 15000,
        currency: 'NGN',
        published: true,
      },
    });
    console.log('✅ Created course:', course.title);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedCourse();
