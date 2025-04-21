import Footer from '../../layout/customer/footer/footer'
import dctracuu from '../../assest/images/dc-tracuu.jpg'
import ttvc from '../../assest/images/banner-ttvaccine.jpg'
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


function ThongTinVaccine(){
    const [item, setItem] = useState(null);

    useEffect(()=>{
        var uls = new URL(document.URL)
        var id = uls.searchParams.get("id");
        const getItem = async() =>{
            var response = await getMethod('/api/vaccine/public/find-by-id?id='+id);
            var result = await response.json();
            setItem(result)
        };
        getItem();
    }, []);
  

    return(
     <div className='container-web'>
        <img src={ttvc} style={{width:"100%"}}/>
        <div className='row listvaccinesearch'>
            <div className='row'>
                <div className='col-sm-8'>
                    <h4>{item?.name}</h4>
                </div>
                <div className='col-sm-4'>
                    <div className='headttvc'>
                    <a href={'dang-ky-tiem-chung?vaccine='+item?.id} className='linkdangkyslt'>Đăng Ký Tiêm</a>
                </div>
                </div>
            </div>
            <div className='divthongtinvx'>
                <h2 className='divheaderttvx'>
                    Thông Tin Vaccine
                </h2>
                <div className='contentttvc'>
                    <div dangerouslySetInnerHTML={{__html:item?.description}}></div>
                </div>
            </div>
        </div>
     </div>
    );
}

export default ThongTinVaccine;