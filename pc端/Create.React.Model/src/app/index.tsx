import Exception from 'ant-design-pro/lib/Exception';
import containers from 'containers/index';
import lodash from 'lodash';
import Loadable from 'react-loadable';
import { Spin, Icon } from 'antd';
import { observer, Provider } from 'mobx-react';
import Animate from 'rc-animate';
import * as React from 'react';
import { renderRoutes } from 'react-router-config';
import { BrowserRouter } from 'react-router-dom';
import NProgress from 'nprogress';
import store from 'store/index';
import swagger, { Entrance } from "components/swagger/index";
import layout from "./layout/index";
import Login from "./login";
import './style.less';
@observer
export default class RootRoutes extends React.Component<any, any> {
    /**
     * 路由列表
     */
    routes: any[] = [
        {
            // swagger 解析
            path: "/analysis",
            exact: true,
            component: this.createCSSTransition(swagger),
        },
        {
            /**
             * 主页布局 
             */
            path: "/",
            component: this.createCSSTransition(layout),
            //  业务路由
            routes: [
                {
                    path: "/",
                    exact: true,
                    component: this.Loadable(containers.home)
                },
                ...this.initRouters(),
                // 404  首页
                {
                    component: this.NoMatch
                }
            ]
        }
    ];
    /**
     * 初始化路由数据
     */
    initRouters() {
        return lodash.map(containers, (component, key) => {
            // x.component = this.createCSSTransition(containers[x.component] || this.NoMatch) as any;
            // x.component = this.Loadable(containers[x.component])
            return {
                "path": "/" + key,
                "exact": true,
                "component": this.Loadable(component)
            };
        })
    }
    /**
     * 404 
     * @param param0 
     */
    NoMatch({ location }) {
        return (
            <Exception type="404" desc={<h3>无法匹配 <code>{location.pathname}</code></h3>} />
        )
    }

    // 组件加载动画
    Loading = (props) => {
        if (props.error) {
            // When the loader has errored
            return <div>Error! {props.error}</div>;
        } else if (props.timedOut) {
            // When the loader has taken longer than the timeout
            return <div>Taking a long time...</div>;
        } else if (props.pastDelay) {
            // When the loader has taken longer than the delay
            return <div className="app-loadable-loading">
                <Spin indicator={<Icon type="loading" style={{ fontSize: 80 }} spin />} />
            </div>;
        } else {
            // NProgress.start();
            // When the loader has just started
            return <div></div>;
        }
    };
    /**
     * 
     * @param Component 组件
     * @param Animate 路由动画
     * @param Loading 组件加载动画
     * @param cssTranParams 路由动画参数
     */
    Loadable(Component, Animate = true, Loading = this.Loading, cssTranParams = { content: true, classNames: "fade" }) {
        if (!Loading) {
            Loading = (props) => this.Loading(props);
        }
        const loadable = Loadable({ loader: Component, loading: Loading });
        if (Animate) {
            return this.createCSSTransition(loadable, cssTranParams.content, cssTranParams.classNames);
        }
        return loadable;
    };
    /**
     * 过渡动画
     * @param Component 组件
     * @param content 
     * @param classNames 动画
     */
    createCSSTransition(Component: any, content = true, classNames = "fade") {
        return class extends React.Component<any, any>{
            state = { error: null, errorInfo: null };
            componentDidCatch(error, info) {
                this.setState({
                    error: error,
                    errorInfo: info
                })
            }
            componentDidMount() {

            }
            shouldComponentUpdate(nextProps, nextState, nextContext) {
                return Component != layout
            }
            render() {
                // NProgress.done();
                if (this.state.errorInfo) {
                    return (
                        <Exception type="500" desc={<div>
                            <h2>组件出错~</h2>
                            <details >
                                {this.state.error && this.state.error.toString()}
                                <br />
                                {this.state.errorInfo.componentStack}
                            </details>
                        </div>} />
                    );
                }
                return (
                    <Animate transitionName={classNames}
                        transitionAppear={true} >
                        <Component  {...this.props} />
                    </Animate  >
                );
            }
        }
    };
    /**
     * 错误边界
     */
    state = { error: null, errorInfo: null };
    componentDidCatch(error, info) {
        this.setState({
            error: error,
            errorInfo: info
        })
    }
    /**
     * 根据用户是否登陆渲染主页面或者 登陆界面
     */
    renderApp() {
        if (store.User.isLogin) {
            return <BrowserRouter >
                <>
                    {renderRoutes(this.routes)}
                    <Entrance />
                </>
            </BrowserRouter>
        }
        return <Login />
    }
    render() {
        if (this.state.errorInfo) {
            return (
                <Exception type="500" desc={<div>
                    <h2>组件出错~</h2>
                    <details >
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                    </details>
                </div>} />
            );
        }
        return (
            <Provider
                {...store}
            >
                {this.renderApp()}
            </Provider>
        );
    }

}
