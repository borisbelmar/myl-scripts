import fs from 'fs/promises'
import path from 'path'
import axios, { type AxiosResponse } from 'axios'
import type { MylEditionData } from './types'

const getDataPath = (dataSlug: string): string => path.join(
  process.cwd(),
  'data',
  `${dataSlug}.json`
)

const editionDataExists = async (editionSlug: string): Promise<boolean> => {
  try {
    const editionDataPath = getDataPath(editionSlug)
    await fs.access(editionDataPath)
    return true
  } catch (error) {
    return false
  }
}

const saveMylEditionData = async (editionData: MylEditionData, editionSlug: string): Promise<void> => {
  const editionDataPath = getDataPath(editionSlug)
  await fs.writeFile(editionDataPath, JSON.stringify(editionData, null, 2))
}

const fetchMylEditionData = async (editionSlug: string): Promise<MylEditionData> => {
  const response: AxiosResponse<MylEditionData> = await axios.get(`https://api.myl.cl/cards/edition/${editionSlug}`)
  return response.data
}

export default async function getMylEditionData (editionSlug: string): Promise<MylEditionData> {
  let editionData: MylEditionData
  const editionDataPath = getDataPath(editionSlug)
  const editionDataAlreadyExists = await editionDataExists(editionSlug)
  if (editionDataAlreadyExists) {
    const editionDataBuffer = await fs.readFile(editionDataPath)
    editionData = JSON.parse(editionDataBuffer.toString())
  } else {
    console.log(`Downloading edition data for ${editionSlug}`)
    editionData = await fetchMylEditionData(editionSlug)
    await saveMylEditionData(editionData, editionSlug)
  }
  if (!editionData) {
    console.error(`Error downloading edition data for ${editionSlug}`)
  }
  return editionData
}
