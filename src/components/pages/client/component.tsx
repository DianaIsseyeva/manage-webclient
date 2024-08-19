import { ClientController } from '@/pages/api/controllers/client';
import { ClientType } from '@/types';
import { ReloadOutlined } from '@ant-design/icons'; // Импортируем иконку
import { Button, Input, Modal, Popconfirm, Select, Table, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';

const { Text } = Typography;
const { Option } = Select;

export const Client = () => {
  const [clients, setClients] = useState<ClientType[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<ClientType | null>(null);
  const [editedClient, setEditedClient] = useState<Partial<ClientType>>({});
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsClient(true);
    (async () => {
      const clientsResponse = await ClientController.getClients();
      setClients(clientsResponse);
    })();
  }, []);

  useEffect(() => {
    filterClientsByStatus(filterStatus);
  }, [clients, filterStatus]);

  const filterClientsByStatus = (status: string | undefined) => {
    if (!status) {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client => client.status === status);
      setFilteredClients(filtered);
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setFilterStatus(value);
  };

  const handleResetFilter = () => {
    setFilterStatus(undefined);
  };

  const showEditModal = (client?: ClientType) => {
    if (client) {
      setCurrentClient(client);
      const [year, month, day] = moment(client.date_of_birth).format('YYYY-MM-DD').split('-');
      setYear(year);
      setMonth(month);
      setDay(day);
      setEditedClient(client);
      setIsEditing(true);
    } else {
      setCurrentClient(null);
      setYear('');
      setMonth('');
      setDay('');
      setEditedClient({});
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleEditOk = async () => {
    try {
      const formattedDateOfBirth = `${year}-${month}-${day}`;

      if (isEditing && currentClient) {
        const updatedClient: ClientType = {
          id: currentClient.id,
          name: editedClient.name || '',
          manager_id: editedClient.manager_id || '',
          date_of_birth: formattedDateOfBirth,
          phone: editedClient.phone || '',
          gender: editedClient.gender || 'male',
          status: editedClient.status || 'active',
        };
        await ClientController.updateClient(updatedClient);
        setClients(prevClients => prevClients.map(client => (client.id === currentClient.id ? updatedClient : client)));
      } else {
        const newClient: ClientType = {
          id: uuidv4(),
          name: editedClient.name || '',
          manager_id: editedClient.manager_id || '',
          date_of_birth: formattedDateOfBirth,
          phone: editedClient.phone || '',
          gender: editedClient.gender || 'male',
          status: editedClient.status || 'active',
        };
        await ClientController.createClient(newClient);
        setClients([...clients, newClient]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating or creating client:', error);
    }
  };

  const handleDelete = async (clientId: string) => {
    try {
      await ClientController.deleteClient(clientId);
      setClients(prevClients => prevClients.filter(client => client.id !== clientId));
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
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
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Button type='primary' onClick={() => showEditModal()}>
          Create Client
        </Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Select
            value={filterStatus}
            onChange={handleStatusFilterChange}
            placeholder='Filter by Status'
            style={{ width: '200px' }}
          >
            <Option value='active'>Active</Option>
            <Option value='archive'>Archive</Option>
            <Option value='pending'>Pending</Option>
          </Select>
          <Button icon={<ReloadOutlined />} onClick={handleResetFilter} style={{ padding: '0 8px' }} />
        </div>
      </div>

      <Table columns={columns} dataSource={filteredClients} rowKey='id' scroll={{ x: 'max-content' }} />

      {isClient &&
        ReactDOM.createPortal(
          <Modal
            title={isEditing ? 'Edit Client' : 'Create Client'}
            open={isModalOpen}
            onOk={handleEditOk}
            onCancel={handleCancel}
          >
            <Input
              value={editedClient.name}
              onChange={e => setEditedClient({ ...editedClient, name: e.target.value })}
              placeholder='Name'
              style={{ marginBottom: '8px' }}
            />
            <Input
              value={editedClient.manager_id}
              onChange={e => setEditedClient({ ...editedClient, manager_id: e.target.value })}
              placeholder='Manager ID'
              style={{ marginBottom: '8px' }}
            />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <Input value={year} onChange={e => setYear(e.target.value)} placeholder='Year' style={{ width: '33%' }} />
              <Input
                value={month}
                onChange={e => setMonth(e.target.value)}
                placeholder='Month'
                style={{ width: '33%' }}
              />
              <Input value={day} onChange={e => setDay(e.target.value)} placeholder='Day' style={{ width: '33%' }} />
            </div>
            <Input
              value={editedClient.phone}
              onChange={e => setEditedClient({ ...editedClient, phone: e.target.value })}
              placeholder='Phone'
              style={{ marginBottom: '8px' }}
            />
            <Select
              value={editedClient.gender}
              onChange={value => setEditedClient({ ...editedClient, gender: value })}
              placeholder='Gender'
              style={{ width: '100%', marginBottom: '8px' }}
            >
              <Option value='male'>Male</Option>
              <Option value='female'>Female</Option>
            </Select>
            <Select
              value={editedClient.status}
              onChange={value => setEditedClient({ ...editedClient, status: value })}
              placeholder='Status'
              style={{ width: '100%', marginBottom: '8px' }}
            >
              <Option value='active'>Active</Option>
              <Option value='archive'>Archive</Option>
              <Option value='pending'>Pending</Option>
            </Select>
          </Modal>,
          document.body
        )}
    </div>
  );
};
