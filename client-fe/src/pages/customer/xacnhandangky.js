import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { getMethod, postMethodPayload } from '../../services/request';
import logomini from '../../assest/images/vaxmslogo3.png'
import momo from '../../assest/images/momo.webp';
import vnpay from '../../assest/images/vnpay.jpg';
import { formatMoney } from '../../services/money';
import Swal from 'sweetalert2';

function XacNhanDangky() {
    const [vaccineTime, setVaccineTime] = useState(null);
    const [customer, setCustomer] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            var response = await getMethod('/api/customer-profile/customer/find-by-user')
            var result = await response.json();
            setCustomer(result)

            var uls = new URL(document.URL)
            var time = uls.searchParams.get("time");
            var response = await getMethod('/api/vaccine-schedule-time/public/find-by-id?id=' + time)
            var result = await response.json();
            setVaccineTime(result)
        };
        fetchData();
    }, []);

    function codClick() {
        document.getElementById("code").click()
    }

    function momoClick() {
        document.getElementById("momo").click()
    }

    function vnpayClick() {
        document.getElementById("vnpay").click()
    }

    async function dangKyTiem(event) {
        event.preventDefault();
        var con = window.confirm("Xác nhận đăng ký tiêm");
        if (con == false) {
            return;
        }
        var paytype = event.target.elements.paytype.value

        var dobInput = event.target.elements.ngaysinhnt.value
        const dobValue = new Date(dobInput); 
        const today = new Date(); 
        if(dobValue > today){
            toast.error("Ngày sinh phải nhỏ hơn ngày hiện tại.");
            return;
        }
        const age = today.getFullYear() - dobValue.getFullYear();
        const monthDifference = today.getMonth() - dobValue.getMonth();
        const dayDifference = today.getDate() - dobValue.getDate();
        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
            age--;
        }
        if (age < 0 || age > 80) {
            toast.error("Tuổi không hợp lệ. Vui lòng nhập ngày sinh trong khoảng từ 0 đến 80 tuổi.");
            return;
        }
        if (paytype == "momo") {
            requestPayMentMomo(event)
        }
        if (paytype == "cod") {
            dangKyCod(event)
        }
        if (paytype == "vnpay") {
            requestPayMentVnpay(event)
        }
    };

    function getPayload(event) {
        var payload = {
            fullName: event.target.elements.hotendki.value,
            dob: event.target.elements.ngaysinhnt.value,
            phone: event.target.elements.sdtnt.value,
            address: event.target.elements.diachint.value,
            vaccineScheduleTime: {
                id: vaccineTime.id
            }
        }
        return payload;
    }

    async function dangKyCod(event) {
        event.preventDefault();
        var payload = getPayload(event);
        const res = await postMethodPayload('/api/customer-schedule/customer/create-not-pay', payload);
        var result = await res.json()
        if (res.status == 417) {
            toast.warning(result.defaultMessage);
        }
        if (res.status < 300) {
            Swal.fire({
                title: "Thông báo",
                text: "Đăng ký thành công, hãy thanh toán trước 24h!",
                preConfirm: () => {
                    window.location.href = '/tai-khoan#lichtiem';
                }
            });
        }
    };

    async function requestPayMentVnpay(event) {
        event.preventDefault();
        const hostname = window.location.hostname;
        const port = window.location.port;
        const protocol = window.location.protocol;
        const urlmain = `${protocol}//${hostname}:${port}`;
        var returnurl = urlmain + '/thong-bao';
        var payload = getPayload(event);
        var paymentDto = {
            "content": "Thanh toán",
            "returnUrl": returnurl,
            "notifyUrl": returnurl,
            "idScheduleTime": payload.vaccineScheduleTime.id,
        }
        localStorage.setItem("thongtindangky", JSON.stringify(payload));
        const res = await postMethodPayload('/api/vnpay/urlpayment', paymentDto)
        var result = await res.json();
        if (res.status < 300) {
            window.open(result.url, '_blank');
        }
        if (res.status == 417) {
            toast.warning(result.defaultMessage);
        }
    }

    async function requestPayMentMomo(event) {
        event.preventDefault();
        const hostname = window.location.hostname;
        const port = window.location.port;
        const protocol = window.location.protocol;
        const urlmain = `${protocol}//${hostname}:${port}`;
        var returnurl = urlmain + '/thong-bao';
        var payload = getPayload(event);
        var paymentDto = {
            "content": "Thanh toán",
            "returnUrl": returnurl,
            "notifyUrl": returnurl,
            "idScheduleTime": payload.vaccineScheduleTime.id,
        }
        localStorage.setItem("thongtindangky", JSON.stringify(payload));
        const res = await postMethodPayload('/api/momo/create-url-payment', paymentDto)
        var result = await res.json();
        if (res.status < 300) {
            window.open(result.url, '_blank');
        }
        if (res.status == 417) {
            toast.warning(result.defaultMessage);
        }
    }

    return (
        <div style={{ width: '100%', backgroundColor: '#f9f9f9', padding: '20px 0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', padding: '20px' }}>
                <p style={{ fontSize: '16px', marginBottom: '15px', color: '#666' }}>
                    <a href="/" style={{ textDecoration: 'none', color: '#007bff' }}>Trang chủ</a>
                    <span style={{ margin: '0 5px' }}> » </span>
                    <span style={{ fontWeight: 'bold', color: '#333' }}>Xác nhận đăng ký thông tin tiêm chủng</span>
                </p>


                <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', // Hai cột bằng nhau
        gap: '20px', // Khoảng cách giữa cột
        alignItems: 'start', // Đảm bảo các phần thẳng hàng
      }}>
                    {/* Thông tin đăng ký */}
                    <div style={{ flex: '1', padding: '10px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff', marginBottom: '20px' }}>
                            XÁC NHẬN ĐĂNG KÝ TIÊM CHỦNG
                        </h2>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                            Khi chọn thanh toán sau, nếu sau 24h chưa thanh toán, chúng tôi sẽ tự động hủy đăng ký lịch tiêm của bạn.
                        </p>

                        <form onSubmit={dangKyTiem} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: '1' }}>
              <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}><span style={{ color: 'red' }}>*</span> Họ tên người tiêm</label>
              <input name="hotendki" placeholder="Nhập họ tên" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ flex: '1' }}>
              <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}><span style={{ color: 'red' }}>*</span> Ngày sinh người tiêm</label>
              <input name="ngaysinhnt" type="date" placeholder="mm/dd/yyyy" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: '1' }}>
              <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}><span style={{ color: 'red' }}>*</span> Địa chỉ</label>
              <input name="diachint" placeholder="Nhập địa chỉ" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ flex: '1' }}>
              <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}><span style={{ color: 'red' }}>*</span> Số điện thoại</label>
              <input name="sdtnt" placeholder="Nhập số điện thoại" style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
          </div>

                            <div>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>HÌNH THỨC THANH TOÁN</span>
                                <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
                                    <tbody>
                                        <tr onClick={momoClick} style={{ cursor: 'pointer', borderBottom: '1px solid #ccc' }}>
                                            <td style={{ padding: '10px' }}>
                                                <input type="radio" name="paytype" id="momo" value="momo" />
                                                <label htmlFor="momo" style={{ marginLeft: '10px', fontSize: '14px', color: '#333' }}>Thanh toán qua MoMo</label>
                                            </td>
                                            <td style={{ textAlign: 'right', padding: '10px' }}>
                                                <img src={momo} alt="MoMo" style={{ width: '40px' }} />
                                            </td>
                                        </tr>
                                        <tr onClick={vnpayClick} style={{ cursor: 'pointer', borderBottom: '1px solid #ccc' }}>
                                            <td style={{ padding: '10px' }}>
                                                <input type="radio" name="paytype" id="vnpay" value="vnpay" />
                                                <label htmlFor="vnpay" style={{ marginLeft: '10px', fontSize: '14px', color: '#333' }}>Thanh toán qua VNPay</label>
                                            </td>
                                            <td style={{ textAlign: 'right', padding: '10px' }}>
                                                <img src={vnpay} alt="VNPay" style={{ width: '40px' }} />
                                            </td>
                                        </tr>
                                        <tr onClick={codClick} style={{ cursor: 'pointer' }}>
                                            <td style={{ padding: '10px' }}>
                                                <input type="radio" name="paytype" id="code" value="cod" />
                                                <label htmlFor="code" style={{ marginLeft: '10px', fontSize: '14px', color: '#333' }}>Thanh toán sau</label>
                                            </td>
                                            <td style={{ textAlign: 'right', padding: '10px' }}>
                                                <i className="fa fa-money" style={{ fontSize: '20px', color: '#28a745' }}></i>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    backgroundColor: '#28a745',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '20px',
                                    padding: '10px 20px',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    width: '150px',
                                    textAlign: 'center',
                                    transition: 'all 0.3s ease',
                                    marginLeft: '180px'
                                }}
                            >
                                <i className="fa fa-calendar-check-o" style={{ fontSize: '16px' }}></i>
                                Đặt lịch
                            </button>

                        </form>
                    </div>

                    {/* Thông tin vaccine */}
                    <div style={{ padding: '10px', backgroundColor: '#f1f1f1', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff', marginBottom: '20px' }}>Thông tin vaccine</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', color: '#333', fontWeight: 'bold' }}>Vaccine</th>
              <td style={{ textAlign: 'right', padding: '8px', color: '#555' }}>{vaccineTime?.vaccineSchedule.vaccine.name}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', color: '#333', fontWeight: 'bold' }}>Ngày tiêm</th>
              <td style={{ textAlign: 'right', padding: '8px', color: '#555' }}>{vaccineTime?.injectDate}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', color: '#333', fontWeight: 'bold' }}>Giờ tiêm</th>
              <td style={{ textAlign: 'right', padding: '8px', color: '#555' }}>{vaccineTime?.start} - {vaccineTime?.end}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', color: '#333', fontWeight: 'bold' }}>Trung tâm</th>
              <td style={{ textAlign: 'right', padding: '8px', color: '#555' }}>{vaccineTime?.vaccineSchedule.center.centerName}</td>
            </tr>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', color: '#333', fontWeight: 'bold' }}>Giá tiền</th>
              <td style={{ textAlign: 'right', padding: '8px', color: '#555' }}>{formatMoney(vaccineTime?.vaccineSchedule.vaccine.price)}</td>
            </tr>
          </tbody>
        </table>
      </div>
                </div>
            </div>
        </div>
    );

}

export default XacNhanDangky;
