import cheerio from 'cheerio'
import { clientGet, StreamLineClient } from '../client'
import { VIEW_RESERVATION_URL } from '../urls'

export const getReservationExtraFields = async ({ client, reservationId, fields }: { client: StreamLineClient | Promise<StreamLineClient>, reservationId: number, fields: Array<string> }) => {
  const authenticatedClient = await client

  const url = VIEW_RESERVATION_URL(reservationId)
  const { body } = await clientGet(authenticatedClient, url)
  const $ = cheerio.load(body)

  return fields.map(name => ({
    name,
    value: $(`[name="${name}"]`).val(),
  }))
}