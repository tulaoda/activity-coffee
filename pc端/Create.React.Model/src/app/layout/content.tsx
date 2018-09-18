
import { Breadcrumb, Layout, Menu } from 'antd';
import * as React from 'react';
import { renderRoutes } from 'react-router-config';
const { Header, Content, Sider } = Layout;
export default class App extends React.Component<any, any> {
  render() {
    return (
      <Layout  className="app-layout-body">
        {/* <Breadcrumb  className="app-layout-breadcrumb">
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>{this.props.location.pathname.replace('/', '')}</Breadcrumb.Item>
        </Breadcrumb> */}
        <Content className="app-layout-content">
          {renderRoutes(this.props.route.routes)}
        </Content>
      </Layout>
    );
  }
}

