import puppeteer, { Browser, Page, Response } from 'puppeteer'
import * as fs from 'fs'
import * as path from 'path'
import { format as formatDate } from 'date-fns'
import { keyBy, mapValues, uniqBy } from 'lodash'
import Bluebird from 'bluebird'

const BASE_URL              = 'https://admin.streamlinevrs.com'
const UNACTIONED_EMAILS_URL = `${BASE_URL}/ds_emails.html?group_id=10&responsible_processor_id=0&system_queue_id=1&all_global_accounts=0&ss=1&page=1&show_all=1&page_id=1&order=creation_date%20DESC`
const LOGIN_URL             = `${BASE_URL}/auth_login.html?logout=1`
const REPLY_EMAIL_URL       = (id: string | number) => `${BASE_URL}/edit_system_email_reply.html?id=${id}&replay_all=1`
const OPEN_EMAIL_URL        = (id: string | number) => `${BASE_URL}/edit_system_email.html?id=${id}`
const EMAIL_TEMPLATE_URL    = (templateId: number, companyId: number) => `${BASE_URL}/editor_email_company_document_template.html?template_id=${templateId}&company_id=${companyId}`
const EDIT_HOME_URL         = (homeId: number) => `${BASE_URL}/edit_home.html?home_id=${homeId}`
const VIEW_RESERVATION_URL  = (reservationId: number) => `${BASE_URL}/edit_reservation.html?reservation_id=${reservationId}`
const COUPON_FORM_URL       = 'https://admin.streamlinevrs.com/edit_company_coupon.html'
const INBOX_URL             = 'https://admin.streamlinevrs.com/emailsystem_client.html?system_queue_id=1&group_id=10'

export interface GetReservationFieldsArgs {
  reservationIds: Array<number>,
  fieldNames: Array<string>,
  concurrency?: number
}

export interface SeasonPeriod {
  type: 'creation' | 'checkIn' | 'checkOut',
  startDate: Date | string,
  endDate: Date | string,
  minNights?: number,
  maxNights?: number
}

const CouponStatus = {
  pending : '1',
  active  : '2',
  inactive: '3',
  redeemed: '4'
}

const CouponLogic = {
  regular  : '1',
  group    : '2',
  autoApply: '3'
}

const CouponType = {
  oneTime   : '1',
  repeatable: '2'
}

const ReservationType = {
  STA                  : 2,
  OWN                  : 1,
  NPG                  : 4,
  POS                  : 7,
  PRE                  : 8,
  WHL                  : 9,
  PGO                  : 14,
  HAFamL               : 16,
  PDWTA                : 20,
  'Airbnb-NI'          : 80,
  BPal                 : 35,
  'BPal-PDWTA'         : 38,
  'BPal-WHL'           : 39,
  HAFamOLB             : 40,
  'RentalsUnited-WHL'  : 190,
  'SC-ABnB'            : 236,
  'RentalsUnited-PDWTA': 258
}

const ReservationSource = {
  FDR  : 3,
  ADM  : 4,
  OWN  : 5,
  WSR  : 7,
  BCR  : 8,
  NET  : 9,
  PDWTA: 11
}

const SeasonPeriodType = {
  creation: '1',
  checkIn : '2',
  checkOut: '3'
}

export interface CreateCouponParams {
  code: string,
  name: string,
  status: 'pending' | 'active' | 'inactive' | 'redeemed',
  logic: 'regular' | 'group' | 'autoApply',
  type: 'oneTime' | 'repeatable',
  comments?: string,
  salePeriod: {
    startDate: Date | string,
    endDate: Date | string,
  },
  seasonPeriods: Array<SeasonPeriod>,
  allowedHomes: 'all' | Array<number>,
  allowedReservationTypes: 'all' | Array<'STA' | 'OWN' | 'NPG' | 'POS' | 'PRE' | 'WHL' | 'PGO' | 'HAFamL' | 'PDWTA' | 'Airbnb-NI' | 'BPal' | 'BPal-PDWTA' | 'BPal-WHL' | 'HAFamOLB' | 'RentalsUnited-WHL' | 'SC-ABnB' | 'RentalsUnited-PDWTA'>,
  allowedReservationSources: 'all' | Array<'FDR' | 'ADM' | 'OWN' | 'WSR' | 'BCR' | 'NET' | 'PDWTA'>,
  discount: {
    type: 'percent' | 'value' | 'nightlyValue' | 'freeNights',
    amount?: number,
    maxNights?: number,
    freeNights?: number
  }
}

