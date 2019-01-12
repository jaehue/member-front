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
            if (this.props.data.students[index].isAttendance) {
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
                        thumb={<img src={groupImage} width='22px'/>}
                        extra={
                        <Button
                            type="primary"
                            inline size="small"
                            style = { this.state.disabled ? { marginRight: '4px', backgroundColor: 'black' } : { marginRight: '4px' }}
                            onClick = { _ => {
                                if (!this.state.disabled) {
                                    this.props.onSave();
                                }
                                this.setState({ disabled: !this.state.disabled })}
                            }
                        >
                            {this.state.disabled ? "출석체크" : "완료"}
                        </Button>}
                    />
                    <Card.Body>
                        <List renderHeader={() => <span>출석 {attendance} | 결석 {absences}</span>}>
                            {students.map(s =>
                                <div key={s.id}>
                                {this.state.disabled ?
                                    <List.Item>
                                        <Icon
                                            size={'sm'}
                                            type={s.isAttendance ? 'check-circle' : 'cross-circle'}
                                            style={{marginBottom: '-5px', marginRight: '15px'}}
                                        />{s.name}
                                    </List.Item> :
                                    <Checkbox.CheckboxItem
                                        checked={s.isAttendance}
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