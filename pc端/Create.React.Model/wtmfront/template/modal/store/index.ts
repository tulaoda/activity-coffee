import { action, observable, runInAction, toJS } from "mobx";
import { HttpBasics } from "core/HttpBasics";
import { message } from "antd";
import storeBasice from 'core/storeBasice';
export class Store extends storeBasice {
    constructor() {
        super();
    }
    /** Url */
    url = {{{JSONStringify url }}}
    /** Ajax 拦截器  */
    Http = new HttpBasics('/api');
    /** 数据 ID 索引 */
    IdKey = '{{{ IdKey }}}';
    /** table 列配置  title dataIndex 必备字段 其他为api 返回默认字段*/
    @observable columns = {{{JSONStringify table }}}
}
export default new Store();