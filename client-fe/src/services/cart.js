import {getMethod,getMethodPostByToken} from '../../services/request'

var token = localStorage.getItem("token");
async function countCartHeader() {
    const response = await fetch('http://localhost:9090/api/cart/user/count-cart', {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    return response
}

export {countCartHeader}