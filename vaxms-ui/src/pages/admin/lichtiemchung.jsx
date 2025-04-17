import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 
import DataTable from 'datatables.net-dt';
import Swal from 'sweetalert2'
import {getMethod, deleteMethod} from '../../services/request';
import AdminGioTiemChung from './giotiem';
import AdminBacSiNgayTiem from './doctorinjectdate';



var size = 10
const AdminLichTiemChung = ()=>{
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [lichTiem, setLichTiem] = useState(null);
    useEffect(()=>{
        const getLichTiemChung= async() =>{
            var response = await getMethod('/api/vaccine-schedule/all/find-all-page?page=0&size='+size+'&sort=id,desc');
            var result = await response.json();
            setItems(result.content)
            setpageCount(result.totalPages)
        };
        getLichTiemChung();
    }, []);  

    async function getAllLich(page) {
        var from = document.getElementById("from").value
        var to = document.getElementById("to").value
        var search = document.getElementById("search").value
        var url = '/api/vaccine-schedule/all/find-all-page?page='+page+'&size='+size+'&sort=id,desc';
        if(from != "" && to != ""){
            url += '&from='+from+'&to='+to
        }
        if(search != ""){
            url += '&search='+search
        }
        var response = await getMethod(url);
        var result = await response.json();
        console.log(result);
        setItems(result.content)
        setpageCount(result.totalPages)
    }

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        await getAllLich(currentPage);
    }

    async function deleteLich(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa lịch tiêm này?");
        if (con == false) {
            return;
        }
        var url = '/api/vaccine-schedule/admin/delete?id=' + id;
        const response = await deleteMethod(url)
        if (response.status < 300) {
            toast.success("xóa thành công!");
            getAllLich(0);
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }

  

    return (
        <>
            <div class="row header-page-admin">
                <div className='col-sm-3'>
                    <a className='btn btn-primary' href='add-lich-tiem-chung'>Thêm lịch tiêm chủng</a>
                </div>
                <div className='col-sm-3'>
                    <input onKeyUp={()=>getAllLich(0)} id='search' className='form-control' placeholder='Nhập tên vaccine'/>
                </div>
                <div className='col-sm-2'>
                    <input id='from' type='date' className='form-control' />
                </div>
                <div className='col-sm-2'>
                    <input id='to' type='date' className='form-control'/>
                </div>
                <div className='col-sm-2'>
                    <button className='btn btn-primary' onClick={()=>getAllLich(0)}><i class="fa fa-filter"></i> Lọc</button>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách lịch tiêm chủng</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Vacxin</th>
                                <th>Trung tâm</th>
                                <th>Người tạo</th>
                                <th>Ngày tạo</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Số lượng tiêm</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                        {items.map((item, index)=>{
                            return <tr>
                                <td>{item.id}</td>
                                <td>{item.vaccine.name}</td>
                                <td>{item.center.centerName}</td>
                                <td>{item.user.email}</td>
                                <td>{item.createdDate}</td>
                                <td>{item.startDate}</td>
                                <td>{item.endDate}</td>
                                <td>{item.limitPeople}</td>
                                <td>
                                    <i onClick={()=>deleteLich(item.id)} class="fa fa-trash iconaction"></i>
                                    <i onClick={()=>window.location.href='add-lich-tiem-chung?id='+item.id} class="fa fa-edit iconaction pointer"></i>
                                    <i onClick={()=>setLichTiem(item)} data-bs-toggle="modal" data-bs-target="#modalGioTiem" class="fa fa-clock iconaction"></i>
                                    <i onClick={()=>setLichTiem(item)} data-bs-toggle="modal" data-bs-target="#modalDoctorInjectdate" class="fa fa-users iconaction"></i>
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
            <AdminGioTiemChung lichtiem={lichTiem}/>
            <AdminBacSiNgayTiem lichtiem={lichTiem}/>
        </>
    );
}

export default AdminLichTiemChung;