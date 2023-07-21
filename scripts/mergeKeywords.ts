import { writeFile } from 'fs/promises'
import allEditions from '../all_editions.json'
import getMylEditionData from '../src/getEditionData'
import type { MylKeyword } from '../src/types'

async function mergeKeywords (): Promise<void> {
  const editionsData = await Promise.all(allEditions.map(getMylEditionData))

  const mergedKeywords = editionsData.reduce<Record<string, MylKeyword>>((acc, curr) => {
    const editionKeywords = curr.keywords || []
    editionKeywords.forEach(keyword => {
      if (!acc[keyword.slug]) {
        acc[keyword.slug] = keyword
      } else {
        const existentRarity = acc[keyword.slug]
        if (keyword.id !== existentRarity.id) {
          console.log(`Rarity ${keyword.slug} has different id: ${keyword.id} and ${existentRarity.id}`)
        }
      }
    })
    return acc
  }, {})

  await writeFile('keywords.json', JSON.stringify(Object.values(mergedKeywords), null, 2))
}

mergeKeywords()