export interface Email {
  id: number;
  name: string;
  email: string;
  subject: string;
  opened: boolean;
  date: string;
  html?: string;
}

export default class Streamline {
  private browser: Promise<Browser>
  private readonly username: string
  private readonly password: string
  private readonly companyId: number
  private readonly authenticatedPage: Promise<Page>
  private readonly timezone: number

  constructor(params: { username: string, password: string, companyId: number, headless?: boolean, timezone?: number, puppeteerArgs?: Array<string> }) {
    this.username  = params.username
    this.password  = params.password
    this.companyId = params.companyId
    this.timezone  = params.timezone || -7

    this.browser = puppeteer.launch({
      headless: !!params.headless,
      args    : [ ...(params.puppeteerArgs || []) ]
    })

    this.authenticatedPage = this.getNewPage()
      .then(async page => await this.authenticate(page))
  }

  private async getNewPage() {
    return this.browser.then(async browser => await browser.newPage())
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

  async getTemplateById(templateId: number) {
    const page = await this.authenticatedPage

    await page.goto(EMAIL_TEMPLATE_URL(templateId, this.companyId))
    await page.waitForSelector('[title=Source]')

    return await page.evaluate(() => (document.querySelector('textarea[name=page_text]') as HTMLTextAreaElement).value)
  }

  async backupTemplate(templateId: number, destinationFolder: string) {
    const currentTemplate = await this.getTemplateById(templateId)

    fs.writeFileSync(path.join(destinationFolder, `template-${templateId}.html`), currentTemplate)
  }

  async updateEmailTemplate(templateId: number, newTemplateHtml: string): Promise<void> {
    const page = await this.authenticatedPage

    await page.goto(EMAIL_TEMPLATE_URL(templateId, this.companyId))
    await page.waitForSelector('[title=Source]')
    await page.waitFor(3000)
    await page.click('[title=Source]')
    await page.waitForSelector('textarea[role=textbox]')
    await page.evaluate((newTemplate) => (document.querySelector('textarea[role=textbox]') as HTMLTextAreaElement).value = newTemplate, newTemplateHtml)
    await page.click('[name=modify_button]')
    await page.waitForSelector('.alert')
    await page.waitFor(1000)
  }

  async updateHomeNetworkId(homeLocationId: number, newNetworkId: number) {
    const page = await this.authenticatedPage

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
    const page = await this.authenticatedPage

    await page.goto(UNACTIONED_EMAILS_URL)
    await page.waitForSelector('table.table_results')

    const emails: Array<Email> = await page.evaluate((timezone) => {
      const table            = document.querySelector('table.table_results') as HTMLElement
      const headCells        = table.querySelectorAll('thead th')
      const headCellsContent = Array.prototype.map.call(headCells, (it: HTMLElement) => it.textContent as string) as Array<string>

      const fromCol    = headCellsContent.findIndex(it => /from/i.test(it))
      const subjectCol = headCellsContent.findIndex(it => /subject/i.test(it))
      const dateCol    = headCellsContent.findIndex(it => /date/i.test(it))
      const openCol    = headCellsContent.findIndex(it => /open/i.test(it))

      const emailRows = table.querySelectorAll('tbody tr')

      const timezoneFormatted = `${timezone > 0 ? '+' : '-'}${Math.abs(timezone).toString().padStart(2, '0')}:00`

      return Array.prototype.map.call(emailRows, (it: HTMLElement) => {
        const nameAndEmailContent = Array.prototype.map.call(it.querySelectorAll(`td:nth-child(${fromCol + 1}) span`), (it: HTMLElement) => it.textContent)

        const name  = (nameAndEmailContent.find((it: string) => !/@[^.]+\./.test(it)) || '').replace(/\(.+\)/g, '').trim()
        const email = nameAndEmailContent.find((it: string) => /@[^.]+\./.test(it))

        const opened      = !!it.querySelector(`td:nth-child(${openCol + 1}) img`)
        const subjectLink = it.querySelector(`td:nth-child(${subjectCol + 1}) a`) as HTMLElement
        const id          = ((subjectLink.getAttribute('onclick') as string).match(/\d+/) as Array<string>)[ 0 ]
        const subject     = subjectLink.textContent as string
        const rawDate     = (it.querySelector(`td:nth-child(${dateCol + 1})`) as HTMLElement).textContent as string

        const dateFormatted = rawDate
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
          opened,
          date: new Date(dateFormatted).toISOString()
        }
      })
    }, this.timezone)

    for (let email of emails) {
      if (email.email) {
        const response = await page.goto(`https://admin.streamlinevrs.com/print_email_preview.html?id=${email.id}`) as Response
        email.html     = await response.text()
      }
    }

    return uniqBy(emails.filter(it => it.email), 'id')
  }

