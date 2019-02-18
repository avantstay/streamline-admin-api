import cheerio from 'cheerio'
import { clientGet, clientPost, StreamLineClient } from '../client'
import { EMAIL_TEMPLATE_URL } from '../urls'

export const updateRegularEmailTemplate = async ({ client, companyId, templateId, templateBody }: { client: StreamLineClient | Promise<StreamLineClient>, companyId: string | number, templateId: number, templateBody: string }) => {
  const authenticatedClient = await client

  const url = EMAIL_TEMPLATE_URL(templateId, companyId)
  const { body } = await clientGet(authenticatedClient, url)
  const $ = cheerio.load(body)

  const CSRFName = $('form [name="CSRFName"]').val()
  const CSRFToken = $('form [name="CSRFToken"]').val()
  const gcid = $('form [name="gcid"]').val()

  await clientPost(authenticatedClient, url, {
    form: {
      CSRFName,
      CSRFToken,
      gcid,
      page_text: templateBody,
    },
  })
}