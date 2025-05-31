const { PrismaClient } = require('../backend/src/generated/prisma');
const prisma = new PrismaClient();

async function main() {
  await prisma.relatable.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const users = await prisma.user.createMany({
    data: [
      { email: 'alice@example.com', password: 'pass1' },
      { email: 'bob@example.com', password: 'pass2' },
      { email: 'carol@example.com', password: 'pass3' },
      { email: 'dave@example.com', password: 'pass4' },
    ]
  });

  const allUsers = await prisma.user.findMany();
  const categories = [
    'Love', 'Family', 'Friends', 'School', 'Work', 'Money', 'Health', 'Society', 'Internet', 'Loss', 'Self', 'Other'
  ];

  let posts = [];
  for (let i = 0; i < categories.length; i++) {
    for (let j = 0; j < 3; j++) {
      const user = allUsers[(i + j) % allUsers.length];
      const post = await prisma.post.create({
        data: {
          title: `${categories[i]} post ${j+1}`,
          description: `Description for ${categories[i]} post ${j+1}`,
          category: categories[i],
          authorId: user.id
        }
      });
      posts.push(post);
    }
  }
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
}

main();
