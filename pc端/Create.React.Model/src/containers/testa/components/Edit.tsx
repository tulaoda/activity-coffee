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
      <FormItem label="公司ID" {...formItemLayout}>
            {getFieldDecorator('corpID',
            {
                rules:[{"required":true,"message":"Please input your corpID!"},{"min":5,"message":"min length 5!"},{"max":5,"message":"max length 5!"}],
                initialValue:this.initialValue('corpID',''),
            })(
              <Input type="text" placeholder='公司ID' />
            )}
        </FormItem> 
         <FormItem label="公司名" {...formItemLayout}>
            {getFieldDecorator('corpName',
            {
                rules:[{"min":0,"message":"min length 0!"},{"max":50,"message":"max length 50!"}],
                initialValue:this.initialValue('corpName',''),
            })(
              <Input type="text" placeholder='公司名' />
            )}
        </FormItem> 
         <FormItem label="管理員ID" {...formItemLayout}>
            {getFieldDecorator('managerID',
            {
                rules:[{"min":0,"message":"min length 0!"},{"max":10,"message":"max length 10!"}],
                initialValue:this.initialValue('managerID',''),
            })(
              <Input type="text" placeholder='管理員ID' />
            )}
        </FormItem> 
         <FormItem label="上級公司ID" {...formItemLayout}>
            {getFieldDecorator('parentCorpID',
            {
                rules:[{"min":0,"message":"min length 0!"},{"max":5,"message":"max length 5!"}],
                initialValue:this.initialValue('parentCorpID',''),
            })(
              <Input type="text" placeholder='上級公司ID' />
            )}
        </FormItem> 
         <FormItem label="公司员工总数" {...formItemLayout}>
            {getFieldDecorator('corpEmpTotals',
            {
                rules:[],
                initialValue:this.initialValue('corpEmpTotals','int32'),
            })(
             <InputNumber   /> 
            )}
        </FormItem> 
         <FormItem label="使用与否" {...formItemLayout}>
            {getFieldDecorator('useYN',
            {
                rules:[{"required":true,"message":"Please input your useYN!"}],
                initialValue:this.initialValue('useYN',''),
            })(
            <Select placeholder='useYN' >
               <Option value='Y'>Y</Option>
               <Option value='N'>N</Option>
            </Select>
            )}
        </FormItem> 
         <FormItem label="创建用户" {...formItemLayout}>
            {getFieldDecorator('createUser',
            {
                rules:[{"min":0,"message":"min length 0!"},{"max":10,"message":"max length 10!"}],
                initialValue:this.initialValue('createUser',''),
            })(
              <Input type="text" placeholder='创建用户' />
            )}
        </FormItem> 
         <FormItem label="创建日期" {...formItemLayout}>
            {getFieldDecorator('createDate',
            {
                rules:[],
                initialValue:this.initialValue('createDate','date-time'),
            })(
             <DatePicker   format={this.dateFormat} /> 
            )}
        </FormItem> 
         <FormItem label="修改用户" {...formItemLayout}>
            {getFieldDecorator('updateUser',
            {
                rules:[{"min":0,"message":"min length 0!"},{"max":10,"message":"max length 10!"}],
                initialValue:this.initialValue('updateUser',''),
            })(
              <Input type="text" placeholder='修改用户' />
            )}
        </FormItem> 
         <FormItem label="修改日期" {...formItemLayout}>
            {getFieldDecorator('updateDate',
            {
                rules:[],
                initialValue:this.initialValue('updateDate','date-time'),
            })(
             <DatePicker   format={this.dateFormat} /> 
            )}
        </FormItem> 
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