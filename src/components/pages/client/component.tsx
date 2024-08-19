import { ClientController } from '@/pages/api/controllers/client';
import { ClientType } from '@/types';
import { Button, Input, Modal, Popconfirm, Select, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

const { Text } = Typography;
const { Option } = Select;

export const Client = () => {
  const [clients, setClients] = useState<ClientType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<ClientType | null>(null);
  const [editedClient, setEditedClient] = useState<Partial<ClientType>>({});

  useEffect(() => {
    (async () => {
      const clientsResponse = await ClientController.getClients();
      setClients(clientsResponse);
    })();
  }, []);

  const showEditModal = (client: ClientType) => {
    setCurrentClient(client);
    setEditedClient(client);
    setIsModalOpen(true);
  };

  const handleEditOk = () => {
    if (currentClient) {
      setClients(prevClients =>
        prevClients.map(client => (client.id === currentClient.id ? { ...client, ...editedClient } : client))
      );
      setIsModalOpen(false);
    }
  };

  const handleEditCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = (clientId: string) => {
    setClients(prevClients => prevClients.filter(client => client.id !== clientId));
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: 'Manager ID',
      dataIndex: 'manager_id',
      key: 'manager_id',
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: 'Date of Birth',
      dataIndex: 'date_of_birth',
      key: 'date_of_birth',
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: ClientType) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button onClick={() => showEditModal(record)}>Edit</Button>
          <Popconfirm
            title='Are you sure to delete this client?'
            onConfirm={() => handleDelete(record.id)}
            okText='Yes'
            cancelText='No'
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={clients} rowKey='id' />

      {ReactDOM.createPortal(
        <Modal title='Edit Client' visible={isModalOpen} onOk={handleEditOk} onCancel={handleEditCancel}>
          <Input
            value={editedClient.name}
            onChange={e => setEditedClient({ ...editedClient, name: e.target.value })}
            placeholder='Name'
          />
          <Input
            value={editedClient.manager_id}
            onChange={e => setEditedClient({ ...editedClient, manager_id: e.target.value })}
            placeholder='Manager ID'
          />
          <Input
            value={editedClient.date_of_birth}
            onChange={e => setEditedClient({ ...editedClient, date_of_birth: e.target.value })}
            placeholder='Date of Birth'
          />
          <Select
            value={editedClient.gender}
            onChange={value => setEditedClient({ ...editedClient, gender: value })}
            placeholder='Gender'
            style={{ width: '100%', marginBottom: '16px' }}
          >
            <Option value='male'>Male</Option>
            <Option value='female'>Female</Option>
          </Select>
          <Select
            value={editedClient.status}
            onChange={value => setEditedClient({ ...editedClient, status: value })}
            placeholder='Status'
            style={{ width: '100%' }}
          >
            <Option value='active'>Active</Option>
            <Option value='inactive'>Inactive</Option>
          </Select>
        </Modal>,
        document.body
      )}
    </div>
  );
};
