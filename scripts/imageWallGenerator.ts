import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'
import path from 'path'

const imageDirectory = path.join(process.cwd(), 'images', 'valhalla')
const canvasWidth = 1920
const canvasHeight = 1080
const imageWidth = 150
const imageHeight = 200
const gapSize = 32
const backgroundColor = 'transparent'

const imagesPerRow = Math.floor(canvasWidth / (imageWidth + gapSize))
const imagesPerColumn = Math.floor(canvasHeight / (imageHeight + gapSize))

// Calculate the total width and height of the card grid
const gridWidth = imagesPerRow * (imageWidth + gapSize) - gapSize
const gridHeight = imagesPerColumn * (imageHeight + gapSize) - gapSize

// Calculate the horizontal and vertical offsets to center the card grid
const offsetX = Math.floor((canvasWidth - gridWidth) / 2)
const offsetY = Math.floor((canvasHeight - gridHeight) / 2)

const canvas = createCanvas(canvasWidth, canvasHeight)
const context = canvas.getContext('2d')

async function loadImageWall (): Promise<void> {
  // Set background color
  context.fillStyle = backgroundColor
  context.fillRect(0, 0, canvasWidth, canvasHeight)

  const files = await fs.promises.readdir(imageDirectory)

  const imageFiles = files.filter((file) =>
    /\.(jpe?g|png|gif)$/i.test(file)
  )

  console.log(`Found ${imageFiles.length} images.`)

  let imageIndex = 0
  for (let row = 0; row < imagesPerColumn; row++) {
    for (let col = 0; col < imagesPerRow; col++) {
      const imageFile = imageFiles[imageIndex % imageFiles.length]
      const imageFilePath = path.join(imageDirectory, imageFile)

      // Calculate the top position based on whether the column is odd or even
      const isColumnOdd = col % 2 !== 0
      const topStart = isColumnOdd
        ? offsetY + row * (imageHeight + gapSize)
        : offsetY + (row + 0.25) * (imageHeight + gapSize)
      const x = offsetX + col * (imageWidth + gapSize)
      const y = topStart

      try {
        const image = await loadImage(imageFilePath)
        // Add shadow
        context.shadowColor = 'rgba(0, 0, 0, 0.5)'
        context.shadowBlur = 10
        context.shadowOffsetX = 5
        context.shadowOffsetY = 5
        // Draw the image
        context.drawImage(image, x, y, imageWidth, imageHeight)
        // Reset shadow properties
        context.shadowColor = 'transparent'
        context.shadowBlur = 0
        context.shadowOffsetX = 0
        context.shadowOffsetY = 0
      } catch (error) {
        console.error(`Error loading image ${imageFilePath}:`, error)
      }

      imageIndex++
    }
  }

  const buffer = canvas.toBuffer('image/png')
  await fs.promises.writeFile('image_wall.png', buffer)
  console.log('Image wall generated successfully.')
}

loadImageWall().catch((error) => {
  console.error('Error generating image wall:', error)
})
