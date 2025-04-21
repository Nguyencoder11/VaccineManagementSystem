import Footer from '../../layout/customer/footer/footer'
import banner from '../../assest/images/BANNERWEB_6_IN_1_FR_1_1440x490_137ec11ded.webp'
import banner1 from '../../assest/images/Vacxin_Cum_thang11_LDP_PC_1440x490_7c1f50d94b.webp'
import banner2 from '../../assest/images/banner-tchung.jpg'
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
    const [visibleCounts, setVisibleCounts] = useState({}); // Lưu trạng thái hiển thị từng loại vaccine

    const handleShowMore = (index) => {
        setVisibleCounts((prevCounts) => ({
            ...prevCounts,
            [index]: prevCounts[index] + 4, // Tăng số lượng hiển thị cho loại vaccine tại chỉ mục tương ứng
        }));
    };

    useEffect(()=>{
        const getItemType = async () => {
            const response = await getMethod('/api/vaccine/public/vaccine-type');
            const result = await response.json();
            setItemType(result);
            const initialCounts = result.reduce((acc, _, index) => {
                acc[index] = 4; // Mặc định hiển thị 4 mục đầu tiên
                return acc;
            }, {});
            setVisibleCounts(initialCounts);
        };
        getItemType();
        const getItemNews = async() =>{
            var response = await getMethod('/api/news/public/top-6');
            var result = await response.json();
            setItemNews(result)
        };
        getItemNews();
    }, []);
  

    

    return (
        <>
            <div style={{ width: "100%", backgroundColor: "#f9f9f9", padding: "20px 0" }}>
                <div style={{ margin: "0 auto", width: "90%" }}>
                    <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel" style={{ marginBottom: "30px", borderRadius: "10px", overflow: "hidden" }}>
                        <div className="carousel-inner">
                            <div className="carousel-item">
                                <a href=""><img src={banner1} className="d-block w-100" style={{ height: "400px", objectFit: "cover" }} /></a>
                            </div>
                            <div className="carousel-item">
                                <a href=""><img src={banner} className="d-block w-100" style={{ height: "400px", objectFit: "cover" }} /></a>
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
    
                <div style={{ margin: "0 auto", width: "90%" }}>
                    {itemType.map((item, itemIndex) => (
                    <div key={itemIndex}>
                        <div style={{ marginBottom: "20px", textAlign: "center" }}>
                            <h4 style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
                                Loại vaccine {item.vaccineType.typeName}
                            </h4>
                        </div>
                        <div className='row'>
                            {item.vaccines.slice(0, visibleCounts[itemIndex] || 0).map((vaccine, vaccineIndex) => (
                        <div className='col-sm-3'>
                                <div className='singlemuitiem'>
                                <a
                                    key={vaccineIndex}
                                    href={"thong-tin-vaccine?id=" + vaccine.id}
                                    style={{
                                        textAlign: "center",
                                        textDecoration: "none",
                                        color: "#333",
                                    }}
                                >
                                    <img
                                        src={vaccine.image}
                                        style={{
                                            width: "100%",
                                            height: "150px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            marginBottom: "10px",
                                        }}
                                        alt={vaccine.name}
                                    />
                                    <span style={{ fontSize: "16px", fontWeight: "bold", display: "block" }}>
                                        {vaccine.name}
                                    </span>
                                </a>
                                </div>
                        </div>
                            ))}
                        </div>
                        {visibleCounts[itemIndex] < item.vaccines.length && (
                            <div className='divxemthem'>
                                <button
                                onClick={() => handleShowMore(itemIndex)}
                                style={{ marginTop: "20px" }}
                                className='btnxemthemindex'
                                >
                                    Xem thêm
                                </button>
                            </div>
                        )}
                    </div>
                    ))}
                    <div style={{ marginTop: "40px" }}>
                        <h5 style={{ fontSize: "20px", fontWeight: "bold", color: "#333", marginBottom: "10px" }}>TIN TỨC</h5>
                        <hr style={{ border: "1px solid #ddd", marginBottom: "20px" }} />
                        <div style={{ position: "relative" }}>
                            <Swiper
                                modules={[Navigation, Pagination]}
                                spaceBetween={30}
                                slidesPerView={3}
                                loop={true}
                                pagination={{ clickable: true }}
                            >
                                {itemNews.map((item, index) => {
                                    return (
                                        <SwiperSlide key={index}>
                                            <div style={{ padding: "15px", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", borderRadius: "10px", backgroundColor: "#fff" }}>
                                                <a href={"chi-tiet-tin-tuc?id=" + item.id}>
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px" }}
                                                    />
                                                </a>
                                                <a href={"chi-tiet-tin-tuc?id=" + item.id} style={{ textDecoration: "none", color: "#333" }}>
                                                    <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>{item.title}</h3>
                                                </a>
                                                <p style={{ fontSize: "14px", color: "#666" }}>{item.content}</p>
                                            </div>
                                        </SwiperSlide>
                                    );
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
