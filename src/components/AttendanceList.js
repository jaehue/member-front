import React, { Component } from "react";
import { List, Icon } from "antd-mobile";
import config from "./../config";
import styles from './../App.css';
import { get } from "./../utils/fetcher";

const Item = List.Item;
const Brief = Item.Brief;

class AttendanceList extends Component {
    state = {
        attendances: []
    };
    componentDidMount = async _ => {
        const res = await get(`${config.api}/v1/attendances`);
        if (!res.success) {
            return;
        }
        this.setState({ attendances: res.result });
    };
    render = _ => {
        return (
            <div>
                <div className={styles['App-header']}>
                    <Icon type="success" size="lg" />
                    <h1>2019 마하나임</h1>
                </div>
                <List renderHeader={() => "출석현황"}>
                    {this.state.attendances.map(d => (
                        <Item key={d.id}
                            arrow="horizontal"
                            multipleLine
                            onClick={_ => {this.props.history.push('/'+d.date)}}
                        >
                            {d.date}
                            <Brief>선생님 {d.teacherCount} | 힉생 {d.studentCount}</Brief>
                        </Item>
                    ))}
                </List>
            </div>
        );
    };
}

export default AttendanceList;
