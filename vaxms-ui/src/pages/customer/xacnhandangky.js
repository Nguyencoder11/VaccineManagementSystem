import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { getMethod, postMethodPayload } from '../../services/request';
import logomini from '../../assets/images/vaxmslogo3.png'

import momo from '../../assets/images/momo.webp';
import vnpay from '../../assets/images/vnpay.jpg';
import {formatMoney} from '../../services/money';
import { faSleigh } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'

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
        var response = await getMethod('/api/vaccine-schedule-time/public/find-by-id?id='+time)
        var result = await response.json();
        setVaccineTime(result)
    };
    fetchData();
  }, []);

  function codClick(){
    document.getElementById("code").click()
  }

  function momoClick(){
    document.getElementById("momo").click()
  }

  function vnpayClick(){
    document.getElementById("vnpay").click()
  }

  async function dangKyTiem(event) {
        event.preventDefault();
        var con = window.confirm("Xác nhận đăng ký tiêm");
        if(con == false){
            return;
        }
        var paytype = event.target.elements.paytype.value
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

    function getPayload(event){
        var payload ={
            fullName: event.target.elements.hotendki.value,
            dob: event.target.elements.ngaysinhnt.value,
            phone: event.target.elements.sdtnt.value,
            address: event.target.elements.diachint.value,
            vaccineScheduleTime: {
                id:vaccineTime.id
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
        if(res.status < 300){
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
        var returnurl = urlmain+'/thong-bao';
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
        var returnurl = urlmain+'/thong-bao';
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
      <div className='container-fluid'>
        <div className='container-web'>
            <div className='row'>
                <div className='col-sm-9'>
                    <p className='link-head-section'>
                        <a href="https://vnvc.vn/">Trang chủ</a>
                        <span class="separator"> » </span>
                        <span class="last">Xác nhận đăng ký thông tin tiêm chủng</span>
                    </p>
                    <div className='section-content-web'>
                    <div className='flex-section'>
                    <div className='divsc-dkytiem'><img src={logomini} className='img-section-dky-tiem'/></div>
                        <h2 className='title-dki-tiem-chung'>XÁC NHẬN ĐĂNG KÝ TIÊM CHỦNG</h2>
                        </div>
                    </div>
                    <p className='ghi-chu-tiem-chung'>Khi chọn thanh toán sau, nếu sau 24h chưa thanh toán, chúng tôi sẽ tự động hủy đăng ký lịch tiêm của bạn</p>
                    <form onSubmit={dangKyTiem} className='form-dky-tiem row' method='post'>
                        <div className='col-sm-6'>
                            <label className='lb-form-dky-tiem'><span>*</span> Họ tên người tiêm</label>
                            <input name='hotendki' defaultValue={customer==null?'':customer.fullName} className='form-control' />
                        </div>
                        <div className='col-sm-6'>
                            <label className='lb-form-dky-tiem'><span>*</span> Ngày sinh người tiêm</label>
                            <input name='ngaysinhnt' defaultValue={customer==null?'':customer.birthdate} className='form-control' type='date' />
                        </div>
                        <div className='col-sm-6'>
                            <label className='lb-form-dky-tiem'><span>*</span> Địa chỉ</label>
                            <input name='diachint' defaultValue={customer==null?'':customer.street+', '+customer.ward+', '+customer.district+', '+customer.city} className='form-control' />
                        </div>
                        <div className='col-sm-6'>
                            <label className='lb-form-dky-tiem'><span>*</span> Số điện thoại</label>
                            <input name='sdtnt' defaultValue={customer==null?'':customer.contactPhone} className='form-control' />
                        </div>
                        <div className='col-sm-12'><span className='title-form-dki-tiem dichvu-dky-tiem'>THÔNG TIN VACCINE</span></div>
                        <div className='col-sm-12' style={{marginTop:'30px'}}>
                        <table className='table tablexacnhandki'>
                            <tr>
                                <th>Vaccine</th>
                                <td>{vaccineTime?.vaccineSchedule.vaccine.name}</td>
                            </tr>
                            <tr>
                                <th>Ngày tiêm</th>
                                <td>{vaccineTime?.injectDate}</td>
                            </tr>
                            <tr>
                                <th>Giờ tiêm</th>
                                <td>{vaccineTime?.start} - {vaccineTime?.end} </td>
                            </tr>
                            <tr>
                                <th>Trung tâm</th>
                                <td>{vaccineTime?.vaccineSchedule.center.centerName}</td>
                            </tr>
                            <tr>
                                <th>Giá tiền</th>
                                <td>{formatMoney(vaccineTime?.vaccineSchedule.vaccine.price)} </td>
                            </tr>
                        </table>
                        </div>
                        <div className='col-sm-12'><span className='title-form-dki-tiem dichvu-dky-tiem'>HÌNH THỨC THANH TOÁN</span></div>
                        <table class="table tablepay">
                            <tr onClick={momoClick}>
                                <td><label class="radiocustom">	<p>Thanh toán qua Ví MoMo</p>
                                        <input value="momo" id="momo" type="radio" name="paytype"/>
                                        <span class="checkmark"></span></label></td>
                                <td><img src={momo} class="momopay"/></td>
                            </tr>
                            <tr onClick={vnpayClick}>
                                <td><label class="radiocustom">	<p>Thanh toán qua Ví Vnpay</p>
                                        <input value="vnpay" id="vnpay" type="radio" name="paytype"/>
                                        <span class="checkmark"></span></label></td>
                                <td><img src={vnpay} class="momopay"/></td>
                            </tr>

                            <tr onClick={codClick}>
                                <td><label class="radiocustom"> <p>Thanh toán sau</p>
                                        <input value="cod" id="code" type="radio" name="paytype"/>
                                        <span class="checkmark"></span></label></td>
                                <td><i class="fa fa-money paycode"></i></td>
                            </tr>
                        </table>
                        <button className='btn btn-primary form-control'>Đặt lịch</button>
                    </form>
                </div>
            </div>
        </div>
      </div>
  );

}

export default XacNhanDangky;