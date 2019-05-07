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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = __importDefault(require("cheerio"));
var format_1 = __importDefault(require("date-fns/format"));
var client_1 = require("../client");
var urls_1 = require("../urls");
exports.upsertCoupon = function (_a) {
    var client = _a.client, couponId = _a.couponId, code = _a.code, name = _a.name, percentValue = _a.percentValue, amountValue = _a.amountValue, startDate = _a.startDate, endDate = _a.endDate;
    return __awaiter(_this, void 0, void 0, function () {
        var authenticatedClient, url, body, $, formElements;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client];
                case 1:
                    authenticatedClient = _b.sent();
                    url = urls_1.EDIT_COUPON_URL(couponId);
                    return [4 /*yield*/, client_1.clientGet(authenticatedClient, url)];
                case 2:
                    body = (_b.sent()).body;
                    $ = cheerio_1.default.load(body);
                    $('[name="homes_allow[]"]').prop('checked', true);
                    formElements = $('form').serializeArray().reduce(function (prev, curr) {
                        var name = curr.name.replace('[]', '');
                        if (prev.hasOwnProperty(name) && Array.isArray(prev[name])) {
                            prev[name].push(curr.value);
                        }
                        else if (prev.hasOwnProperty(name)) {
                            prev[name] = [prev[name], curr.value];
                        }
                        else {
                            prev[name] = curr.value;
                        }
                        return prev;
                    }, {});
                    return [4 /*yield*/, client_1.clientPost(authenticatedClient, url, {
                            form: __assign({}, formElements, {
                                code: code,
                                name: name,
                                percent_value: percentValue.toFixed(1) + "%",
                                amount_value: "$" + amountValue.toFixed(2),
                                startdate: format_1.default(startDate, 'MM/DD/YYYY'),
                                enddate: format_1.default(endDate, 'MM/DD/YYYY'),
                                startdate_100511: format_1.default(startDate, 'MM/DD/YYYY'),
                                enddate_100511: format_1.default(endDate, 'MM/DD/YYYY'),
                                startdate_new: format_1.default(startDate, 'MM/DD/YYYY'),
                                enddate_new: format_1.default(endDate, 'MM/DD/YYYY'),
                            }),
                        })];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
