
import { Layout } from 'antd';
import * as React from 'react';
import ContentComponent from './content';
import HeaderComponent from './header';
import SiderComponent from './sider';
export default class App extends React.Component<any, any> {
  render() {
    return (
      <Layout className="app-layout-root">
        <SiderComponent {...this.props} />
        <Layout>
          <HeaderComponent {...this.props} />
          <ContentComponent {...this.props} />
        </Layout>
      </Layout>

    );
  }
}

