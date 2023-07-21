import { writeFile } from 'fs/promises'
import allEditions from '../all_editions.json'
import getMylEditionData from '../src/getEditionData'
import type { MylType } from '../src/types'

async function mergeTypes (): Promise<void> {
  const editionsData = await Promise.all(allEditions.map(getMylEditionData))

  const mergedTypes = editionsData.reduce<Record<string, MylType>>((acc, curr) => {
    const editionTypes = curr.types || []
    editionTypes.forEach(type => {
      if (!acc[type.slug]) {
        acc[type.slug] = type
      } else {
        const existentType = acc[type.slug]
        if (type.id !== existentType.id) {
          console.log(`Type ${type.slug} has different id: ${type.id} and ${existentType.id}`)
        }
      }
    })
    return acc
  }, {})

  await writeFile('types.json', JSON.stringify(Object.values(mergedTypes), null, 2))
}

mergeTypes()
