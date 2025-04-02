import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'


async function handleChangePass(event) {
    var token = localStorage.getItem('token');
    event.preventDefault();
    if(event.target.elements.newpass.value != event.target.elements.renewpass.value){
        toast.error("Mật khẩu mới không trùng khớp");
        return;
    }
    const payload = {
        oldPass: event.target.elements.currentpass.value,
        newPass: event.target.elements.newpass.value
    };
    var res = await fetch('http://localhost:8080/api/user/change-password', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }),
        body: JSON.stringify(payload)
    });
    if (res?.status == 417) {
        var result = await res.json()
        toast.error(result.defaultMessage);
    }
    if(res?.status < 300){
        toast.success("Đổi mật khẩu thành công!");
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.reload();
    }
};


export {handleChangePass}