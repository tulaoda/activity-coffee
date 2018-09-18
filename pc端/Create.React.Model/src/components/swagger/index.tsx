import * as React from 'react';
import { Tabs } from 'antd';
import Create from './components/create/index';
import List from './components/list';
import Info from './components/info';
export * from "./entrance";
import "./style.less";
const TabPane = Tabs.TabPane;
export default class IApp extends React.Component<any, any> {
    public render() {
        return (
            <div className="sam-container-manage">
                <Tabs defaultActiveKey="1" >
                    <TabPane tab="基础信息" key="1">
                        <Info />
                    </TabPane>
                    <TabPane tab="创建组件" key="2">
                        <Create />
                    </TabPane>
                    <TabPane tab="组件列表" key="3">
                        <List />
                    </TabPane>
                </Tabs>
            </div>

        );
    }
}
