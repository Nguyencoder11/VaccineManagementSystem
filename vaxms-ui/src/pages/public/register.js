import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postMethodPayload } from '../../services/request';
import Swal from 'sweetalert2';
import '../../layout/customer/styles/register.scss';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
function Register() {
    const [loading, setLoading] = useState(false);

    async function handleRegister(event) {
        event.preventDefault();
        setLoading(true);

        const payload = {
            email: event.target.elements.email.value.trim(),
            username: event.target.elements.username.value.trim(),
            password: event.target.elements.password.value,
            repeatPassword: event.target.elements.repeatPassword.value,
        };

        // Kiểm tra mật khẩu có trùng khớp không
        if (payload.password !== payload.repeatPassword) {
            toast.error('Mật khẩu không trùng khớp');
            setLoading(false);
            return;
        }

        // Kiểm tra độ mạnh của mật khẩu (tùy chọn)
        if (payload.password.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự');
            setLoading(false);
            return;
        }

        try {
            const res = await postMethodPayload('/api/user/public/register', payload);

            if (!res.ok) {
                const result = await res.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Đăng ký thất bại',
                    text: result.errorMessage || 'Đã xảy ra lỗi trong quá trình đăng ký',
                });
            } else {
                toast.success('Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.');
                setTimeout(() => {
                    window.location.href = '/activate-account?email=' + encodeURIComponent(payload.email);
                }, 1500);
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Đăng ký thất bại',
                text: 'Không thể kết nối đến server',
            });
        } finally {
            setLoading(false);
        }
    }
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
    async function processLogin(user, token) {
        toast.success('Đăng nhập thành công!');
        await new Promise(resolve => setTimeout(resolve, 1500));
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        if (user.authorities.name === "Admin") {
            window.location.href = 'admin/index';
        }
        if (user.authorities.name === "Customer") {
            window.location.href = '/';
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

    return (
        <div className="register-container">
            <div className="register-card">
                <h1>Tạo tài khoản của bạn</h1>
                <p>Đăng ký thật dễ dàng.</p>
                <form onSubmit={handleRegister} autoComplete="off">
                    <label>Email <span>*</span></label>
                    <input type="email" name="email" required />

                    <label>Tên người dùng <span>*</span></label>
                    <input type="text" name="username" required />

                    <label>Mật khẩu <span>*</span></label>
                    <input type="password" name="password" required />

                    <label>Nhập lại mật khẩu <span>*</span></label>
                    <input type="password" name="repeatPassword" required />

                    <button type="submit" className="register-btn" disabled={loading}>
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </form>

                <p>HOẶC</p>

                {/* Google Sign-In Button */}
                <GoogleOAuthProvider clientId="663646080535-l004tgn5o5cpspqdglrl3ckgjr3u8nbf.apps.googleusercontent.com">
                    <div className='divcenter' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <GoogleLogin
                            onSuccess={handleLoginSuccess}
                            onError={handleLoginError}
                        />
                    </div>
                </GoogleOAuthProvider>

                <p className="login-footer">
                    By clicking Sign in or Continue with Google, you agree to our <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a>.
                </p>
            </div>
        </div >
    );
}

export default Register;