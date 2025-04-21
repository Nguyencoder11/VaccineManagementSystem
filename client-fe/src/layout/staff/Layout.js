import lich from "../../assest/images/lich.png";
import avatar from "../../assest/images/user.svg";
import { useEffect, useState } from "react";

function Header({ children }) {
  const [isCssLoaded, setCssLoaded] = useState(false);

  useEffect(() => {
    if (!isCssLoaded) {
      import("../staff/layout.scss").then(() => setCssLoaded(true));
    }
  }, [isCssLoaded]);

  return (
    <>
      {/* Left Navigation Bar */}
      <div className="navleft">
        <div className="divroot">
          <img src={avatar} alt="Avatar" />
          <div className="name-status">
            <h4>Staff</h4>
            <span className="online-status">
              <i className="fa fa-circle"></i> Online
            </span>
          </div>
        </div>
        <div className="listmenumain">
          <a href="chat">
            <i className="fa fa-envelope"></i> Tin nhắn
          </a>
          <a href="vaccine">
            <i className="fa fa-medkit"></i> Quản lý vaccine
          </a>
          <a href="vaccine-inventory">
            <i className="fa fa-hospital-o"></i> Kho vaccine
          </a>
          <a href="customer-schedule-1">
            <i className="fa fa-calendar"></i> Lịch tiêm và Khách hàng
          </a>
          <a href="lich-tiem-chung">
            <i className="fa fa-calendar"></i> Lịch tiêm chủng
          </a>
          <a href="#" onClick={() => logout()}>
            <i className="fa fa-sign-out"></i> Đăng xuất
          </a>
        </div>
      </div>

      {/* Header Section */}
      <div className="header">
        <div className="header-left">
        </div>
        <div className="header-right">
          <i className="fa fa-bell"></i>
          <i className="fa fa-question-circle"></i>
          <i className="fa fa-envelope"></i>
          <div className="profile">
            <img src={avatar} alt="Avatar" />
            <span>Staff</span>
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

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.replace("../");
}

export default Header;