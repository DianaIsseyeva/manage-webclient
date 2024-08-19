import { ManagerType } from '@/types';
import { BaseController } from './base';

export class ManagerController extends BaseController {
  public static getManagers(): Promise<ManagerType[]> {
    return this.get<ManagerType[]>(`http://localhost:3001/manager`);
  }
}
