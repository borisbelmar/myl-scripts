import allEditions from '../all_editions.json'
import getMylEditionData from '../src/getEditionData'
import downloadCardImage from '../src/downloadCardImage'

const downloadEditionDataAndStatics = async (editionSlug: string): Promise<void> => {
  const editionData = await getMylEditionData(editionSlug)

  const cards = editionData.cards || []

  await Promise.all(cards.map(downloadCardImage))
}

const editionSlug = process.argv[2]

if (!editionSlug) {
  const downloadAllEditions = async (): Promise<void> => {
    for (const edition of allEditions) {
      await downloadEditionDataAndStatics(edition)
    }
  }

  downloadAllEditions()
} else {
  downloadEditionDataAndStatics(editionSlug)
}
