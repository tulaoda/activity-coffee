
import { Icon } from 'antd';
import * as React from 'react';
import Store from './store';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import DragBtn from '../dragBtn';
@observer
export class Entrance extends React.Component<any, any> {
    render() {
        if (window.location.pathname != "/analysis" && Store.Model.startFrame) {
            return (
                <DragBtn>
                    <Link to="/analysis" target="_blank" className="sam-entrance-btn" title="添加组件">
                        <Icon type="plus-circle-o" />
                    </Link>
                </DragBtn>
            );
        }
        return null;
    }
}

