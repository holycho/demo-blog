import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { checkTokenByAxios } from "Source/utils";

import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import Thunk from 'redux-thunk';
import blogReducer from './reducers/blog';
import blogAction from './actions/blog';
const reducers = combineReducers({
    blog: blogReducer
})
const store = createStore(reducers, applyMiddleware(Thunk));

// css
import 'Source/less/blog.less';
import 'Source/less/login.less';
import 'Source/less/app.less';

// Components
import BlogPage from 'Source/components/BlogPage';
import Login from 'Source/components/Login';
import MemoAppBar from 'Source/components/AppBar';

const AUTH_TOKEN_INTERVAL = 30 * 1000;

const App = props => {
    const [isLogin, setIsLogin] = useState('init');
    const [account, setAccount] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const intervalId = setInterval(async () => {
            // check the token in frond end and then logout if this token is expired
            let obj = JSON.parse(window.localStorage.getItem('demo-blog'));
            if (obj) {
                let res = await checkTokenByAxios(obj.token);
                if (res && res.errcode === 'AUTH_TOKEN_FAIL') {
                    handleLogout();
                }
            }
        }, AUTH_TOKEN_INTERVAL);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(async () => {
        let obj = JSON.parse(window.localStorage.getItem('demo-blog'));
        if (obj) {
            let res = await checkTokenByAxios(obj.token);
            if (res && res.success) {
                setAccount(obj.account);
                setUserId(obj.userId);
                setIsLogin('ok');
            } else {
                setIsLogin('login');
            }
        } else {
            setIsLogin('login')
        }
    }, [isLogin, account, userId]);

    const handleLogin = async (account, userId, token) => {
        window.localStorage.setItem('demo-blog', JSON.stringify({ account, userId, token }));

        setAccount(account);
        setUserId(userId);
        setIsLogin('ok');
    }

    const handleLogout = () => {
        window.localStorage.removeItem('demo-blog');

        setAccount('');
        setUserId('');
        setIsLogin('login');

        store.dispatch(blogAction.clearAll());
    }

    // momorize the instance of function for MemoAppBar
    const logoutCallback = useCallback(() => {
        handleLogout();
    }, []);

    if (isLogin === 'init') {
        return (<div>{`請稍等`}</div>);
    } else if (isLogin === 'login') {
        return (<Login onLogin={handleLogin} />);
    }

    return (<Provider store={store}>
        <div className="bg">
            <MemoAppBar account={account} onLogout={logoutCallback} />
            <BlogPage userId={userId} />
        </div>
    </Provider>);
}

ReactDOM.render(
    <App />,
    document.querySelector('#app')
);