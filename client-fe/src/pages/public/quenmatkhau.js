import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postMethodPayload } from '../../services/request';
import Swal from 'sweetalert2';
import '../../layout/customer/styles/quenmk.scss';

function QuenMatKhau() {
  async function handleQuenMk(event) {
    event.preventDefault();
    const payload = {
      url: window.location.origin + '/datlaimatkhau',
      email: event.target.elements.email.value.trim(),
    };

    var response = await postMethodPayload('/api/user/public/send-request-forgot-password', payload);
    if (response.status < 300) {
      Swal.fire({
        title: 'Thông báo',
        text: 'Kiểm tra email của bạn',
        preConfirm: () => {
          window.location.href = '/';
        },
      });
    } else {
      if (response.status === 417) {
        var result = await response.json();
        toast.warning(result.defaultMessage);
      } else {
        toast.error('Thất bại');
      }
    }
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-image">
          <h1>Quên mật khẩu</h1>
          <p>Hãy nhập email để nhận liên kết đặt lại mật khẩu của bạn.</p>
        </div>
        <div className="forgot-password-form">
          <form onSubmit={handleQuenMk} autoComplete="off">
            <div className="form-group">
              <label>Email *</label>
              <input
                className="form-control"
                name="email"
                placeholder="Nhập email của bạn"
                required
              />
            </div>
            <button className="submit-btn" type="submit">
              Gửi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default QuenMatKhau;