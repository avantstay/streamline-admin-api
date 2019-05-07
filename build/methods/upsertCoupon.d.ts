import { StreamLineClient } from '../client';
export declare const upsertCoupon: ({ client, couponId, code, name, percentValue, amountValue, startDate, endDate }: {
    client: StreamLineClient | Promise<StreamLineClient>;
    couponId?: number | undefined;
    code: string;
    name: string;
    percentValue: number;
    amountValue: number;
    startDate: Date;
    endDate: Date;
}) => Promise<void>;
