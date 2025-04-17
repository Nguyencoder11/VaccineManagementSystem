import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { Modal } from 'bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { getMethod, deleteMethod, putMethod, uploadSingleFile } from '../../services/request';

var size = 10;
const Employee = () => {
    const [activeTab, setActiveTab] = useState('doctors');
    const [items, setItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [editModal, setEditModal] = useState(null);

    useEffect(() => {
        const modal = new Modal(document.getElementById('editModal'));
        setEditModal(modal);
    }, []);

    useEffect(() => {
        loadData(0);
    }, [searchTerm, activeTab]);

    const loadData = async (page) => {
        const baseUrl = activeTab === 'doctors' 
            ? '/api/doctor/admin/list-doctor'
            : '/api/nurse/admin/list-nurse';
            
        const url = `${baseUrl}?page=${page}&size=${size}&sort=id,asc${searchTerm ? '&q=' + searchTerm : ''}`;
        
        try {
            const response = await getMethod(url);
            const result = await response.json();
            setItems(result.content);
            setPageCount(result.totalPages);
        } catch (error) {
            console.error("Error loading data:", error);
            toast.error("Có lỗi xảy ra khi tải dữ liệu");
        }
    };

    const handlePageClick = async (data) => {
        await loadData(data.selected);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Bạn chắc chắn muốn xóa?");
        if (!confirmDelete) return;

        const baseUrl = activeTab === 'doctors' 
            ? `/api/doctor/admin/delete/${id}`
            : `/api/nurse/admin/delete/${id}`;

        try {
            const response = await deleteMethod(baseUrl);
            if (response.status < 300) {
                toast.success("Xóa thành công!");
                loadData(0);
            } else {
                const result = await response.json();
                toast.warning(result.defaultMessage);
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi xóa");
        }
    };

    const handleEditClick = (item) => {
        setEditItem({...item});
        if (editModal) {
            editModal.show();
        }
    };

    const handleUpdate = async () => {
        if (!editItem) return;

        const fileInput = document.getElementById('avatarUpload');
        if (fileInput.files.length > 0) {
            const avatarUrl = await uploadSingleFile(fileInput);
            if (avatarUrl) {
                editItem.avatar = avatarUrl;
            }
        }

        const baseUrl = activeTab === 'doctors'
            ? `/api/doctor/admin/update/${editItem.id}`
            : `/api/nurse/admin/update/${editItem.id}`;

        try {
            const response = await putMethod(baseUrl, editItem);
            if (response.status < 300) {
                toast.success("Cập nhật thành công!");
                loadData(0);
                
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
                setEditItem(null);
            } else {
                const result = await response.json();
                toast.error(result.defaultMessage || "Có lỗi xảy ra");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật");
        }
    };

    return (
        <>
            <div className="nav nav-tabs mb-3">
                <button 
                    className={`nav-link ${activeTab === 'doctors' ? 'active' : ''}`}
                    onClick={() => setActiveTab('doctors')}
                >
                    Danh sách bác sĩ
                </button>
                <button 
                    className={`nav-link ${activeTab === 'nurses' ? 'active' : ''}`}
                    onClick={() => setActiveTab('nurses')}
                >
                    Danh sách y tá
                </button>
            </div>

            <div className="row header-page-admin mb-3">
                <div className="col-sm-9">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm theo tên, email, số điện thoại"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-sm-3">
                    <button className="btn btn-primary" onClick={() => loadData(0)}>
                        <i className="fa fa-search"></i> Tìm kiếm
                    </button>
                </div>
            </div>

            <div className="tablediv">
                <div className="headertable">
                    <span className="lbtable">
                        {activeTab === 'doctors' ? 'Danh sách bác sĩ' : 'Danh sách y tá'}
                    </span>
                </div>
                <div className="divcontenttable">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Họ tên</th>
                                <th>{activeTab === 'doctors' ? 'Chuyên môn' : 'Trình độ'}</th>
                                <th>Năm kinh nghiệm</th>
                                <th>Mô tả</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.fullName}</td>
                                    <td>{activeTab === 'doctors' ? item.specialization : item.qualification}</td>
                                    <td>{item.experienceYears}</td>
                                    <td>{item.bio}</td>
                                    <td>
                                        <i onClick={() => setSelectedItem(item)} data-bs-toggle="modal" data-bs-target="#detailModal" className="fa fa-eye iconaction"></i>
                                        <i onClick={() => handleEditClick(item)} className="fa fa-edit iconaction"></i>
                                        <i onClick={() => handleDelete(item.id)} className="fa fa-trash iconaction"></i>
                                    </td>
                                </tr>
                            ))}
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

            {/* Detail Modal */}
            <div className="modal fade" id="detailModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Chi tiết {activeTab === 'doctors' ? 'bác sĩ' : 'y tá'}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            {selectedItem && (
                                <div>
                                    <p><strong>Họ tên:</strong> {selectedItem.fullName}</p>
                                    <p><strong>{activeTab === 'doctors' ? 'Chuyên môn:' : 'Trình độ:'}</strong> 
                                        {activeTab === 'doctors' ? selectedItem.specialization : selectedItem.qualification}
                                    </p>
                                    <p><strong>Năm kinh nghiệm:</strong> {selectedItem.experienceYears}</p>
                                    <p><strong>Mô tả:</strong> {selectedItem.bio}</p>
                                    {selectedItem.avatar && (
                                        <img src={selectedItem.avatar} style={{maxWidth: '200px'}} alt="Avatar" />
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

            {/* Edit Modal */}
            <div className="modal fade" id="editModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Cập nhật thông tin {activeTab === 'doctors' ? 'bác sĩ' : 'y tá'}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            {editItem && (
                                <div>
                                    <div className="mb-3">
                                        <label className="form-label">Họ tên</label>
                                        <input 
                                            type="text" 
                                            className="form-control"
                                            value={editItem.fullName}
                                            onChange={(e) => setEditItem({...editItem, fullName: e.target.value})}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            {activeTab === 'doctors' ? 'Chuyên môn' : 'Trình độ'}
                                        </label>
                                        <input 
                                            type="text" 
                                            className="form-control"
                                            value={activeTab === 'doctors' ? editItem.specialization : editItem.qualification}
                                            onChange={(e) => setEditItem(activeTab === 'doctors' 
                                                ? {...editItem, specialization: e.target.value}
                                                : {...editItem, qualification: e.target.value}
                                            )}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Năm kinh nghiệm</label>
                                        <input 
                                            type="number" 
                                            className="form-control"
                                            value={editItem.experienceYears}
                                            onChange={(e) => setEditItem({...editItem, experienceYears: parseInt(e.target.value)})}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mô tả</label>
                                        <textarea 
                                            className="form-control"
                                            value={editItem.bio}
                                            onChange={(e) => setEditItem({...editItem, bio: e.target.value})}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ảnh đại diện</label>
                                        <input 
                                            type="file" 
                                            className="form-control" 
                                            id="avatarUpload" 
                                            accept="image/*" 
                                        />
                                        {editItem.avatar && (
                                            <img 
                                                src={editItem.avatar} 
                                                style={{maxWidth: '200px', marginTop: '10px'}} 
                                                alt="Current Avatar" 
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" className="btn btn-primary" onClick={handleUpdate}>Cập nhật</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Employee;
