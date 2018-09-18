
// import "../node_modules/antd/dist/antd.less"; 这种方式 production 模式生成文件。
// <reference path="./index.d.ts" />
import 'babel-polyfill';
require('antd/dist/antd.less')
require('ant-design-pro/dist/ant-design-pro.css')
require('nprogress/nprogress.css')
import App from "app/index";
import * as React from 'react';
import ReactDOM from 'react-dom';
import NProgress from 'nprogress';
import "./style.less";
// NProgress.start();
ReactDOM.render( <App />,
  document.getElementById('root'));
