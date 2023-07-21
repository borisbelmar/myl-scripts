import { writeFile } from 'fs/promises'
import allEditions from '../all_editions.json'
import getMylEditionData from '../src/getEditionData'
import type { MylCardForApp } from '../src/types'

async function mergeCards (): Promise<void> {
  const editionsData = await Promise.all(allEditions.map(getMylEditionData))

  const mergedCards = editionsData.reduce<Record<string, MylCardForApp>>((acc, curr) => {
    const editionCards = curr.cards || []
    editionCards.forEach(card => {
      if (!acc[card.id]) {
        acc[card.id] = {
          id: card.id,
          edid: card.edid,
          slug: card.slug,
          name: card.name,
          edition: card.ed_edid,
          image: `https://api.myl.cl/static/cards/${card.ed_edid}/${card.edid}.png`,
          rarity: card.rarity,
          race: card.race,
          type: card.type,
          keywords: card.keywords,
          cost: card.cost,
          damage: card.damage,
          ability: card.ability,
          flavour: card.flavour
        }
      } else {
        console.log(`Card ${card.id} already exists`)
      }
    })
    return acc
  }, {})

  console.log('Total cards: ', Object.values(mergedCards)?.length)

  await writeFile('cards.json', JSON.stringify(Object.values(mergedCards).filter(Boolean), null, 2))
}

mergeCards()
