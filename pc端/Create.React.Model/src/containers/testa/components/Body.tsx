import { Divider, Popconfirm, Row, Table } from 'antd';
import { observer } from 'mobx-react';
import * as React from 'react';
import moment from 'moment';
import { Store } from '../store';
interface Props {
  Store: Store
}
@observer
export default class BodyComponent extends React.Component<Props, any> {
  constructor(props) {
    super(props)
    this.Store.onGet();
  }
  Store = this.props.Store;
  columns = [
    ...this.Store.columns.map(this.columnsMap.bind(this)),
    {
      title: 'Action',
      dataIndex: 'Action',
      render: this.renderAction.bind(this),
    }
  ]
  // 时间格式化
  dateFormat = 'YYYY-MM-DD';
  // 处理 表格类型输出
  columnsMap(column) {
    if (column.format == 'date-time') {
      column.render = (record) => {
        try {
          if (record == null || record == undefined) {
            return "";
          }
          return moment(record).format(this.dateFormat)
        } catch (error) {
          return error.toString()
        }
      }
    }
    return column
  }
  renderAction(text, record) {
    return <ActionComponent {...this.props} data={record} />;
  }
  render() {
    const rowSelection = {
      selectedRowKeys: this.Store.selectedRowKeys,
      onChange: e => this.Store.onSelectChange(e),
    };
    return (
      <Row>
        <Divider />
        <Table
          dataSource={this.Store.dataSource.slice()}
          columns={this.columns}
          rowSelection={rowSelection}
          loading={this.Store.pageConfig.loading}
        />
      </Row>
    );
  }
}
class ActionComponent extends React.Component<{ Store: Store, data: any }, any> {
  Store = this.props.Store;
  async onDelete() {
    let data = await this.Store.onDelete([this.props.data])
    if (data) {
      this.Store.onGet();
    }
  }
  render() {
    return (
      <>
        <a onClick={this.Store.onModalShow.bind(this.Store, this.props.data)} >Edit</a>
        <Divider type="vertical" />
        <Popconfirm title="Sure to delete?" onConfirm={this.onDelete.bind(this)} >
          <a >Delete</a>
        </Popconfirm>
      </>
    );
  }
}