  async openEmail(emailId: string | number) {
    const page = await this.authenticatedPage
    await page.goto(OPEN_EMAIL_URL(emailId))
    await page.waitFor(2000)
  }

  async replyEmail(emailId: string | number, responseHtml: string) {
    const page = await this.authenticatedPage
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


  async getReservationsFields({ reservationIds, fieldNames, concurrency = 4 }: GetReservationFieldsArgs): Promise<any> {
    await this.authenticatedPage

    const reservationsWithFieldValues = await Bluebird.map(reservationIds, async (reservationId) => {
      const page = await this.getNewPage()

      await page.goto(VIEW_RESERVATION_URL(reservationId))

      for (let fieldName of fieldNames) {
        await page.waitForSelector(`[name="${fieldName}"]`)
      }

      const values = await Promise.all(
        fieldNames.map(async (fieldName: string) => await page.evaluate((name) => {
          const field = document.querySelector(`[name="${name}"]`) as HTMLInputElement

          return {
            name,
            value: field ? field.value : null
          }
        }, fieldName)))

      const valuesByFieldName = mapValues(keyBy(values, (it: any) => it.name), (it: any) => it.value)

      await page.close()

      return {
        reservationId,
        values: valuesByFieldName
      }
    }, { concurrency })


    return mapValues(
      keyBy(reservationsWithFieldValues, it => it.reservationId),
      it => it.values
    )
  }

  async refreshInbox() {
    const page = await this.authenticatedPage

    await page.goto(INBOX_URL)
    await page.waitForSelector('img[alt="Refresh"]')
    await page.evaluate(() => (window as any).doAction('refresh'))
    await page.waitForSelector('img[src*="bigrotation.gif"]')
    await page.waitForSelector('#inbox-table_info')
  }

  async createCoupon(config: CreateCouponParams) {
    const { code, name, status, logic, type, allowedHomes, allowedReservationSources, allowedReservationTypes, comments, discount, salePeriod, seasonPeriods } = config

    const statusId = CouponStatus[ status ]
    const logicId  = CouponLogic[ logic ]
    const typeId   = CouponType[ type ]

    if (!statusId)
      throw new Error('Invalid coupon status')

    if (!logicId)
      throw new Error('Invalid coupon logic')

    if (!typeId)
      throw new Error('Invalid coupon type')

    // const page = await this.getNewPage()
    const page = await this.authenticatedPage

    await page.goto(COUPON_FORM_URL)
    await page.waitForSelector('#code')

    // Fill first tab
    await page.type('#code', code)
    await page.type('#name', name)
    await page.select('#status_id', statusId)
    await page.select('#logic_id', logicId)
    await page.select('#type_id', typeId)

    // Fill discount type and amount
    switch (discount.type) {
      case 'percent':
        await page.click('[name="logictype_id"][value="1"]')
        await page.evaluate((v: number) => (document.querySelector('#percent_value') as HTMLInputElement).value = `${v.toFixed(1)}%`, discount.amount)
        break

      case 'value':
        await page.click('[name="logictype_id"][value="2"]')
        await page.evaluate((v: number) => (document.querySelector('#amount_value') as HTMLInputElement).value = `$${v.toFixed(2)}`, discount.amount)
        break

      case 'freeNights':
        await page.click('[name="logictype_id"][value="3"]')
        await page.select('#nights_limit', `${discount.maxNights}`)
        await page.select('#nights_free', `${discount.freeNights}`)
        break

      case 'nightlyValue':
        await page.click('[name="logictype_id"][value="4"]')
        await page.evaluate((v: number) => (document.querySelector('#amount_nightly_value') as HTMLInputElement).value = `$${v.toFixed(2)}`, discount.amount)
        break
    }

    // If comments, select comments tab and fill it
    if (comments) {
      await page.click('[href="#tab2"]')
      await page.waitForSelector('[name="description"]')
      await page.type('[name="description"]', comments)
    }

    // Select periods tab
    await page.click('[href="#tabPeriods"]')
    await page.waitForSelector('#startdate')

    // Fill start date
    await page.evaluate((startDate: string) => {
      (document.querySelector('#startdate') as HTMLInputElement).value = startDate
    }, formatDate(salePeriod.startDate, 'MM/DD/YYYY'))

    // Fill end date
    await page.evaluate((endDate: string) => {
      (document.querySelector('#enddate') as HTMLInputElement).value = endDate
    }, formatDate(salePeriod.endDate, 'MM/DD/YYYY'))

    // select allowed homes tab
    await page.click('[href="#tabLocations"]')
    await page.waitForSelector('[name="homes_allow[]"]')

    // fill allowed homes
    if (allowedHomes === 'all')
      await page.click('input[value="Check All Homes"]')
    else if (Array.isArray(allowedHomes)) {
      await Promise.all(
        allowedHomes.map(
          async it => await page.evaluate(
            (homeId) => (document.querySelector(`[home_id="${homeId}"]`) as HTMLInputElement).checked = true,
            it
          )))
    }

    // select allowed reservation types tab
    await page.click('[href="#tabReservationTypes"]')
    await page.waitForSelector('[name="reservation_types_allow[]"]')

    // fill allowed reservation types
    if (allowedReservationTypes === 'all') {
      await page.click('#tabReservationTypes input[value="Check All"]')
    } else if (Array.isArray(allowedReservationTypes)) {
      await Promise.all(
        allowedReservationTypes.map(
          async it => await page.evaluate(
            (typeId) => (document.querySelector(`[name="reservation_types_allow[]"][value="${typeId}"]`) as HTMLInputElement).checked = true,
            ReservationType[ it ]
          )))
    }

    // select allowed reservation source tab
    await page.click('[href="#tabReservationModules"]')
    await page.waitForSelector('[name="reservation_madetypes_allow[]"]')

    // fill allowed reservation sources
    if (allowedReservationSources === 'all') {
      await page.click('#tabReservationModules input[value="Check All"]')
    } else if (Array.isArray(allowedReservationSources)) {
      await Promise.all(
        allowedReservationSources.map(
          async it => await page.evaluate(
            (typeId) => (document.querySelector(`[name="reservation_types_allow[]"][value="${typeId}"]`) as HTMLInputElement).checked = true,
            ReservationSource[ it ]
          )))
    }

    // Submit form
    await page.click('[type="submit"][value="Submit"]')
    await page.waitForSelector('.alert-success')

    // Fill season periods
    for (let seasonPeriod of seasonPeriods) {
      await page.click('[href="#tabPeriods"]')
      await page.waitForSelector('#startdate')

      await page.select('#datetype_id_new', SeasonPeriodType[ seasonPeriod.type ])

      await page.evaluate((endDate: string) => {
        (document.querySelector('#startdate_new') as HTMLInputElement).value = endDate
      }, formatDate(seasonPeriod.startDate, 'MM/DD/YYYY'))

      await page.evaluate((endDate: string) => {
        (document.querySelector('#enddate_new') as HTMLInputElement).value = endDate
      }, formatDate(seasonPeriod.endDate, 'MM/DD/YYYY'))

      await page.click('[type="submit"][value="Submit"]')
      await page.waitForSelector('.alert-success')
    }
  }

  async close() {
    await (await this.browser).close()
  }
}