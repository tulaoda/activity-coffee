import Result from 'ant-design-pro/lib/Result';
import { Steps, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import Store from '../../store';
import CreateModel from './createModel';
import CreateName from './createName';
const Step = Steps.Step;
export default class App extends React.Component<any, any> {
    render() {
        return (
            <>
                <StepsComponent />
                <ContentComponent />
            </>
        );
    }
}
@inject(() => Store)
@observer
class StepsComponent extends React.Component<any, any> {
    steps = [{
        title: 'Name',
    }, {
        title: 'Model',
    }, {
        title: 'Success',
    }]
    render() {
        const { StepsCurrent } = this.props.Model;
        return (
                <Steps current={StepsCurrent}>
                    {this.steps.map(item => <Step key={item.title} title={item.title} />)}
                </Steps>
        );
    }
}
@inject(() => Store)
@observer
class ContentComponent extends React.Component<any, any> {
    next() {
        this.props.Model.updateStepsCurrent(1);
    }
    prev() {
        this.props.Model.updateStepsCurrent(-2);
    }
    render() {
        const { StepsCurrent } = this.props.Model;
        switch (StepsCurrent) {
            case 0:
                return (<CreateName />);
                break;
            case 1:
                return (<CreateModel/>);
                break;
            case 2:
                return (  <Result
                    type={Store.Model.createState?"success":"error"}
                    title={Store.Model.createState?"提交成功":"提交失败"}
                    description="组件创建成功，等待编译~。"
                    // extra={extra}
                    actions={<Button type="primary" onClick={this.prev.bind(this)}>继续添加</Button>}
                  />);
                break;

        }

    }
}