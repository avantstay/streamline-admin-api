export const BASE_URL = 'https://admin.streamlinevrs.com'
export const EMAIL_TEMPLATE_URL = (templateId: number, companyId: string | number) => `${BASE_URL}/editor_email_company_document_template.html?template_id=${templateId}&company_id=${companyId}`
export const EMAIL_STREAMSIGN_TEMPLATE_URL = (templateId: number, companyId: string | number) => `${BASE_URL}/edit_company_document_template.html?template_id=${templateId}&company_id=${companyId}`
export const VIEW_RESERVATION_URL = (reservationId: number) => `${BASE_URL}/ds_reservation_info.html?reservation_id=${reservationId}`
export const VIEW_PROPERTY_URL = (propertyId: number) => `${BASE_URL}/ds_home_details.html?home_id=${propertyId}`