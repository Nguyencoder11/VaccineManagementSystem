import logo from '../../../assest/images/vasmsvetay.png';
import { useState, useEffect } from 'react'
import { getMethod, getMethodByToken } from '../../../services/request'
import React, { createContext, useContext } from 'react';

export const HeaderContext = createContext();


var token = localStorage.getItem("token");
function Header() {
  import('../styles/styleuser.scss');
  var auth = <a href="/signin" class="itemheader itemtopheader hotlineheader">Đăng nhập</a>
  if (token != null) {
    auth = <>
      <a href="/tai-khoan" class="itemheader itemtopheader">Tài khoản</a>
      <a onClick={() => logout()} class="itemheader itemtopheader hotlineheader pointer">Đăng xuất</a>
    </>
  }

  const [danhMuc, setDanhMuc] = useState([]);
  useEffect(() => {
      const getDanhMucCha = async() =>{
          var response = await getMethod('/api/vaccine-type/find-primary')
          var result = await response.json();
          setDanhMuc(result)
      };
      getDanhMucCha();
  }, []);
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace('/')
  }
  return (
    <>
      <div id="headerweb">
        <div class="container-web">
          <nav class="navbar navbar-expand-lg">
            <div class="container-fluid">
              <a class="navbar-brand" href="/"><img src={logo} class="imagelogoheader" /></a>
              <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                </ul>
                <div class="d-flex">
                  {/* <a href="" class="itemheader itemtopheader"><i class="fa fa-map-marker"></i> Tìm trung tâm</a> */}
                  <a href="/dang-ky-tiem-chung" class="itemheader itemtopheader"><i class="fa fa-calendar"></i> Đăng ký tiêm</a>
                  <a href="tel:0967332130" class="itemheader itemtopheader hotlineheader">Hotline: 0967.332.130</a>
                  {auth}
                </div>
                <form action='tim-kiem-vaccine' className='d-flex'>
                  <input name='search' className='form-control' placeholder='Tìm kiếm vaccine' />
                </form>
              </div>
            </div>
          </nav>
        </div>
        <hr className='hrheader-web' />
        <div class="container-web container-bottom-header">
        <nav class="navbar-expand-lg">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            {danhMuc.map((item, index)=>{
                return <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle itemheader itembottomheder" href="#" id={"navbarDropdown"+index} role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {item.typeName}
                </a>
                <ul class="dropdown-menu" aria-labelledby={"navbarDropdown"+index}>
                {item.vaccineTypes.map((child, indexChild)=>{
                  return <li><a class="dropdown-item" href={"vaccine-danhmuc?danhmuc="+child.id}>{child.typeName}</a></li>
                })} 
                </ul>
              </li>
            })} 
             <li class="nav-item"><a class="nav-link itemheader itembottomheder" href="tra-cuu-lich-tiem">Tra cứu lịch tiêm</a></li>
          </ul>
        </nav>
      </div>
      </div>

    </>

  );


}

export default Header;