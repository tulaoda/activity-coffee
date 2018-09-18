import Rx from "rxjs";
import { message } from "antd";
import NProgress from 'nprogress';
export class HttpBasics {
    constructor(address?, public newResponseMap?) {
        if (address) {
            this.address = address;
        }
        // if (responseMap) {
        //     this.responseMap = responseMap;
        // }
    }
    /** 
     * 请求路径前缀
     */
    address = ""
    /**
     * 请求头
     */
    headers = {
        credentials: 'include',
        accept: "*/*",
        "Content-Type": "application/json",
    };
    /**
     * get
     * @param url 
     * @param body 
     * @param headers 
     */
    get(url: string, body?: { [key: string]: any } | string, headers?: Object) {
        headers = { ...this.headers, ...headers };
        body = this.formatBody(body);
        url = `${this.address}${url}${body}`;
        return Rx.Observable.ajax.get(
            url,
            headers
        ).catch(err => Rx.Observable.of(err)).map(this.responseMap);
    }
    /**
     * post
     * @param url 
     * @param body 
     * @param headers 
     */
    post(url: string, body?: any, headers?: Object) {
        headers = { ...this.headers, ...headers };
        body = this.formatBody(body, "body", headers);
        url = `${this.address}${url}`;
        return Rx.Observable.ajax.post(
            url,
            body,
            headers
        ).catch(err => Rx.Observable.of(err)).map(this.responseMap);
    }
    /**
     * put
     * @param url 
     * @param body 
     * @param headers 
     */
    put(url: string, body?: any, headers?: Object) {
        headers = { ...this.headers, ...headers };
        body = this.formatBody(body, "body", headers);
        url = `${this.address}${url}`;
        return Rx.Observable.ajax.put(
            url,
            body,
            headers
        ).catch(err => Rx.Observable.of(err)).map(this.responseMap);
    }
    /**
     * delete
     * @param url 
     * @param body 
     * @param headers 
     */
    delete(url: string, body?: { [key: string]: any } | string, headers?: Object) {
        headers = { ...this.headers, ...headers };
        body = this.formatBody(body);
        url = `${this.address}${url}${body}`;
        return Rx.Observable.ajax.delete(
            url,
            headers
        ).catch(err => Rx.Observable.of(err)).map(this.responseMap);
    }
    /**
     * 格式化 参数
     * @param body  参数 
     * @param type  参数传递类型
     * @param headers 请求头 type = body 使用
     */
    formatBody(
        body?: { [key: string]: any } | string,
        type: "url" | "body" = "url",
        headers?: Object
    ) {
        // 加载进度条
        NProgress.start();
        if (typeof body === 'undefined') {
            return '';
        }
        if (type === "url") {
            let param = "";
            if (typeof body != 'string') {
                let parlist = [];
                Object.keys(body).map(x => {
                    const val = body[x];
                    if (val) {
                        parlist.push(`${x}=${body[x]}`);
                    }
                })
                param = "?" + parlist.join("&");
            } else {
                param = body;
            }
            return param;
        } else {
            // 处理 Content-Type body 类型 
            switch (headers["Content-Type"]) {
                case 'application/json;charset=UTF-8':
                    body = JSON.stringify(body)
                    break;
                case 'application/x-www-form-urlencoded':

                    break;
                case 'multipart/form-data':

                    break;
                case null:
                    delete headers["Content-Type"];
                    break;
                default:
                    break;
            }
            return body;
        }
    }
    /**
     * ajax过滤
     */
    responseMap = (x) => {
        // 关闭加载进度条
        setTimeout(() => {
            NProgress.done();
        });
        if (this.newResponseMap && typeof this.newResponseMap == "function") {
            return this.newResponseMap(x);
        }
        if (x.status == 200) {
            if (x.response.status) {
                if (x.response.status == 200) {
                    return x.response.result;
                }
                message.error(x.response.message);
                throw x.response.message;
            }
            return x.response
        }
        message.error(x.status);
        throw x;
    }
    /** 日志 */
    log(url, body, headers) {
    }
}
export default new HttpBasics();