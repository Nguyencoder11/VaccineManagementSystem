import layoutAdmin from "../layout/admin/Layout";
import layoutLogin from "../layout/customer/loginlayout/login";
import layoutStaff from "../layout/staff/Layout";

//admin
import homeAdmin from "../pages/admin/index";
import userAdmin from "../pages/admin/user";
import lichTiemChungAdmin from "../pages/admin/lichtiemchung";
import addLichTiemChungAdmin from "../pages/admin/addlichtiemchung";

//public
import login from "../pages/public/login";
import register from '../pages/public/register';
import signin from '../pages/public/signin';
import nhanvienAdmin from "../pages/admin/nhanvien";
import khachHangAdmin from "../pages/admin/khachhang";
import employeeAdmin from "../pages/admin/employee";
import index from "../pages/public/index";
import TraCuuLichTiem from "../pages/public/tracuulichtiem";
import LichTiemDaQua from "../pages/public/lichtiemdaqua";
import TimKiemVacxin from "../pages/public/timkiemvaccine";
import ActivateAccount from '../pages/public/ActivateAccount';
import QuenMatKhau from "../pages/public/quenmatkhau";
import DatLaiMatKhau from "../pages/public/datlaimatkhau";

//customer
import dangkytiemchung from "../pages/customer/dangkytiemchung";
import taikhoan from "../pages/customer/taikhoan";
import thongbao from "../pages/customer/thongbao";
import XacNhanDangky from "../pages/customer/xacnhandangky";
import ThanhCong from "../pages/customer/thanhcong";

//staff
import StaffChat from "../pages/staff/chat";
import Vaccine from "../pages/staff/vaccine/vaccine";
import VaccineInventory from "../pages/staff/vaccineInventory/VaccineInventory";
import CustomerSchedule from "../pages/staff/customerSchedule/CustomerSchedule";
import CustomerScheduleView from "../pages/staff/customerSchedule";
import { CustomerScheduleViewDetail } from "../pages/staff/customerSchedule/modal/CustomerScheduleViewDetail";

const publicRoutes = [
    { path: "/", component: index },
    { path: "/search-vaccine", component: TimKiemVacxin },
    { path: "/index", component: index },
    { path: "/login", component: login, layout: layoutLogin },
    { path: "/activate-account", component: ActivateAccount },
    { path: "/register", component: register },
    { path: "/sign-in", component: signin },
    { path: "/lookup-inject-schedule", component: TraCuuLichTiem },
    { path: "/overdue-vaccine-schedule", component: LichTiemDaQua },
    { path: "/forgot-password", component: QuenMatKhau },
    { path: "/reset-password", component: DatLaiMatKhau },
];

const customerRoutes = [
    { path: "/vaccine-register", component: dangkytiemchung },
    { path: "/account", component: taikhoan },
    { path: "/notifications", component: thongbao },
    { path: "/register-confirm", component: XacNhanDangky },
    { path: "/success-payment", component: ThanhCong },
];

const adminRoutes = [
    { path: "/admin/index", component: homeAdmin, layout: layoutAdmin },
    { path: "/admin/user", component: userAdmin, layout: layoutAdmin },
    { path: "/admin/employees", component: nhanvienAdmin, layout: layoutAdmin },
    {
        path: "/admin/vaccine-schedule",
        component: lichTiemChungAdmin,
        layout: layoutAdmin,
    },
    {
        path: "/admin/add-vaccine-schedule",
        component: addLichTiemChungAdmin,
        layout: layoutAdmin,
    },
    {
        path: "/admin/customer-admin",
        component: khachHangAdmin,
        layout: layoutAdmin,
    },
    {
        path: "/admin/employees",
        component: employeeAdmin,
        layout: layoutAdmin,
    },
];

const staffRoutes = [
    { path: "/staff/chat", component: StaffChat, layout: layoutStaff },
    { path: "/staff/vaccine", component: Vaccine, layout: layoutStaff },
    { path: "/staff/vaccine-inventory", component: VaccineInventory, layout: layoutStaff },
    { path: "/staff/customer-schedule", component: CustomerSchedule, layout: layoutStaff },
    { path: "/staff/customer-schedule-1", component: CustomerScheduleView, layout: layoutStaff },
    { path: "/staff/customer-schedule-1-detail", component: CustomerScheduleViewDetail, layout: layoutStaff },
];


export { publicRoutes, adminRoutes, customerRoutes, staffRoutes };