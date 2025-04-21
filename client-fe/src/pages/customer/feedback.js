import Footer from '../../layout/customer/footer/footer'
import logomini from '../../assest/images/logomini.svg'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Select from 'react-select';
import {getMethod, postMethod, postMethodPayload, deleteMethod} from '../../services/request';
import Swal from 'sweetalert2'
import StarRating from './star';



function FeedBack(){
    const [item, setItem] = useState([]);

    useEffect(()=>{
        const getItem= async() =>{
            var response = await getMethod('/api/feedback/customer/my-feedback');
            var result = await response.json();
            setItem(result)
        };
        getItem();
    }, []);
  
    async function huyPhanHoi(id) {
        var con = window.confirm("Xác nhận xóa phản hồi này?");
        if(con == false){
            return;
        }
        var res = await deleteMethod('/api/feedback/customer/delete?id='+id)
        if (res.status < 300) {
            toast.success("Xóa phản hồi thành công");
            var response = await getMethod('/api/feedback/customer/my-feedback');
            var result = await response.json();
            setItem(result)

        } else {
            toast.error("Xóa phản hồi thất bại");
        }
    }

    
    return(
        <>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách phản hồi của bạn</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Nội dung phản hồi</th>
                                <th>Ngày tạo</th>
                                <th>Sao</th>
                                <th>Mã đăng ký</th>
                                <th>Bác sĩ</th>
                                <th>Y tá</th>
                                <th>Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                        {item.map((item, index)=>{
                            return <tr>
                                <td>{item.content}</td>
                                <td>{item.createdDate}</td>
                                <td>{item.rating} <i className='fa fa-star yellow'></i></td>
                                <td>{item.customerSchedule.id}</td>
                                <td>{item.doctor == null?'':item.doctor.fullName}</td>
                                <td>{item.nurse == null?'':item.nurse.fullName}</td>
                                <td><i onClick={()=>huyPhanHoi(item.id)} className='fa fa-trash pointer'></i></td>
                            </tr>
                         })}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default FeedBack;
