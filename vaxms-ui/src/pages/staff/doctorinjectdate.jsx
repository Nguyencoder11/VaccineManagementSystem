import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 
import DataTable from 'datatables.net-dt';
import Swal from 'sweetalert2'
import {getMethod, deleteMethod, postMethodPayload} from '../../services/request';
import Select from 'react-select';

const AdminBacSiNgayTiem = ({lichtiem})=>{
    const [listNgay, setListNgay] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [nurses, setNurses] = useState([]);
    const [selectedBacSi, setSelectedBacSi] = useState([]);
    const [selectedYTa, setSelectedYTa] = useState([]);
    const [vacDoctor, setVacDoctor] = useState([]);
    const [vacNurse, setVacNurse] = useState([]);

    useEffect(()=>{
        if(lichtiem != null){
            var startDate = lichtiem.startDate
            var endDate = lichtiem.endDate
            let dates = [];
            let currentDate = new Date(startDate);
            while (currentDate <= new Date(endDate)) {
                let year = currentDate.getFullYear();
                let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên +1
                let day = String(currentDate.getDate()).padStart(2, '0');
                dates.push(`${year}-${month}-${day}`);
                currentDate.setDate(currentDate.getDate() + 1);
            }
            setListNgay(dates)

            getDoctorAndNurse();
        }
        const getData= async() =>{
            var response = await getMethod('/api/doctor/public/find-all');
            var result = await response.json();
            setDoctors(result)
            var response = await getMethod('/api/nurse/public/find-all');
            var result = await response.json();
            setNurses(result)
        };
        getData();
    }, [lichtiem]);

    async function thembacsiyta(){
        var listbs = [];
        var listyt = [];
        
        for(var i=0; i< selectedBacSi.length; i++){
            listbs.push(selectedBacSi[i].value)
        }
        for(var i=0; i< selectedYTa.length; i++){
            listyt.push(selectedYTa[i].value)
        }
        var payload = {
            "vaccineScheduleId":lichtiem.id,
            "injectDate":document.getElementById("ngaytiem").value,
            "doctorId":listbs,
            "nurseId":listyt,
        }
        console.log(payload);
        
        var res = await postMethodPayload('/api/vaccine-schedule-doctor/admin/create', payload)
        if (res.status < 300) {
            toast.success("Thành công");
            getDoctorAndNurse();
        } else {
            if(res.status == 417){
                var result = await res.json();
                toast.warning(result.defaultMessage);
            }
            else{
                toast.error("Thất bại");
            }
        }
    }
    

    const getDoctorAndNurse= async() =>{
        var response = await getMethod('/api/vaccine-schedule-doctor/all/find-by-schedule?idSchedule='+lichtiem.id);
        var result = await response.json();
        setVacDoctor(result)
        var response = await getMethod('/api/vaccine-schedule-nurse/all/find-by-schedule?idSchedule='+lichtiem.id);
        var result = await response.json();
        setVacNurse(result)
    };

    async function deletevacDoc(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa bác sĩ khỏi ngày tiêm này?");
        if (con == false) {
            return;
        }
        const res = await deleteMethod('/api/vaccine-schedule-doctor/admin/delete?id=' + id)
        if (res.status < 300) {
            toast.success("Xóa thành công!");
            getDoctorAndNurse();
        }
        else {
            if(res.status == 417){
                var result = await res.json();
                toast.warning(result.defaultMessage);
            }
            else{
                toast.error("Xóa thất bại");
            }
        }
    }

    async function deletevacNur(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa y tá khỏi ngày tiêm này?");
        if (con == false) {
            return;
        }
        const res = await deleteMethod('/api/vaccine-schedule-nurse/admin/delete?id=' + id)
        if (res.status < 300) {
            toast.success("Xóa thành công!");
            getDoctorAndNurse();
        }
        else {
            if(res.status == 417){
                var result = await res.json();
                toast.warning(result.defaultMessage);
            }
            else{
                toast.error("Xóa thất bại");
            }
        }
    }
    

    return (
    <div class="modal fade" id="modalDoctorInjectdate" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Chọn bác sĩ và y tá cho lịch tiêm vaccine {lichtiem?.vaccine.name}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id='noidungtimeschedule'>
                <div className='chonngaybs'>
                    <div className='row'>
                        <div className='col-sm-3'>
                            <Select
                                isMulti
                                options={doctors.map((item) => ({
                                    label: item.fullName,
                                    value: item.id,
                                }))}
                                placeholder="Chọn bác sĩ..."
                                name='bacsi'
                                onChange={setSelectedBacSi}
                                isSearchable={true} 
                            />
                        </div>
                        <div className='col-sm-3'>
                            <Select
                                isMulti
                                options={nurses.map((item) => ({
                                    label: item.fullName,
                                    value: item.id,
                                }))}
                                placeholder="Chọn y tá..."
                                name='yta'
                                onChange={setSelectedYTa}
                                isSearchable={true} 
                            />
                        </div>
                        <div className='col-sm-3'>
                            <select className='form-control' id='ngaytiem'>
                                {listNgay.map((item, index)=>{
                                    return <option value={item}>{item}</option>
                                })}
                            </select>
                        </div>
                        <div className='col-sm-3'>
                            <button onClick={thembacsiyta} className='btn btn-primary form-control'>Tạo</button>
                        </div>
                    </div>
                </div>
                {listNgay.map((item, index)=>{
                    return <div style={{marginTop:'30px'}}>
                        <div className='d-flex' style={{background:'#9e9e9e', paddingLeft:'10px'}}>
                            <span>Ngày: <strong>{item}</strong></span>
                        </div>
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>ID bác sĩ</th>
                                    <th>Tên bác sĩ</th>
                                    <th>Chuyên ngành</th>
                                    <th>Chức năng</th>
                                </tr>
                            </thead>
                            <tbody id={'tablegiotiem'+index}>
                                {vacDoctor.map((vac, index)=>{
                                    if(vac.injectDate == item){
                                        return <tr>
                                            <td>{vac.doctor.id}</td>
                                            <td>{vac.doctor.fullName}</td>
                                            <td>{vac.doctor.specialization}</td>
                                            <td>
                                                <i onClick={()=>deletevacDoc(vac.id)}  className='fa fa-trash iconaction'></i>
                                            </td>
                                        </tr>
                                    }
                                })}
                            </tbody>
                        </table>
                        <table className='table table-bordered'>
                            <thead>
                                <tr>
                                    <th>ID y tá</th>
                                    <th>Tên Y Tá</th>
                                    <th>Chuyên môn</th>
                                    <th>Chức năng</th>
                                </tr>
                            </thead>
                            <tbody id={'tablegiotiem'+index}>
                                {vacNurse.map((vac, index)=>{
                                    if(vac.injectDate == item){
                                        return <tr>
                                            <td>{vac.nurse.id}</td>
                                            <td>{vac.nurse.fullName}</td>
                                            <td>{vac.nurse.qualification}</td>
                                            <td>
                                                <i onClick={()=>deletevacNur(vac.id)} className='fa fa-trash iconaction'></i>
                                            </td>
                                        </tr>
                                    }
                                })}
                            </tbody>
                        </table>
                    </div>
                })}
                </div>
            </div>
        </div>
    </div>
    );
}

export default AdminBacSiNgayTiem;