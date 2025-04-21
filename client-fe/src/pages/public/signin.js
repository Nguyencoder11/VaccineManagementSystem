import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postMethodPayload } from '../../services/request';
import Swal from 'sweetalert2';
import '../../layout/customer/styles/login.scss'; // Assuming you created a login.scss file for custom styles.
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  useEffect(() => { }, []);

  async function handleLogin(event) {
    event.preventDefault();
    const payload = {
      email: event.target.elements.email.value,
      password: event.target.elements.password.value,
    };

    console.log(payload);

    const res = await postMethodPayload('/api/user/login/email', payload);

    var result = await res.json();
    console.log(result);
    if (res.status === 417) {
      if (result.errorCode === 300) {
        Swal.fire({
          title: 'Thông báo',
          text: 'Tài khoản chưa được kích hoạt, đi tới kích hoạt tài khoản!',
          preConfirm: () => {
            window.location.href = 'confirm?email=' + event.target.elements.username.value;
          },
        });
      } else {
        toast.warning(result.defaultMessage);
      }
    }
    if (res.status < 300) {
      processLogin(result.user, result.token);
    }
  }

  const handleLoginSuccess = async (accessToken) => {
    console.log(accessToken);

    var response = await fetch('http://localhost:8080/api/user/login/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: accessToken.credential,
    });
    var result = await response.json();
    if (response.status < 300) {
      processLogin(result.user, result.token);
    }
    if (response.status === 417) {
      toast.warning(result.defaultMessage);
    }
  };

  async function processLogin(user, token) {
    toast.success('Đăng nhập thành công!');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    if (user.authorities.name === 'Admin') {
      window.location.href = 'admin/index';
    }
    if (user.authorities.name === 'Customer') {
      window.location.href = '/';
    }
    if (user.authorities.name === 'Doctor') {
      window.location.href = '/doctor/dashboard';
    }
    if (user.authorities.name === 'Nurse') {
      window.location.href = 'staff/vaccine';
    }
    if (user.authorities.name === 'Support Staff') {
      window.location.href = '/staff/chat';
    }
  }

  const handleLoginError = () => {
    toast.error('Đăng nhập google thất bại');
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-image">
          <h1>VaxMS</h1>
          <p>Hệ thống quản lý tiêm chủng hiệu quả.</p>
        </div>
        <div className="login-form">
          <h2>Đăng nhập</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Nhập email của bạn" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="password-wrapper">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  required
                />
                <span
                  className="password-eye-icon"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? '👁️' : '🙈'}
                </span>
              </div>
            </div>
            <div className="stay-signed-in">
              <input type="checkbox" id="staySignedIn" />
              <label htmlFor="staySignedIn"> Lưu thông tin đăng nhập</label>
            </div>
            <p className="forgot-password">
              Quên mật khẩu? <a href="/quenmatkhau">Nhấn vào đây</a>
            </p>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
            <div className="register-section">
              <span>Chưa có tài khoản?</span>{' '}
              <a href="/register" className="register-link">
                Đăng ký
              </a>
            </div>
          </form>

          <div className="or-divider">HOẶC</div>
          <GoogleOAuthProvider clientId="663646080535-l004tgn5o5cpspqdglrl3ckgjr3u8nbf.apps.googleusercontent.com">
            <div className='divcenter' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
              />
            </div>
          </GoogleOAuthProvider>
          <p className="register-footer">
            Bằng cách nhấp vào Đăng nhập với Google, bạn đồng ý với{' '}
            <a href="#">Điều khoản sử dụng</a> và <a href="#">Chính sách quyền riêng tư</a> của chúng tôi.
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;