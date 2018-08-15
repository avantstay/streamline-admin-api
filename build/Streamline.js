"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var puppeteer_1 = __importDefault(require("puppeteer"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var lodash_1 = require("lodash");
var bluebird_1 = __importDefault(require("bluebird"));
var BASE_URL = 'https://admin.streamlinevrs.com';
var UNACTIONED_EMAILS_URL = BASE_URL + "/ds_emails.html?group_id=10&responsible_processor_id=0&system_queue_id=1&all_global_accounts=0&ss=1&page=1&show_all=1&page_id=1&order=creation_date%20DESC";
var LOGIN_URL = BASE_URL + "/auth_login.html?logout=1";
var REPLY_EMAIL_URL = function (id) { return BASE_URL + "/edit_system_email_reply.html?id=" + id + "&replay_all=1"; };
var OPEN_EMAIL_URL = function (id) { return BASE_URL + "/edit_system_email.html?id=" + id; };
var EMAIL_TEMPLATE_URL = function (templateId, companyId) { return BASE_URL + "/editor_email_company_document_template.html?template_id=" + templateId + "&company_id=" + companyId; };
var EDIT_HOME_URL = function (homeId) { return BASE_URL + "/edit_home.html?home_id=" + homeId; };
var VIEW_RESERVATION_URL = function (reservationId) { return BASE_URL + "/edit_reservation.html?reservation_id=" + reservationId; };
var Streamline = /** @class */ (function () {
    function Streamline(params) {
        var _this = this;
        this.username = params.username;
        this.password = params.password;
        this.companyId = params.companyId;
        this.timezone = params.timezone || -7;
        this.browser = puppeteer_1.default.launch({
            headless: !!params.headless,
            args: (params.puppeteerArgs || []).slice()
        });
        this.authenticatedPage = this.getNewPage()
            .then(function (page) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.authenticate(page)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); });
    }
    Streamline.prototype.getNewPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.browser.then(function (browser) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, browser.newPage()];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); })];
            });
        });
    };
    Streamline.prototype.authenticate = function (page) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, page.goto(LOGIN_URL)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('#user_login')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.type('#user_login', this.username)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.type('#user_password', this.password)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, page.click('#submit_button')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, page.waitForFunction(function () { return /index.html/.test(window.location.pathname); })
                            // await page.waitForSelector('#page_title_bar_title')
                        ];
                    case 6:
                        _a.sent();
                        // await page.waitForSelector('#page_title_bar_title')
                        return [2 /*return*/, page];
                }
            });
        });
    };
    Streamline.prototype.getTemplateById = function (templateId) {
        return __awaiter(this, void 0, void 0, function () {
            var page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authenticatedPage];
                    case 1:
                        page = _a.sent();
                        return [4 /*yield*/, page.goto(EMAIL_TEMPLATE_URL(templateId, this.companyId))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('[title=Source]')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.evaluate(function () { return document.querySelector('textarea[name=page_text]').value; })];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Streamline.prototype.backupTemplate = function (templateId, destinationFolder) {
        return __awaiter(this, void 0, void 0, function () {
            var currentTemplate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTemplateById(templateId)];
                    case 1:
                        currentTemplate = _a.sent();
                        fs.writeFileSync(path.join(destinationFolder, "template-" + templateId + ".html"), currentTemplate);
                        return [2 /*return*/];
                }
            });
        });
    };
    Streamline.prototype.updateEmailTemplate = function (templateId, newTemplateHtml) {
        return __awaiter(this, void 0, void 0, function () {
            var page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authenticatedPage];
                    case 1:
                        page = _a.sent();
                        return [4 /*yield*/, page.goto(EMAIL_TEMPLATE_URL(templateId, this.companyId))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('[title=Source]')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.waitFor(3000)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, page.click('[title=Source]')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('textarea[role=textbox]')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, page.evaluate(function (newTemplate) { return document.querySelector('textarea[role=textbox]').value = newTemplate; }, newTemplateHtml)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, page.click('[name=modify_button]')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('.alert')];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, page.waitFor(1000)];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Streamline.prototype.updateHomeNetworkId = function (homeLocationId, newNetworkId) {
        return __awaiter(this, void 0, void 0, function () {
            var page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authenticatedPage];
                    case 1:
                        page = _a.sent();
                        return [4 /*yield*/, page.goto(EDIT_HOME_URL(homeLocationId))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('input[name=property_variable_5028]')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.evaluate(function () { return document.querySelector('[name=property_variable_5028]').value = ''; })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, page.type('[name=property_variable_5028]', "" + newNetworkId)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, page.click('[type=submit][name=modify_button]')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('.yui-dialog #yui-gen0-button')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, page.click('.yui-dialog #yui-gen0-button')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, page.waitFor(1000)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('input[name=property_variable_5028]')];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Streamline.prototype.getAllUnactionedEmails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var page, emails, _i, emails_1, email, response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.authenticatedPage];
                    case 1:
                        page = _b.sent();
                        return [4 /*yield*/, page.goto(UNACTIONED_EMAILS_URL)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, page.waitForSelector('table.table_results')];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, page.evaluate(function (timezone) {
                                var table = document.querySelector('table.table_results');
                                var headCells = table.querySelectorAll('thead th');
                                var headCellsContent = Array.prototype.map.call(headCells, function (it) { return it.textContent; });
                                var fromCol = headCellsContent.findIndex(function (it) { return /from/i.test(it); });
                                var subjectCol = headCellsContent.findIndex(function (it) { return /subject/i.test(it); });
                                var dateCol = headCellsContent.findIndex(function (it) { return /date/i.test(it); });
                                var openCol = headCellsContent.findIndex(function (it) { return /open/i.test(it); });
                                var emailRows = table.querySelectorAll('tbody tr');
                                var timezoneFormatted = "" + (timezone > 0 ? '+' : '-') + Math.abs(timezone).toString().padStart(2, '0') + ":00";
                                return Array.prototype.map.call(emailRows, function (it) {
                                    var nameAndEmailContent = Array.prototype.map.call(it.querySelectorAll("td:nth-child(" + (fromCol + 1) + ") span"), function (it) { return it.textContent; });
                                    var name = (nameAndEmailContent.find(function (it) { return !/@[^.]+\./.test(it); }) || '').replace(/\(.+\)/g, '').trim();
                                    var email = nameAndEmailContent.find(function (it) { return /@[^.]+\./.test(it); });
                                    var opened = !!it.querySelector("td:nth-child(" + (openCol + 1) + ") img");
                                    var subjectLink = it.querySelector("td:nth-child(" + (subjectCol + 1) + ") a");
                                    var id = subjectLink.getAttribute('onclick').match(/\d+/)[0];
                                    var subject = subjectLink.textContent;
                                    var rawDate = it.querySelector("td:nth-child(" + (dateCol + 1) + ")").textContent;
                                    var dateFormatted = rawDate
                                        .replace(/(\d{2})\/(\d{2})\/(\d{2}) (\d{2}:\d{2}[ap]m)/i, "20$3-$1-$2T$4:00" + timezoneFormatted)
                                        .replace(/(\d{2}:\d{2}[ap]m)/i, function (it) {
                                        var hours = parseInt(it.match(/^(\d+)/)[1], 10);
                                        var minutes = parseInt(it.match(/:(\d+)/)[1], 10);
                                        var ampm = it.match(/([ap]m)$/)[1];
                                        if (/pm/i.test(ampm) && hours < 12)
                                            hours = hours + 12;
                                        if (/am/i.test(ampm) && hours === 12)
                                            hours = hours - 12;
                                        var sHours = hours.toString().padStart(2, '0');
                                        var sMinutes = minutes.toString().padStart(2, '0');
                                        return sHours + ":" + sMinutes;
                                    });
                                    return {
                                        id: id,
                                        name: name,
                                        email: email,
                                        subject: subject,
                                        opened: opened,
                                        date: new Date(dateFormatted).toISOString()
                                    };
                                });
                            }, this.timezone)];
                    case 4:
                        emails = _b.sent();
                        _i = 0, emails_1 = emails;
                        _b.label = 5;
                    case 5:
                        if (!(_i < emails_1.length)) return [3 /*break*/, 9];
                        email = emails_1[_i];
                        if (!email.email) return [3 /*break*/, 8];
                        return [4 /*yield*/, page.goto("https://admin.streamlinevrs.com/print_email_preview.html?id=" + email.id)];
                    case 6:
                        response = _b.sent();
                        _a = email;
                        return [4 /*yield*/, response.text()];
                    case 7:
                        _a.html = _b.sent();
                        _b.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 5];
                    case 9: return [2 /*return*/, lodash_1.uniqBy(emails.filter(function (it) { return it.email; }), 'id')];
                }
            });
        });
    };
    Streamline.prototype.openEmail = function (emailId) {
        return __awaiter(this, void 0, void 0, function () {
            var page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authenticatedPage];
                    case 1:
                        page = _a.sent();
                        return [4 /*yield*/, page.goto(OPEN_EMAIL_URL(emailId))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.waitFor(2000)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Streamline.prototype.replyEmail = function (emailId, responseHtml) {
        return __awaiter(this, void 0, void 0, function () {
            var page;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authenticatedPage];
                    case 1:
                        page = _a.sent();
                        return [4 /*yield*/, page.goto(REPLY_EMAIL_URL(emailId))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('[title=Source]')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.waitFor(3000)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, page.click('[title=Source]')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('textarea[role=textbox]')];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, page.evaluate(function (responseHtml) {
                                var textArea = document.querySelector('textarea[role=textbox]');
                                var originalContent = textArea.value;
                                textArea.value = originalContent.replace(/(<body.*?>)([^]*?)(-+\s?original message\s?-+)/i, "$1\n" + responseHtml + "\n<p>&nbsp;</p>\n$3");
                            }, responseHtml)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, page.evaluate(function () { return window.verifyForm(); })];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, page.waitFor(2000)];
                    case 9:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Streamline.prototype.getReservationsFields = function (_a) {
        var reservationIds = _a.reservationIds, fieldNames = _a.fieldNames, _b = _a.concurrency, concurrency = _b === void 0 ? 4 : _b;
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var reservationsWithFieldValues;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.authenticatedPage];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, bluebird_1.default.map(reservationIds, function (reservationId) { return __awaiter(_this, void 0, void 0, function () {
                                var _this = this;
                                var page, _i, fieldNames_1, fieldName, values, valuesByFieldName;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.getNewPage()];
                                        case 1:
                                            page = _a.sent();
                                            return [4 /*yield*/, page.goto(VIEW_RESERVATION_URL(reservationId))];
                                        case 2:
                                            _a.sent();
                                            _i = 0, fieldNames_1 = fieldNames;
                                            _a.label = 3;
                                        case 3:
                                            if (!(_i < fieldNames_1.length)) return [3 /*break*/, 6];
                                            fieldName = fieldNames_1[_i];
                                            return [4 /*yield*/, page.waitForSelector("[name=\"" + fieldName + "\"]")];
                                        case 4:
                                            _a.sent();
                                            _a.label = 5;
                                        case 5:
                                            _i++;
                                            return [3 /*break*/, 3];
                                        case 6: return [4 /*yield*/, Promise.all(fieldNames.map(function (fieldName) { return __awaiter(_this, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, page.evaluate(function (name) {
                                                                var field = document.querySelector("[name=\"" + name + "\"]");
                                                                return {
                                                                    name: name,
                                                                    value: field ? field.value : null
                                                                };
                                                            }, fieldName)];
                                                        case 1: return [2 /*return*/, _a.sent()];
                                                    }
                                                });
                                            }); }))];
                                        case 7:
                                            values = _a.sent();
                                            valuesByFieldName = lodash_1.mapValues(lodash_1.keyBy(values, function (it) { return it.name; }), function (it) { return it.value; });
                                            return [2 /*return*/, {
                                                    reservationId: reservationId,
                                                    values: valuesByFieldName
                                                }];
                                    }
                                });
                            }); }, { concurrency: concurrency })];
                    case 2:
                        reservationsWithFieldValues = _c.sent();
                        return [2 /*return*/, lodash_1.mapValues(lodash_1.keyBy(reservationsWithFieldValues, function (it) { return it.reservationId; }), function (it) { return it.values; })];
                }
            });
        });
    };
    Streamline.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.browser];
                    case 1: return [4 /*yield*/, (_a.sent()).close()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Streamline;
}());
exports.default = Streamline;
