export const BASE_URL = 'https://admin.streamlinevrs.com'
export const EMAIL_TEMPLATE_URL = (templateId: number, companyId: string | number) => `${BASE_URL}/editor_email_company_document_template.html?template_id=${templateId}&company_id=${companyId}`
export const EMAIL_STREAMSIGN_TEMPLATE_URL = (templateId: number, companyId: string | number) => `${BASE_URL}/edit_company_document_template.html?template_id=${templateId}&company_id=${companyId}`
export const VIEW_RESERVATION_URL = (reservationId: number) => `${BASE_URL}/edit_reservation.html?reservation_id=${reservationId}`