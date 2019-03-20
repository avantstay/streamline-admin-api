import { StreamLineClient } from '../client';
export declare const updatePropertyFields: ({ client, propertyId, fields }: {
    client: StreamLineClient | Promise<StreamLineClient>;
    propertyId: number;
    fields: {
        [name: string]: string;
    };
}) => Promise<void>;
