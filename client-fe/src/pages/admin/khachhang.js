import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { Modal } from 'bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod, deleteMethod, putMethod, uploadSingleFile } from '../../services/request';
import './khachhang.scss';

var size = 10
const AdminKhachHang = () => {
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [editCustomer, setEditCustomer] = useState(null);
    const [editModal, setEditModal] = useState(null);

    useEffect(() => {
        const modal = new Modal(document.getElementById('editCustomerModal'));
        setEditModal(modal);
    }, []);

    useEffect(() => {
        const getKhachHang = async () => {
            var response = await getMethod('/api/customer-profile/admin/list-customer?page=0&size=' + size + '&sort=id,asc' + (searchTerm ? '&q=' + searchTerm : ''));
            var result = await response.json();
            setItems(result.content)
            setpageCount(result.totalPages)
        };
        getKhachHang();
    }, [searchTerm]);

    async function getAllKhachHang(page) {
        var url = '/api/customer-profile/admin/list-customer?page=' + page + '&size=' + size + '&sort=id,asc';
        if (searchTerm) {
            url += '&q=' + searchTerm;
        }
        var response = await getMethod(url);
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }

    const handlePageClick = async (data) => {
        var currentPage = data.selected
        await getAllKhachHang(currentPage);
    }

    async function deleteKhachHang(id) {
        var con = window.confirm("Bạn chắc chắn muốn xóa khách hàng này?");
        if (con == false) {
            return;
        }
        var url = `/api/customer-profile/admin/delete/${id}`;
        const response = await deleteMethod(url)
        if (response.status < 300) {
            toast.success("Xóa thành công!");
            getAllKhachHang(0);
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }

    const handleEditClick = (item) => {
        setEditCustomer({...item});
        if (editModal) {
            editModal.show();
        }
    };

    async function updateKhachHang() {
        if (!editCustomer) return;
        
        const fileInput = document.getElementById('avatarUpload');
        if (fileInput.files.length > 0) {
            const avatarUrl = await uploadSingleFile(fileInput);
            if (avatarUrl) {
                editCustomer.avatar = avatarUrl;
            }
        }

        const response = await putMethod(`/api/customer-profile/admin/update/${editCustomer.id}`, editCustomer);
        if (response.status < 300) {
            toast.success("Cập nhật thành công!");
            getAllKhachHang(0);
            
            if (editModal) {
                editModal.hide();
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.remove();
                }
            }
            setEditCustomer(null);
        } else {
            const result = await response.json();
            toast.error(result.defaultMessage || "Có lỗi xảy ra");
        }
    }

    return (
        <>
            <div className="row header-page-admin">
                <div className="col-sm-9">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm theo tên, số điện thoại, email của khách hàng"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-sm-3">
                    <button className="btn btn-primary" onClick={() => getAllKhachHang(0)}>
                        <i className="fa fa-search"></i> Tìm kiếm
                    </button>
                </div>
            </div>
            <div className="tablediv">
                <div className="headertable">
                    <span className="lbtable">Danh sách khách hàng</span>
                </div>
                <div className="divcontenttable">
                    <table id="example" className="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Họ tên khách hàng</th>
                                <th>Giới tính</th>
                                <th>Ngày sinh</th>
                                <th>Số điện thoại</th>
                                <th>Người liên hệ</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => {
                                return (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.fullName}</td>
                                        <td>{item.gender === 'Male' ? 'Nam' : 'Nữ'}</td>
                                        <td>{item.birthdate}</td>
                                        <td>{item.phone}</td>
                                        <td>{item.contactName}</td>
                                        <td>
                                            <i onClick={() => setSelectedCustomer(item)} data-bs-toggle="modal" data-bs-target="#customerDetailModal" className="fa fa-eye iconaction"></i>
                                            <i onClick={() => handleEditClick(item)} className="fa fa-edit iconaction"></i>
                                            <i onClick={() => deleteKhachHang(item.id)} className="fa fa-trash iconaction"></i>
                                        </td>
                                    </tr>
                                )
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
                        previousClassName={'page-item'}
                        previousLinkClassName={'page-link'}
                        nextClassName={'page-item'}
                        nextLinkClassName={'page-link'}
                        breakClassName={'page-item'}
                        breakLinkClassName={'page-link'}
                        previousLabel={'Trang trước'}
                        nextLabel={'Trang sau'}
                        activeClassName={'active'}
                    />
                </div>
            </div>

            <div className="modal fade" id="customerDetailModal" tabIndex="-1" aria-labelledby="customerDetailModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="customerDetailModalLabel">Thông tin chi tiết khách hàng</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {selectedCustomer && (
                                <div>
                                    <p><strong>Họ tên:</strong> {selectedCustomer.fullName}</p>
                                    <p><strong>Giới tính:</strong> {selectedCustomer.gender === 'Male' ? 'Nam' : 'Nữ'}</p>
                                    <p><strong>Ngày sinh:</strong> {selectedCustomer.birthdate}</p>
                                    <p><strong>Số điện thoại:</strong> {selectedCustomer.phone}</p>
                                    <p><strong>Địa chỉ:</strong> {selectedCustomer.street}, {selectedCustomer.ward}, {selectedCustomer.district}, {selectedCustomer.city}</p>
                                    <p><strong>Bảo hiểm y tế:</strong> {selectedCustomer.insuranceStatus ? 'Có' : 'Không'}</p>
                                    <p><strong>Người liên hệ:</strong> {selectedCustomer.contactName}</p>
                                    <p><strong>Mối Quan hệ:</strong> {selectedCustomer.contactRelationship}</p>
                                    <p><strong>SĐT người liên hệ:</strong> {selectedCustomer.contactPhone}</p>
                                    <p><strong>Ngày tạo:</strong> {new Date(selectedCustomer.createdDate).toLocaleDateString('vi-VN')}</p>
                                    {selectedCustomer.avatar && (
                                        <img src={selectedCustomer.avatar} style={{maxWidth: '200px', marginTop: '10px'}} alt="Avatar" />
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="editCustomerModal" tabIndex="-1" aria-labelledby="editCustomerModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editCustomerModalLabel">Cập nhật thông tin khách hàng</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {editCustomer && (
                                <div>
                                    <div className="mb-3">
                                        <label className="form-label">Họ tên</label>
                                        <input type="text" className="form-control" value={editCustomer.fullName} 
                                            onChange={(e) => setEditCustomer({...editCustomer, fullName: e.target.value})} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Giới tính</label>
                                        <select className="form-control" value={editCustomer.gender}
                                            onChange={(e) => setEditCustomer({...editCustomer, gender: e.target.value})}>
                                            <option value="Male">Nam</option>
                                            <option value="Female">Nữ</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ngày sinh</label>
                                        <input type="date" className="form-control" value={editCustomer.birthdate}
                                            onChange={(e) => setEditCustomer({...editCustomer, birthdate: e.target.value})} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Số điện thoại</label>
                                        <input type="text" className="form-control" value={editCustomer.phone}
                                            onChange={(e) => setEditCustomer({...editCustomer, phone: e.target.value})} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Địa chỉ</label>
                                        <input type="text" className="form-control mb-2" placeholder="Đường" value={editCustomer.street}
                                            onChange={(e) => setEditCustomer({...editCustomer, street: e.target.value})} />
                                        <input type="text" className="form-control mb-2" placeholder="Phường/Xã" value={editCustomer.ward}
                                            onChange={(e) => setEditCustomer({...editCustomer, ward: e.target.value})} />
                                        <input type="text" className="form-control mb-2" placeholder="Quận/Huyện" value={editCustomer.district}
                                            onChange={(e) => setEditCustomer({...editCustomer, district: e.target.value})} />
                                        <input type="text" className="form-control" placeholder="Tỉnh/Thành phố" value={editCustomer.city}
                                            onChange={(e) => setEditCustomer({...editCustomer, city: e.target.value})} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Bảo hiểm y tế</label>
                                        <select className="form-control" value={editCustomer.insuranceStatus}
                                            onChange={(e) => setEditCustomer({...editCustomer, insuranceStatus: e.target.value === 'true'})}>
                                            <option value="true">Có</option>
                                            <option value="false">Không</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Người liên hệ</label>
                                        <input type="text" className="form-control" value={editCustomer.contactName}
                                            onChange={(e) => setEditCustomer({...editCustomer, contactName: e.target.value})} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mối quan hệ</label>
                                        <input type="text" className="form-control" value={editCustomer.contactRelationship}
                                            onChange={(e) => setEditCustomer({...editCustomer, contactRelationship: e.target.value})} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">SĐT người liên hệ</label>
                                        <input type="text" className="form-control" value={editCustomer.contactPhone}
                                            onChange={(e) => setEditCustomer({...editCustomer, contactPhone: e.target.value})} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ảnh đại diện</label>
                                        <input type="file" className="form-control" id="avatarUpload" accept="image/*" />
                                        {editCustomer.avatar && (
                                            <img src={editCustomer.avatar} style={{maxWidth: '200px', marginTop: '10px'}} alt="Current Avatar" />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" className="btn btn-primary" onClick={updateKhachHang}>Cập nhật</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminKhachHang