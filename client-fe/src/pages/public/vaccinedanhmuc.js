import Footer from '../../layout/customer/footer/footer'
import dctracuu from '../../assest/images/dc-tracuu.jpg'
import logomini from '../../assest/images/vaxmslogo3.png'
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
function VaccineDanhMuc(){
    const [item, setItem] = useState([]);
    const [vaccine, setVacxin] = useState(null);
    const [pageCount, setpageCount] = useState(0);
    const [danhMuc, setDanhMuc] = useState(null);
    useEffect(()=>{
        const getItem = async() =>{
            url = '/api/vaccine-schedule/public/next-schedule?size='+scheduleSize;
            var response = await getMethod(url+'&page=0');
            var result = await response.json();
            setItem(result.content)
            setpageCount(result.totalPages)
        };
        getItem();

        const getById = async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("danhmuc");
            if(id != null){
                var response = await getMethod('/api/vaccine-type/find-by-id?id='+id)
                var result = await response.json();
                setDanhMuc(result)
                var response = await getMethod('/api/vaccine/all/find-by-type?typeId='+id)
                var result = await response.json();
                setItem(result)
            }
        };
        getById();
    }, []);
  
    return(
     <div className='container-web'>
        <img src={dctracuu} className='imgtracuulichtiem'/>
        <div className='row'>
                <div className='col-sm-12'>
                    <p className='link-head-section'>
                        <a href="/">Trang chủ</a>
                        <span class="separator"> » </span>
                        <span class="last">Danh sách vaccine</span>
                    </p>
                    <div className='section-content-web'>
                        <div className='flex-section'>
                            <div className='divsc-dkytiem'><img src={logomini} className='img-section-dky-tiem'/></div>
                            <h2 className='title-dki-tiem-chung'>DANH SÁCH VACCINE {danhMuc?.typeName}</h2>
                        </div>
                    </div>
                    <table className='table table-bordered tablelichtiemvaccine'> 
                        <thead className='thead'>
                            <tr>
                                <th>STT</th>
                                <th>Tên vaccine</th>
                                <th>Mô tả</th>
                                <th>Nhà sản xuất</th>
                                <th className='col-gre'>Giá bán</th>
                            </tr>
                        </thead>
                        <tbody>
                            {item.map((item, index)=>{
                                return <tr className='pointer hoverschedule' onClick={()=>setVacxin(item)} data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    <td>{index+1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.manufacturer?.name}<br/>{item.manufacturer?.country}</td>
                                    <td className='col-gre'>{formatMoney(item.price)}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
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
                                <td><img src={vaccine==null?'':vaccine.image} className='imgtableschedule'/></td>
                            </tr>
                            <tr>
                                <th>Tên vaccine</th>
                                <td>{vaccine==null?'':vaccine.name}</td>
                            </tr>
                            <tr>
                                <th>Nhóm tuổi</th>
                                <td>{vaccine==null?'':vaccine.ageGroup.ageRange}</td>
                            </tr>
                            <tr>
                                <th>Mô tả</th>
                                <td>{vaccine==null?'':vaccine.description}</td>
                            </tr>
                            <tr>
                                <th>Giá tiền</th>
                                <td>{vaccine==null?'':formatMoney(vaccine.price)}</td>
                            </tr>
                            <tr>
                                <th>Loại vaccine</th>
                                <td>{vaccine==null?'':vaccine.vaccineType.typeName}</td>
                            </tr>
                            <tr>
                                <th>Nhà máy sản xuất</th>
                                <td>{vaccine==null?'':vaccine.manufacturer.name}</td>
                            </tr>
                            <tr>
                                <th>Quốc gia sản xuất</th>
                                <td>{vaccine==null?'':vaccine.manufacturer.country}</td>
                            </tr>
                        </table>
                    </div>
                    </div>
                </div>
            </div>
     </div>
    );
}

export default VaccineDanhMuc;