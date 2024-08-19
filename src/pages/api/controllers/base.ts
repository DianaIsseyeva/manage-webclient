import axios from 'axios';

export class BaseController {
  private static async baseFetch<T>(url: string, method?: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any): Promise<T> {
    try {
      switch (method) {
        case 'POST':
          return (await axios.post(url, data)).data;
        case 'PUT':
          return (await axios.put(url, data)).data;
        case 'DELETE':
          return (await axios.delete(url, { data })).data;
        case 'GET':
        default:
          return (await axios.get(url)).data;
      }
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  }

  protected static async delete<T>(url: string, data?: any): Promise<T> {
    return this.baseFetch<T>(url, 'DELETE', data);
  }

  protected static async put<T>(url: string, body: any): Promise<T> {
    return this.baseFetch<T>(url, 'PUT', body);
  }

  protected static async get<T>(url: string): Promise<T> {
    return this.baseFetch<T>(url, 'GET');
  }

  protected static async post<T>(url: string, body?: any): Promise<T> {
    return this.baseFetch<T>(url, 'POST', body);
  }
}
