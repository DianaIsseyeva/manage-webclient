import { ClientType } from '@/types';
import { BaseController } from './base';

export class ClientController extends BaseController {
  public static getClients(): Promise<ClientType[]> {
    return this.get<ClientType[]>(`http://localhost:3001/client`);
  }
}
