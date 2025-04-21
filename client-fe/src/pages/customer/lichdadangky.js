import Footer from '../../layout/customer/footer/footer'
import logomini from '../../assest/images/vaxmslogo3.png'

import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Select from 'react-select';
import {getMethod, postMethod, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2'
import StarRating from './star';
import momo from '../../assest/images/momo.webp';
import vnpay from '../../assest/images/vnpay.jpg';
import { formatMoney } from '../../services/money';
import DoiLich from './doilich'


var size = 3
var url = '';
function LichDaDangKy(){
    const [customerSchedule, setCustomerSchedule] = useState([]);
    const [schedule, setSchedule] = useState(null);
    const [rating, setRating] = useState(1);
    const [doctors, setDoctors] = useState([]);
    const [nurses, setNurses] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [item, setItem] = useState(null);

    useEffect(()=>{
        const getItem= async() =>{
            var response = await getMethod('/api/customer-schedule/customer/my-schedule?&size='+size+'&sort=id,desc&page='+0);
            var result = await response.json();
            
            setCustomerSchedule(result.content)
            
            setpageCount(result.totalPages)
            url = '/api/customer-schedule/customer/my-schedule?&size='+size+'&sort=id,desc&page='
        };
        getItem();
        const getDoctor= async() =>{
            var response = await getMethod('/api/doctor/public/find-all');
            var result = await response.json();
            setDoctors(result)
        };
        getDoctor();
        const getNurse= async() =>{
            var response = await getMethod('/api/nurse/public/find-all');
            var result = await response.json();
            setNurses(result)
        };
        getNurse();
    }, []);
  
    async function huyTiem(id) {
        var con = window.confirm("Xác nhận hủy tiêm?");
        if(con == false){
            return;
        }
        var res = await postMethod('/api/customer-schedule/customer/cancel?id='+id)
        if (res.status < 300) {
            toast.success("Đã hủy lịch tiêm thành công!")
            var response = await getMethod('/api/customer-schedule/customer/my-schedule?&size='+size+'&sort=id,desc&page='+0);
            var result = await response.json();
            setCustomerSchedule(result.content)
            setpageCount(result.totalPages)
            url = '/api/customer-schedule/customer/my-schedule?&size='+size+'&sort=id,desc&page='
        } else {
            if(res.status == 417){
                var result = await res.json();
                toast.error(result.defaultMessage);
            }
            else{
                toast.error("Hủy lịch tiêm thất bại");
            }
        }
    }


    const handleRatingSelect = (ratingValue) => {
        setRating(ratingValue);
        console.log('Rating được chọn:', ratingValue);
    };

    async function taoPhanHoi(event) {
        event.preventDefault();
        var phanhoi = {
            "content": event.target.elements.noidungph.value,
            "rating": rating,
            "customerSchedule": {"id":schedule.id},
            "doctor": {"id":event.target.elements.doctor.value},
            "nurse": {"id":event.target.elements.yta.value},
        }
        if(event.target.elements.doctor.value == ''){
            phanhoi.doctor = null
        }
        if(event.target.elements.yta.value == ''){
            phanhoi.nurse = null
        }
        var res = await postMethodPayload('/api/feedback/customer/create', phanhoi)
        if (res.status < 300) {
            toast.success("Đã gửi phản hồi thành công");
        } else {
            toast.error("Hành hộng thất bại");
        }
    }

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setCustomerSchedule(result.content)
        setpageCount(result.totalPages)
        setCurrentPage(currentPage);
    }

    async function filterLichDangKy(){
        var search = document.getElementById("search").value
        var from = document.getElementById("from").value
        var to = document.getElementById("to").value
        var curUrl = '/api/customer-schedule/customer/my-schedule?&size='+size+'&sort=id,desc';
        if(search != ""){
            curUrl += '&search='+search;
        }
        if(from != ""){
            curUrl += '&from='+from;
        }
        if(to != ""){
            curUrl += '&to='+to;
        }
        curUrl += '&page=';
        url = curUrl
        var response = await getMethod(curUrl+0)
        var result = await response.json();
        setCustomerSchedule(result.content)
        setpageCount(result.totalPages)
    }
    async function loadDuLieu(){
        url = '/api/customer-schedule/customer/my-schedule?&size='+size+'&sort=id,desc&page=';
        var response = await getMethod(url+0)
        var result = await response.json();
        setCustomerSchedule(result.content)
        setpageCount(result.totalPages)
        document.getElementById("search").value = ""
        document.getElementById("from").value = ""
        document.getElementById("to").value = "";
    }

    
    function momoClick(){
        document.getElementById("momo").click()
    }

    function vnpayClick(){
        document.getElementById("vnpay").click()
    }

    async function dangKyTiem(event) {
        event.preventDefault();
        var con = window.confirm("Xác nhận thanh toán lịch tiêm");
        if(con == false){
            return;
        }
        var paytype = event.target.elements.paytype.value
        if (paytype == "momo") {
            requestPayMent(event,"momo")
        }
        if (paytype == "vnpay") {
            requestPayMent(event,"vnpay")
        }
    };

    async function requestPayMent(event, type) {
        event.preventDefault();
        const hostname = window.location.hostname;
        const port = window.location.port;         
        const protocol = window.location.protocol;
        const urlmain = `${protocol}//${hostname}:${port}`;
        var returnurl = urlmain+'/thanh-cong';
        var paymentDto = {
            "content": "Thanh toán",
            "returnUrl": returnurl,
            "notifyUrl": returnurl,
            "idScheduleTime": item.vaccineScheduleTime.id,
        }
        localStorage.setItem("customerschedule", item.id);
        var url = '/api/vnpay/urlpayment';
        if(type == "momo"){
            url = '/api/momo/create-url-payment';
        }
        const res = await postMethodPayload(url, paymentDto)
        var result = await res.json();
        if (res.status < 300) {
            window.open(result.url, '_blank');
        }
        if (res.status == 417) {
            toast.warning(result.defaultMessage);
        }
    
    }



    
    return(
        <>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách lịch tiêm chủng đã đăng ký</span>
                    <div className='row'>
                        <div className='col-sm-3'>
                            <label dangerouslySetInnerHTML={{__html:'&ThinSpace;'}}></label>
                            <input id='search' className='form-control' placeholder='Tìm kiếm tên vaccine '/>
                        </div>
                        <div className='col-sm-3'>
                            <label>Từ ngày</label>
                            <input id='from' className='form-control' type='date'/>
                        </div>
                        <div className='col-sm-3'>
                            <label>Đến ngày</label>
                            <input id='to' className='form-control' type='date'/>
                        </div>
                        <div className='col-sm-2'>
                            <label dangerouslySetInnerHTML={{__html:'&ThinSpace;'}}></label>
                           <button onClick={filterLichDangKy} className='form-control btn btn-primary btncommont'>Lọc</button>
                        </div>
                        <div className='col-sm-1'>
                        <label dangerouslySetInnerHTML={{__html:'&ThinSpace;'}}></label>
                           <button onClick={loadDuLieu}  className='form-control btn btn-primary btncommont'><i class="fa fa-refresh"></i></button>
                        </div>
                    </div>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Mã đăng ký</th>
                                <th>Vacxin</th>
                                <th>Trung tâm</th>
                                <th>Ngày đăng ký</th>
                                <th>Ngày tiêm</th>
                                <th>Thanh toán</th>
                                <th>Trạng thái</th>
                                <th>Chức năng</th>
                                <th>Phản hồi</th>
                                <th>Hủy lịch</th>
                            </tr>
                        </thead>
                        <tbody>
                        {customerSchedule.map((item, index)=>{
                            const currentDate = new Date();
                            const targetDate = new Date(item.vaccineScheduleTime.injectDate);
                            var checked = false;
                            if (currentDate.getTime() >= targetDate.getTime()) {
                                checked = true;
                            }
                            return <tr>
                                <td>{item.id}</td>
                                <td>{item.vaccineScheduleTime.vaccineSchedule.vaccine.name}</td>
                                <td>{item.vaccineScheduleTime.vaccineSchedule.center.centerName}</td>
                                <td>{item.createdDate.split(".")[0]}</td>
                                <td>{item.vaccineScheduleTime.start} - {item.vaccineScheduleTime.end}<br/>Ngày tiêm: {item.vaccineScheduleTime.injectDate}</td>
                                <td>{item.customerSchedulePay == 'CHUA_THANH_TOAN'?'Chưa thanh toán':'Đã thanh toán'}</td>
                                <td>{item.statusCustomerSchedule}</td>
                                <td>
                                    {
                                    item.customerSchedulePay == 'CHUA_THANH_TOAN'?
                                    <button onClick={()=>setItem(item)} data-bs-toggle="modal" data-bs-target="#modelthanhtoan" className='btn btn-primary btncommont'>Thanh toán</button>:
                                    <button onClick={()=>setItem(item)} data-bs-toggle="modal" data-bs-target="#modeldoilich" className='btn btn-primary btncommont'>Đổi lịch</button>
                                    }
                                </td>
                                <td>
                                    {
                                    item.statusCustomerSchedule == 'confirmed'?
                                    <button onClick={()=>setSchedule(item)} data-bs-toggle="modal" data-bs-target="#exampleModal" className='btn btn-primary btncommont'>Gửi</button>:<></>
                                    }
                                </td>
                                <td>
                                    {
                                    item.statusCustomerSchedule != 'cancelled' && item.statusCustomerSchedule != 'finished' && checked == false?
                                    <button onClick={()=>huyTiem(item.id)} className='btn btn-danger'>Hủy</button>:<></>
                                    }
                                </td>
                            </tr>
                         })}
                        </tbody>
                    </table>
                    <ReactPaginate 
                        marginPagesDisplayed={2} 
                        pageCount={pageCount} 
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'} 
                        pageClassName={'page-item'} 
                        pageLinkClassName={'page-link'}
                        previousClassName='page-item'
                        previousLinkClassName='page-link'
                        nextClassName='page-item'
                        nextLinkClassName='page-link'
                        breakClassName='page-item'
                        breakLinkClassName='page-link' 
                        previousLabel='Trang trước'
                        nextLabel='Trang sau'
                        activeClassName='active'/>
                </div>
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Gửi phản hổi</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form onSubmit={taoPhanHoi} method='post'>
                                <label className='lb-form-dky-tiem'><span>*</span> Đánh giá sao</label>
                                <StarRating onRatingSelect={handleRatingSelect} />
                                <label className='lb-form-dky-tiem'><span>*</span> Nội dung phản hồi</label>
                                <textarea name='noidungph' className='form-control' />
                                <label className='lb-form-dky-tiem'>Bác sĩ</label>
                                <Select
                                    options={doctors.map((item) => ({
                                        label: item.fullName +", "+item.specialization,
                                        value: item.id,
                                    }))}
                                    placeholder="Chọn bác sĩ tiêm"
                                    name='doctor'
                                    isSearchable={true} 
                                />
                                <label className='lb-form-dky-tiem'>Y tá</label>
                                <Select
                                    options={nurses.map((item) => ({
                                        label: item.fullName +", "+item.qualification,
                                        value: item.id,
                                    }))}
                                    placeholder="Chọn y tá"
                                    name='yta'
                                    isSearchable={true} 
                                />
                                <br/><br/>
                                <button className='btn btn-primary form-control'>Gửi phản hồi</button>
                            </form>
                        </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="modelthanhtoan" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Thanh toán {formatMoney(item?.vaccineScheduleTime.vaccineSchedule.vaccine.price)}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={dangKyTiem}  class="modal-body">
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

                            </table>
                            <button className='btn btn-primary form-control'>Thanh toán</button>
                        </form>
                        </div>
                    </div>
                </div>
                <DoiLich customerSchedule={item}/>
            </div>
        </>
    );
}

export default LichDaDangKy;