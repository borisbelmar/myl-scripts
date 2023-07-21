import { compareDesc, isAfter, parseISO } from 'date-fns'
import getMylEditionData from './getEditionData'
import type { MylEditionData } from './types'

export default async function getEmpireEditions (allEditions: string[]): Promise<MylEditionData[]> {
  const results = await Promise.allSettled(allEditions.map(getMylEditionData))

  const editionsData = results.map(result => {
    if (result.status === 'fulfilled') {
      return result.value
    } else {
      return null
    }
  }).filter(data => data !== null) as MylEditionData[]

  const empireEditions = editionsData.filter(data => {
    if (data.edition) {
      return isAfter(new Date(data.edition.date_empire_valid), new Date())
    }
    return false
  })

  empireEditions.sort((a, b) => {
    const dateA = parseISO(a.edition.date_release)
    const dateB = parseISO(b.edition.date_release)
    return compareDesc(dateA, dateB)
  })

  return empireEditions
}
