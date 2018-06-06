import puppeteer, { Browser, Page } from 'puppeteer'
import * as fs from 'fs'
import * as path from 'path'

const BASE_URL              = 'https://admin.streamlinevrs.com'
const UNACTIONED_EMAILS_URL = `${BASE_URL}/ds_emails.html?group_id=10&responsible_processor_id=0&system_queue_id=1&all_global_accounts=0&ss=1&page=1&show_all=1&page_id=1&order=creation_date%20DESC`
const LOGIN_URL             = `${BASE_URL}/auth_login.html?logout=1`
const REPLY_EMAIL_URL       = (id: string | number) => `${BASE_URL}/edit_system_email_reply.html?id=${id}&replay_all=1`
const EMAIL_TEMPLATE_URL    = (templateId: number, companyId: number) => `${BASE_URL}/editor_email_company_document_template.html?template_id=${templateId}&company_id=${companyId}`
const EDIT_HOME_URL         = (homeId: number) => `${BASE_URL}/edit_home.html?home_id=${homeId}`
// const INITIAL_SCREEN_URL    = `${BASE_URL}/index.html`
// const ALL_EMAILS_URL        = `${BASE_URL}/ds_emails.html?group_id=0&responsible_processor_id=0&system_queue_id=1&all_global_accounts=0&ss=1&page=1&show_all=1&page_id=1&order=creation_date%20DESC`

export interface Email {
  id: number;
  name: string;
  email: string;
  subject: string;
  date: string;
}

export default class Streamline {
  private browser: Promise<Browser>
  private readonly username: string
  private readonly password: string
  private readonly companyId: number
  private readonly page: Promise<Page>

  constructor(params: { username: string, password: string, companyId: number, headless?: boolean }) {
    this.username  = params.username
    this.password  = params.password
    this.companyId = params.companyId

    this.browser = puppeteer.launch({ headless: !!params.headless })
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
    await page.waitForFunction(() => /index.html/.test(window.location.pathname))
    // await page.waitForSelector('#page_title_bar_title')

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
    await page.waitFor(3000)
    await page.click('[title=Source]')
    await page.waitForSelector('textarea[role=textbox]')
    await page.evaluate((newTemplate) => (document.querySelector('textarea[role=textbox]') as HTMLTextAreaElement).value = newTemplate, newTemplateHtml)
    await page.click('[name=modify_button]')
    await page.waitForSelector('.tooltip')
    await page.waitFor(1000)
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

  async getAllUnactionedEmails(): Promise<Array<Email>> {
    const page = await this.page

    await page.goto(UNACTIONED_EMAILS_URL)
    await page.waitForSelector('table.table_results')

    return await page.evaluate(() => {
      const table            = document.querySelector('table.table_results') as HTMLElement
      const headCells        = table.querySelectorAll('thead th')
      const headCellsContent = Array.prototype.map.call(headCells, (it: HTMLElement) => it.textContent as string) as Array<string>

      const fromCol    = headCellsContent.findIndex(it => /from/i.test(it))
      const subjectCol = headCellsContent.findIndex(it => /subject/i.test(it))
      const dateCol    = headCellsContent.findIndex(it => /date/i.test(it))

      const emailRows = table.querySelectorAll('tbody tr')

      const timezone          = -7
      const timezoneFormatted = `${timezone > 0 ? '+' : '-'}${Math.abs(timezone).toString().padStart(2, '0')}:00`

      return Array.prototype.map.call(emailRows, (it: HTMLElement) => {
        const nameAndEmailContent = Array.prototype.map.call(
          it.querySelectorAll(`td:nth-child(${fromCol + 1}) span`),
          (it: HTMLElement) => it.textContent)

        const name          = nameAndEmailContent.find((it: string) => !/@[^.]+\./.test(it)) || ''
        const email         = nameAndEmailContent.find((it: string) => /@[^.]+\./.test(it))
        const subjectLink   = it.querySelector(`td:nth-child(${subjectCol + 1}) a`) as HTMLElement
        const id            = ((subjectLink.getAttribute('onclick') as string).match(/\d+/) as Array<string>)[ 0 ]
        const subject       = subjectLink.textContent as string
        const date          = (it.querySelector(`td:nth-child(${dateCol + 1})`) as HTMLElement).textContent as string
        const dateFormatted = date
          .replace(/(\d{2})\/(\d{2})\/(\d{2}) (\d{2}:\d{2}[ap]m)/i, `20$3-$1-$2T$4:00${timezoneFormatted}`)
          .replace(/(\d{2}:\d{2}[ap]m)/i, (it: string) => {
            let hours   = parseInt((it.match(/^(\d+)/) as Array<any>)[ 1 ], 10)
            let minutes = parseInt((it.match(/:(\d+)/) as Array<any>)[ 1 ], 10)

            const ampm = (it.match(/([ap]m)$/) as Array<any>)[ 1 ]

            if (/pm/i.test(ampm) && hours < 12)
              hours = hours + 12
            if (/am/i.test(ampm) && hours === 12)
              hours = hours - 12

            const sHours   = hours.toString().padStart(2, '0')
            const sMinutes = minutes.toString().padStart(2, '0')

            return `${sHours}:${sMinutes}`
          })


        return {
          id,
          name,
          email,
          subject,
          date: new Date(dateFormatted).toISOString()
        }
      })
    })
  }

  async replyEmail(emailId: string | number, responseHtml: string) {
    const page = await this.page
    await page.goto(REPLY_EMAIL_URL(emailId))

    await page.waitForSelector('[title=Source]')
    await page.waitFor(3000)
    await page.click('[title=Source]')
    await page.waitForSelector('textarea[role=textbox]')

    await page.evaluate((responseHtml) => {
      const textArea        = document.querySelector('textarea[role=textbox]') as HTMLTextAreaElement
      const originalContent = textArea.value as string
      textArea.value        = originalContent.replace(/(<body.*?>)([^]*?)(-+\s?original message\s?-+)/i, `$1\n${responseHtml}\n<p>&nbsp;</p>\n$3`)
    }, responseHtml)

    await page.evaluate(() => (window as any).verifyForm())
    await page.waitFor(2000)
  }

  async close() {
    await (await this.browser).close()
  }
}