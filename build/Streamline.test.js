"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var Streamline_1 = __importDefault(require("../src/Streamline"));
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var chai_1 = require("chai");
var templateId = 27835;
var streamline;
var credentials = {
    username: process.env.STREAMLINE_USERNAME,
    password: process.env.STREAMLINE_PASSWORD
};
describe('Email templates', function () {
    before(function () {
        streamline = new Streamline_1.default(__assign({}, credentials, { headless: false }));
    });
    after(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, streamline.close()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Backup template', function () { return __awaiter(_this, void 0, void 0, function () {
        var tempDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tempDir = path.join(__dirname, 'temp');
                    if (!fs.existsSync(tempDir))
                        fs.mkdirSync(tempDir);
                    return [4 /*yield*/, streamline.backupTemplate(templateId, tempDir)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Update template', function () { return __awaiter(_this, void 0, void 0, function () {
        var newTemplateHtml;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    newTemplateHtml = "<html><body>" + new Date().toISOString() + "</body></html>";
                    return [4 /*yield*/, streamline.updateEmailTemplate(templateId, newTemplateHtml)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    // it('Update StreamSign template', async () => {
    //   const newTemplateHtml = `<html><body>${new Date().toISOString()}</body></html>`
    //   await streamline.updateStreamSignEmailTemplate(33751, newTemplateHtml)
    // })
    it('Update home network id', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, streamline.updateHomeNetworkId(209911, 314136)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Reply an email', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, streamline.replyEmail(56556933, "<p>Hey ho, let's go! " + new Date().toISOString() + "</p>")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Get reservation extra fields', function () { return __awaiter(_this, void 0, void 0, function () {
        var fieldNames, reservationIds, reservationFields;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fieldNames = ['last_name', 'payment_comments', 'client_comments'];
                    reservationIds = [11619171, 11618996, 11618980, 11617239];
                    return [4 /*yield*/, streamline.getReservationsFields({
                            fieldNames: fieldNames,
                            reservationIds: reservationIds
                        })];
                case 1:
                    reservationFields = _a.sent();
                    chai_1.expect(Object.keys(reservationFields).length).to.equal(reservationIds.length);
                    chai_1.expect(Object.keys(reservationFields[11619171]).length).to.equal(fieldNames.length);
                    return [2 /*return*/];
            }
        });
    }); });
    it('Create coupon', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, streamline.createCoupon({
                        code: 'TEST009',
                        name: 'Test only 009',
                        status: 'active',
                        logic: 'regular',
                        type: 'oneTime',
                        discount: {
                            type: 'percent',
                            amount: 10
                        },
                        salePeriod: {
                            startDate: '2018-09-10',
                            endDate: '2019-09-10'
                        },
                        seasonPeriods: [
                            {
                                startDate: '2018-09-10',
                                endDate: '2019-09-10',
                                type: 'checkIn'
                            },
                            {
                                startDate: '2018-09-10',
                                endDate: '2019-09-10',
                                type: 'creation'
                            }
                        ],
                        allowedHomes: 'all',
                        allowedReservationTypes: 'all',
                        allowedReservationSources: 'all'
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
