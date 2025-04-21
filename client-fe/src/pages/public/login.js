import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logologin from '../../assest/images/logologin.jpg'
import {postMethodPayload} from '../../services/request'
import Swal from 'sweetalert2'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

async function handleLogin(event) {
    event.preventDefault();
    const payload = {
        email: event.target.elements.username.value,
        password: event.target.elements.password.value
    };
    const res = await postMethodPayload('/api/user/login/email', payload);
    
    var result = await res.json()
    console.log(result);
    if (res.status == 417) {
        if (result.errorCode == 300) {
            Swal.fire({
                title: "Thông báo",
                text: "Tài khoản chưa được kích hoạt, đi tới kích hoạt tài khoản!",
                preConfirm: () => {
                    window.location.href = 'confirm?email=' + event.target.elements.username.value
                }
            });
        } else {
            toast.warning(result.defaultMessage);
        }
    }
    if(res.status < 300){
        processLogin(result.user, result.token)
    }
};

async function processLogin(user, token) {
    toast.success('Đăng nhập thành công!');
    await new Promise(resolve => setTimeout(resolve, 1500));
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    if (user.authorities.name === "Admin") {
        window.location.href = 'admin/index';
    }
    if (user.authorities.name === "Customer") {
        window.location.href = '/index';
    }
    if (user.authorities.name === "Doctor") {
        
    }
    if (user.authorities.name === "Nurse") {
        window.location.href = 'staff/vaccine';
    }
    if (user.authorities.name === "Support Staff") {
        window.location.href = '/staff/chat';
    }
}


function login(){
    const handleLoginSuccess = async (accessToken) => {
        console.log(accessToken);
        
        var response = await fetch('http://localhost:8080/api/user/login/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: accessToken.credential
        })
        var result = await response.json();
        if (response.status < 300) {
            processLogin(result.user, result.token)
        }
        if (response.status == 417) {
            toast.warning(result.defaultMessage);
        }
    };
    
    const handleLoginError = () => {
        toast.error("Đăng nhập google thất bại")
    };

    return(
        <div class="contentweb">
        <div class="container">
            <div class="dangnhapform">
                <div class="divctlogin">
                    <p class="labeldangnhap">Đăng Nhập</p>
                    <form onSubmit={handleLogin} autocomplete="off">
                        <label class="lbform">Tên tài khoản</label>
                        <input required name='username' id="username" class="inputlogin"/>
                        <label class="lbform">Mật khẩu</label>
                        <input required name='password' type="password" id="password" class="inputlogin"/>
                        <button class="btndangnhap">ĐĂNG NHẬP</button>
                        <button type="button"  onClick={()=>{window.location.href = 'regis'}} class="btndangky">ĐĂNG KÝ</button>
                    </form><br/><br/><br/>
                    <hr/>
                    <p className='text-center'>Hoặc đăng nhập với google</p>
                    <GoogleOAuthProvider clientId="663646080535-l004tgn5o5cpspqdglrl3ckgjr3u8nbf.apps.googleusercontent.com">
                    <div className='divcenter' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={handleLoginError}
                    />
                    </div>
                    </GoogleOAuthProvider>
                    <a href="/quenmatkhau" class="lbquenmk">Quên mật khẩu ?</a>
                </div>
            </div>
        </div>
    </div>
    );
}
export default login;