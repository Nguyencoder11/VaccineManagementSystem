import { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { getMethod, postMethodPayload } from '../../services/request';
import logomini from '../../assest/images/vasmsvetay.png'

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
      if (vaccine != null) {
        var res = await getMethod('/api/vaccine/public/find-by-id?id=' + vaccine);
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
    if (currentVaccine == null) {
      toast.warning("Hãy chọn vaccine");
      return;
    }
    const response = await getMethod(`/api/vaccine-schedule/public/get-center?start=${start}&vaccineId=${currentVaccine.id}`);
    var result = await response.json()
    if (response.status == 417) {
      toast.error(result.defaultMessage)
      return;
    }
    setCenter(result);
    if (result.length == 0) {
      document.getElementById("thongbaokhongtimthaydiadiem").style.display = 'block'
      document.getElementById("titlediadiem").style.display = 'none'
    }
    else {
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
    if (result.length == 0) {
      document.getElementById("thongbaokhongtimthayngaytiem").style.display = 'block'
      document.getElementById("titlengaytiem").style.display = 'none'
    }
    else {
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
    if (result.length == 0) {
      document.getElementById("titlegiotiem").style.display = 'none'
    }
    else {
      document.getElementById("titlegiotiem").style.display = 'block'
    }
  }

  function setTimeChoose(item, index) {
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
    <div style={{ width: '100%' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <div style={{ flex: '9 0 75%' }}>
            <p style={{ fontSize: '16px', marginBottom: '10px' }}>
              <a href="/" style={{ textDecoration: 'none', color: '#000' }}>Trang chủ</a>
              <span style={{ margin: '0 5px' }}> » </span>
              <span style={{ fontWeight: 'bold' }}>Đăng ký thông tin tiêm chủng</span>
            </p>
            <div style={{ padding: '20px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ marginRight: '15px' }}>
                  <img src={logomini} style={{ width: '60px', height: '60px' }} />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>ĐĂNG KÝ TIÊM CHỦNG</h2>
              </div>
            </div>
            <p style={{ fontSize: '14px', marginTop: '20px' }}>
              Đăng ký thông tin tiêm chủng để tiết kiệm thời gian khi đến làm thủ tục tại quầy Lễ tân cho Quý Khách hàng, việc đăng ký thông tin tiêm chủng chưa hỗ trợ đặt lịch hẹn chính xác theo giờ.
            </p>
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <div style={{ flex: '0 0 100%', marginBottom: '15px' }}>
                  <span style={{ fontWeight: 'bold' }}>THÔNG TIN DỊCH VỤ</span>
                </div>
                <div style={{ flex: '0 0 50%', padding: '0 15px' }}>
                  <label style={{ fontSize: '14px' }}><span>*</span> Loại vắc xin muốn đăng ký</label>
                  <Select
                    options={vacxinType}
                    getOptionLabel={(option) => option.typeName}
                    getOptionValue={(option) => option.id}
                    value={selectedType}
                    onChange={handleChonLoai}
                    placeholder="Chọn loại vacxin"
                    isSearchable={true}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                      }),
                      option: (provided) => ({
                        ...provided,
                        fontSize: '14px',
                      }),
                    }}
                  />
                </div>
                <div style={{ flex: '0 0 50%', padding: '0 15px' }}>
                  <label style={{ fontSize: '14px' }}><span>*</span> Tên vacxin</label>
                  <Select
                    options={vacxin}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    onChange={setCurrentVaccine}
                    value={currentVaccine}
                    id='vaccine'
                    placeholder="Tên vacxin"
                    isSearchable={true}
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                      }),
                      option: (provided) => ({
                        ...provided,
                        fontSize: '14px',
                      }),
                    }}
                  />
                </div>
                <div style={{ flex: '0 0 100%', marginBottom: '15px' }}>
                  <span style={{ fontWeight: 'bold' }}>THỜI GIAN TIÊM</span>
                </div>
                <div style={{ flex: '0 0 33%', padding: '0 15px' }}>
                  <label style={{ fontSize: '14px' }}><span>*</span> Chọn ngày muốn tiêm</label>
                  <input id='start' defaultValue={currentDate} type='date' style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div style={{ flex: '0 0 33%', padding: '0 15px' }}>
                  <label style={{ fontSize: '14px' }}>&nbsp;</label>
                  <button onClick={getCenter} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    <i className='fa fa-filter'></i> Tìm kiếm
                  </button>
                </div>
                <div style={{ flex: '0 0 100%', marginTop: '20px' }}>
                  <div style={{ flex: '0 0 100%' }}>
                    <span style={{ fontWeight: 'bold' }} id='titlediadiem'>CHỌN ĐỊA ĐIỂM TIÊM</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                    {center.map((item, index) => (
                      <div
                        key={item.id}
                        onClick={() => loadDateScheduleTime(item, index)}
                        className={`center-card ${indexSchedule === index ? 'selected' : ''}`}
                        style={{
                          backgroundColor: indexSchedule === index ? '#e6f3ff' : 'white',
                          border: `1px solid ${indexSchedule === index ? '#007bff' : '#e0e0e0'}`,
                          borderRadius: '12px',
                          padding: '15px',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {indexSchedule === index && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              width: 0,
                              height: 0,
                              borderStyle: 'solid',
                              borderWidth: '0 50px 50px 0',
                              borderColor: 'transparent #007bff transparent transparent'
                            }}
                          >
                            <i
                              className="fa fa-check"
                              style={{
                                position: 'absolute',
                                top: '-35px',
                                right: '-25px',
                                color: 'white',
                                transform: 'rotate(45deg)'
                              }}
                            />
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                          <i className='fa fa-hospital-o' style={{ marginRight: '10px', color: '#007bff', fontSize: '24px' }} />
                          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                            {item.center.centerName}
                          </h3>
                        </div>
                        <div style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>
                          <i className='fa fa-map-marker' style={{ marginRight: '8px', color: '#28a745' }} />
                          {item.center.street}, {item.center.ward}, {item.center.district}
                        </div>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                          <i className='fa fa-calendar' style={{ marginRight: '8px', color: '#ffc107' }} />
                          Thời gian: {item.startDate} - {item.endDate}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'none' }} id='thongbaokhongtimthaydiadiem'>
                    <p>Xin lỗi! Không tìm thấy lịch tiêm nào với vacxin này</p>
                  </div>
                </div>
                <div style={{ flex: '0 0 33%', marginBottom: '20px' }}>
                  <div id='titlengaytiem'>
                    <div style={{
                      marginBottom: '10px',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      color: '#007bff'
                    }}>
                      CHỌN THỜI GIAN TIÊM
                    </div>
                    <Select
                      options={dateScheduleTime.map((item) => ({
                        label: item,
                        value: item
                      }))}
                      onChange={loadScheduleTime}
                      placeholder="Chọn ngày"
                      isSearchable={true}
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: '8px',
                          border: '1px solid #ccc',
                          height: '40px',
                          minHeight: 'unset',
                          width: '300px', // Giới hạn chiều ngang
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          padding: '0 10px'
                        }),
                        option: (provided) => ({
                          ...provided,
                          fontSize: '14px',
                          padding: '8px 12px'
                        })
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'none',
                      color: '#ff4d4f',
                      textAlign: 'center'
                    }}
                    id='thongbaokhongtimthayngaytiem'
                  >
                    <p>Xin lỗi! Không tìm thấy ngày tiêm nào với vacxin này</p>
                  </div>
                </div>
                <div style={{ flex: '0 0 66%', marginBottom: '20px' }}>
                  <div id='titlegiotiem'>
                    <div style={{
                      fontWeight: 'bold',
                      marginBottom: '10px',
                      fontSize: '16px',
                      color: '#007bff'
                    }}>
                      {/* CHỌN GIỜ TIÊM */}
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: '10px',
                      backgroundColor: '#f9f9f9',
                      padding: '10px',
                      borderRadius: '8px'
                    }}>
                      {vacxinScheduleTime.map((item, index) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (item.quantity !== item.limitPeople) {
                              setTimeChoose(item, index);
                            }
                          }}
                          style={{
                            backgroundColor: item.quantity !== item.limitPeople
                              ? (selectedTime === item ? '#007bff' : '#ffffff')
                              : '#f8d7da',
                            color: item.quantity !== item.limitPeople
                              ? (selectedTime === item ? 'white' : '#333')
                              : '#721c24',
                            borderRadius: '8px',
                            padding: '10px',
                            textAlign: 'center',
                            cursor: item.quantity !== item.limitPeople ? 'pointer' : 'not-allowed',
                            opacity: item.quantity !== item.limitPeople ? 1 : 0.6,
                            border: `1px solid ${selectedTime === item ? '#007bff' : '#ccc'}`,
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <div style={{
                            fontWeight: 'bold',
                            marginBottom: '5px',
                            fontSize: '14px'
                          }}>
                            {formatTime(item.start)} - {formatTime(item.end)}
                          </div>
                          <div style={{ fontSize: '12px' }}>
                            Còn: {item.limitPeople - item.quantity} chỗ
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ flex: '0 0 100%' }}>
                {selectedTime !== null && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '20px'
                  }}>
                    <button
                      onClick={chuyenTrangDangky}
                      style={{
                        width: '250px',
                        padding: '12px 20px',
                        marginTop: '-16px',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      id='btndangkytiem'
                    >
                      <i className="fa fa-calendar-check-o" style={{ marginRight: '10px' }} />
                      Xác nhận Đăng ký
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


}

export default DangKyTiem;