import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
var token = localStorage.getItem('token');
async function loadAllUser(page, size, role){
    var url = 'http://localhost:8080/api/admin/get-user-by-role?page=' + page + '&size=' + size;
    if (role != "") {
        url += '&role=' + role
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    return response;
}

async function loadAuthority(){
    var url = 'http://localhost:8080/api/admin/authority';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    return response;
}

async function lockOrUnlock(id, typeLock) {
    var con = window.confirm("Xác nhận hành động?")
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/admin/lockOrUnlockUser?id=' + id;
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        var mess = '';
        if (typeLock == 1) {
            mess = 'Khóa thành công'
        } else {
            mess = 'Mở khóa thành công'
        }
        toast.success(mess);
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.reload();
    } else {
        toast.error("Thất bại");
    }
}

async function changeRole(rolename, iduser){
    var url = 'http://localhost:8080/api/admin/update-role?id='+iduser+'&role='+rolename;
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    return response;
}

export {loadAllUser,lockOrUnlock,loadAuthority,changeRole}