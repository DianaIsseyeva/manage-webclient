import { baseFetchAsync } from './base-fetch';

export const postAsync = async (url: string, body: string, token?: string): Promise<any> =>
  baseFetchAsync(url, 'POST', body, token);
