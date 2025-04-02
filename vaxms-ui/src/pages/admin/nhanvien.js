import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal } from 'bootstrap';
import DataTable from 'datatables.net-dt';

var token = localStorage.getItem("token");


const EmployeeSchedule = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [workingDate, setWorkingDate] = useState('');
    const [workingTime, setWorkingTime] = useState('');
    const [schedules, setSchedules] = useState([]); // Thêm state để lưu lịch làm việc
    const tableRef = useRef(null); // Ref cho DataTable
    async function loadEmployees() {
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
            throw error;
        }
    }
    const loadSchedules = async (doctorId) => {
        const url = `http://localhost:8080/api/work_schedules/doctor/${doctorId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });

        if (response.ok) {
            const data = await response.json();
            return data || []; // Trả về data hoặc mảng rỗng
        } else {
            console.error("Failed to load schedules:", response.status);
            return []; // Nếu có lỗi, trả về mảng rỗng
        }
    };


    async function scheduleWork(payload) {
        const res = await fetch('http://localhost:8080/api/work_schedules', {
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(payload)
        });
        return res;
    }

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const listEmployees = await loadEmployees();
                setEmployees(listEmployees);
            } catch (error) {
                console.error("Failed to load employees:", error);
            }
        };

        fetchEmployees();
    }, []);

    useEffect(() => {
        if (tableRef.current && employees.length > 0) {
            const dataTable = new DataTable(tableRef.current);
            return () => {
                dataTable.destroy(); // Giải phóng tài nguyên khi component unmount
            };
        }
    }, [employees]);

    const handleShowModal = async (employee) => {
        setSelectedEmployee(employee);

        const loadedSchedules = await loadSchedules(employee.id); // Gọi API để tải lịch làm việc
        setSchedules(loadedSchedules);

        const modalElement = document.getElementById('scheduleModal');
        const modal = new Modal(modalElement);
        modal.show();
    };

    const handleScheduleWork = async (event) => {
        event.preventDefault();
        if (!selectedEmployee || !workingDate || !workingTime) {
            toast.error("Please fill in all fields!");
            return;
        }

        const payload = {
            doctorId: selectedEmployee.id,
            workingDate: workingDate,
            workingTime: workingTime
        };

        const res = await scheduleWork(payload);
        if (res.ok) {
            toast.success("Work schedule created successfully!");
            setWorkingDate('');
            setWorkingTime('');
            const modalElement = document.getElementById('scheduleModal');
            const modal = Modal.getInstance(modalElement);
            modal.hide();
        } else {
            const errorData = await res.json();
            toast.error(errorData.message || "Failed to schedule work!");
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-md-3">
                    <button onClick={() => handleShowModal(null)} className="btn btn-primary">
                        <i className="fa fa-plus"></i> Schedule Work
                    </button>
                </div>
            </div>

            <div className="tablediv">
                <div className="headertable">
                    <span className="lbtable">Employee List</span>
                </div>
                <div className="divcontenttable">
                    <table ref={tableRef} className="table table-bordered">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Full Name</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.id}>
                                <td>{employee.id}</td>
                                <td>{employee.email}</td>
                                <td>{employee.fullname}</td>
                                <td>{employee.phone}</td>
                                <td>
                                    <button onClick={() => handleShowModal(employee)} className="btn btn-warning">
                                        <i className="fa fa-calendar"></i> Schedule
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="modal fade" id="scheduleModal" tabIndex="-1" aria-labelledby="scheduleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="scheduleModalLabel">Schedule Work</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleScheduleWork}>
                                <div className="mb-3">
                                    <label className="form-label">Employee: {selectedEmployee ? selectedEmployee.fullname : ''}</label>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Working Date</label>
                                    <input type="date" className="form-control" value={workingDate} onChange={(e) => setWorkingDate(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Working Time</label>
                                    <input type="time" className="form-control" value={workingTime} onChange={(e) => setWorkingTime(e.target.value)} required />
                                </div>
                                <button type="submit" className="btn btn-primary">Schedule Work</button>
                            </form>
                            <div className="mt-4">
                                <h5>Existing Schedules</h5>
                                <ul className="list-group">
                                    {schedules.map(schedule => (
                                        <li key={schedule.id} className="list-group-item">
                                            {schedule.workingDate} at {schedule.workingTime}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmployeeSchedule;