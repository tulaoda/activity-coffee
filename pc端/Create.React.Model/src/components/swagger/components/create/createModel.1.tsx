import { List, Row, Col, Switch, Icon, Button, Select, message } from 'antd';
import { observable, runInAction, toJS, action } from "mobx";
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import Store from '../../store';
const Option = Select.Option;
@inject(() => Store)
@observer
export default class App extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.getModel();
    }
    @observable tags = [];
    // @observable data = {};
    @observable list = [];
    model: any = null;
    tag: any = {};
    /**
     * 获取model
     */
    async getModel() {
        const data = await Store.Model.getModel();
        console.log(data);
        runInAction(() => {
            this.tags = data.tagsMap;
            // this.model = data.definitions['用户表单'].properties;
            // let urls = data.paths;
            // // 删除多余属性
            // Object.keys(urls).map(url => {
            //     Object.keys(urls[url]).map(x => {
            //         delete urls[url][x].parameters
            //         delete urls[url][x].produces
            //         delete urls[url][x].responses
            //         delete urls[url][x].tags
            //     })
            // })
            // this.data = {
            //     url: urls,
            //     model: data.definitions['用户表单'].properties
            // };
            // console.log("this.model", this.model);
            // this.list = Object.keys(this.model).map(x => {
            //     const model = this.model[x];
            //     model.key = x;
            //     model.show = true;
            //     model.edit = true;
            //     model.search = true;
            //     return {
            //         ...model,
            //     }
            // })
        })
    }
    handleSubmit() {
        if (this.model) {
            let data: any = { ...this.tag };
            let list: any[] = toJS(this.list);
            data.tableModel = this.model;
            console.log(data);
            // this.model = null;
            // this.props.Model.updateCPmodel(data);
            // this.props.Model.create();
            // this.props.Model.updateStepsCurrent(1);
        } else {
            message.success('请选择模型');
        }
    }
    /**
     * 切换 mode
     * @param 
     */
    @action.bound
    handleChange(i) {
        // console.log(toJS(this.tags[i]));
        this.tag = toJS(this.tags[i]);
        this.model = this.tag.value[Object.keys(this.tag.value)[0]]['get']['model']['properties'];
        this.list = Object.keys(this.model).map(x => {
            const model = this.model[x];
            model.key = x;
            model.show = true;
            return {
                ...model,
            }
        })
    }
    onChange(e, type, itme) {
        this.model[itme.key][type] = e;
    }
    prev() {
        this.props.Model.updateStepsCurrent(-1);
    }
    render() {
        return <>
            <Select placeholder='选择模型' style={{ width: '100%' }} onChange={this.handleChange.bind(this)}>
                {this.tags.map((x, i) => {
                    return <Option key={i} value={i}>{x.key.name}</Option>
                })}
            </Select>
            <List
                size="large"
                header={
                    <Row style={{ width: "100%" }}>
                        <Col span={6}>编辑模型</Col>
                        <Col span={6}>
                            查看
                    </Col>
                        {/* <Col span={6}>
                            编辑
                    </Col>
                        <Col span={6}>
                            搜索
                    </Col> */}
                    </Row>
                }
                footer={
                    <div>
                        <Button type="primary" onClick={this.prev.bind(this)}>
                            上一步
                  </Button>
                        <Button type="primary" onClick={this.handleSubmit.bind(this)}>
                            提交
                  </Button>
                    </div>
                }
                bordered
                dataSource={this.list}
                renderItem={(item, index) => (<List.Item>
                    <Row style={{ width: "100%" }}>
                        <Col span={6}>{item.description}</Col>
                        <Col span={6}>
                            <Switch onChange={e => {
                                this.onChange(e, 'show', item)
                            }}
                                checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} defaultChecked={item.show} />
                        </Col>
                        {/* <Col span={6}>
                            <Switch onChange={e => {
                                this.onChange(e, 'edit', item)
                            }} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} defaultChecked={item.edit} />
                        </Col>
                        <Col span={6}>
                            <Switch onChange={e => {
                                this.onChange(e, 'search', item)
                            }} checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} defaultChecked={item.search} />
                        </Col> */}
                    </Row>
                </List.Item>)}
            />
        </>
    }
}


