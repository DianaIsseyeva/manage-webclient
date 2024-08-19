import { Layout as AntLayout, Menu, theme } from 'antd';
import Link from 'next/link';
import React from 'react';

const { Header, Content } = AntLayout;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const pagesArr = [
    {
      key: 1,
      label: <Link href='/manager'>Менеджер</Link>,
    },
    {
      key: 2,
      label: <Link href='/client'>Клиент</Link>,
    },
  ];

  return (
    <AntLayout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Menu theme='dark' mode='horizontal' items={pagesArr} style={{ flex: 1, minWidth: 0 }} />
      </Header>
      <Content>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>
    </AntLayout>
  );
};

export default Layout;
