
import { Layout, Menu, Avatar, Row, Col, Dropdown, Button } from 'antd';
import { Link } from 'react-router-dom';
import * as React from 'react';
import store from 'store/index';
const { Header } = Layout;
export default class App extends React.Component<any, any> {
    shouldComponentUpdate() {
        return false;
    }
    render() {
        return (
            <Header className="app-layout-header">
                {/* <Menu
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    style={{ lineHeight: '64px' }}
                >
                    <Menu.Item key="1">nav 1</Menu.Item>
                    <Menu.Item key="2">nav 2</Menu.Item>
                    <Menu.Item key="3">nav 3</Menu.Item>
                </Menu> */}
                <Row>
                    <Col span={24} style={{ textAlign: "right", padding: "0 20px" }}>
                        <Dropdown overlay={<UserMenu />} placement="bottomCenter">
                            <div style={{ display: "inline-block" }}> <Avatar size="large" icon="user" /> &nbsp;<span>UserName</span></div>
                        </Dropdown>
                    </Col>
                </Row>
            </Header>
        );
    }
}
class UserMenu extends React.Component<any, any> {
    render() {
        return (
            <Menu>
                <Menu.Item>
                    <a onClick={() => { store.User.outLogin() }}>退出</a>
                </Menu.Item>
                {/* <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3rd menu item</a>
                </Menu.Item> */}
            </Menu>
        );
    }
}

