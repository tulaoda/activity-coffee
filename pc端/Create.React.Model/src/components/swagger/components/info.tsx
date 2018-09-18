import { Button, Icon, Tree } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import Store from '../store';
const TreeNode = Tree.TreeNode;
@inject(() => Store)
@observer
export default class App extends React.Component<any, any> {
    render() {
        return (
            <div>
                <h2>项目信息~</h2>
                <p><span>contextRoot: </span><span>{this.props.Model.project.contextRoot}</span></p>
                <p><span>routersPath: </span><span>{this.props.Model.project.routersPath}</span></p>
                <p><span>containersPath: </span><span>{this.props.Model.project.containersPath}</span></p>
                {/* <p><span>componentName: </span><span>{this.props.Model.project.componentName}</span></p> */}
            </div>
        );
    }
}
