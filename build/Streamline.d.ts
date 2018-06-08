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
    private browser;
    private readonly username;
    private readonly password;
    private readonly companyId;
    private readonly page;
    private readonly timezone;
    constructor(params: {
        username: string;
        password: string;
        companyId: number;
        headless?: boolean;
        timezone?: number;
        puppeteerArgs?: Array<string>;
    });
    private authenticate(page);
    backupTemplate(templateId: number, destinationFolder: string): Promise<void>;
    updateEmailTemplate(templateId: number, newTemplateHtml: string): Promise<void>;
    updateHomeNetworkId(homeLocationId: number, newNetworkId: number): Promise<void>;
    getAllUnactionedEmails(): Promise<Array<Email>>;
    openEmail(emailId: string | number): Promise<void>;
    replyEmail(emailId: string | number, responseHtml: string): Promise<void>;
    close(): Promise<void>;
}
