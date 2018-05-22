import Streamline from '../Streamline'
import path from 'path'

let TIMEOUT     = 240000
let templateId = 27835
let streamline: Streamline
let credentials = {
  username : process.env.STREAMLINE_USERNAME as string,
  password : process.env.STREAMLINE_PASSWORD as string,
  companyId: parseInt(process.env.STREAMLINE_COMPANY_ID as string, 10)
}

describe('Email templates', () => {
  before(() => {
    streamline = new Streamline(credentials)
  })

  after(async () => {
    await streamline.close()
  })

  it('Backup template', async () => {
    await streamline.backupTemplate(templateId, path.join(__dirname, 'temp'))
  }, TIMEOUT)

  it('Update template', async () => {
    const newTemplateHtml = `<html><body>${new Date().toISOString()}</body></html>`
    await streamline.updateEmailTemplate(templateId, newTemplateHtml)
  }, TIMEOUT)

  it('Update home network id', async () => {
    await streamline.updateHomeNetworkId(209911, 314136)
  }, TIMEOUT)
})