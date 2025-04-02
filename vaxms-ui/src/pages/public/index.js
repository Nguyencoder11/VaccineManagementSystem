import Footer from '../../layout/customer/footer/footer'
import banner from '../../assets/images/banner.jpg'
import banner1 from '../../assets/images/banner1.png'
import banner2 from '../../assets/images/banner2.jpg'
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
import style from '../../layout/customer/styles/styleuser.scss'


var sizepro = 20
function Home(){
    const [itemType, setItemType] = useState([]);
    const [itemNews, setItemNews] = useState([]);

    useEffect(()=>{
        const getItemTyoe = async() =>{
            var response = await getMethod('/api/vaccine/public/vaccine-type');
            var result = await response.json();
            setItemType(result)
        };
        getItemTyoe();
        const getItemNews = async() =>{
            var response = await getMethod('/api/news/public/top-6');
            var result = await response.json();
            setItemNews(result)
        };
        getItemNews();
    }, []);
  

    

    return(
     <>
        <div class="bannerindex">
        <div id="courseindex">
            <div id="carouselExampleControls" class="carousel slide bannerindex" data-bs-ride="carousel">
                <div id="carouselindex">
                    <div class="carousel-inner carousel-inner-index">
                        <div class="carousel-item active">
                            <a href=""><img src={banner2} class="d-block w-100"/></a>
                        </div>
                        <div class="carousel-item">
                            <a href=""><img src={banner1} class="d-block w-100"/></a>
                        </div>
                        <div class="carousel-item">
                            <a href=""><img src={banner} class="d-block w-100"/></a>
                        </div>
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
            </div>
        </div>

        <div className='container-web'>
            {itemType.map((item, index)=>{
            return <div className=''>
                <div class="headersection">
                    <h4>Loại vaccine {item.vaccineType.typeName}</h4>
                </div>
                <div className='row'>
                {item.vaccines.map((vaccine, index)=>{
                    return <a href={"thong-tin-vaccine?id="+vaccine.id} className='col-sm-3 taga-index'>
                    <img src={vaccine.image} className='img-vaccine-index'/>
                    <span className='vaccine-name-index'>{vaccine.name}</span>
                </a>
                })} 
                </div>
            </div>
            })}

            <div className='news-index-block'>
                <h5>TIN TỨC</h5>
                <hr/>
                <div className="news-slider">
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={30}
                    slidesPerView={3}
                    // navigation
                    loop={true}
                    pagination={{ clickable: true }}
                >
                    {itemNews.map((item, index)=>{
                        return <SwiperSlide>
                        <div className="news-item">
                            <a href={"chi-tiet-tin-tuc?id="+item.id}><img src={item.image} alt={item.title} /></a>
                            <a href={"chi-tiet-tin-tuc?id="+item.id}><h3>{item.title}</h3></a>
                            <p>{item.content}</p>
                        </div>
                        </SwiperSlide>
                    })}
                </Swiper>
                </div>
            </div>
        </div>
    </div>
     </>
    );
}

export default Home;
