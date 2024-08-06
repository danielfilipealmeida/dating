import { Prisma, PrismaClient } from '@prisma/client'
import { hashString } from '../src/lib'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    bio: 'a data scientist who loves hiking and photography. Always seeking new challenges in AI and machine learning',
    latitude: 37.0179137,
    longitude: -7.9873126,
    password: "pass123"
  },
  {
    name: 'Emma',
    email: 'emma@prisma.io',
    bio: 'a talented graphic designer passionate about minimalist art. Enjoys baking and exploring new coffee shops.',
    latitude: 37.1162609,
    longitude: -8.0889362,
    password: "some_random_pass"
  },
  {
    name: 'Liam',
    email: 'liam@email.pt',
    bio: 'a software engineer and avid gamer. Dedicated to creating immersive VR experiences and loves sci-fi movies.',
    latitude: 38.7441844,
    longitude: -9.2421369,
    password: "mypass"
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        bio: u.bio,
        password: hashString(u.password)
      },
    })
    console.log(`Created user with id: ${user.id}`)

    await prisma.$executeRaw`UPDATE "User" SET coords=ST_SetSRID(ST_MakePoint(${u.longitude}, ${u.latitude}), 4326) WHERE id = ${user.id}::int`
    console.log(`Set coordinates for user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
