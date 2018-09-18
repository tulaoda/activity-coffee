import { action, observable, runInAction, toJS } from "mobx";
import { HttpBasics } from "./HttpBasics";
import { message } from "antd";
interface config {
    url: {
        get?: string,
        post?: string,
        put?: string,
        delete?: string,
        details?: string,
        [key: string]: any
    },
    HttpUrl?: string,
    IdKey?:string,
    [key: string]: any
}
export default class Store {
    constructor() {
        
    }
    url = {
        get: "/user",
        post: "/user",
        put: "/user",
        delete: "/user/",
        details: "/user/"
    }
    /** Ajax   */
    Http = new HttpBasics('/api');
    /** 数据 ID 索引 */
    IdKey = 'id';
    /** table 列配置 */
    @observable columns = []
    /** table 数据 */
    @observable dataSource = [];
    /** table 已选择 keys */
    @observable selectedRowKeys = [];
    /**  详情 */
    @observable details: any = {};
    /** 页面 配置 */
    @observable pageConfig = {
        /** Modal 显示状态  */
        visible: false,
        /** 数据加载 */
        loading: false,
    };
    /** true 修改 or false 添加 */
    @observable isUpdate = false;
    /** table 选择 行  */
    @action.bound
    onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
    }
    /** 编辑  */
    @action.bound
    onModalShow(details = {}) {
        this.details = details;
        if (details[this.IdKey] == null) {
            this.isUpdate = false;
        } else {
            this.isUpdate = true;
        }
        this.onVisible();
    }
    /** model 框 显示隐藏 */
    @action.bound
    onVisible(visible = !this.pageConfig.visible) {
        this.pageConfig.visible = visible;
    }
    /** 加载数据 */
    // @action.bound
    async onGet(params?) {
        runInAction(() => {
            this.pageConfig.loading = true;
        })
        const result = await this.Http.get(this.url.get, params).map(result => {
            // 设置 table 组件需要的唯一key
            return result.map((x, i) => {
                if (!x.key) {
                    x.key = i;
                }
                return x
            })
        }).toPromise();
        runInAction(() => {
            this.dataSource = result;
            this.pageConfig.loading = false;
        });
        return result;
    }
    /** 加载数据 */
    async onGetDetails(params) {
        const id = params[this.IdKey]
        const result = await this.Http.get(this.url.details + id).toPromise();
        runInAction(() => {
            this.details = result;
        });
        return result;
    }
    /** 编辑数据 */
    async onEdit(params) {
        const details = Object.assign({}, this.details, params);
        // 添加 | 修改 
        if (this.isUpdate) {
            return await this.onPut(details);
        }
        return await this.onPost(details);

    }
    /** 添加数据 */
    async onPost(params) {
        const result = await this.Http.post(this.url.post, params).toPromise();
        if (result) {
            message.success('添加成功');
            this.onGet();
            this.onVisible(false);
        } else {
            message.error('添加失败');
        }
        return result;
    }
    /** 更新数据 */
    async onPut(params) {
        const result = await this.Http.put(this.url.put, params).toPromise();
        if (result) {
            message.success('更新成功');
            this.onGet();
            this.onVisible(false);
        } else {
            message.error('更新失败');
        }
        return result;
    }
    /** 删除数据 */
    async onDelete(params: any[]) {
        params = params.map(x => x[this.IdKey])
        const result = await this.Http.delete(this.url.delete, params.join(',')).toPromise();
        return result;
    }

}