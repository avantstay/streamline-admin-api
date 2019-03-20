import cheerio from 'cheerio'
import { clientGet, StreamLineClient } from '../client'
import { VIEW_PROPERTY_URL } from '../urls'

export const getPropertyExtraFields = async ({ client, propertyId, fields }: { client: StreamLineClient | Promise<StreamLineClient>, propertyId: number, fields: Array<string> }) => {
  const authenticatedClient = await client

  const url = VIEW_PROPERTY_URL(propertyId)
  const { body } = await clientGet(authenticatedClient, url)
  const $ = cheerio.load(body)

  return fields
    .map(name => $(`[name="${name}"]`))
    .map(field => ({
      name : field.attr('name'),
      value: field.val(),
    }))
}