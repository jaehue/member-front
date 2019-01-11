import { getToken } from './../appData';

const callApi = (method, url, body, cb) => new Promise((resolve, reject) => {
    let fetchInit = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken()
        }
    }
    if (body) {
        fetchInit.body = JSON.stringify(body)
    }

    fetch(url, fetchInit).then(function (response) {
        resolve(response.json());
    }).catch(function (ex) {
        console.log("ex:", ex)
    })
})

export const get = (url, cb) => callApi('GET', url, null, cb)
export const del = (url, body, cb) => callApi('DELETE', url, body, cb)
export const post = (url, body, cb) => callApi('POST', url, body, cb)
export const patch = (url, body, cb) => callApi('PATCH', url, body, cb)
export const put = (url, body, cb) => callApi('PUT', url, body, cb)