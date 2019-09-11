import React, { Component } from "react";
import { withRouter } from 'react-router-dom'
import { NavBar, SearchBar, WhiteSpace, Icon } from "antd-mobile";
import AttendanceDetail from "./AttendanceDetail";
import config from "./../config";
import { get, post } from "./../utils/fetcher";
import { getToken } from './../appData';
import reloadImage from './../assets/reload.png'


class Attendance extends Component {
    state = {
        loading: false,
        date: '',
        filter: '',
        groups: [],
        changes: {},
        totalAttendance: 0,
    }
    componentDidMount = _ => {
        if (!getToken()) {
            this.props.history.push('/login')
            return
        }
        if (!this.props.location.state) {
            this.props.history.push('/')
            return
        }
        if (!this.props.location.state.attendanceId) {
            this.props.history.push('/')
            return
        }

        this.setState({
            attendanceId: this.props.location.state.attendanceId
        })


        if (this.props.match) {
            this.search(this.props.match.params.date)
        }
    }
    search = async date => {
        this.setState({ loading: true })
        const res = await get(`${config().api}/v1/attendances/latest/${date}`);
        this.setState({ loading: false })

        if (res.message && res.message === 'invalid or expired jwt') {
            this.props.history.push('/login')
            return
        }

        if (!res.success) {
            return;
        }

        let totalAttendance = 0;
        const accumulator = res.result.reduce((a, t) => {
            if (t.teacherId && t.lastChecks[0].isAttendance === true) {
                totalAttendance += 1;
            }
            if (!t.teacherId) {
                if (a[t.id]) {
                    a[t.id].teacherName = t.name
                } else {
                    a[t.id] = {
                        teacherName: t.name,
                        students: []
                    }
                }

                return a;
            }

            if (a[t.teacherId]) {
                a[t.teacherId].students.push(t)
            } else {
                a[t.teacherId] = {
                    students: [t]
                }
            }

            return a;
        }, {})

        const groups = []
        for (const teacherId in accumulator) {
            if (accumulator.hasOwnProperty(teacherId)) {
                groups.push({
                    teacherId: teacherId,
                    teacherName: accumulator[teacherId].teacherName,
                    students: accumulator[teacherId].students,
                })
                continue;
            }
        }

        groups.sort((a, b) => a.teacherName > b.teacherName ? 1 : -1)

        this.setState({ id: res.result.id, date, groups, totalAttendance });
    }
    setAttendance = (teacherId, studentId, isAttendance) => {
        const changes = this.state.changes
        let found = false;
        for (const key in changes) {
            if (key !== studentId) {
                continue;
            }
            if (changes.hasOwnProperty(key)) {
                changes[key] = isAttendance;
                found = true;
                break;
            }
        }

        if (!found) {
            changes[studentId] = isAttendance
        }


        const groups = this.state.groups;
        let student = groups.find(g => g.teacherId === teacherId).students.find(s => s.id === studentId)
        student.lastChecks[0].isAttendance = isAttendance
        this.setState({ changes, groups })
    }
    save = async _ => {
        const attendanceMembers = []
        for (const key in this.state.changes) {
            if (this.state.changes.hasOwnProperty(key)) {
                const isAttendance = this.state.changes[key];
                attendanceMembers.push({
                    memberId: parseInt(key),
                    isAttendance: isAttendance,
                })
            }
        }

        this.setState({ loading: true })
        const res = await post(`${config().api}/v1/attendances/${this.state.attendanceId}/members`, attendanceMembers);
        this.setState({ loading: false })
        if (!res.success) {
            return;
        }

        this.setState({ totalAttendance: res.result.members.length });
    }
    render = _ => {
        return (
            <div>
                <NavBar
                    mode="dark"
                    leftContent="전체보기"
                    style={{ backgroundColor: 'black' }}
                    onLeftClick={_ => { this.props.history.push('/') }}
                    rightContent={this.state.loading
                        ? <Icon type="loading"></Icon>
                        : <a onClick={_ => this.search(this.state.date)}>
                            <img src={reloadImage} width='23' style={{ marginTop: '5px', marginRight: '4px' }} />
                        </a>}
                >{this.state.date}&nbsp;<small>{this.state.totalAttendance === 0 ? '' : `(출석:${this.state.totalAttendance})`}</small></NavBar>
                <SearchBar
                    placeholder="Search"
                    maxLength={8}
                    cancelText={"취소"}
                    onChange={v => this.setState({ filter: v })}
                />
                {this.state.groups.map(g => <div key={g.teacherId}>
                    <WhiteSpace size="lg" />
                    <AttendanceDetail
                        data={g}
                        onChange={this.setAttendance}
                        onSave={this.save}
                        filter={this.state.filter}
                    />
                </div>)}
            </div>
        );
    };
}

export default withRouter(Attendance);