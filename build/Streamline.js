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
var BASE_URL = 'https://admin.streamlinevrs.com';
var LOGIN_URL = BASE_URL + "/auth_login.html?logout=1";
var EMAIL_TEMPLATE_URL = function (templateId, companyId) { return BASE_URL + "/editor_email_company_document_template.html?template_id=" + templateId + "&company_id=" + companyId; };
var EDIT_HOME_URL = function (homeId) { return BASE_URL + "/edit_home.html?home_id=" + homeId; };
var Streamline = /** @class */ (function () {
    function Streamline(params) {
        var _this = this;
        this.username = params.username;
        this.password = params.password;
        this.companyId = params.companyId;
        this.browser = puppeteer_1.default.launch({ headless: true });
        this.page = this.browser
            .then(function (browser) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, browser.newPage()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); })
            .then(function (page) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.authenticate(page)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); });
    }
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
                        return [4 /*yield*/, page.waitForSelector('#page_title_bar_title')];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, page];
                }
            });
        });
    };
    Streamline.prototype.backupTemplate = function (templateId, destinationFolder) {
        return __awaiter(this, void 0, void 0, function () {
            var page, currentTemplate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page];
                    case 1:
                        page = _a.sent();
                        return [4 /*yield*/, page.goto(EMAIL_TEMPLATE_URL(templateId, this.companyId))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('[title=Source]')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.evaluate(function () { return document.querySelector('textarea[name=page_text]').value; })];
                    case 4:
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
                    case 0: return [4 /*yield*/, this.page];
                    case 1:
                        page = _a.sent();
                        return [4 /*yield*/, page.goto(EMAIL_TEMPLATE_URL(templateId, this.companyId))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('[title=Source]')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.click('[title=Source]')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, page.waitFor(500)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, page.evaluate(function () { return document.querySelector('textarea[role=textbox]').value = ''; })];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, page.type('textarea[role=textbox]', newTemplateHtml)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, page.click('[name=modify_button]')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, page.waitForSelector('.tooltip')];
                    case 9:
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
                    case 0: return [4 /*yield*/, this.page];
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