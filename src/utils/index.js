import axios from "axios";

if (typeof window === 'undefined') {
    throw new Error('invalid environment');
}

// console.log('hl location: ', window.location);
let host = window.location.host;
let hostname = window.location.hostname;
let port = window.location.port;
let protocol = window.location.protocol;
let baseUrl = `${protocol}//${hostname}:${port}`;
const URLS = {
    LOGIN: () => `${baseUrl}/api/login`,
    SESSION: () => `${baseUrl}/api/session`
};

async function login(account, password) {
    const optoins = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            account,
            password
        })
    }

    try {
        let result = await fetch(URLS.LOGIN(), optoins);
        return await result.json();
    } catch (err) {
        console.error('Login failed', err);
        throw err;
    }
}

async function loginByAxios(account, password) {
    try {
        let result = await axios.post('api/login', {
            account,
            password
        });
        console.log('login: ', result);
        if (result) {
            return JSON.parse(JSON.stringify(result.data));
        }
    } catch (err) {
        console.error("Login failed", err);
    }
}

async function checkToken(token) {
    const options = {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': token
        }
    }

    try {
        let result = await fetch(URLS.SESSION(), options);
        return await result.json();
    } catch (err) {
        console.error('Checking the token failed', err);
        throw err;
    }
}

async function checkTokenByAxios(token) {
    try {
        let result = await axios.get('api/session', {
            headers: {
                'x-access-token': token
            }
        });
        console.log('session: ', result);
        if (result) {
            return JSON.parse(JSON.stringify(result.data));
        }
    } catch (err) {
        console.error("Getting the token failed", err);
    }
}

export {
    host,
    hostname,
    port,
    protocol,
    login,
    loginByAxios,
    checkToken,
    checkTokenByAxios
}
