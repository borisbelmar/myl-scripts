import { writeFile } from 'fs/promises'
import allEditions from '../all_editions.json'
import getMylEditionData from '../src/getEditionData'
import type { MylRace } from '../src/types'

async function mergeRaces (): Promise<void> {
  const editionsData = await Promise.all(allEditions.map(getMylEditionData))

  const mergedRaces = editionsData.reduce<Record<string, MylRace>>((acc, curr) => {
    const editionRaces = curr.races || []
    editionRaces.forEach(race => {
      if (!acc[race.slug]) {
        acc[race.slug] = race
      } else {
        const existentRarity = acc[race.slug]
        if (race.id !== existentRarity.id) {
          console.log(`Rarity ${race.slug} has different id: ${race.id} and ${existentRarity.id}`)
        }
      }
    })
    return acc
  }, {})

  await writeFile('races.json', JSON.stringify(Object.values(mergedRaces), null, 2))
}

mergeRaces()
