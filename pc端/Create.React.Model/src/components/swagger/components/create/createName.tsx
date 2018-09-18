import { Button, Form, Icon, Input, Steps, message, Select } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import Store from '../../store';
const FormItem = Form.Item;
const Option = Select.Option;
@inject(() => Store)
@observer
class App extends React.Component<any, any> {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.Model.updateCPContainers(values);
                this.props.Model.updateStepsCurrent(1);
            }
        });
    }
    render() {
        const { containers } = this.props.Model.createParam
        const { project } = this.props.Model
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} style={{ width: 500, margin: "auto" }}>
                <FormItem label="组件名称" extra="全英文不包含空格等特殊字符">
                    {getFieldDecorator('containersName', {
                        initialValue: containers.containersName || 'test',
                        rules: [
                            { required: true, message: '组件名称必填!' },
                            { pattern: /^[a-zA-Z]+$/, message: '组件名称必须是全英文!' }
                        ],
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="containersName" />
                    )}
                </FormItem>
                <FormItem label="菜单名称" extra="置空将使用组件名称">
                    {getFieldDecorator('menuName', {
                        initialValue: containers.menuName || 'test',
                    })(
                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="menuName" />
                    )}
                </FormItem>
                <FormItem label="模板" extra="渲染模板（内置&自定义模板）">
                    {getFieldDecorator('template', {
                        initialValue: containers.template || 'default',
                    })(
                        <Select style={{ width: "100%" }} >
                            {project.templates.map((x, i) => {
                                return <Option key={i} value={x}>{x}</Option>
                            })}
                        </Select>
                    )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        下一步
              </Button>
                </FormItem>
            </Form>
        );
    }
}

const WrappedHorizontalLoginForm = Form.create()(App);
export default WrappedHorizontalLoginForm

