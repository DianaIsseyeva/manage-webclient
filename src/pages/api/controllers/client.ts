import { ClientType } from '@/types';
import { BaseController } from './base';

export class ClientController extends BaseController {
  public static getClients(): Promise<ClientType[]> {
    return this.get<ClientType[]>(`http://localhost:3001/client`);
  }

  public static createClient(body: ClientType) {
    return this.post<ClientType>(`http://localhost:3001/client`, body);
  }

  public static updateClient(body: ClientType) {
    return this.put<ClientType>(`http://localhost:3001/client/${body.id}`, body);
  }

  public static deleteClient(id: string) {
    return this.delete<ClientType>(`http://localhost:3001/client/${id}`);
  }
}
