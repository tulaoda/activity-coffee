import { HttpBasics } from "core/HttpBasics";
import { action, observable, runInAction } from "mobx";
import { notification } from 'antd';
import wtmfront from 'wtmfront.json';
const Http = new HttpBasics(null,(x) => {
    if (x.status == 200) {
        if (x.response.status) {
            if (x.response.status == 200) {
                return x.response.result;
            }
            throw x.response.message;
        }
        return x.response
    }
    throw x;
});
export default class ObservableStore {
    /**
     * 构造
     */
    constructor() {
        notification.config({
            duration: 2,
            top: 60
        })
        this.init();
    }
    /**当前进度 */
    @observable StepsCurrent = 0;
    /**是否连接脚手架 */
    @observable startFrame = false;
    /**项目信息 */
    @observable project = {
        templates:['default']
    };
    /*** 模块列表 */
    @observable containers = [];
    /*** 模块列表 */
    @observable createParam = {
        // 组件信息
        containers: {},
        // 模型信息
        model: {}
    };
    @observable createState = true;
    map = (x) => {
        if (x.code) {
            if (x.code == 200) {
                return x.data;
            }
            notification['error']({
                message: x.message,
                description: '',
            });
            runInAction(() => {
                this.createState = false;
            })
            throw x.message;
        }
        return x
    }
    /**
     * 初始化 项目信息
     */
    async init() {
        const data = await Http.post("/server/init", wtmfront).map(this.map).toPromise();
        runInAction(() => {
            this.project = data;
            this.startFrame = true;
            // notification['success']({
            //     message: '成功链接组件服务',
            //     description: '',
            // });
        })
        this.getModel();
    }
    /**
     * 获取现有模块
     */
    async getContainers() {
        // const data = await Http.get("/server/containers").map(this.map).map(data => {
        //     return data.routers
        // }).toPromise();
        // runInAction(() => {
        //     this.containers = data;
        // })
        const data = await Http.get("/server/containers").map(this.map).toPromise();
        runInAction(() => {
            this.containers = data;
        })
    }
    /**
     * 创建模块
     * @param param 
     */
    async create(param = this.createParam) {
        const data = await Http.post("/server/create", param).map(this.map).toPromise();
        runInAction(() => {
            this.createState = true;
        });
        notification['success']({
            message: '创建成功',
            description: '',
        });
    }
    /**
     * 删除
     * @param param 
     */
    async  delete(param) {
        const data = await Http.post("/server/delete", param).map(this.map).toPromise();
        notification['success']({
            message: '删除成功',
            description: '',
        });
    }
    /**
     * 获取model
     */
    async getModel() {
        const data = await Http.get("/swaggerDoc").map(docs => this.groupingModel(docs)).toPromise();
        return data
    }
    /**
     * 分组处理 model 数据
     * @param docs 
     */
    groupingModel(docs) {
        console.log("docs", docs);
        const { tags, definitions, paths } = docs;
        // 获取 设置 mo'de'l 数据 
        const getApisModel = (apiPaths) => {
            let $ref: string, match;
            Object.keys(apiPaths).map(api => {
                let apiInfo = apiPaths[api];
                // console.log(api);
                try {
                    switch (api) {
                        case 'get':
                            $ref = apiInfo.responses[200]['schema']['$ref'];
                            match = /.*«(\w*)»/.exec($ref);
                            break;
                        default:
                            $ref = apiInfo.parameters[0]['schema']['$ref'];
                            //#/definitions/Corp
                            match = /.*\/(\w*)/.exec($ref);
                            break;
                    }
                } catch (error) {
                    // console.error(error);
                }
                if (match) {
                    var mNmae = match[1];
                    //获取model
                    apiInfo['model'] = definitions[mNmae];
                }
                //删除无用属性
                delete apiInfo.operationId;
                delete apiInfo.responses;
                delete apiInfo.produces;
                delete apiInfo.consumes
            })
            return apiPaths;
        };
        console.log(paths);
        // 设置 tags 标签 取 get 接口 得 tags
        const pathsMap = Object.keys(paths).map(path => {
            let data: any = {};
            const getInfo = paths[path]['get'];
            data['tags'] = getInfo.tags;
            data['key'] = path;
            data['value'] = getApisModel(paths[path]);
            return data
        });
        // 根据 tags 分组 数据
        // const tagsMap = new Map<{ description?: string, name?: string }, any>();
        const tagsMap = [];
        tags.map(x => {
            let path = {};
            pathsMap.filter(y => {
                if (y.tags.toString() == x.name) {
                    path[y.key] = y.value
                }
            });
            // tagsMap.set(x, path)
            tagsMap.push({
                key: x,
                value: path
            })
        })
        return {
            definitions: definitions,
            tagsMap: tagsMap
        };
    }
    @action.bound
    updateStepsCurrent(StepsCurrent) {
        this.StepsCurrent += StepsCurrent;
    }
    @action.bound
    updateCPContainers(Containers = {}) {
        this.createParam.containers = Object.assign({}, this.createParam.containers, Containers)
    }
    @action.bound
    updateCPmodel(model = {}) {
        this.createParam.model = Object.assign({}, this.createParam.model, model)
    }
}




