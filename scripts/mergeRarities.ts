import { writeFile } from 'fs/promises'
import allEditions from '../all_editions.json'
import getMylEditionData from '../src/getEditionData'
import type { MylRarity } from '../src/types'

async function mergeRarities (): Promise<void> {
  const editionsData = await Promise.all(allEditions.map(getMylEditionData))

  const mergedRarities = editionsData.reduce<Record<string, MylRarity>>((acc, curr) => {
    const editionRarities = curr.rarities || []
    editionRarities.forEach(rarity => {
      if (!acc[rarity.slug]) {
        acc[rarity.slug] = rarity
      } else {
        const existentRarity = acc[rarity.slug]
        if (rarity.id !== existentRarity.id) {
          console.log(`Rarity ${rarity.slug} has different id: ${rarity.id} and ${existentRarity.id}`)
        }
      }
    })
    return acc
  }, {})

  await writeFile('rarities.json', JSON.stringify(Object.values(mergedRarities), null, 2))
}

mergeRarities()
