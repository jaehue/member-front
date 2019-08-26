import React, { Component } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom'
import styles from './App.css';
import AttendanceList from './components/AttendanceList'
import Attendance from './components/Attendance'
import AttendanceTotal from './components/AttendanceTotal'
import Login from './components/Login'

class App extends Component {
    render() {
        return (
            <div className={styles.App}>
                <HashRouter>
                    <Switch>
                        <Route exact path="/" component={AttendanceList}/>
                        <Route exact path="/login" component={Login}/>
                        <Route path="/total" component={AttendanceTotal}/>
                        <Route path="/:date" component={Attendance}/>
                    </Switch>
                </HashRouter>
            </div>
        );
    }
}

export default App;
