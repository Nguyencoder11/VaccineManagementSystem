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


var size = 10;
var url = '';
function TimKiemVacxin(){
    const [item, setItem] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [description, setDescription] = useState("");

    useEffect(()=>{
        var uls = new URL(document.URL)
        var search = uls.searchParams.get("search");
        const getItem = async() =>{
            url = '/api/vaccine/public/search-by-param?search='+search+'&size='+size+'&page=';
            var response = await getMethod(url+0);
            var result = await response.json();
            setItem(result.content)
            setpageCount(result.totalPages)
        };
        getItem();
    }, []);
  

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItem(result.content)
        setpageCount(result.totalPages)
    }
    return(
     <div className='container-web'>
        <div className='row listvaccinesearch'>
        {item.map((item=>{
            return <div className='col-sm-3'>
                <div onClick={()=>setDescription(item.description)}  data-bs-toggle="modal" data-bs-target="#motamodal"  className='singlevcsearch'>
                    <img src={item.image} className='imgvaccine'/>
                    <div className='divcntvaccine'>
                        <a href='#' className='tenvaccinesearch'>{item.name}</a>
                        <span className='motavaccinesearch' dangerouslySetInnerHTML={{__html:item?.description}}></span>
                        <span className='nhomtuoivc'>Nhóm tuổi: {item.ageGroup.ageRange}</span>
                        
                        <a target='_blank' href={'dang-ky-tiem-chung?vaccine='+item.id} className='btn btn-primary'>Đặt</a>
                    </div>
                </div>
            </div>
        }))}
        </div>
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

        <div class="modal fade" id="motamodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Mô tả vaccine</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row">
                            <div dangerouslySetInnerHTML={{__html:description}}>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
     </div>
    );
}

export default TimKiemVacxin;