import * as React from 'react';
import { Link } from 'react-router-dom';
import { Form, Icon, Input, Button, Spin, Row, Col } from 'antd';
import { inject, observer } from 'mobx-react';
import Antv1 from './antv1';
import Antv2 from './antv2';
import Antv3 from './antv3';
import Testa from '../testa';

export default class IApp extends React.Component<any, any> {
    public render() {

        return (
            <div>
                <Row gutter={16}>
                    <Col span={12} >
                        <Antv1 />
                    </Col>
                    <Col span={12} >
                        <Antv3 />
                    </Col>
                    <Col span={24} >
                        <Antv2 />
                    </Col>
                    <Col span={6} ></Col>
                </Row>
                <Testa />
            </div>
        );
    }
}
