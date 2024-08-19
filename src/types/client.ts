export type Client = Person & {
  manager_id: string;
  date_of_birth: string;
  phone: string;
  gender: 'male' | 'female';
  status: 'active' | 'archive' | 'pending';
};
