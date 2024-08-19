import { baseFetchAsync } from './base-fetch';

export const deleteAsync = async (url: string, token?: string): Promise<any> =>
  baseFetchAsync(url, 'DELETE', null, token);
