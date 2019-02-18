/// <reference types="request" />
import * as request from 'request';
export declare type ClientMethod = (url: string, options: {
    form?: any;
    body?: any;
} & any, callback: (err: Error, response: any, body: string) => void) => void;
export declare type StreamLineClient = {
    get: ClientMethod;
    post: ClientMethod;
    put: ClientMethod;
    delete: ClientMethod;
};
export declare const createStreamLineClient: (username: string, password: string) => Promise<StreamLineClient>;
export declare const clientGet: (client: StreamLineClient, url: string, options?: any) => Promise<{
    response: request.Response;
    body: any;
}>;
export declare const clientPost: (client: StreamLineClient, url: string, options?: any) => Promise<{
    response: request.Response;
    body: any;
}>;
