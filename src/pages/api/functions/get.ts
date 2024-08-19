import { baseFetchAsync } from './base-fetch';

export const getAsync = async (url: string, token?: string): Promise<any> => baseFetchAsync(url, 'GET', null, token);
