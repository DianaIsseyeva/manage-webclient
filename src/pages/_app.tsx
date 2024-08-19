// import '@/styles/globals.css';
import Layout from '@/components/layouts/component';
import { ConfigProvider } from 'antd';
import type { AppProps } from 'next/app';
import theme from '../../theme/themeConfig';

const App = ({ Component, pageProps }: AppProps) => (
  <ConfigProvider theme={theme}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </ConfigProvider>
);

export default App;
