import { baseFetchAsync } from './base-fetch';

export const putAsync = async (url: string, body: string, token?: string): Promise<any> =>
  baseFetchAsync(url, 'PUT', body, token);
