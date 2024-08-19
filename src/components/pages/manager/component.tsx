import { ManagerController } from '@/pages/api/controllers/manager';
import { ManagerType } from '@/types';
import { Button, Input, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export const Manager = () => {
  const [managers, setManagers] = useState<ManagerType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentManager, setCurrentManager] = useState<ManagerType | null>(null);
  const [newName, setNewName] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    (async () => {
      const meResponse = await ManagerController.getManagers();
      setManagers(meResponse);
    })();
  }, []);

  const showModal = (manager: ManagerType) => {
    setCurrentManager(manager);
    setNewName(manager.name);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (currentManager) {
      setManagers(prevManagers =>
        prevManagers.map(manager => (manager.id === currentManager.id ? { ...manager, name: newName } : manager))
      );
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: ManagerType) => <Button onClick={() => showModal(record)}>Edit</Button>,
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={managers} rowKey='id' />

      {isClient &&
        ReactDOM.createPortal(
          <Modal title='Edit' visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Input value={newName} onChange={e => setNewName(e.target.value)} />
          </Modal>,
          document.body
        )}
    </div>
  );
};
