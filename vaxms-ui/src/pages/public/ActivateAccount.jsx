import React, { useState, useEffect } from 'react';
import { postMethodPayload } from '../../services/request';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import '../../layout/customer/styles/activateAccount.scss';

function ActivateAccount() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    // Lấy email từ query parameters
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  async function handleActivateAccount(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await postMethodPayload('/api/user/public/active-account', {
        email: email,
        key: code,
      });
      if (res.ok) {
        const result = await res.json();
        toast.success(
          result.message || 'Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập ngay bây giờ.'
        );
        setTimeout(() => {
          window.location.href = '/signin';
        }, 1500);
      } else {
        const result = await res.json();
        Swal.fire({
          icon: 'error',
          title: 'Kích hoạt thất bại',
          text: result.message || 'Đã xảy ra lỗi trong quá trình kích hoạt',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Kích hoạt thất bại',
        text: 'Không thể kết nối đến server',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="activate-account-container">
      <div className="activate-account-card">
        <div className="activate-account-image">
          <h1>VaxMS</h1>
          <p>Kích hoạt tài khoản của bạn dễ dàng và nhanh chóng.</p>
        </div>
        <div className="activate-account-form">
          <h2>Kích hoạt tài khoản</h2>
          <form onSubmit={handleActivateAccount}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Nhập email của bạn"
              />
            </div>
            <div className="form-group">
              <label>Mã xác nhận</label>
              <input
                type="text"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="Nhập mã xác nhận"
              />
            </div>
            <button type="submit" className="activate-btn" disabled={loading}>
              {loading ? 'Đang kích hoạt...' : 'Kích hoạt tài khoản'}
            </button>
          </form>
          <p className="resend-code">
            Không nhận được mã? <a href="/resend-activation-code">Gửi lại mã</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ActivateAccount;