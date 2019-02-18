import { StreamLineClient } from '../client';
export declare const getRegularEmailTemplate: ({ client, companyId, templateId }: {
    client: StreamLineClient | Promise<StreamLineClient>;
    companyId: string | number;
    templateId: number;
    templateBody: string;
}) => Promise<string>;
