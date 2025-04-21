import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 
import DataTable from 'datatables.net-dt';
import Swal from 'sweetalert2'
import {getMethod, deleteMethod, postMethodPayload} from '../../services/request';

const AdminGioTiemChung = ({lichtiem})=>{
    const [listNgay, setListNgay] = useState([]);
    const [items, setItems] = useState([]);
    const [soLuongDefault, setSoLuongDefault] = useState(1);
    const [tongHienTai, setTongHienTai] = useState(0);

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
            setSoLuongDefault(lichtiem.limitPeople / dates.length)
            loadGioTiem(lichtiem.id)
        }
        
    }, [lichtiem]);
    
    async function taoGioTiem(index, date){
        var payload = {
            "scheduleId":lichtiem.id,
            "date":date,
            "startTime":document.getElementById("giobatdau"+index).value,
            "endTime":document.getElementById("gioketthuc"+index).value,
            "numHour":document.getElementById("sogiomoica"+index).value,
            "maxPeople":document.getElementById("soluongnguoitiem"+index).value,
        }
        var res = await postMethodPayload('/api/vaccine-schedule-time/admin/create-multiple', payload)
        if (res.status < 300) {
            toast.success("Tạo thành công");
            loadGioTiem(lichtiem.id)
        } else {
            if(res.status == 417){
                var result = await res.json();
                toast.warning(result.defaultMessage);
            }
            else{
                toast.error("Thêm thời gian tiêm thất bại");
            }
        }
    }

    async function loadGioTiem(idLich) {
        var response = await getMethod('/api/vaccine-schedule-time/all/find-by-schedule?idSchedule=' + idLich);
        var result = await response.json();
        setItems(result)
        var tong = 0;
        for(var i=0; i< result.length; i++){
            tong = Number(tong) + Number(result[i].limitPeople) 
        }
        setTongHienTai(tong)
    }


    async function capNhatGio(id){
        var st = document.getElementById("giobdupdate"+id).value.split(":")
        var ed = document.getElementById("gioktupdate"+id).value.split(":")
        var payload = {
            "id":id,
            "start":st[0]+":"+st[1],
            "end":ed[0]+":"+ed[1],
            "limitPeople":document.getElementById("soluongupdate"+id).value,
        }
        var res = await postMethodPayload('/api/vaccine-schedule-time/admin/update', payload)
        if (res.status < 300) {
            toast.success("Cập nhật thành công");
            loadGioTiem(lichtiem.id)
        } else {
            if(res.status == 417){
                var result = await res.json();
                toast.warning(result.defaultMessage);
            }
            else{
                toast.error("Cập nhật thời gian tiêm thất bại");
            }
        }
    }
    
    function appendTr(index, date){
        var tablegiotiem = document.getElementById("tablegiotiem"+index);
        var tr = document.createElement('tr'); 
        const tdtime = document.createElement('td'); 
        const soluong = document.createElement('td'); 
        const thaction = document.createElement('td'); 

        const inputStart = document.createElement('input'); 
        inputStart.type = 'time'
        tdtime.appendChild(inputStart)

        const gachNgang = document.createElement('span'); 
        gachNgang.textContent = ' - '
        tdtime.appendChild(gachNgang)

        const inputEnd = document.createElement('input'); 
        inputEnd.type = 'time'
        tdtime.appendChild(inputEnd)


        const inputSoLuong = document.createElement('input'); 
        inputSoLuong.type = 'number'
        soluong.appendChild(inputSoLuong)

        const iconxoa = document.createElement('i'); 
        iconxoa.classList.add('fa','fa-trash','iconaction')
        thaction.appendChild(iconxoa)
        iconxoa.onclick = function(){
            xoaTam(tr)
        }

        const iconsave = document.createElement('i'); 
        iconsave.classList.add('fa','fa-edit','iconaction')
        thaction.appendChild(iconsave)
        iconsave.onclick = function(){
            addSingle(inputStart, inputEnd, inputSoLuong, date)
        }
        

        tr.appendChild(tdtime)
        tr.appendChild(soluong)
        tr.appendChild(thaction)
        tablegiotiem.appendChild(tr)
    }
    

    function xoaTam(e){
        e.remove();
    }

    async function addSingle(start, end, soluong, date){
        var payload = {
            start: start.value,
            end: end.value,
            limitPeople: soluong.value,
            injectDate: date,
            vaccineSchedule: {
                id:lichtiem.id
            },
        }
        var res = await postMethodPayload('/api/vaccine-schedule-time/admin/create', payload)
        if (res.status < 300) {
            toast.success("Tạo thành công");
            loadGioTiem(lichtiem.id)
        } else {
            if(res.status == 417){
                var result = await res.json();
                toast.warning(result.defaultMessage);
            }
            else{
                toast.error("Thêm thời gian tiêm thất bại");
            }
        }
    }

    async function deleteGioTiem(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa giờ tiêm này?");
        if (con == false) {
            return;
        }
        const res = await deleteMethod('/api/vaccine-schedule-time/admin/delete?id=' + id)
        if (res.status < 300) {
            toast.success("Xóa thành công!");
            loadGioTiem(lichtiem.id)
        }
        else {
            if(res.status == 417){
                var result = await res.json();
                toast.warning(result.defaultMessage);
            }
            else{
                toast.error("Xóa thời gian tiêm thất bại");
            }
        }
    }

    return (
    <div class="modal fade" id="modalGioTiem" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Giờ tiêm chủng vaccine {lichtiem?.vaccine.name}, tổng {lichtiem?.limitPeople} mũi tiêm, {soLuongDefault.toFixed(2)}/ngày
                        , Tổng mũi hiện tại: {tongHienTai}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id='noidungtimeschedule'>
                {listNgay.map((item, index)=>{
                    return <div style={{marginTop:'30px'}}>
                    <div className='d-flex' style={{background:'#9e9e9e', paddingLeft:'10px'}}>
                        <span>Ngày: <strong>{item}</strong></span>
                    </div>
                    <div className='row'>
                        <div className='col-sm-2'>
                            <label>Giờ bắt đầu</label>
                            <input id={'giobatdau'+index} defaultValue='08:00' className='form-control' type='time'/>
                        </div>
                        <div className='col-sm-2'>
                            <label>Giờ kết thúc</label>
                            <input id={'gioketthuc'+index} defaultValue='18:00' className='form-control' type='time'/>
                        </div>
                        <div className='col-sm-2'>
                            <label>Số giờ mỗi ca tiêm</label>
                            <input id={'sogiomoica'+index} defaultValue={1} min={1} className='form-control' type='number'/>
                        </div>
                        <div className='col-sm-2'>
                            <label>Số lượng người tiêm</label>
                            <input id={'soluongnguoitiem'+index} className='form-control' type='number'/>
                        </div>
                        <div className='col-sm-2'>
                            <label dangerouslySetInnerHTML={{__html:'&ThinSpace;'}}></label>
                            <button onClick={()=>taoGioTiem(index, item)} className='btn btn-primary form-control'>Lưu</button>
                        </div>
                        <div className='col-sm-2'>
                            <label dangerouslySetInnerHTML={{__html:'&ThinSpace;'}}></label>
                            <button onClick={()=>appendTr(index, item)} className='btn btn-primary' style={{display:'block'}}><i className='fa fa-plus' ></i></button>
                        </div>
                    </div><br/>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>Thời gian tiêm</th>
                                <th>Số lượng giới hạn</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody id={'tablegiotiem'+index}>
                            {items.map((giotiem, index)=>{
                                if(giotiem.injectDate == item){
                                    return <tr>
                                        <td>
                                            <input id={'giobdupdate'+giotiem.id} type='time' defaultValue={giotiem.start}/> - 
                                            <input id={'gioktupdate'+giotiem.id} type='time' defaultValue={giotiem.end}/>
                                        </td>
                                        <td><input id={'soluongupdate'+giotiem.id} defaultValue={giotiem.limitPeople}/></td>
                                        <td>
                                            <i onClick={()=>deleteGioTiem(giotiem.id)} class="fa fa-trash iconaction"></i>
                                            <i onClick={()=>capNhatGio(giotiem.id)} class="fa fa-edit iconaction"></i>
                                        </td>
                                    </tr>
                                }
                            })}
                        </tbody>
                    </table>
                    <hr/>
                    </div>
                })}
                </div>
            </div>
        </div>
    </div>
    );
}

export default AdminGioTiemChung;