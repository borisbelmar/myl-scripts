import { writeFile } from 'fs/promises'
import allEditions from '../all_editions.json'
import getMylEditionData from '../src/getEditionData'

async function mergeEditions (): Promise<void> {
  const editionsData = await Promise.all(allEditions.map(getMylEditionData))

  const editions = editionsData.map(data => data.edition).filter(Boolean)

  await writeFile('editions.json', JSON.stringify(editions, null, 2))
}

mergeEditions()
