import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

// Output directory for the compressed images
const OUTPUT_DIR = 'compressed_images'

// Input directory containing images to be compressed
const INPUT_DIR = 'images'

const compressImage = async (file: string): Promise<void> => {
  const filePath = path.join(INPUT_DIR, file)

  const image = sharp(filePath)

  const { format } = await image.metadata()

  const outputFilePath = path.join(OUTPUT_DIR, file).replace(format as string, 'webp')

  const originImageStat = await fs.promises.stat(filePath)

  await image
    .webp({ quality: 70 }) // lower quality for more compression
    .resize(600)
    .toFile(outputFilePath)

  const compressedImageStat = await fs.promises.stat(outputFilePath)

  console.log(`Compressed ${file},  original size: ${originImageStat.size} bytes, new size: ${compressedImageStat.size} bytes, saved ${Math.round((1 - compressedImageStat.size / originImageStat.size) * 100)}%`)
}

const run = async (): Promise<void> => {
  try {
    const editions = await fs.promises.readdir(INPUT_DIR)

    for (const edition of editions) {
      try {
        const files = await fs.promises.readdir(path.join(INPUT_DIR, edition))

        if (!fs.existsSync(path.join(OUTPUT_DIR, edition))) {
          fs.mkdirSync(path.join(OUTPUT_DIR, edition))
        }

        await Promise.all(files.map(async (file) => {
          await compressImage(path.join(edition, file))
        }))
      } catch (err) {
        console.log(err)
      }
    }
  } catch (err) {
    console.log(err)
  }
}

run()
