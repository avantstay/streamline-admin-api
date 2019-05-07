import cheerio from 'cheerio'
import formatDate from 'date-fns/format'
import { clientGet, clientPost, StreamLineClient } from '../client'
import { EDIT_COUPON_URL } from '../urls'

export const upsertCoupon = async ({ client, couponId, code, name, percentValue, amountValue, startDate, endDate }: { client: StreamLineClient | Promise<StreamLineClient>, couponId?: number, code: string, name: string, percentValue: number, amountValue: number, startDate: Date, endDate: Date }) => {
  const authenticatedClient = await client

  const url = EDIT_COUPON_URL(couponId)
  const { body } = await clientGet(authenticatedClient, url)
  const $ = cheerio.load(body)

  $('[name="homes_allow[]"]').prop('checked', true)

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
      ...{
        code            : code,
        name            : name,
        percent_value   : `${percentValue.toFixed(1)}%`,
        amount_value    : `$${amountValue.toFixed(2)}`,
        startdate       : formatDate(startDate, 'MM/DD/YYYY'),
        enddate         : formatDate(endDate, 'MM/DD/YYYY'),
        startdate_100511: formatDate(startDate, 'MM/DD/YYYY'),
        enddate_100511  : formatDate(endDate, 'MM/DD/YYYY'),
        startdate_new   : formatDate(startDate, 'MM/DD/YYYY'),
        enddate_new     : formatDate(endDate, 'MM/DD/YYYY'),
      },
    },
  })
}