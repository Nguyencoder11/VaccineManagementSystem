import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
import Swal from 'sweetalert2';
import './user.scss';

const token = localStorage.getItem("token");

async function loadUser(role) {
    let url = 'http://localhost:8080/api/user/admin/get-user-by-role';
    if (role) url += `?role=${role}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

async function handleAddAccount(event) {
    event.preventDefault();
    const { password, repassword, fullname, email, phone } = event.target.elements;

    if (password.value !== repassword.value) {
        toast.error("Mật khẩu không trùng khớp");
        return;
    }

    const payload = {
        fullname: fullname.value,
        email: email.value,
        phone: phone.value,
        password: password.value
    };

    const res = await fetch('http://localhost:8080/api/user/admin/addaccount', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (res.status === 417) {
        toast.error(result.defaultMessage);
    } else if (res.ok) {
        Swal.fire({
            title: "Thông báo",
            text: "Tạo tài khoản thành công!",
            preConfirm: () => window.location.reload()
        });
    }
}

const AdminUser = () => {
    const [editUser, setEditUser] = useState(null);
    const [items, setItems] = useState([]);
    const roles = ["Admin", "Doctor", "Nurse", "Customer", "Support Staff"];

    async function handleRoleChange(userId, newRole) {
        const res = await fetch(`http://localhost:8080/api/user/admin/change-role?id=${userId}&role=${newRole}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            toast.success("Cập nhật quyền thành công!");
        } else {
            const errorData = await res.json();
            toast.error(errorData.message || "Cập nhật quyền thất bại!");
        }
    }

    useEffect(() => {
        const getUser = async () => {
            try {
                const listUser = await loadUser("");
                setItems(listUser);
            } catch (error) {
                console.error("Failed to load users:", error);
            }
        };

        getUser();
    }, []);

    async function handleDeleteUser(id) {
        const confirmation = window.confirm("Bạn có chắc chắn muốn xóa người dùng này?");
        if (!confirmation) return;

        const res = await fetch(`http://localhost:8080/api/user/admin/delete?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (res.ok) {
            toast.success("Xóa thành công!");
            const updatedItems = items.filter(item => item.id !== id);
            setItems(updatedItems);
        } else {
            const errorData = await res.json();
            toast.error(errorData.message || "Xóa thất bại!");
        }
    }

    async function handleEditUser(event) {
        event.preventDefault();

        const payload = {
            id: editUser.id,
            fullname: event.target.elements.fullname.value,
            email: event.target.elements.email.value,
            phone: event.target.elements.phone.value,
        };

        const res = await fetch('http://localhost:8080/api/user/admin/all/update-infor', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            toast.success("Cập nhật thông tin thành công!");
            const updatedItems = items.map(item => (item.id === editUser.id ? { ...item, ...payload } : item));
            setItems(updatedItems);
            setEditUser(null);
            $('#editUserModal').modal('hide');
        } else {
            const errorData = await res.json();
            toast.error(errorData.message || "Cập nhật thông tin thất bại!");
        }
    }

    async function lockOrUnlock(id, type) {
        const confirmation = window.confirm("Xác nhận hành động?");
        if (!confirmation) return;

        const response = await fetch(`http://localhost:8080/api/user/admin/lockOrUnlockUser?id=${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            toast.success(type === 1 ? 'Khóa thành công' : 'Mở khóa thành công');
            const updatedItems = items.map(item => (item.id === id ? { ...item, actived: !item.actived } : item));
            setItems(updatedItems);
        } else {
            toast.error("Thất bại");
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-md-3 col-sm-6 col-6">
                    <button data-bs-toggle="modal" data-bs-target="#addtk" className="btn btn-primary">
                        <i className="fa fa-plus"></i> Thêm admin
                    </button>
                </div>
            </div>
            <div className="tablediv">
                <div className="headertable">
                    <span className="lbtable">Danh sách tài khoản</span>
                </div>
                <div className="divcontenttable">
                    <table id="example" className="table table-bordered">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Email</th>
                                <th>Ngày tạo</th>
                                <th>Quyền</th>
                                <th>Hành động</th>
                                <th>Khóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.email}</td>
                                    <td>{item.createdDate}</td>
                                    <td>
                                        <select value={item.authorities.name} onChange={e => handleRoleChange(item.id, e.target.value)}>
                                            {roles.map(role => (
                                                <option key={role} value={role}>
                                                    {role.replace('ROLE_', '').replace('_', ' ')}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <button className="btn btn-warning" onClick={() => { setEditUser(item); $('#editUserModal').modal('show'); }}>
                                            <i className="fa fa-edit"></i> Sửa
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleDeleteUser(item.id)}>
                                            <i className="fa fa-trash"></i> Xóa
                                        </button>
                                    </td>
                                    <td className="sticky-col">
                                        <button onClick={() => lockOrUnlock(item.id, item.actived ? 0 : 1)} className={item.actived ? "btn btn-primary" : "btn btn-danger"}>
                                            <i className={item.actived ? "fa fa-lock" : "fa fa-unlock"}></i> {item.actived ? 'Khóa' : 'Mở khóa'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default AdminUser;
