import cheerio from 'cheerio'
import { clientGet, StreamLineClient } from '../client'
import { EMAIL_TEMPLATE_URL } from '../urls'

export const getRegularEmailTemplate = async ({ client, companyId, templateId }: { client: StreamLineClient | Promise<StreamLineClient>, companyId: string | number, templateId: number }) => {
  const authenticatedClient = await client

  const url = EMAIL_TEMPLATE_URL(templateId, companyId)
  const { body } = await clientGet(authenticatedClient, url)
  const $ = cheerio.load(body)

  return $('form [name="page_text"]').text()
}