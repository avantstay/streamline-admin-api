import cheerio from 'cheerio'
import { clientGet, clientPost, StreamLineClient } from '../client'
import { VIEW_PROPERTY_URL } from '../urls'

export const updatePropertyFields = async ({ client, propertyId, fields }: { client: StreamLineClient | Promise<StreamLineClient>, propertyId: number, fields: { [name: string]: string } }) => {
  const authenticatedClient = await client

  const url = VIEW_PROPERTY_URL(propertyId)
  const { body } = await clientGet(authenticatedClient, url)
  const $ = cheerio.load(body)

  const formElements = $('form').serializeArray().reduce((prev, curr) => {
    const name = curr.name.replace('[]', '')

    if (prev.hasOwnProperty(name) && Array.isArray(prev[name])) {
      prev[name].push(curr.value)
    } else if (prev.hasOwnProperty(name)) {
      prev[name] = [prev[name], curr.value]
    } else {
      prev[name] = curr.value
    }
    return prev
  }, {} as any)

  await clientPost(authenticatedClient, url, {
    form: {
      ...formElements,
      ...fields,
    },
  })
}