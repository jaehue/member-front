import React, { Component } from "react";
import { List, Icon, NavBar, SearchBar } from "antd-mobile";
import config from "./../config";
import { get } from "./../utils/fetcher";
import { getToken } from './../appData';

class AttendanceTotal extends Component {
    state = {
        loading: false,
        filter: '',
        members: []
    };
    componentDidMount = async _ => {
        if (!getToken()) {
            this.props.history.push('/login')
            return
        }
        this.search()
    }
    search = async _ => {
        this.setState({ loading: true })

        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();

        const res = await get(`${config().api}/v1/attendances/latest/${yyyy}-${mm}-${dd}?from=${yyyy}-01-01`);
        this.setState({ loading: false })

        if (res.message && res.message === 'invalid or expired jwt') {
            this.props.history.push('/login')
            return
        }

        if (!res.success) {
            return;
        }

        this.setState({ members: res.result });
    }
    pad = (n, width) => {
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
    }
    render = _ => {
        let students = this.state.members.filter(m => m.teacherId !== 0);
        if (this.state.filter) {
            students = students.filter(s => s.name.includes(this.state.filter))
        }

        students.forEach(s => {
            let total = 0;
            for (let i = 0; i < s.lastChecks.length; i++) {
                if (s.lastChecks[i].isAttendance) {
                    total += 1
                }
            }
            s.total = total
        })
        // students.sort((a,b) => a.total > b.total ? -1 : 1)
        students.sort((a, b) => a.name < b.name ? -1 : 1)
        return (
            <div>
                <NavBar
                    mode="dark"
                    leftContent={<Icon type="left" />}
                    onLeftClick={_ => { this.props.history.push('/') }}
                    style={{ backgroundColor: 'black' }}
                >출석현황</NavBar>
                <SearchBar
                    placeholder="Search"
                    maxLength={8}
                    cancelText={"취소"}
                    onChange={v => this.setState({ filter: v })}
                />
                <List>
                    {students.filter(s => s.total > 0).map(s => <List.Item>
                        <div style={{ "overflow": "scroll" }}>{s.name}&nbsp;<small style={{ "color": "#888" }}>({this.pad(s.total, 2)})</small>&nbsp;&nbsp;&nbsp;{
                            s.lastChecks.map((c, i) =>
                                <span key={c.date} style={{ "color": "#888" }}>
                                    <small>
                                        {
                                            i == 0 ? '' :
                                                s.lastChecks[i - 1].date.substring(5, 7) !== c.date.substring(5, 7) ? <span>|&nbsp;&nbsp;</span> : ''
                                        }
                                    </small>
                                    <Icon
                                        type={c.isAttendance ? 'check-circle' : 'cross-circle'}
                                        size='xxs'
                                        style={{ marginRight: '10px', marginTop: '10px' }}
                                    />
                                </span>
                            )
                        }
                        </div>
                    </List.Item>)}
                </List>
            </div>
        );
    };
}

export default AttendanceTotal;
