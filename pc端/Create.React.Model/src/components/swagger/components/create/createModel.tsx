import { List, Row, Col, Switch, Icon, Button, Select, message, Tabs } from 'antd';
import { observable, runInAction, toJS, action } from "mobx";
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import lodash from 'lodash';
const TabPane = Tabs.TabPane;
import Store from '../../store';
const Option = Select.Option;
class ObservableStore {
    @observable Model = {
        tagsMap: [],
        definitions: {}
    };
    models = {
        // 唯一标识
        IdKey: "id",
        url: {
            get: "",
            post: "",
            put: "",
            delete: "",
            details: ""
        },
        table: [],
        search: [],
        edit: [],
    }
    @observable lists = {
        table: [],
        search: [],
        edit: [],
    }
    @observable isSelectModel = false;
    /**
      * 获取model
      */
    async getModel() {
        const data = await Store.Model.getModel();
        console.log(data);
        runInAction(() => {
            this.Model = data;
        })
    }
    @action.bound
    selectModel(index) {
        // tab 对应的 api 配置
        const tagsMap: any = toJS(this.Model.tagsMap[index]);
        const value = lodash.find(tagsMap.value);
        const getConfig = value['get'];
        const postConfig = value['post'];
        try {
            const table = getConfig['model']['properties'];
            const search = getConfig['parameters'];
            const edit = postConfig['model']['properties'];
            const lists = {
                table: [],
                search: [],
                edit: [],
            }
            lodash.forIn(table, (value, key) => {
                value.key = key;
                value.show = true;
                value.title = value.description;
                value.dataIndex = value.key;
                lists.table.push(value);
            });
            lodash.forIn(search, (value, key) => {
                value.key = value.name;
                value.show = true;
                lists.search.push(value);
            });
            lodash.forIn(edit, (value, key) => {
                value.key = key;
                value.show = true;
                lists.edit.push(value);
            });
            this.lists = lists;
            const apiName = lodash.findKey(tagsMap.value);
            const detailsName = lodash.findLastKey(tagsMap.value);
            ModelStore.models.url = {
                get: apiName,
                post: apiName,
                put: apiName,
                delete: apiName + "/",
                details: apiName + "/"
            }
            //  /user/{id}  详情 ID 参数名称
            ModelStore.models.IdKey = /(.*\/){(\w*)}/.exec(detailsName)[2];
            this.isSelectModel = true;
        } catch (error) {
            console.error(error);
        }
    }
    @action.bound
    async Submit() {
        if (this.isSelectModel) {
            const model = this.dataFormat();
            Store.Model.updateCPmodel(model);
            await Store.Model.create();
            Store.Model.updateStepsCurrent(1);
            this.isSelectModel = false;
            this.lists = {
                table: [],
                search: [],
                edit: [],
            }
        } else {
            message.warn("请选择 Model")
        }
    }
    dataFormat() {
        const model = Object.assign(ModelStore.models, toJS(ModelStore.lists));
        model.edit = model.edit.filter(x => x.show).map(x => {
            const rules = [];
            // 添加验证
            if (!x.allowEmptyValue) {
                rules.push({ required: true, message: `Please input your ${x.key}!` });
            }
            if (typeof x.minLength != 'undefined') {
                rules.push({ min: x.minLength, message: `min length ${x.minLength}!` });
            }
            if (typeof x.maxLength != 'undefined') {
                rules.push({ max: x.maxLength, message: `max length ${x.maxLength}!` });
            }
            return {
                key: x.key,
                show: x.show,
                description: x.description,
                rules: rules,
                ...x
            }
        });
        model.search = model.search.filter(x => x.show);
        model.table = model.table.filter(x => x.show);
        return model;
    }
}
const ModelStore = new ObservableStore();
export default class App extends React.Component<any, any> {
    constructor(props) {
        super(props)
        ModelStore.getModel();
    }
    handleSubmit() {
        ModelStore.Submit();
    }
    prev() {
        Store.Model.updateStepsCurrent(-1);
    }
    render() {
        return <>
            <ModelSelect />
            <ModelBody />
            <div>
                <Button type="primary" onClick={this.prev.bind(this)}>
                    上一步
              </Button>
                <Button type="primary" onClick={this.handleSubmit.bind(this)}>
                    提交
              </Button>
            </div>
        </>
    }
}
/**
 * model选择
 */
