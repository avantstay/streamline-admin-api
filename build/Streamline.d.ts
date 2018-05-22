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
    });
    private authenticate(page);
    backupTemplate(templateId: number, destinationFolder: string): Promise<void>;
    updateEmailTemplate(templateId: number, newTemplateHtml: string): Promise<void>;
    updateHomeNetworkId(homeLocationId: number, newNetworkId: number): Promise<void>;
    close(): Promise<void>;
}
