import { Button, Divider, Form, DatePicker, InputNumber, Input, Modal, Row, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import { observer } from 'mobx-react';
import * as React from 'react';
import lodash from 'lodash';
import moment from 'moment';
import { Store } from '../store';
const Option = Select.Option;
interface Props extends FormComponentProps {
  Store: Store
}
class FormComponent extends React.Component<Props, any> {
  Store = this.props.Store;
 /**
   * 提交数据
   */
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // 转换时间对象  moment 对象 valueOf 为时间戳，其他类型数据 为原始数据。
        values = lodash.mapValues(values, x => x.valueOf());
        this.Store.onEdit(values);
      }
    });
  }
  /**
   * 获取 数据类型默认值
   * @param key 属性名称
   * @param type 属性值类型
   */
  initialValue(key, type) {
    const value = this.Store.details[key];
    switch (type) {
      case 'int32':
        return value == null ? 0 : value;
        break;
      case 'date-time':
        return this.moment(value);
        break;
      default://默认字符串
        return value || ''
        break;
    }
  }
  // 时间格式化
  dateFormat = 'YYYY-MM-DD';
  /**
   * 时间转化
   * @param date 
   */
  moment(date) {
    if (date == '' || date == null || date == undefined) {
      date = new Date();
    }
    if (typeof date == 'string') {
      date = moment(date, this.dateFormat)
    } else {
      date = moment(date)
    }
    return date
  }
  renderItem() {
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
      {{{EditFormItem edit}}}
    </>
  }
  render() {
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        {this.renderItem()}
        <Button type="primary" htmlType="submit" >
          提交
          </Button>
      </Form>
    );
  }
}
const WrappedFormComponent = Form.create()(FormComponent);
@observer
export default class EditComponent extends React.Component<{ Store: Store }, any> {
  Store = this.props.Store;
  async onDelete() {
    const params = this.Store.dataSource.filter(x => this.Store.selectedRowKeys.some(y => y == x.key));
    let data = await this.Store.onDelete(params)
    if (data) {
      this.Store.onGet();
    }
  }
  render() {
    return (
      <Row>
        <Button type="primary" onClick={this.Store.onModalShow.bind(this.Store, {})} >
          Add
        </Button>
        <Divider type="vertical" />
        <Button type="primary" onClick={this.onDelete.bind(this)} disabled={this.Store.selectedRowKeys.length < 1}>
          Delete
        </Button>
      
         <Modal
          title={this.Store.isUpdate ? 'Update' : 'Add'}
          visible={this.Store.pageConfig.visible}
          onCancel={this.Store.onVisible.bind(this.Store,false)}
          maskClosable={false}
          footer={null}
          destroyOnClose={true}
        >
          <WrappedFormComponent {...this.props} />
        </Modal>
      </Row>
    );
  }
}