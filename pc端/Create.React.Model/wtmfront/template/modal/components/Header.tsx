import { Button, Col, Form,DatePicker,InputNumber , Input, Row, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import * as React from 'react';
import { Store } from '../store';
const FormItem = Form.Item;
const Option = Select.Option;
interface Props extends FormComponentProps {
  Store: Store
}
class FormComponent extends React.Component<Props, any> {
  Store = this.props.Store;
  renderInput() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return <>
      {{{HeaderFormItem search}}}
    </>
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.Store.onGet(values)
      }
    });
  }
  onReset() {
    const { resetFields } = this.props.form;
    resetFields();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.Store.onGet(values)
      }
    });
  }
  render() {
    return (
      <Form className="table-header-form" onSubmit={this.handleSubmit}>
        <Row type="flex" gutter={16} className="table-header-search">
          {this.renderInput()}
        </Row>
        <Row type="flex" gutter={16} justify="end">
          <Col span={6} className="table-header-btn">
            <Button type="primary" onClick={this.onReset.bind(this)}>Reset</Button>
            <Button type="primary" htmlType="submit" icon="search">Search</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
const WrappedFormComponent = Form.create()(FormComponent);
export default class HeaderComponent extends React.Component<{ Store: Store }, any> {
  Store = this.props.Store;
  render() {
    return (
      <Row>
        <WrappedFormComponent {...this.props} />
      </Row>
    );
  }
}

