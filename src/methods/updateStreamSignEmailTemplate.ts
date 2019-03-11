import cheerio from 'cheerio'
import { clientGet, clientPost, StreamLineClient } from '../client'
import { EMAIL_STREAMSIGN_TEMPLATE_URL } from '../urls'

export const updateStreamSignEmailTemplate = async ({ client, companyId, templateId, templateBody }: { client: StreamLineClient | Promise<StreamLineClient>, companyId: string | number, templateId: number, templateBody: string }) => {
  const authenticatedClient = await client

  const url = EMAIL_STREAMSIGN_TEMPLATE_URL(templateId, companyId)
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
      asignatureaway_message: templateBody,
    },
  })
}