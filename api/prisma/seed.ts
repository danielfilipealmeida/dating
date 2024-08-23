import { Prisma, PrismaClient } from '@prisma/client'
import { createUserFolderIfNeeded, getFileLocalPath, hashString } from '../src/lib'
const fs = require('node:fs');
const path = require('node:path')
import { getUploadFileData } from '../src/lib'

const IMAGE_ASSETS_RELATIVE_PATH = "../assets/images"

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    bio: 'a data scientist who loves hiking and photography. Always seeking new challenges in AI and machine learning',
    latitude: 37.0179137,
    longitude: -7.9873126,
    password: "pass123",
    sex: 'FEMALE'
  },
  {
    name: 'Emma',
    email: 'emma@prisma.io',
    bio: 'a talented graphic designer passionate about minimalist art. Enjoys baking and exploring new coffee shops.',
    latitude: 37.1162609,
    longitude: -8.0889362,
    password: "some_random_pass",
    sex: 'FEMALE'
  },
  {
    name: 'Liam',
    email: 'liam@email.pt',
    bio: 'a software engineer and avid gamer. Dedicated to creating immersive VR experiences and loves sci-fi movies.',
    latitude: 38.7441844,
    longitude: -9.2421369,
    password: "mypass",
    sex: 'MALE'
  }
]


const getImages = (): object => {
  return {
    MALE: fs.readdirSync(`${IMAGE_ASSETS_RELATIVE_PATH}/male`),
    FEMALE: fs.readdirSync(`${IMAGE_ASSETS_RELATIVE_PATH}/female`) 
  }
}

async function main() {
  console.log(`Clearing existing data...`);
  await prisma.user.deleteMany({});
  await prisma.file.deleteMany({});
  //removeContentsOfUploadsDirectory()
  
  const images = getImages()

  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        bio: u.bio,
        password: hashString(u.password),
        sex: u.sex
      },
    })
    console.log(`Created user with id: ${user.id}`)

    add_random_image_to_user(user, images) 

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


  /**
   * Adds to a user a random image from the set of images, according to the sex of the user
   * @param user 
   * @param images 
   */
function add_random_image_to_user(user: object, images: object) {
  const sex: string = user.sex
  const image:string = images[sex][Math.floor(Math.random()*images[sex].length)]
  const userFolder: string = hashString(user.id.toString())
  createUserFolderIfNeeded(userFolder)
  const {filePath, storePath , url} = getUploadFileData(image, userFolder)

  fs.copyFileSync(`${IMAGE_ASSETS_RELATIVE_PATH}/${sex.toLowerCase()}/${image}`, storePath)

  prisma.file.create({
    data: {
      userId: user.id,
      path: filePath
    }
  })
  
}

/**
 * Removes everything in the uploads folder
 */
function removeContentsOfUploadsDirectory() {
  const directory = getFileLocalPath('')
  const files = fs.readdirSync(directory)
  for (const file of files) {
    const filePath = path.join(directory, file);
    console.log(`Removing "${filePath}".`)
    fs.unlinkSync(filePath);
  }
}

