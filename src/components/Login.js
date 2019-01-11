import React, { Component } from "react";
import { InputItem, WhiteSpace, Button, Toast } from "antd-mobile";
import { post } from "./../utils/fetcher";
import { setToken } from './../appData';
import config from "./../config";

class Login extends Component {
    state = {
        password: ''
    }
    login = async _ => {
        const res = await post(`${config().api}/v1/login`, this.state);
        if (!res.success) {
            Toast.fail(res.error.message, 1)
            return
        }

        setToken(res.result.token)
        this.props.history.push('/')
    }
    render = _ => {
        return (
            <div style={{maxWidth: '300px', margin: 'auto', marginTop: '15%'}}>
                <InputItem
                    placeholder="please input password"
                    type="password"
                    onChange={v => this.setState({password: v})}
                >
                    Password
                </InputItem>
                <WhiteSpace />
                <Button style={{backgroundColor: 'black', color: 'white'}} onClick={this.login}>로그인</Button>
            </div>
        );
    };
}

export default Login;