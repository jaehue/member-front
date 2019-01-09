import React, { Component } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom'
import styles from './App.css';
import config from "./config";
import { setTeachers } from './appData';
import { get } from "./utils/fetcher";
import AttendanceList from './components/AttendanceList'
import Attendance from './components/Attendance'

class App extends Component {
    componentDidMount = async _ => {
        const res = await get(`${config.api}/v1/members?memberType=1`)
        if (res.success) {
            setTeachers(res.result)
        }
    }
    render() {
        return (
            <div className={styles.App}>
                <HashRouter>
                    <Switch>
                        <Route exact path="/" component={AttendanceList}/>
                        <Route path="/:date" component={Attendance}/>
                    </Switch>
                </HashRouter>
            </div>
        );
    }
}

export default App;
