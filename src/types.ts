import type { ObjectId } from 'mongodb'

export interface MylRace {
  id: string
  slug: string
  name: string
}

export interface MylRarity {
  id: string
  slug: string
  name: string
}

export interface MylType {
  id: string
  slug: string
  name: string
}

export interface MylKeyword {
  id: string
  flag: string
  slug: string
  title: string
  alt_title: string
  definition: string
}

export interface MylEdition {
  id: string
  order: string
  slug: string
  title: string
  image: string
  date_release: string
  date_empire_valid: string
  custom_bg: string
  flags: string
}

export interface MylEditionData {
  status: string
  code: number
  races: MylRace[]
  rarities: MylRarity[]
  types: MylType[]
  keywords: MylKeyword[]
  edition: MylEdition
  cards: MylCard[]
}

export interface MylMongoCard {
  edid: string
  slug: string
  name: string
  rarity: ObjectId | undefined
  race: ObjectId | undefined
  type: ObjectId | undefined
  keywords: ObjectId | undefined
  cost: number | null
  damage: number | null
  ability: string | null
  flavour: string | null
  edition: ObjectId | undefined
  image: string | null
}

export interface MylCard {
  id: string
  edid: string
  slug: string
  name: string
  rarity: string | null
  race: string | null
  type: string
  keywords: string | null
  cost: string | null
  damage: string | null
  ability: string | null
  flavour: string | null
  ed_edid: string
  ed_slug: string
}

export interface MylCardForApp {
  id: string
  edid: string
  slug: string
  name: string
  edition: string
  image: string | null
  rarity: string | null
  race: string | null
  type: string
  keywords: string | null
  cost: string | null
  damage: string | null
  ability: string | null
  flavour: string | null
}
