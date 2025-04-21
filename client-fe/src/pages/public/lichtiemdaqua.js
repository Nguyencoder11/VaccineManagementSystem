import Footer from '../../layout/customer/footer/footer'
import dctracuu from '../../assest/images/dc-tracuu.jpg'
import logomini from '../../assest/images/logomini.svg'
import banner2 from '../../assest/images/banner2.jpg'
import {getMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';


var scheduleSize = 10;
var url = '';
function LichTiemDaQua(){
    const [item, setItem] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [schedule, setSchedule] = useState(null);
    useEffect(()=>{
        const getItem = async() =>{
            url = '/api/vaccine-schedule/public/pre-schedule?size='+scheduleSize;
            var response = await getMethod(url+'&page=0');
            var result = await response.json();
            setItem(result.content)
            setpageCount(result.totalPages)
        };
        getItem();
    }, []);
  

    async function searchSchedule() {
        var param = document.getElementById("searchschedule").value
        url = '/api/vaccine-schedule/public/pre-schedule?size='+scheduleSize+'&param='+param;
        var response = await getMethod(url+'&page=0');
        var result = await response.json();
        setItem(result.content)
        setpageCount(result.totalPages)
    }

    async function pageation(page) {
        var response = await getMethod(url+'&page='+page);
        var result = await response.json();
        setItem(result.content)
        setpageCount(result.totalPages)
    }

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        await pageation(currentPage);
    }

    return(
     <div className='container-web'>
        <img src={dctracuu} className='imgtracuulichtiem'/>
        <div className='row'>
                <div className='col-sm-12'>
                    <p className='link-head-section'>
                        <a href="https://vnvc.vn/">Trang chủ</a>
                        <span class="separator"> » </span>
                        <span class="last">Tra cứu lịch tiêm chủng</span>
                    </p>
                    <div className='section-content-web'>
                        <div className='flex-section'>
                            <div className='divsc-dkytiem'><img src={logomini} className='img-section-dky-tiem'/></div>
                            <h2 className='title-dki-tiem-chung'>TRA CỨU LỊCH TIÊM CHỦNG ĐÃ QUA</h2>
                        </div>
                    </div>
                    <div className='headertracuu'>
                        <input onKeyUp={searchSchedule} id='searchschedule' className='input-search-schedule' placeholder='Nhập tên vaccine'/>
                        <a href='tra-cuu-lich-tiem'>Xem lịch tiêm chủng sắp tới</a>
                    </div>
                    <table className='table table-bordered tablelichtiemvaccine'> 
                        <thead className='thead'>
                            <tr>
                                <th>STT</th>
                                <th>Tên vaccine</th>
                                <th>Mô tả</th>
                                <th>Nhà sản xuất</th>
                                <th className='col-gre'>Giá bán</th>
                                <th className='col-gre'>Ngày tiêm</th>
                                <th className='col-blue'>Giới hạn</th>
                                <th className='col-blue'>Địa điểm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {item.map((item, index)=>{
                                return <tr className='pointer hoverschedule' onClick={()=>setSchedule(item)} data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    <td>{index+1}</td>
                                    <td>{item.vaccine.name}</td>
                                    <td dangerouslySetInnerHTML={{__html:item?.vaccine.description}}></td>
                                    <td>{item.vaccine.manufacturer.name}<br/>{item.vaccine.manufacturer.country}</td>
                                    <td className='col-gre'>{formatMoney(item.vaccine.price)}</td>
                                    <td className='col-gre'>{item.startDate} - {item.endDate}</td>
                                    <td className='col-blue'>{item.limitPeople}</td>
                                    <td className='col-blue'>{item.center.centerName}<br/>
                                        {item.center.street},
                                        {item.center.ward},
                                        {item.center.district},
                                        {item.center.city},
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
            </div>

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Thông tin vaccine</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <table className='table'>
                            <tr>
                                <th>Ảnh</th>
                                <td><img src={schedule==null?'':schedule.vaccine.image} className='imgtableschedule'/></td>
                            </tr>
                            <tr>
                                <th>Tên vaccine</th>
                                <td>{schedule==null?'':schedule.vaccine.name}</td>
                            </tr>
                            <tr>
                                <th>Nhóm tuổi</th>
                                <td>{schedule==null?'':schedule.vaccine.ageGroup.ageRange}</td>
                            </tr>
                            <tr>
                                <th>Mô tả</th>
                                <td>{schedule==null?'':schedule.vaccine.description}</td>
                            </tr>
                            <tr>
                                <th>Giá tiền</th>
                                <td>{schedule==null?'':formatMoney(schedule.vaccine.price)}</td>
                            </tr>
                            <tr>
                                <th>Loại vaccine</th>
                                <td>{schedule==null?'':schedule.vaccine.vaccineType.typeName}</td>
                            </tr>
                            <tr>
                                <th>Nhà máy sản xuất</th>
                                <td>{schedule==null?'':schedule.vaccine.manufacturer.name}</td>
                            </tr>
                            <tr>
                                <th>Quốc gia sản xuất</th>
                                <td>{schedule==null?'':schedule.vaccine.manufacturer.country}</td>
                            </tr>
                        </table>
                    </div>
                    </div>
                </div>
            </div>
     </div>
    );
}

export default LichTiemDaQua;
