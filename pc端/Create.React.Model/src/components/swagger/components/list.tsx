import { Button, Icon, Tree } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import Store from '../store';
const TreeNode = Tree.TreeNode;
@inject(() => Store)
@observer
export default class App extends React.Component<any, any> {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.props.Model.getContainers();
    }
    componentDidMount() {

    }
    onDelete(x) {
        if (x.path == "/") {
            return console.log("首页不能删除");
        }
        this.props.Model.delete({ containersName: x.component })
    }
    render() {

        return (
            <div>
                <h1>组件列表</h1>
                <Tree
                    showIcon
                    showLine
                    defaultExpandAll
                >
                    {this.props.Model.containers.map((x, i) => {
                        return <TreeNode icon={<Icon type="smile-o" />} title={<>
                            <span>{x.name}</span>
                            <Button type="dashed" size="small" onClick={this.onDelete.bind(this, x)}>delete</Button>
                        </>} key={i}>
                        </TreeNode>
                    })}

                </Tree>
            </div>
        );
    }
}