@observer
class ModelSelect extends React.Component<any, any> {
    /**
     * 切换 mode
     * @param
     */
    @action.bound
    handleChange(index) {
        ModelStore.selectModel(index);
        // console.log(i);
        // console.log(toJS(this.tags[i]));
        // this.tag = toJS(this.tags[i]);
        // this.model = this.tag.value[Object.keys(this.tag.value)[0]]['get']['model']['properties'];
        // this.list = Object.keys(this.model).map(x => {
        //     const model = this.model[x];
        //     model.key = x;
        //     model.show = true;
        //     return {
        //         ...model,
        //     }
        // })
    }
    render() {
        return (
            <Select
                placeholder='选择模型'
                style={{ width: '100%' }}
                onChange={this.handleChange.bind(this)}>
                {ModelStore.Model.tagsMap.map((x, i) => {
                    return <Option key={i} value={i}>{x.key.name}</Option>
                })}
            </Select>
        );
    }
}
class ModelBody extends React.Component<any, any> {
    render() {
        return (
            <Tabs defaultActiveKey="1" >
                <TabPane tab="Table" key="1">
                    <ModelTable />
                </TabPane>
                <TabPane tab="Search" key="2">
                    <ModelSearch />
                </TabPane>
                <TabPane tab="Edit" key="3">
                    <ModelEdit />
                </TabPane>
            </Tabs>
        );
    }
}
@observer
class ModelTable extends React.Component<any, any> {
    @action.bound
    onChange(e, data) {
        data.show = e;
        ModelStore.lists.table.splice(lodash.findIndex(ModelStore.lists.table, x => x.key == data.key), 1, data)
    }
    render() {
        return (
            <List
                size="large"
                header={
                    <Row type="flex" justify="center" align="top" gutter={16}>
                        <Col span={6}>Key</Col>
                        <Col span={6}>Show</Col>
                    </Row>
                }
                bordered
                dataSource={ModelStore.lists.table.slice()}
                renderItem={(item, index) => (<List.Item>
                    <Row type="flex" justify="center" align="top" gutter={16} style={{ width: "100%" }}>
                        <Col span={6}>{item.description}</Col>
                        <Col span={6}>
                            <Switch onChange={e => {
                                this.onChange(e, item)
                            }}
                                checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} defaultChecked={item.show} />
                        </Col>
                    </Row>
                </List.Item>)}
            />
        );
    }
}
@observer
class ModelSearch extends React.Component<any, any> {
    @action.bound
    onChange(e, data) {
        data.show = e;
        ModelStore.lists.search.splice(lodash.findIndex(ModelStore.lists.search, x => x.key == data.key), 1, data)
    }
    render() {
        return (
            <List
                size="large"
                header={
                    <Row type="flex" justify="center" align="top" gutter={16}>
                        <Col span={6}>Key</Col>
                        <Col span={6}>Show</Col>
                    </Row>
                }
                bordered
                dataSource={ModelStore.lists.search.slice()}
                renderItem={(item, index) => (<List.Item>
                    <Row type="flex" justify="center" align="top" gutter={16} style={{ width: "100%" }}>
                        <Col span={6}>{item.description}</Col>
                        <Col span={6}>
                            <Switch onChange={e => {
                                this.onChange(e, item)
                            }}
                                checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} defaultChecked={item.show} />
                        </Col>
                    </Row>
                </List.Item>)}
            />
        );
    }
}
@observer
class ModelEdit extends React.Component<any, any> {
    @action.bound
    onChange(e, data) {
        data.show = e;
        ModelStore.lists.edit.splice(lodash.findIndex(ModelStore.lists.edit, x => x.key == data.key), 1, data)
    }
    render() {
        return (
            <List
                size="large"
                header={
                    <Row type="flex" justify="center" align="top" gutter={16}>
                        <Col span={6}>Key</Col>
                        <Col span={6}>Show</Col>
                    </Row>
                }
                bordered
                dataSource={ModelStore.lists.edit.slice()}
                renderItem={(item, index) => (<List.Item>
                    <Row type="flex" justify="center" align="top" gutter={16} style={{ width: "100%" }}>
                        <Col span={6}>{item.description}</Col>
                        <Col span={6}>
                            <Switch onChange={e => {
                                this.onChange(e, item)
                            }}
                                checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} defaultChecked={item.show} />
                        </Col>
                    </Row>
                </List.Item>)}
            />
        );
    }
}

