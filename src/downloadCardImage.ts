import fs from 'fs/promises'
import path from 'path'
import type { MylCard } from './types'
import axios, { type AxiosResponse } from 'axios'

const getImageUrl = (editionId: string, cardId: string): string => (
  `https://api.myl.cl/static/cards/${editionId}/${cardId}.png`
)

const getImageDownloadPath = (editionSlug: string): string => (
  path.join(
    process.cwd(),
    'images',
    editionSlug
  )
)

const imageExists = async (editionSlug: string, cardId: string): Promise<boolean> => {
  const downloadPath = getImageDownloadPath(editionSlug)
  const imageDownloadPath = path.join(downloadPath, `${cardId}.png`)
  try {
    await fs.access(imageDownloadPath)
    return true
  } catch (error) {
    return false
  }
}

export default async function downloadCardImage (card: MylCard): Promise<void> {
  const editionSlug = card.ed_slug
  const editionId = card.ed_edid
  const cardId = card.edid

  const downloadPath = getImageDownloadPath(editionSlug)
  await fs.mkdir(downloadPath, { recursive: true })

  const cardImageExists = await imageExists(editionSlug, cardId)
  if (cardImageExists) {
    return
  }

  try {
    const imageUrl = getImageUrl(editionId, cardId)
    const imageDownloadPath = path.join(downloadPath, `${cardId}.png`)
    const response: AxiosResponse<ArrayBuffer> = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    await fs.writeFile(imageDownloadPath, response.data as Buffer)
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`)
    }
    console.error(`Error downloading image for card ${cardId} from edition ${editionSlug}`)
  }
}
