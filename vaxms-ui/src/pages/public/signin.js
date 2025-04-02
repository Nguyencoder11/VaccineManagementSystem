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

  useEffect(() => {
   
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    const payload = {
        email: event.target.elements.email.value,
        password: event.target.elements.password.value
    };
    console.log(payload);
    
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

const handleLoginError = () => {
    toast.error("Đăng nhập google thất bại")
};
  

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Sign in</h2>
          <button className="register-btn" onClick={() => window.location.href = '/register'}>
            Register
          </button>
        </div>
        <form onSubmit={handleLogin} autoComplete="off">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" id="email" name="email" required placeholder="Email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input type="password" id="password" name="password" required placeholder="Password" />
              <i className="password-eye-icon" />
            </div>
          </div>
          <div className="stay-signed-in">
            <input type="checkbox" id="staySignedIn" />
            <label htmlFor="staySignedIn">Stay signed in</label>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Loading...' : 'Sign in'}
          </button>
          <div className="forgot-password">
            <a href="/forgot-password">Forgot your password?</a>
          </div>
        </form>

        <div className="or-divider">
          <span>OR</span>
        </div>

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
    </div>
  );
}

export default Login;