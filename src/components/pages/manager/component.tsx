import { ManagerController } from '@/pages/api/controllers/manager';
import { ManagerType } from '@/types';
import { Button, Input, Modal, Popconfirm, Table } from 'antd';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuidv4 } from 'uuid';

export const Manager = () => {
  const [managers, setManagers] = useState<ManagerType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentManager, setCurrentManager] = useState<ManagerType | null>(null);
  const [newName, setNewName] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    (async () => {
      const managersResponse = await ManagerController.getManagers();
      setManagers(managersResponse);
    })();
  }, []);

  const showModal = (manager?: ManagerType) => {
    if (manager) {
      setCurrentManager(manager);
      setNewName(manager.name);
      setIsEditing(true);
    } else {
      setCurrentManager(null);
      setNewName('');
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (isEditing && currentManager) {
      try {
        await ManagerController.updateManager({ id: currentManager.id, name: newName }); // Обновление менеджера через API
        setManagers(prevManagers =>
          prevManagers.map(manager => (manager.id === currentManager.id ? { ...manager, name: newName } : manager))
        );
      } catch (error) {
        console.error('Error updating manager:', error);
      }
    } else {
      const newManager: ManagerType = {
        id: uuidv4(),
        name: newName,
      };
      try {
        await ManagerController.createManager(newManager);
        setManagers([...managers, newManager]);
      } catch (error) {
        console.error('Error creating manager:', error);
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (managerId: string) => {
    try {
      await ManagerController.deleteManager(managerId);
      setManagers(prevManagers => prevManagers.filter(manager => manager.id !== managerId));
    } catch (error) {
      console.error('Error deleting manager:', error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'No.',
      key: 'no',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: ManagerType) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button onClick={() => showModal(record)}>Edit</Button>
          <Popconfirm
            title='Are you sure to delete this manager?'
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
      <Button type='primary' onClick={() => showModal()} style={{ marginBottom: '16px' }}>
        Create Manager
      </Button>
      <Table columns={columns} dataSource={managers} rowKey='id' />

      {isClient &&
        ReactDOM.createPortal(
          <Modal
            title={isEditing ? 'Edit Manager' : 'Create Manager'}
            visible={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder='Enter manager name' />
          </Modal>,
          document.body
        )}
    </div>
  );
};
