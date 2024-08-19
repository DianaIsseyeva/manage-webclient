export type ClientType = {
  id: string;
  name: string;
  manager_id: string;
  date_of_birth: string;
  phone: string;
  gender: 'male' | 'female';
  status: 'active' | 'archive' | 'pending';
};
