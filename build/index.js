"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("./client");
exports.createStreamLineClient = client_1.createStreamLineClient;
var getReservationExtraFields_1 = require("./methods/getReservationExtraFields");
exports.getReservationExtraFields = getReservationExtraFields_1.getReservationExtraFields;
var getPropertyExtraFields_1 = require("./methods/getPropertyExtraFields");
exports.getPropertyExtraFields = getPropertyExtraFields_1.getPropertyExtraFields;
var getRegularEmailTemplate_1 = require("./methods/getRegularEmailTemplate");
exports.getRegularEmailTemplate = getRegularEmailTemplate_1.getRegularEmailTemplate;
var updatePropertyFields_1 = require("./methods/updatePropertyFields");
exports.updatePropertyFields = updatePropertyFields_1.updatePropertyFields;
var updateRegularEmailTemplate_1 = require("./methods/updateRegularEmailTemplate");
exports.updateRegularEmailTemplate = updateRegularEmailTemplate_1.updateRegularEmailTemplate;
var updateStreamSignEmailTemplate_1 = require("./methods/updateStreamSignEmailTemplate");
exports.updateStreamSignEmailTemplate = updateStreamSignEmailTemplate_1.updateStreamSignEmailTemplate;
