import Footer from '../../layout/customer/footer/footer'
import logomini from '../../assest/images/logomini.svg'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Select from 'react-select';
import {getMethod, postMethod, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2'


function DoiLich({customerSchedule}){
    const [dateScheduleTime, setDateScheduleTime] = useState([]);
    const [vacxinScheduleTime, setVacxinScheduleTime] = useState([]);
    const [indexTime, setIndexTime] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    useEffect(()=>{
        if(customerSchedule != null){
            setIndexTime(null)
            setVacxinScheduleTime([])
            const loadDateScheduleTime= async() =>{
                const response = await getMethod(`/api/vaccine-schedule-time/public/find-date-by-vaccine-schedule?idSchedule=${customerSchedule.vaccineScheduleTime.vaccineSchedule.id}`);
                var result = await response.json()
                setDateScheduleTime(result)
            }
            loadDateScheduleTime();
        }
    }, [customerSchedule]);

    async function loadScheduleTime(item) {
        const response = await getMethod(`/api/vaccine-schedule-time/public/find-time-by-vaccine-schedule?date=${item.value}&idSchedule=${customerSchedule.vaccineScheduleTime.vaccineSchedule.id}`);
        var result = await response.json()
        setVacxinScheduleTime(result)
        if(result.length == 0){
          document.getElementById("titlegiotiem").style.display = 'none'
        }
        else{
           document.getElementById("titlegiotiem").style.display = 'block'
        }
    }
    function formatTime(time) {
        const parts = time.split(":");
        return `${parts[0]}:${parts[1]}`;
    }

    
    function setTimeChoose(item, index){
        setIndexTime(index)
        setSelectedTime(item)
    }

    async function xacNhandoiLich() {
        var con = window.confirm("Xác nhận đổi lịch");
        if(con == false){
            return;
        }
        if(selectedTime == null){
            toast.warning("Hãy chọn 1 thời gian tiêm");
            return;
        }
        var res = await postMethod("/api/customer-schedule/customer/change-schedule?id="+customerSchedule.id+'&timeId='+selectedTime.id)
        if(res.status < 300){
            toast.success("Đổi lịch thành công")
        }
        if(res.status == 417){
            var result = await res.json();
            console.log(result);
            
            toast.warning(result.defaultMessage)
        }
    }
  
    return(
        <div class="modal fade" id="modeldoilich" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Đổi lịch tiêm {customerSchedule?.vaccineScheduleTime.vaccineSchedule.vaccine.name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body row">
                <div className='col-sm-4'>
                    <div id='titlengaytiem'>
                      <div className='col-sm-12'>
                      <span className='title-form-dki-tiem dichvu-dky-tiem'>CHỌN NGÀY TIÊM</span>
                      </div>
                      <Select
                          options={dateScheduleTime.map((item) => ({
                            label: item,
                            value: item,
                          }))}
                          onChange={loadScheduleTime}
                          placeholder="Chọn ngày"
                          isSearchable={true}
                      />
                    </div>
                </div>
                <div className='col-sm-8'>
                    <div className='hiddendiv' id='titlegiotiem'>
                      <div><span className='title-form-dki-tiem dichvu-dky-tiem'>CHỌN GIỜ TIÊM</span></div>
                      <div className='row listdiadiemtiem'>
                        {vacxinScheduleTime.map((item, index)=>{
                            return <div className='col-sm-3'>
                              <div key={item.id} onClick={() => {
                                 if (item.quantity !== item.limitPeople) {
                                    setTimeChoose(item, index);
                                }}}
                                  className={`singletgtiem ${indexTime === index ? 'activetiem' : ''}`} >
                                {formatTime(item.start)} - {formatTime(item.end)}<br/>
                                SL: {item.quantity} / {item.limitPeople}
                              </div>
                            </div>
                        })}
                      </div>
                    </div>
                </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button onClick={xacNhandoiLich} type="button" class="btn btn-primary">Xác nhận</button>
                </div>
                </div>
            </div>
        </div>
    );
}

export default DoiLich;
