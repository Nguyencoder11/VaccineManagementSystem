import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postMethodPayload } from '../../services/request';
import Swal from 'sweetalert2';
import '../../layout/customer/styles/register.scss';
function QuenMatKhau() {

    async function handleQuenMk(event) {
        event.preventDefault();
        const payload = {
            url:  window.location.origin+'/reset-password',
            email: event.target.elements.email.value.trim(),
        };

        var response = await postMethodPayload('/api/user/public/send-request-forgot-password', payload);
        if(response.status< 300){
            Swal.fire({
                title: "Thông báo",
                text: "Kiểm tra email của bạn",
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
                <h1>Quên mật khẩu</h1>
                <form onSubmit={handleQuenMk} autoComplete="off">
                   <input className='form-control' name='email' placeholder='Nhập email của bạn' required/>
                   <button className='btn btn-primary'>Gửi</button>
                </form>
            </div>
        </div>
    );
}

export default QuenMatKhau;