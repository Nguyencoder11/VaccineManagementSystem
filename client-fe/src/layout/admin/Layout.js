import { handleChangePass } from '../../services/auth';
import lich from '../../assest/images/lich.png';
import avatar from '../../assest/images/user.svg';
import { useState, useEffect } from 'react';

function Header({ children }) {
    const [isCssLoaded, setCssLoaded] = useState(false);

    useEffect(() => {
        import('../admin/layout.scss').then(() => setCssLoaded(true));
    }, []);

    return (
        <>
            {/* Left Navigation Bar */}
            <div className="navleft">
                <div className="divroot">
                    <img src={avatar} alt="Avatar" className="admin-avatar" />
                    <div className="name-status">
                        <h4>Admin</h4>
                        <span className="online-status">
                            <i className="fa fa-circle"></i> Online
                        </span>
                    </div>
                </div>
                <div className="listmenumain">
                    <a href="index">
                        <i className="fa fa-home"></i> Trang chủ
                    </a>
                    <a href="user">
                        <i className="fa fa-user"></i> Quản lí quyền
                    </a>
                    <a href="danhmuc">
                        <i className="fa fa-list"></i> Danh mục
                    </a>
                    <a href="lich-tiem-chung">
                        <i className="fa fa-calendar-check-o"></i> Lịch tiêm chủng
                    </a>
                    <a href="khach-hang">
                        <i className="fa fa-users"></i> Quản lý khách hàng
                    </a>
                    <a href="nhan-vien">
                        <i className="fa fa-user-md"></i> Quản lý bác sỹ, y tá
                    </a>
                    <a href="#" onClick={() => logout()}>
                        <i className="fa fa-sign-out"></i> Đăng xuất
                    </a>
                </div>
            </div>

            {/* Header Section */}
            <div className="header">
                <div className="header-left"></div>
                <div className="header-right">
                    <div className="profile">
                        <a
                            className="nav-link dropdown-toggle menucha"
                            href="#"
                            id="navbarDropdown"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <span className="tendangnhap">Admin</span>
                            <img src={avatar} className="userlogo-admin" alt="Avatar" />
                        </a>
                        <ul className="dropdown-menu listitemtk" aria-labelledby="navbarDropdown">
                            <li>
                                <a className="dropdown-item" onClick={() => logout()} href="#">
                                    <i className="fa fa-sign-out"></i> Đăng xuất
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="contentadminweb">
                <div className="contentmain">
                    <div className="table-section">{children}</div>
                </div>
            </div>
        </>
    );
}

async function checkAdmin() {
    var token = localStorage.getItem("token");
    var url = 'http://localhost:8080/api/admin/check-role-admin';
    const response = await fetch(url, {
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        }),
    });
    if (response.status > 300) {
        window.location.replace('../');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.replace('../');
}

export default Header;