import { StreamLineClient } from '../client';
export declare const getPropertyExtraFields: ({ client, propertyId, fields }: {
    client: StreamLineClient | Promise<StreamLineClient>;
    propertyId: number;
    fields: string[];
}) => Promise<{
    name: string;
    value: string;
}[]>;
