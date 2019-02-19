import { StreamLineClient } from '../client';
export declare const updateStreamSignEmailTemplate: ({ client, companyId, templateId, templateBody }: {
    client: StreamLineClient | Promise<StreamLineClient>;
    companyId: string | number;
    templateId: number;
    templateBody: string;
}) => Promise<void>;
