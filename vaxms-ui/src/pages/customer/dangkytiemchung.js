import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { getMethod, postMethodPayload } from '../../services/request';
import logomini from '../../assets/images/vaxmslogo3.png'

function DangKyTiem() {
  const [vacxinType, setVacxinType] = useState([]);
  const [vacxin, setVacxin] = useState([]);
  const [vacxinScheduleTime, setVacxinScheduleTime] = useState([]);
  const [dateScheduleTime, setDateScheduleTime] = useState([]);
  const [vacxinScheduleChoose, setVacxinScheduleChoose] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [center, setCenter] = useState([]);
  const [currentVaccine, setCurrentVaccine] = useState(null);
  const [indexSchedule, setIndexSchedule] = useState(null);
  const [indexTime, setIndexTime] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);
    const fetchData = async () => {
      var res = await getMethod('/api/vaccine-type/find-all');
      var result = await res.json();
      setVacxinType(result);

      var uls = new URL(document.URL)
      var vaccine = uls.searchParams.get("vaccine");
      if(vaccine != null){
        var res = await getMethod('/api/vaccine/public/find-by-id?id='+vaccine);
        var result = await res.json();
        setSelectedType(result.vaccineType)
        handleChonLoai(result.vaccineType)
        setCurrentVaccine(result)
      }
    };
    fetchData();
  }, []);

  const handleChonLoai = async (option) => {
    setSelectedType(option)
    const response = await getMethod(`/api/vaccine/all/find-by-type?typeId=${option.id}`);
    setVacxin(await response.json());
    setVacxinChoose(null);
  };

  const setVacxinChoose = (item, index) => {
    setActiveIndex(index);
    setVacxinScheduleChoose(item);
  };

  async function getCenter() {
    var start = document.getElementById("start").value
    if(currentVaccine == null){
      toast.warning("Hãy chọn vaccine");
      return;
    }
    const response = await getMethod(`/api/vaccine-schedule/public/get-center?start=${start}&vaccineId=${currentVaccine.id}`);
    var result = await response.json()
    if(response.status == 417){
      toast.error(result.defaultMessage)
      return;
    }
    setCenter(result);
    if(result.length == 0){
      document.getElementById("thongbaokhongtimthaydiadiem").style.display = 'block'
      document.getElementById("titlediadiem").style.display = 'none'
    }
    else{
      document.getElementById("thongbaokhongtimthaydiadiem").style.display = 'none'
       document.getElementById("titlediadiem").style.display = 'block'
    }
    setIndexTime(null)
    setVacxinScheduleTime([])
    setSelectedTime(null)
  }

  async function loadDateScheduleTime(schedule, index) {
    setIndexSchedule(index)
    setSelectedSchedule(schedule)
    const response = await getMethod(`/api/vaccine-schedule-time/public/find-date-by-vaccine-schedule?idSchedule=${schedule.id}`);
    var result = await response.json()
    setDateScheduleTime(result)
    if(result.length == 0){
      document.getElementById("thongbaokhongtimthayngaytiem").style.display = 'block'
      document.getElementById("titlengaytiem").style.display = 'none'
    }
    else{
      document.getElementById("thongbaokhongtimthayngaytiem").style.display = 'none'
       document.getElementById("titlengaytiem").style.display = 'block'
    }
    setIndexTime(null)
    setVacxinScheduleTime([])
    setSelectedTime(null)
  }

  async function loadScheduleTime(item) {
    const response = await getMethod(`/api/vaccine-schedule-time/public/find-time-by-vaccine-schedule?date=${item.value}&idSchedule=${selectedSchedule.id}`);
    var result = await response.json()
    setVacxinScheduleTime(result)
    if(result.length == 0){
      document.getElementById("titlegiotiem").style.display = 'none'
    }
    else{
       document.getElementById("titlegiotiem").style.display = 'block'
    }
  }

  function setTimeChoose(item, index){
    setIndexTime(index)
    setSelectedTime(item)
  }

  function formatTime(time) {
    const parts = time.split(":");
    return `${parts[0]}:${parts[1]}`;
  }

  function chuyenTrangDangky() {
    if (selectedTime) {
        window.open('xac-nhan-dang-ky?time=' + selectedTime.id, '_blank');
    }
  }

  return (
      <div className='container-fluid'>
        <div className='container-web'>
          <div className='row'>
            <div className='col-sm-9'>
              <p className='link-head-section'>
                <a href="/">Trang chủ</a>
                <span class="separator"> » </span>
                <span class="last">Đăng ký thông tin tiêm chủng</span>
              </p>
              <div className='section-content-web'>
                <div className='flex-section'>
                  <div className='divsc-dkytiem'><img src={logomini} className='img-section-dky-tiem'/></div>
                  <h2 className='title-dki-tiem-chung'>ĐĂNG KÝ TIÊM CHỦNG</h2>
                </div>
              </div>
              <p className='ghi-chu-tiem-chung'>Đăng ký thông tin tiêm chủng để tiết kiệm thời gian khi đến làm thủ tục tại quầy Lễ tân cho Quý Khách hàng, việc đăng ký thông tin tiêm chủng chưa hỗ trợ đặt lịch hẹn chính xác theo giờ.</p>
              <div className='form-dky-tiem'>
                <div className='row'>
                  <div className='col-sm-12'><span className='title-form-dki-tiem dichvu-dky-tiem'>THÔNG TIN DỊCH VỤ</span></div>
                  <div className='col-sm-6'>
                    <label className='lb-form-dky-tiem'><span>*</span> Loại vắc xin muốn đăng ký</label>
                    <Select
                        options={vacxinType}
                        getOptionLabel={(option) => option.typeName}
                        getOptionValue={(option) => option.id}
                        value={selectedType}
                        onChange={handleChonLoai}
                        placeholder="Chọn loại vacxin"
                        isSearchable={true}
                    />
                  </div>
                  <div className='col-sm-6'>
                    <label className='lb-form-dky-tiem'><span>*</span> Tên vacxin</label>
                    <Select
                        options={vacxin}
                        getOptionLabel={(option)=>option.name}
                        getOptionValue={(option)=>option.id}
                        onChange={setCurrentVaccine}
                        value={currentVaccine}
                        id='vaccine'
                        placeholder="Tên vacxin"
                        isSearchable={true}
                    />
                  </div>
                  <div className='col-sm-12'><span className='title-form-dki-tiem dichvu-dky-tiem'>THỜI GIAN TIÊM</span></div>
                  <div className='col-sm-4'>
                    <label className='lb-form-dky-tiem'><span>*</span> Chọn ngày muốn tiêm</label>
                    <input id='start' defaultValue={currentDate} type='date' className='form-control'/>
                  </div>
                  <div className='col-sm-4'>
                    <label className='lb-form-dky-tiem' dangerouslySetInnerHTML={{__html:'&ThinSpace;'}}></label>
                    <button onClick={getCenter} className='btn btn-primary form-control'><i className='fa fa-filter'></i> Tìm kiếm</button>
                  </div>
                  <div className='col-sm-12'>
                  <div className='col-sm-12'>
                    <span className='title-form-dki-tiem dichvu-dky-tiem' id='titlediadiem'>CHỌN ĐỊA ĐIỂM TIÊM</span></div>
                    <div className='row listdiadiemtiem'>
                      {center.map((item, index)=>{
                          return <div className='col-sm-3'>
                            <div key={item.id} onClick={() => loadDateScheduleTime(item, index)}
                                 className={`singletgtiem h-100 ${indexSchedule === index ? 'activetiem' : ''}`} >
                              <i className='fa fa-home'></i> {item.center.centerName}<br/>
                              <i className='fa fa-road'></i> Địa chỉ: {item.center.street}, {item.center.ward}, {item.center.district}, {item.center.city}<br/>
                              <i className='fa fa-clock'></i> Thời gian:<br/> {item.startDate} - {item.endDate}
                            </div>
                          </div>
                      })}
                    </div>
                    <div className='hiddendiv' id='thongbaokhongtimthaydiadiem'>
                          <p>Xin lỗi! Không tìm thấy lịch tiêm nào với vacxin này</p>
                    </div>
                  </div>
                  <div className='col-sm-4'>
                    <div className='hiddendiv' id='titlengaytiem'>
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
                    <div className='hiddendiv' id='thongbaokhongtimthayngaytiem'>
                      <p>Xin lỗi! Không tìm thấy ngày tiêm nào với vacxin này</p>
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
                                    className={`singletgtiem ${indexTime === index ? 'activetiem' : ''} ${item.quantity !== item.limitPeople?'':'hetslottiem'}`} >
                                  {formatTime(item.start)} - {formatTime(item.end)}<br/>
                                  SL: {item.quantity} / {item.limitPeople}
                                  {item.quantity === item.limitPeople && <span className="cross"></span>}
                                </div>
                              </div>
                        })}
                      </div>
                    </div>
                  </div>
                  <div className='col-sm-12'>
                  {selectedTime !== null && (
                      <button onClick={chuyenTrangDangky} className='btn btn-primary form-control' id='btndangkytiem'>
                          Đăng ký
                      </button>
                  )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );

}

export default DangKyTiem;