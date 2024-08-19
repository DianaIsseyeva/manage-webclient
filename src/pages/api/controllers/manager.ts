import { ManagerType } from '@/types';
import { BaseController } from './base';

export class ManagerController extends BaseController {
  public static getManagers(): Promise<ManagerType[]> {
    return this.get<ManagerType[]>(`http://localhost:3001/manager`);
  }
  public static createManager(body: { id: string; name: string }) {
    return this.post<any>(`http://localhost:3001/manager`, body);
  }
  public static updateManager(body: { id: string; name: string }) {
    return this.put<any>(`http://localhost:3001/manager/${body.id}`, body);
  }
  public static deleteManager(id: string) {
    return this.delete<any>(`http://localhost:3001/manager/${id}`);
  }
}
