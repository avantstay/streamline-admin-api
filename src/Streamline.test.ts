import Streamline from '../src/Streamline'
import * as path from 'path'
import * as fs from 'fs'
import { expect } from 'chai'

let templateId = 27835
let streamline: Streamline

let credentials = {
  username : process.env.STREAMLINE_USERNAME as string,
  password : process.env.STREAMLINE_PASSWORD as string,
  companyId: parseInt(process.env.STREAMLINE_COMPANY_ID as string, 10)
}

describe('Email templates', () => {
  before(() => {
    streamline = new Streamline({
      ...credentials,
      headless: false
    })
  })

  after(async () => {
    await streamline.close()
  })

  it('Backup template', async () => {
    const tempDir = path.join(__dirname, 'temp')

    if (!fs.existsSync(tempDir))
      fs.mkdirSync(tempDir)

    await streamline.backupTemplate(templateId, tempDir)
  })

  it('Update template', async () => {
    const newTemplateHtml = `<html><body>${new Date().toISOString()}</body></html>`
    await streamline.updateEmailTemplate(templateId, newTemplateHtml)
  })

  it('Update home network id', async () => {
    await streamline.updateHomeNetworkId(209911, 314136)
  })

  it('Reply an email', async () => {
    await streamline.replyEmail(56556933, `<p>Hey ho, let's go! ${new Date().toISOString()}</p>`)
  })

  it('Get reservation extra fields', async () => {
    let fieldNames     = [ 'last_name', 'payment_comments', 'client_comments' ]
    let reservationIds = [ 11619171, 11618996, 11618980, 11617239 ]

    const reservationFields = await streamline.getReservationsFields({
      fieldNames,
      reservationIds
    })

    expect(Object.keys(reservationFields).length).to.equal(reservationIds.length)
    expect(Object.keys(reservationFields[ 11619171 ]).length).to.equal(fieldNames.length)
  })

  it('Create coupon', async () => {
    await streamline.createCoupon({
      code                     : 'TEST009',
      name                     : 'Test only 009',
      status                   : 'active',
      logic                    : 'regular',
      type                     : 'oneTime',
      discount                 : {
        type  : 'percent',
        amount: 10
      },
      salePeriod               : {
        startDate: '2018-09-10',
        endDate  : '2019-09-10'
      },
      seasonPeriods            : [
        {
          startDate: '2018-09-10',
          endDate  : '2019-09-10',
          type     : 'checkIn'
        },
        {
          startDate: '2018-09-10',
          endDate  : '2019-09-10',
          type     : 'creation'
        }
      ],
      allowedHomes             : 'all',
      allowedReservationTypes  : 'all',
      allowedReservationSources: 'all'
    })
  })
})