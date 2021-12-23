import React, { Component } from "react";
import PropTypes from "prop-types";
import { protocol, hostname, port, login } from "Source/utils";

// Material UI - input
import TextField from '@material-ui/core/TextField';

// Material UI - Dialog
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const ERROR_LOGIN = {
    "BAD_REQUEST": "請輸入帳號與密碼",
    "DEFAULT_ACCOUNT": "此為預設帳號",
    "DUPLICATE_ACCOUNT": "帳號名稱已存在, 請更換申請帳號",
    "NO_INPUT": "請輸入帳號與密碼",
    "USER_NOT_FOUND": "此帳號尚未建立, 請建立新帳號",
    "WRONG_PASSWORD": "密碼錯誤"
}

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: '',
            password: '',
            loginError: false,
            error: '',
            showInfo: false,
            info: '',
            openCreateDialog: false,
            newAccount: '',
            newPassword: '',
            createMessage: ''
        };
    }

    handleInputChange = (key, e) => {
        this.setState({
            [key]: e.target.value
        });
    }

    handleCreate = () => {
        this.setState({
            openCreateDialog: true,
            loginError: false,
            error: '',
            showInfo: false,
            info: ''
        })
    }

    showErrorMessage = (errMsg) => {
        this.setState({
            loginError: true,
            error: errMsg,
            showInfo: false,
            info: ''
        });
    }

    handleLogin = async () => {
        const { account, password } = this.state;

        try {
            let res = await login(account, password);
            if (res) {
                if (res.success && this.props.onLogin) {
                    this.props.onLogin(account, res.userId, res.token);
                }

                if (!res.success) {
                    this.showErrorMessage(ERROR_LOGIN[res.errcode]);
                }
            }
        } catch (err) {
            console.error('Login failed', err.message);
            this.showErrorMessage(err.message);
        }
    }

    handleKeyPress = e => {
        if (e.nativeEvent.keyCode === 13) { // enter key
            this.handleLogin();
        }
    }

    handleCreateDialogClose = () => {
        this.setState({
            openCreateDialog: false
        });
    }

    handleAccountChange = evt => {
        this.setState({
            newAccount: evt.target.value
        });
    }

    handlePasswordChange = evt => {
        this.setState({
            newPassword: evt.target.value
        });
    }

    handleEditCancel = () => {
        this.setState({
            openCreateDialog: false,
            createMessage: ''
        });
    }

    showInfoMessage = (infoMsg) => {
        this.setState({
            showInfo: true,
            info: infoMsg,
            loginError: false,
            error: ''
        })
    }

    handleEditOk = async () => {
        let { newAccount, newPassword } = this.state;

        let url = `${protocol}//${hostname}:${port}/api/account`;
        let options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: newAccount,
                password: newPassword
            })
        }

        try {
            let response = await fetch(url, options);
            let res = await response.json();
            if (res.error) {
                // console.log('hl error', res);
                this.setState({
                    createMessage: ERROR_LOGIN[res.errcode] ? ERROR_LOGIN[res.errcode] : res.error
                })
            } else {
                // console.log('hl success');
                this.setState({
                    openCreateDialog: false
                }, () => {
                    this.showInfoMessage(`新增帳號 ${newAccount} 成功`);
                });
            }
        } catch (err) {
            console.error('Creating new account failed', err.message);
            this.setState({
                createMessage: err.message
            })
        }
    }

    render() {
        let { account, password, loginError, error, showInfo, info, openCreateDialog, createMessage } = this.state;

        let modalStyle = { backgroundColor: '#38D0F2', color: 'white' };
        let blogTextStyle = { margin: '0px 0px 15px 0px' };

        let accountModal = <Dialog
            open={openCreateDialog}
            onClose={this.handleCreateDialogClose}
            aria-labelledby="create-acc-dialog-title"
            aria-describedby="create-acc-dialog-description"
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle id="create-acc-dialog-title" style={modalStyle}>{`建立帳號`}</DialogTitle>
            <DialogContent dividers>
                <TextField
                    autoFocus
                    margin="dense"
                    id="login-account"
                    label="帳號"
                    fullWidth
                    style={blogTextStyle}
                    onChange={this.handleAccountChange}
                />
                <TextField
                    type="password"
                    margin="dense"
                    id="login-password"
                    label="密碼"
                    fullWidth
                    style={blogTextStyle}
                    onChange={this.handlePasswordChange}
                />
                <DialogContentText id="create-acc-dialog-description" style={{ color: 'red' }}>
                    {createMessage}
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={this.handleEditCancel} style={modalStyle}>
                    取消
                </Button>
                <Button onClick={this.handleEditOk} style={modalStyle}>
                    確定
                </Button>
            </DialogActions>
        </Dialog>;

        return <div id="login">
            <div className="form">
                <div className="title">登入</div>
                <div className="panel">
                    <div className="row">帳號</div>
                    <input value={account} onChange={e => { this.handleInputChange('account', e) }} />
                    <div className="row">密碼</div>
                    <input type="password" value={password} onKeyPress={this.handleKeyPress} onChange={e => { this.handleInputChange('password', e) }} />
                    {loginError ? <div className="error">{error}</div> : null}
                    {showInfo ? <div className="info">{info}</div> : null}
                </div>
                <div className="footer">
                    <div className="button" onClick={this.handleCreate}>新增帳號</div>
                    <div className="button" onClick={this.handleLogin}>登入</div>
                </div>
            </div>
            {accountModal}
        </div>
    }
}

Login.propTypes = {
    onLogin: PropTypes.func
}

export default Login;