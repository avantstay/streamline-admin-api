export interface Email {
    id: number;
    name: string;
    email: string;
    subject: string;
    date: string;
}
export default class Streamline {
    private browser;
    private readonly username;
    private readonly password;
    private readonly companyId;
    private readonly page;
    constructor(params: {
        username: string;
        password: string;
        companyId: number;
        headless?: boolean;
    });
    private authenticate(page);
    backupTemplate(templateId: number, destinationFolder: string): Promise<void>;
    updateEmailTemplate(templateId: number, newTemplateHtml: string): Promise<void>;
    updateHomeNetworkId(homeLocationId: number, newNetworkId: number): Promise<void>;
    getAllUnactionedEmails(): Promise<Array<Email>>;
    replyEmail(emailId: string | number, responseHtml: string): Promise<void>;
    close(): Promise<void>;
}
