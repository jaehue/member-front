import React, { Component } from "react";
import { withRouter } from 'react-router-dom'
import { NavBar, SearchBar, WhiteSpace } from "antd-mobile";
import AttendanceDetail from "./AttendanceDetail";
import config from "./../config";
import { get } from "./../utils/fetcher";


class Attendance extends Component {
    state = {
        date: '',
        filter: '',
        groups: [],
        changes: {}
    }
    componentDidMount = _ => {
        if (this.props.match) {
            this.setState({ date: this.props.match.params.date })
            this.search(this.props.match.params.date)
        }
    }
    search = async date => {
        const res = await get(`${config.api}/v1/attendances/${date}`);
        if (!res.success) {
            return;
        }

        const accumulator = res.result.members.reduce((a, t) => {
            if (!t.teacherId) {
                return a;
            }

            if (a[t.teacherId]) {
                a[t.teacherId].push(t)
            } else {
                a[t.teacherId] = [t]
            }

            return a;
        }, {})

        const groups = []
        for (const teacherId in accumulator) {
            if (accumulator.hasOwnProperty(teacherId)) {
                groups.push({
                    teacherId: teacherId,
                    students: accumulator[teacherId],
                })
                continue;
            }
        }
        this.setState({ groups });
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
        student.isAttendance = isAttendance
        this.setState({ changes, groups })
    }
    save = _ => {
        console.log(this.state.changes)
    }
    render = _ => {
        return (
            <div>
                <NavBar
                    mode="dark"
                    leftContent="전체보기"
                    style={{backgroundColor: 'black'}}
                    onLeftClick={_ => {this.props.history.push('/')}}
                >{this.state.date}</NavBar>
                <SearchBar
                    placeholder="Search"
                    maxLength={8}
                    cancelText={"취소"}
                    onChange={v=>this.setState({ filter: v })}
                />
                {this.state.groups.map(g => <div key={g.teacherId}>
                    <WhiteSpace size="lg"/>
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