import puppeteer, {Browser, Page} from 'puppeteer'
import * as fs from 'fs'
import * as path from 'path'

const BASE_URL           = 'https://admin.streamlinevrs.com'
const LOGIN_URL          = `${BASE_URL}/auth_login.html?logout=1`
const EMAIL_TEMPLATE_URL = (templateId: number, companyId: number) => `${BASE_URL}/editor_email_company_document_template.html?template_id=${templateId}&company_id=${companyId}`
const EDIT_HOME_URL      = (homeId: number) => `${BASE_URL}/edit_home.html?home_id=${homeId}`

export default class Streamline {
  private browser: Promise<Browser>
  private readonly username: string
  private readonly password: string
  private readonly companyId: number
  private readonly page: Promise<Page>

  constructor(params: { username: string, password: string, companyId: number }) {
    this.username  = params.username
    this.password  = params.password
    this.companyId = params.companyId

    this.browser = puppeteer.launch({ headless: true })
    this.page    = this.browser
      .then(async browser => await browser.newPage())
      .then(async page => await this.authenticate(page))
  }

  private async authenticate(page: Page): Promise<Page> {
    await page.goto(LOGIN_URL)

    await page.waitForSelector('#user_login')
    await page.type('#user_login', this.username)
    await page.type('#user_password', this.password)

    await page.click('#submit_button')
    await page.waitForSelector('#page_title_bar_title')

    return page
  }

  async backupTemplate(templateId: number, destinationFolder: string) {
    const page = await this.page

    await page.goto(EMAIL_TEMPLATE_URL(templateId, this.companyId))
    await page.waitForSelector('[title=Source]')

    const currentTemplate = await page.evaluate(() => (document.querySelector('textarea[name=page_text]') as HTMLTextAreaElement).value)

    fs.writeFileSync(path.join(destinationFolder, `template-${templateId}.html`), currentTemplate)
  }

  async updateEmailTemplate(templateId: number, newTemplateHtml: string): Promise<void> {
    const page = await this.page

    await page.goto(EMAIL_TEMPLATE_URL(templateId, this.companyId))
    await page.waitForSelector('[title=Source]')
    await page.click('[title=Source]')
    await page.waitFor(500)
    await page.evaluate(() => (document.querySelector('textarea[role=textbox]') as HTMLTextAreaElement).value = '')
    await page.type('textarea[role=textbox]', newTemplateHtml)
    await page.click('[name=modify_button]')
    await page.waitForSelector('.tooltip')
  }

  async updateHomeNetworkId(homeLocationId: number, newNetworkId: number) {
    const page = await this.page

    await page.goto(EDIT_HOME_URL(homeLocationId))
    await page.waitForSelector('input[name=property_variable_5028]')
    await page.evaluate(() => (document.querySelector('[name=property_variable_5028]') as HTMLTextAreaElement).value = '')
    await page.type('[name=property_variable_5028]', `${newNetworkId}`)
    await page.click('[type=submit][name=modify_button]')
    await page.waitForSelector('.yui-dialog #yui-gen0-button')
    await page.click('.yui-dialog #yui-gen0-button')
    await page.waitFor(1000)
    await page.waitForSelector('input[name=property_variable_5028]')
  }

  async close() {
    await (await this.browser).close()
  }
}