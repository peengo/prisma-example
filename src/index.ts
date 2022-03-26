import { PrismaClient, User, Post } from '@prisma/client';

const prisma: PrismaClient = new PrismaClient();

const main = async (): Promise<void> => {
  const alice: User | null = await prisma.user.findFirst({
    where: { name: 'Alice' }
  });

  const aliceExists: boolean = alice !== null;

  if (!aliceExists) {
    await prisma.user.create({
      data: {
        name: 'Alice',
        email: 'alice@prisma.io',
        posts: {
          create: {
            title: 'Hello World'
          }
        }
      }
    });
  }

  const allUsers: User[] = await prisma.user.findMany();
  const allPosts: Post[] = await prisma.post.findMany();

  console.log('allUsers', allUsers);
  console.log('allPosts', allPosts);

  // type PostWithAuthor = Post & { author: User };

  interface PostWithAuthor extends Post {
    author: User;
  }

  const posts: PostWithAuthor[] = await prisma.post.findMany({
    where: {
      title: {
        contains: 'Hello World'
      }
    },
    include: {
      author: true
    }
  });

  console.log('posts', posts);
};

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
