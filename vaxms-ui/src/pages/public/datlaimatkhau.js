import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postMethod } from '../../services/request';
import Swal from 'sweetalert2';
import '../../layout/customer/styles/register.scss';
function DatLaiMatKhau() {

    async function handleDatLaiMk(event) {
        event.preventDefault();
        var newpass = event.target.elements.newpass.value.trim();
        var renewpass = event.target.elements.renewpass.value.trim();
        if(renewpass != newpass){
            toast.error("Mật khẩu không trùng khơp");
            return
        }
        var uls = new URL(document.URL)
        var email = uls.searchParams.get("email");
        var key = uls.searchParams.get("key");
        var response = await postMethod('/api/user/public/complete-forgot-password?email='+email+'&key='+key+'&password='+newpass);
        if(response.status< 300){
            Swal.fire({
                title: "Thông báo",
                text: "Cập nhật mật khẩu thành công",
                preConfirm: () => {
                    window.location.href = '/'
                }
            });
        }
        else{
            if(response.status == 417){
                var result = await response.json();
                toast.warning(result.defaultMessage);
            }
            else{
                toast.error("Thất bại");
            }
        }

    }

    return (
        <div className="register-container">
            <div className="register-card">
                <h1>Đặt Lại mật khẩu</h1>
                <form onSubmit={handleDatLaiMk} autoComplete="off">
                   <input className='form-control' name='newpass' type='password' placeholder='Nhập mật khẩu mới' required/>
                   <input className='form-control' name='renewpass' type='password' placeholder='Nhập lại mật khẩu' required/>
                   <button className='btn btn-primary'>Gửi</button>
                </form>
            </div>
        </div>
    );
}

export default DatLaiMatKhau;