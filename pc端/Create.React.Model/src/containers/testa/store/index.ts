import { action, observable, runInAction, toJS } from "mobx";
import { HttpBasics } from "core/HttpBasics";
import { message } from "antd";
import storeBasice from 'core/storeBasice';
export class Store extends storeBasice {
    constructor() {
        super();
    }
    /** Url */
    url = {
    "get": "/corp",
    "post": "/corp",
    "put": "/corp",
    "delete": "/corp/",
    "details": "/corp/"
}
    /** Ajax 拦截器  */
    Http = new HttpBasics('/api');
    /** 数据 ID 索引 */
    IdKey = 'corpID';
    /** table 列配置  title dataIndex 必备字段 其他为api 返回默认字段*/
    @observable columns = [
    {
        "type": "string",
        "description": "公司ID",
        "allowEmptyValue": false,
        "minLength": 5,
        "maxLength": 5,
        "key": "corpID",
        "show": true,
        "title": "公司ID",
        "dataIndex": "corpID"
    },
    {
        "type": "string",
        "description": "管理員ID",
        "allowEmptyValue": true,
        "minLength": 0,
        "maxLength": 10,
        "key": "managerID",
        "show": true,
        "title": "管理員ID",
        "dataIndex": "managerID"
    },
    {
        "type": "integer",
        "format": "int32",
        "description": "公司员工总数",
        "allowEmptyValue": true,
        "key": "corpEmpTotals",
        "show": true,
        "title": "公司员工总数",
        "dataIndex": "corpEmpTotals"
    },
    {
        "type": "string",
        "description": "创建用户",
        "allowEmptyValue": true,
        "minLength": 0,
        "maxLength": 10,
        "key": "createUser",
        "show": true,
        "title": "创建用户",
        "dataIndex": "createUser"
    }
]
}
export default new Store();