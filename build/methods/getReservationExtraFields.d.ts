import { StreamLineClient } from '../client';
export declare const getReservationExtraFields: ({ client, reservationId, fields }: {
    client: StreamLineClient | Promise<StreamLineClient>;
    reservationId: number;
    fields: string[];
}) => Promise<{
    name: string;
    value: string;
}[]>;
