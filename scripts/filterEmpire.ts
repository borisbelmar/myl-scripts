import allEditions from '../all_editions.json'
import getEmpireEditions from '../src/getEmpireEditions'

async function filterEmpire (): Promise<void> {
  const empireEditions = await getEmpireEditions(allEditions)

  const empireEditionsFormatted = empireEditions.map(data => ({
    title: data.edition.title,
    slug: data.edition.slug,
    empireUntil: data.edition.date_empire_valid,
    release: data.edition.date_release,
    cards: data.cards.length
  }))

  console.log(JSON.stringify(empireEditionsFormatted, null, 2))
  console.log(`Total Card: ${empireEditionsFormatted.reduce((acc, curr) => acc + curr.cards, 0)}`)
}

filterEmpire()
