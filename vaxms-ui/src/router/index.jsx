import layoutAdmin from "../layout/admin/Layout";
import layoutLogin from "../layout/customer/loginlayout/login";
import layoutStaff from "../layout/staff/Layout";

//admin
import homeAdmin from "../pages/admin";
import userAdmin from "../pages/admin/user";
import lichTiemChungAdmin from "../pages/admin/lichtiemchung";
import addLichTiemChungAdmin from "../pages/admin/addlichtiemchung";
import AdminDanhMuc from "../pages/admin/danhmuc";
import AdminAddDanhMuc from "../pages/admin/adddanhmuc";

//public
import login from "../pages/public/login";
import register from '../pages/public/register';
import signin from '../pages/public/signin';
import nhanvienAdmin from "../pages/admin/nhanvien";
import khachHangAdmin from "../pages/admin/khachhang";
import employeeAdmin from "../pages/admin/employee";
import index from "../pages/public";
import Tracuulichtiem from "../pages/public/tracuulichtiem";
import Lichtiemdaqua from "../pages/public/lichtiemdaqua";
import TimKiemVacxin from "../pages/public/timkiemvaccine";
import ActivateAccount from '../pages/public/ActivateAccount';
import Quenmatkhau from "../pages/public/quenmatkhau";
import Datlaimatkhau from "../pages/public/datlaimatkhau";
import Vaccinedanhmuc from "../pages/public/vaccinedanhmuc";
import Thongtinvaccine from "../pages/public/thongtinvaccine";

//customer
import dangkytiemchung from "../pages/customer/dangkytiemchung";
import taikhoan from "../pages/customer/taikhoan";
import thongbao from "../pages/customer/thongbao";
import Xacnhandangky from "../pages/customer/xacnhandangky";
import Thanhcong from "../pages/customer/thanhcong";

//staff
import StaffChat from "../pages/staff/chat";
import Vaccine from "../pages/staff/vaccine/vaccine";
import VaccineInventory from "../pages/staff/vaccineInventory/VaccineInventory";
import CustomerSchedule from "../pages/staff/customerSchedule/CustomerSchedule";
import CustomerScheduleView from "../pages/staff/customerSchedule";
import {CustomerScheduleViewDetail} from "../pages/staff/customerSchedule/modal/CustomerScheduleViewDetail";
import lichTiemChungStaff from "../pages/staff/lichtiemchung";
import addLichTiemChungStaff from "../pages/staff/addlichtiemchung";
import StaffAddVaccine from "../pages/staff/vaccine/addvaccine";

const publicRoutes = [
    {path: "/", component: index},
    { path: "/tim-kiem-vaccine", component: TimKiemVacxin },
    {path: "/index", component: index},
    {path: "/login", component: login, layout: layoutLogin},
    { path: "/activate-account", component: ActivateAccount },
    {path: "/register", component: register },
    {path: "/signin", component: signin },
    {path: "/tra-cuu-lich-tiem", component: Tracuulichtiem},
    {path: "/lich-tiem-da-qua", component: Lichtiemdaqua},
    { path: "/quenmatkhau", component: Quenmatkhau },
    { path: "/datlaimatkhau", component: Datlaimatkhau },
    {path: "/vaccine-danhmuc", component: Vaccinedanhmuc},
    {path: "/thong-tin-vaccine", component: Thongtinvaccine},
];

const customerRoutes = [
    {path: "/dang-ky-tiem-chung", component: dangkytiemchung},
    {path: "/tai-khoan", component: taikhoan},
    {path: "/thong-bao", component: thongbao},
    {path: "/xac-nhan-dang-ky", component: Xacnhandangky},
    {path: "/thanh-cong", component: Thanhcong},
];

const adminRoutes = [
    {path: "/admin/index", component: homeAdmin, layout: layoutAdmin},
    {path: "/admin/user", component: userAdmin, layout: layoutAdmin},
    { path: "/admin/nhanvien", component: nhanvienAdmin, layout: layoutAdmin },
    { path: "/admin/danhmuc", component: AdminDanhMuc, layout: layoutAdmin },
    { path: "/admin/adddanhmuc", component: AdminAddDanhMuc, layout: layoutAdmin },
    {
        path: "/admin/lich-tiem-chung",
        component: lichTiemChungAdmin,
        layout: layoutAdmin,
    },
    {
        path: "/admin/add-lich-tiem-chung",
        component: addLichTiemChungAdmin,
        layout: layoutAdmin,
    },
    {
        path: "/admin/khach-hang",
        component: khachHangAdmin,
        layout: layoutAdmin,
    },
    {
        path: "/admin/nhan-vien",
        component: employeeAdmin,
        layout: layoutAdmin,
    },
];

const staffRoutes = [
    {path: "/staff/chat", component: StaffChat, layout: layoutStaff},
    {path: "/staff/vaccine", component: Vaccine, layout: layoutStaff},
    {path: "/staff/vaccine-inventory", component: VaccineInventory, layout: layoutStaff},
    {path: "/staff/customer-schedule", component: CustomerSchedule, layout: layoutStaff},
    {path: "/staff/customer-schedule-1", component: CustomerScheduleView, layout: layoutStaff},
    {path: "/staff/customer-schedule-1-detail", component: CustomerScheduleViewDetail, layout: layoutStaff},
    {path: "/staff/lich-tiem-chung", component: lichTiemChungStaff, layout: layoutStaff},
    {path: "/staff/add-lich-tiem-chung", component: addLichTiemChungStaff, layout: layoutStaff},
    {path: "/staff/add-vaccine", component: StaffAddVaccine, layout: layoutStaff},
];


export {publicRoutes, adminRoutes, customerRoutes, staffRoutes};