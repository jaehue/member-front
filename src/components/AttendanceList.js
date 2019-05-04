import React, { Component } from "react";
import { List, Icon, NavBar } from "antd-mobile";
import config from "./../config";
import styles from './../App.css';
import { get } from "./../utils/fetcher";
import { getToken } from './../appData';
import reloadImage from './../assets/reload.png'

const Item = List.Item;
const Brief = Item.Brief;

class AttendanceList extends Component {
    state = {
        loading: false,
        attendances: []
    };
    componentDidMount = async _ => {
        if (!getToken()) {
            this.props.history.push('/login')
            return
        }
        this.search()
    }
    search = async _ => {
        this.setState({loading: true})
        const res = await get(`${config().api}/v1/attendances`);
        this.setState({loading: false})

        if (res.message && res.message === 'invalid or expired jwt') {
            this.props.history.push('/login')
            return
        }

        if (!res.success) {
            return;
        }
        this.setState({ attendances: res.result });
    }
    render = _ => {
        return (
            <div>
                <div className={styles['App-header']}>
                    <Icon type="success" size="lg" />
                    <h1>2019 마하나임</h1>
                </div>
                <NavBar
                    mode="dark"
                    style={{backgroundColor: 'black'}}
                    rightContent={this.state.loading
                        ? <Icon type="loading"></Icon>
                        : <a onClick={_ => this.search()}>
                            <img src={reloadImage} width='23' style={{marginTop: '5px', marginRight: '4px'}}/>
                        </a>}
                >출석현황</NavBar>
                <List>
                    {!this.state.attendances ? '' : this.state.attendances.map(d => (
                        <Item key={d.id}
                            arrow="horizontal"
                            multipleLine
                            onClick={_ => {this.props.history.push({
                                pathname:'/'+d.date,
                                state: { attendanceId: d.id }
                            })}}
                        >
                            {d.date}
                            <Brief>학생 {d.studentCount}</Brief>
                        </Item>
                    ))}
                </List>
            </div>
        );
    };
}

export default AttendanceList;
