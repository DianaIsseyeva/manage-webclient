import { ClientController } from '@/pages/api/controllers/client';
import { ClientType } from '@/types';
import { useEffect, useState } from 'react';

export const Client = () => {
  const [clients, setClients] = useState<ClientType[]>([]);

  useEffect(() => {
    (async () => {
      const meResponse = await ClientController.getClients();
      setClients(meResponse);
    })();
  }, []);

  return (
    <div>
      {clients?.map(client => (
        <div key={client.id} style={{ display: 'flex' }}>
          <p>{client.name}</p>
          <p>{client.manager_id}</p>
          <p>{client.date_of_birth}</p>
          <p>{client.gender}</p>
          <p>{client.status}</p>
        </div>
      ))}
    </div>
  );
};
