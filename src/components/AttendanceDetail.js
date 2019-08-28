import React, { Component } from "react";
import { List, Card, Button, Checkbox, Icon } from "antd-mobile";
import groupImage from './../assets/group.png'

class AttendanceDetail extends Component {
    state = {
        disabled: true
    }
    render = _ => {
        let attendance = 0
        let absences = 0

        for (let index = 0; index < this.props.data.students.length; index++) {
            if (this.props.data.students[index].lastChecks[0].isAttendance) {
                attendance += 1;
            } else {
                absences += 1;
            }
        }

        let students = this.props.data.students
        if (this.props.filter) {
            students = students.filter(s => s.name.includes(this.props.filter))
        }

        const teacherName = this.props.data.teacherName

        return (
            <div>
                <Card full>
                    <Card.Header
                        title={`${teacherName} 선생님`}
                        thumb={<img src={groupImage} width='22px' />}
                        extra={
                            <Button
                                type="primary"
                                inline size="small"
                                style={this.state.disabled ? { marginRight: '4px', backgroundColor: 'black' } : { marginRight: '4px' }}
                                onClick={_ => {
                                    if (!this.state.disabled) {
                                        this.props.onSave();
                                    }
                                    this.setState({ disabled: !this.state.disabled })
                                }
                                }
                            >
                                {this.state.disabled ? "출석체크" : "완료"}
                            </Button>}
                    />
                    <Card.Body>
                        <List renderHeader={() => <div>
                            <span>출석 {attendance} | 결석 {absences}</span>
                            <div style={{ float: 'right', marginRight: '6px' }}>
                                {
                                    students.length <= 0 ? '' :
                                        <div>
                                            <span>{students[0].lastChecks[1].date.substring(5, 10)}</span>
                                            <span>&nbsp;&nbsp;...&nbsp;&nbsp;</span>
                                            <span>{students[0].lastChecks[4].date.substring(5, 10)}</span>
                                        </div>
                                }
                            </div>
                        </div>}>
                            {students.map(s =>
                                <div key={s.id}>
                                    {this.state.disabled ?
                                        <List.Item extra={
                                            s.lastChecks.slice(1).map(c =>
                                                <span key={c.date}>
                                                    <Icon
                                                        type={c.isAttendance ? 'check-circle' : 'cross-circle'}
                                                        size='xxs'
                                                        style={{ marginRight: '10px', marginTop: '10px' }}
                                                    />
                                                </span>
                                            )
                                        }>
                                            <Icon
                                                size={'sm'}
                                                type={s.lastChecks[0].isAttendance ? 'check-circle' : 'cross-circle'}
                                                style={{ marginBottom: '-5px', marginRight: '15px' }}
                                            />{s.name}
                                        </List.Item> :
                                        <Checkbox.CheckboxItem
                                            checked={s.lastChecks[0].isAttendance}
                                            onChange={e => this.props.onChange(this.props.data.teacherId, s.id, e.target.checked)}
                                        >
                                            {s.name}
                                        </Checkbox.CheckboxItem>
                                    }
                                </div>
                            )}
                        </List>
                    </Card.Body>
                </Card>
            </div>
        );
    };
}

export default AttendanceDetail;