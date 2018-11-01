export interface GetReservationFieldsArgs {
    reservationIds: Array<number>;
    fieldNames: Array<string>;
    concurrency?: number;
}
export interface SeasonPeriod {
    type: 'creation' | 'checkIn' | 'checkOut';
    startDate: Date | string;
    endDate: Date | string;
    minNights?: number;
    maxNights?: number;
}
export interface CreateCouponParams {
    code: string;
    name: string;
    status: 'pending' | 'active' | 'inactive' | 'redeemed';
    logic: 'regular' | 'group' | 'autoApply';
    type: 'oneTime' | 'repeatable';
    comments?: string;
    salePeriod: {
        startDate: Date | string;
        endDate: Date | string;
    };
    seasonPeriods: Array<SeasonPeriod>;
    allowedHomes: 'all' | Array<number>;
    allowedReservationTypes: 'all' | Array<'STA' | 'OWN' | 'NPG' | 'POS' | 'PRE' | 'WHL' | 'PGO' | 'HAFamL' | 'PDWTA' | 'Airbnb-NI' | 'BPal' | 'BPal-PDWTA' | 'BPal-WHL' | 'HAFamOLB' | 'RentalsUnited-WHL' | 'SC-ABnB' | 'RentalsUnited-PDWTA'>;
    allowedReservationSources: 'all' | Array<'FDR' | 'ADM' | 'OWN' | 'WSR' | 'BCR' | 'NET' | 'PDWTA'>;
    discount: {
        type: 'percent' | 'value' | 'nightlyValue' | 'freeNights';
        amount?: number;
        maxNights?: number;
        freeNights?: number;
    };
}
export default class Streamline {
    private browser;
    private readonly username;
    private readonly password;
    private readonly authenticatedPage;
    private readonly timezone;
    constructor(params: {
        username: string;
        password: string;
        headless?: boolean;
        timezone?: number;
        puppeteerArgs?: Array<string>;
    });
    private getNewPage();
    private authenticate(page);
    getTemplateById(templateId: number): Promise<any>;
    backupTemplate(templateId: number, destinationFolder: string): Promise<void>;
    updateEmailTemplate(templateId: number, newTemplateHtml: string): Promise<void>;
    updateStreamSignEmailTemplate(templateId: number, newTemplateHtml: string): Promise<void>;
    updateHomeNetworkId(homeLocationId: number, newNetworkId: number): Promise<void>;
    replyEmail(emailId: string | number, responseHtml: string): Promise<void>;
    getReservationsFields({reservationIds, fieldNames, concurrency}: GetReservationFieldsArgs): Promise<any>;
    refreshInbox(): Promise<void>;
    createCoupon(config: CreateCouponParams): Promise<void>;
    close(): Promise<void>;
}
