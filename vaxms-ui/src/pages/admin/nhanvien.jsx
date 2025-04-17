import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './nhanvien.scss'; // CSS mới

const EmployeeSchedule = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [workingDate, setWorkingDate] = useState('');
    const [workingTime, setWorkingTime] = useState('');
    const [schedules, setSchedules] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const token = localStorage.getItem("token");

    const loadEmployees = async () => {
        const url = 'http://localhost:8080/api/user/admin/get-user-by-role?role=Doctor';
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: new Headers({
                    'Authorization': 'Bearer ' + token
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching employees:", error);
            toast.error("Không thể tải danh sách nhân viên");
            return [];
        }
    };

    const loadSchedules = async (doctorId) => {
        const url = `http://localhost:8080/api/work_schedules/doctor/${doctorId}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: new Headers({
                    'Authorization': 'Bearer ' + token
                })
            });

            if (response.ok) {
                return await response.json() || [];
            } else {
                console.error("Failed to load schedules:", response.status);
                return [];
            }
        } catch (error) {
            toast.error("Không thể tải lịch làm việc");
            return [];
        }
    };

    const scheduleWork = async (payload) => {
        try {
            const res = await fetch('http://localhost:8080/api/work_schedules', {
                method: 'POST',
                headers: new Headers({
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify(payload)
            });
            return res;
        } catch (error) {
            toast.error("Lỗi khi tạo lịch làm việc");
            return null;
        }
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            const listEmployees = await loadEmployees();
            setEmployees(listEmployees);
        };

        fetchEmployees();
    }, []);

    const handleOpenModal = async (employee) => {
        setSelectedEmployee(employee);
        const loadedSchedules = await loadSchedules(employee.id);
        setSchedules(loadedSchedules);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEmployee(null);
        setWorkingDate('');
        setWorkingTime('');
    };

    const handleScheduleWork = async (event) => {
        event.preventDefault();
        if (!selectedEmployee || !workingDate || !workingTime) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const payload = {
            doctorId: selectedEmployee.id,
            workingDate: workingDate,
            workingTime: workingTime
        };

        const res = await scheduleWork(payload);
        if (res && res.ok) {
            toast.success("Tạo lịch làm việc thành công!");
            const loadedSchedules = await loadSchedules(selectedEmployee.id);
            setSchedules(loadedSchedules);
            setWorkingDate('');
            setWorkingTime('');
        } else {
            const errorData = await res.json();
            toast.error(errorData.message || "Tạo lịch làm việc thất bại!");
        }
    };

    const getInitials = (fullname) => {
        if (!fullname) return 'NA'; // Trả về 'NA' (Not Available) nếu fullname không tồn tại
        return fullname
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="employee-schedule-container">
            <ToastContainer />

            {/* Header */}
            <div className="employee-header">
                <h1 className="title">Quản Lý Nhân Viên</h1>
                <button
                    className="add-schedule-btn"
                    onClick={() => handleOpenModal(null)}
                >
                    <i className="fa fa-plus"></i> Thêm Lịch Làm Việc
                </button>
            </div>

            {/* Grid of Employee Cards */}
            <div className="employee-grid">
                {employees.map((employee) => (
                    <div key={employee.id} className="employee-card">
                        <div className="employee-info">
                            <div className="avatar">{getInitials(employee.fullname)}</div>
                            <div className="name">{employee.fullname}</div>
                            <div className="email">{employee.email}</div>
                            <button
                                className="schedule-btn"
                                onClick={() => handleOpenModal(employee)}
                            >
                                Đặt Lịch
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* New Table: Display Work Schedules */}
            <div className="work-schedules-table">
                <h2 className="table-title">Lịch Làm Việc Đã Đặt</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nhân Viên</th>
                            <th>Email</th>
                            <th>Ngày Làm Việc</th>
                            <th>Giờ Làm Việc</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.length > 0 ? (
                            schedules.map((schedule, index) => (
                                <tr key={index}>
                                    <td>{selectedEmployee?.fullname || 'NA'}</td>
                                    <td>{selectedEmployee?.email || 'NA'}</td>
                                    <td>{schedule.workingDate}</td>
                                    <td>{schedule.workingTime}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>
                                    Chưa có lịch làm việc nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className={`schedule-modal ${isModalOpen ? 'show' : ''}`}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="title">
                                {selectedEmployee ? `Lịch Làm Việc: ${selectedEmployee.fullname}` : 'Thêm Lịch Làm Việc'}
                            </div>
                            <button className="close-btn" onClick={handleCloseModal}>
                                &times;
                            </button>
                        </div>

                        <form className="schedule-form" onSubmit={handleScheduleWork}>
                            <div className="form-group">
                                <label>Ngày Làm Việc</label>
                                <input
                                    type="date"
                                    value={workingDate}
                                    onChange={(e) => setWorkingDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Giờ Làm Việc</label>
                                <input
                                    type="time"
                                    value={workingTime}
                                    onChange={(e) => setWorkingTime(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="submit-btn">
                                Xác Nhận
                            </button>
                        </form>

                        {schedules.length > 0 && (
                            <div className="existing-schedules">
                                <h4>Các Lịch Làm Việc Hiện Tại</h4>
                                <div className="schedule-list">
                                    {schedules.map(schedule => (
                                        <div key={schedule.id} className="schedule-item">
                                            <span>{schedule.workingDate}</span>
                                            <span>{schedule.workingTime}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

    );
};

export default EmployeeSchedule;