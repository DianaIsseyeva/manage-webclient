import { ManagerController } from '@/pages/api/controllers/manager';
import { ManagerType } from '@/types';
import { Button, Input, Modal } from 'antd';
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

  return (
    <div>
      {managers?.map(manager => (
        <div key={manager.id} style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ margin: 0 }}>{manager.name}</p>
          <Button style={{ marginLeft: '10px' }} onClick={() => showModal(manager)}>
            Редактировать
          </Button>
        </div>
      ))}

      {isClient &&
        ReactDOM.createPortal(
          <Modal title='Редактирование имени' visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Input value={newName} onChange={e => setNewName(e.target.value)} />
          </Modal>,
          document.body
        )}
    </div>
  );
};
