import { useState, useEffect } from 'react';
import $ from 'jquery';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {getMethod, deleteMethod} from '../../services/request';

var size = 10
var url = '';
const AdminDanhMuc = () => {
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    useEffect(() => {
        getCategory();
    }, []);

    const getCategory = async() =>{
        var response = await getMethod('/api/vaccine-type/find-all-admin?&size='+size+'&sort=isPrimary,desc&page='+0)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
        url = '/api/vaccine-type/find-all-admin?&size='+size+'&sort=isPrimary,desc&page='
    };

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }
    

    async function deleteData(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa danh mục này?");
        if (con == false) {
            return;
        }
        var response = await deleteMethod('/api/vaccine-type/delete?id='+id)
        if (response.status < 300) {
            toast.success("xóa thành công!");
            getCategory();
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-md-3 col-sm-6 col-6">
                    <a href='adddanhmuc' className="btn btn-primary">
                        <i className="fa fa-plus"></i> Thêm danh mục
                    </a>
                </div>
            </div>
            <div className="tablediv">
                <div className="headertable">
                    <span className="lbtable">Danh sách danh mục</span>
                </div>
                <div className="divcontenttable">
                    <table id="example" className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Tên danh mục</th>
                                <th>Danh mục chính</th>
                                <th>Danh mục cha</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr>
                                    <td>{item.id}</td>
                                    <td>{item.typeName}</td>
                                    <td>{item.isPrimary == true?<span className='green-text'><i class="fa fa-check-circle" aria-hidden="true"></i> Là danh mục chính</span>:''}</td>
                                    <td>{item.vaccineType?.typeName}</td>
                                    <td>
                                    <a href={'adddanhmuc?id='+item.id} class="edit-btn"><i className='fa fa-edit'></i></a>
                                    <button onClick={()=>deleteData(item.id)} class="delete-btn"><i className='fa fa-trash'></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
            </div>


        </>
    );
};

export default AdminDanhMuc;