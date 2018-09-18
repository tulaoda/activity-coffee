import { configure } from "mobx";
import user from './user';
configure({ enforceActions: true });
class store {
    constructor() {
        this.ready();
        this.init();
    }
    User = new user();
    /**
     * 定义全局 变量 枚举 ===
     */
    ready() {
        console.log("-----------ready Store------------", this);
    }
    init() {

    }
};
export default new store();