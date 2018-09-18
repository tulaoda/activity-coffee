
import { Icon, Layout, Menu } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
// import routersConfig from '../routersConfig';
import SubMenuJson from '../SubMenu.json';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
export default class App extends React.Component<any, any> {
  routers = SubMenuJson.SubMenu.slice();
  renderLink(menu) {
    if (menu.Path) {
      return <Link to={menu.Path}><Icon type={menu.Icon || 'appstore'} /> {menu.Name}</Link>
    }
    return <span><Icon type={menu.Icon || 'appstore'} />{menu.Name}</span>
  }
  renderMenu(menus, index) {
    return menus.Meuu.map((x, i) => {
      const key = x.Path || 'sub' + index + '_' + x.Path;
      return <Menu.Item key={key} data-key={key}>
        {this.renderLink(x)}
      </Menu.Item>
    })
  }
  runderSubMenu() {
    return this.routers.map((menu: any, index) => {
      if (menu.Meuu.length > 0) {
        return <SubMenu key={"sub" + index} title={<span><Icon type={menu.Icon} />{menu.Name}</span>}>
          {
            this.renderMenu(menu, index)
          }
        </SubMenu>
      }
      const key = menu.Path || menu.Path + '_' + index;
      return <Menu.Item key={key} data-key={key}>
        {this.renderLink(menu)}
      </Menu.Item>
    })
  }
  shouldComponentUpdate() {
    return this.routers.length != SubMenuJson.SubMenu.length
  }
  // state = {
  //   collapsed: false,
  // }

  // toggleCollapsed = () => {
  //   this.setState({
  //     collapsed: !this.state.collapsed,
  //   });
  // }
  render() {
    return (
      <Sider width={250} className="app-layout-sider">
        <div className="app-layout-logo"  >Logo</div>
        <Menu
          theme="dark" mode="inline"
          defaultSelectedKeys={[this.props.location.pathname]}
          style={{ borderRight: 0 }}
          // inlineCollapsed={this.state.collapsed}
        >
          <Menu.Item key="/">
            <Link to="/"><Icon type="appstore" />首页</Link>
          </Menu.Item>
          {this.runderSubMenu()}
        </Menu>
      </Sider>
    );
  }
}

