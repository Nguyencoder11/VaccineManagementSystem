import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 
import DataTable from 'datatables.net-dt';
import Swal from 'sweetalert2'
import {getMethod, postMethodPayload} from '../../services/request';
import { formatMoney } from '../../services/money';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

var token = localStorage.getItem("token");

async function addOrUpdateLichTiemChung(event) {
    event.preventDefault();
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var lichtiem = {
        "id": id,
        "startDate": event.target.elements.ngaybatdau.value,
        "endDate": event.target.elements.ngayketthuc.value,
        "limitPeople": event.target.elements.gioihan.value,
        "idPreSchedule": event.target.elements.idPreSchedule.value,
        "description": event.target.elements.description.value,
        "center": {"id":event.target.elements.centerselect.value},
        "vaccine": {"id":event.target.elements.vacxinselect.value},
    }
    console.log(lichtiem)
    var res = null;
    if(id == null){
        res = await postMethodPayload('/api/vaccine-schedule/admin/create', lichtiem)
    }
    else{
        res = await postMethodPayload('/api/vaccine-schedule/admin/update', lichtiem)
    }
    if (res.status < 300) {
        Swal.fire({
            title: "Thông báo",
            text: "Thêm/cập nhật thành công!",
            preConfirm: () => {
                window.location.href = 'lich-tiem-chung'
            }
        });
    } else {
        if(res.status == 417){
            var result = await res.json();
            toast.warning(result.defaultMessage);
        }
        else{
            toast.error("Thêm/ sửa lịch tiêm thất bại");
        }
    }
}

const AdminAddLichTiemChung = ()=>{
    const [item, setItem] = useState(null);
    const [vacxin, setVacxin] = useState([]);
    const [center, setCenter] = useState([]);
    const [textButton, setTextbutton] = useState("Thêm lịch tiêm chủng");
    const [vacxinchs, setVacxinchs] = useState(null);
    const [centerchs, setCenterchs] = useState(null);

    useEffect(()=>{
        const getLichTiemChung= async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                setTextbutton("Cập nhật lịch tiêm chủng")
                var response = await getMethod('/api/vaccine-schedule/all/find-by-id?id=' + id);
                var result = await response.json();
                setItem(result)
                setVacxinchs(result.vaccine)
                setCenterchs(result.center)
            }
        };
        getLichTiemChung();
        
        const getVacxin= async() =>{
            var response = await getMethod('/api/vaccine/all/find-all');
            var result = await response.json();
            setVacxin(result)
        };
        getVacxin();

        const getCenter= async() =>{
            var response = await getMethod('/api/center/public/find-all');
            var result = await response.json();
            setCenter(result)
        };
        getCenter();
    }, []);

    const handleChangeVacXin = (option) => {
        var value = option.value;
        for(var i=0; i<vacxin.length; i++){
            if(vacxin[i].id == value){
                setVacxinchs(vacxin[i])
            }
        }
    };
    const handleChangeCenter = (option) => {
        var value = option.value;
        for(var i=0; i<center.length; i++){
            if(center[i].id == value){
                setCenterchs(center[i])
            }
        }
    };

    return (
        <>
            <div className='row'>
                <div className='col-sm-4'>
                    <div className='headpageadmin'>
                        <span>{textButton}</span>
                    </div>
                </div>
            </div>
            <form className='row' onSubmit={addOrUpdateLichTiemChung} method='post'>
                <div className='col-sm-4'>
                    <label className='lbadd-admin'>Ngày bắt đầu</label>
                    <input name='ngaybatdau' defaultValue={item==null?'':item.startDate} type='date' className='form-control' required/>

                    <label className='lbadd-admin'>Ngày kết thúc</label>
                    <input name='ngayketthuc' defaultValue={item==null?'':item.endDate} type='date' className='form-control' required/>
                    
                    <label className='lbadd-admin'>Số người giới hạn</label>
                    <input name='gioihan' defaultValue={item==null?'':item.limitPeople} type='number' className='form-control' required/>
                    
                    <label className='lbadd-admin'>Id lịch tiêm trước đó</label>
                    <input name='idPreSchedule' defaultValue={item==null?'':item.idPreSchedule} type='number' className='form-control'/>
                    
                </div>
                <div className='col-sm-4'>
                    <label className='lbadd-admin'>Tên vacxin</label>
                    <Select
                        options={vacxin.map((item) => ({
                            label: item.name,
                            value: item.id,
                        }))}
                        value={vacxinchs==null?'':{ label: vacxinchs.name, value: vacxinchs.id }}
                        placeholder="Chọn vacxin..."
                        name='vacxinselect'
                        isSearchable={true} 
                        onChange={handleChangeVacXin}
                    />
                    <label className='lbadd-admin'>Trung tâm tiêm</label>
                    <Select
                        options={center.map((item) => ({
                            label: item.centerName,
                            value: item.id,
                        }))}
                        value={centerchs==null?'':{ label: centerchs.centerName, value: centerchs.id }}
                        onChange={handleChangeCenter}
                        placeholder="Chọn trung tâm..."
                        name='centerselect'
                        isSearchable={true} 
                    />
                    <label className='lbadd-admin'>Mô tả</label>
                    <textarea defaultValue={item==null?'':item.description} className='form-control' name="description"></textarea>
                    <label className='lbadd-admin' dangerouslySetInnerHTML={{__html:'&ThinSpace;'}}></label>
                    <button className='btn btn-primary form-control'>{textButton}</button>
                </div>
            </form>
        </>
    );
}

export default AdminAddLichTiemChung;