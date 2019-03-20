"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_URL = 'https://admin.streamlinevrs.com';
exports.EMAIL_TEMPLATE_URL = function (templateId, companyId) { return exports.BASE_URL + "/editor_email_company_document_template.html?template_id=" + templateId + "&company_id=" + companyId; };
exports.EMAIL_STREAMSIGN_TEMPLATE_URL = function (templateId, companyId) { return exports.BASE_URL + "/edit_company_document_template.html?template_id=" + templateId + "&company_id=" + companyId; };
exports.VIEW_RESERVATION_URL = function (reservationId) { return exports.BASE_URL + "/ds_reservation_info.html?reservation_id=" + reservationId; };
exports.VIEW_PROPERTY_URL = function (propertyId) { return exports.BASE_URL + "/ds_home_details.html?home_id=" + propertyId; };
