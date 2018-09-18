import * as React from 'react';
import { Button } from 'antd';
import ReactDOM from 'react-dom';
import Animate from 'rc-animate';
import { observer, inject } from 'mobx-react';

import "./style.less"
export default class DragBtn extends React.Component<any, any> {
    state = {
        // 防止首次渲染 定位到 坐标 0，0
        renStyle: false,
        style: { left: 0, top: 0 }
    }
    btnDom: HTMLDivElement;
    toucheStart;
    toucheMove;
    scrollY = 0;
    componentDidMount() {
        // 提取 保存的位置或者 默认位置信息 
        let style = (localStorage.getItem("dragBtnStyle") && JSON.parse(localStorage.getItem("dragBtnStyle"))) || { left: this.btnDom.offsetLeft, top: this.btnDom.offsetTop }
        this.setState({
            renStyle: true,
            style: style
        })
    }
    // 点击事件
    onClick() {

    }
    // 点击
    onTouchStart(e) {
        e.stopPropagation();
        let touche = this.toucheStart = e.touches[0];
        // this.scrollY = window.scrollY;
        // document.body.style.overflow = "hidden";
        // document.body.style.position = "fixed";
        // document.body.style.top = -this.scrollY + "px";
    }
    // 移动
    onTouchMove(e) {
        e.stopPropagation();
        let touche = this.toucheMove = e.touches[0];
        let clientX = this.toucheStart.clientX - touche.clientX;
        let clientY = this.toucheStart.clientY - touche.clientY;
        this.btnDom.style.transform = `translate(${-clientX}px,${-clientY}px)`;
    }
    // 停止
    onTouchEnd(e) {
        e.stopPropagation();
        if (!this.toucheMove) {
            this.props.Team.home.updateAddButtonOnTouchEnd();
            document.body.removeAttribute("style");
            window.scrollTo(0, this.scrollY);
            return;
        }
        // 最大 移动范围
        let offsetHeight = document.body.offsetHeight - 57;
        let offsetWidth = document.body.offsetWidth - 57;
        let clientX = this.toucheStart.clientX - this.toucheMove.clientX;
        let clientY = this.toucheStart.clientY - this.toucheMove.clientY;
        let left = this.state.style.left - clientX;
        let top = this.state.style.top - clientY;
        //  判断 是否移除屏幕 移除 回位
        if (left <= 0) {
            left = 0;
        }
        if (left >= offsetWidth) {
            left = offsetWidth;
        }
        if (top <= 0) {
            top = 0;
        }
        if (top >= offsetHeight) {
            top = offsetHeight;
        }
        this.setState({
            style: { left: left, top: top }
        }, () => {
            //  保存位置信息
            localStorage.setItem("AddButtonStyle", JSON.stringify(this.state.style));
            this.toucheMove = null;
            this.toucheStart = null;
        })
        this.btnDom.style.transform = ``;
        document.body.removeAttribute("style");
        // window.scrollTo(0, this.scrollY);
    }
    render() {
        return ReactDOM.createPortal(<Animate transitionName="fade"
            transitionAppear={true} component="" >
            <div >

                <div className="drag-btn"
                    onTouchStart={this.onTouchStart.bind(this)}
                    onTouchMove={this.onTouchMove.bind(this)}
                    onTouchEnd={this.onTouchEnd.bind(this)}
                    ref={e => this.btnDom = e}
                    // style={this.state.renStyle ? this.state.style : null}
                >
                    {this.props.children}
                </div>
            </div>
        </Animate>, document.body)
    }
}
