import React, { useEffect, useRef, useState } from "react";
import { VaccineScheduleApi } from "../../../../services/staff/VaccineSchedule.api";
import { CustomerScheduleApi } from "../../../../services/staff/CustomerSchedule.api";
import { AppNotification } from "../../../../components/AppNotification";
import dayjs from "dayjs";
import { Button, Form, Input, Modal, Pagination, Popconfirm, Select, Table, Tag } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEdit, faRemove } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useParams } from "react-router-dom";
import ModalUpdateCustomerSchedule from "./ModalUpdateCustomerShedule";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
export const CustomerScheduleViewDetail = () => {
    const nav = useNavigate();
    const { state } = useLocation();
    const location = useLocation();

    // Kiểm tra nếu có trạng thái được truyền từ trang chi tiết
    useEffect(() => {
        if (location.state) {
            const { currentPage, size, formSearch } = location.state;
            if (currentPage) setCurrentPage(currentPage);
            if (size) setPageSize(size);
            if (formSearch) setFormSearch(formSearch);
        }
    }, [location.state]);

    const [modalHandle, setModalHandle] = useState(false);
    const [formHandle, setFormHandle] = useState({
        status: "ACTIVE",
    });
    console.log(state)
    const fileInputRef = useRef(null);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [customerSchedules, setCustomerSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [formSearch, setFormSearch] = useState({
        vaccineScheduleId: state, fullName: "", status: "", page: 1, limit: 10,
    });
    const [vaccineSchedules, setVaccineSchedules] = useState([]);
    const closeModal = () => {
        setModalHandle(false);
        setFormHandle({});
        setFormErrors({});
    };
    useEffect(() => {
        if (modalHandle) {
            VaccineScheduleApi.vaccineSchedules().then((res) => {
                setVaccineSchedules(res.data);
            });
        }
    }, [modalHandle]);
    useEffect(() => {
        handleCustomerSchedules(formSearch);
    }, [formSearch]);
    useEffect(() => {
        handleCustomerSchedules({
            ...formSearch, page: currentPage, limit: pageSize,
        });
    }, [currentPage, pageSize]);
    const handleCustomerSchedules = async (formSearch) => {
        setLoading(true);
        await CustomerScheduleApi.customerSchedules(formSearch)
            .then((res) => {
                console.log("Dữ liệu trả về:", res.data);
                setTotal(res.data.totalElements);
                setCurrentPage(res.data.pageable.pageNumber + 1);
                setPageSize(res.data.size);
                const dataVacines = res.data.content;
                setCustomerSchedules(updatedList(dataVacines, formSearch.page, formSearch.limit));
                setTimeout(() => {
                    setLoading(false);
                }, 500);

                console.log(dataVacines)

            })
            .catch((err) => {
                console.log(err);
            });
    };
    const updatedList = (data, currentPage, pageSize) => {
        return data.map((item, index) => ({
            ...item, stt: (currentPage - 1) * pageSize + index + 1,
        }));
    };
    const handleApprove = (id, status) => {
        CustomerScheduleApi.approveCustomerSchedule({
            customerScheduleId: id, status: status,
        })
            .then((res) => {
                handleCustomerSchedules(formSearch);
                if (status === "confirmed") {
                    AppNotification.success("Duyệt thành công");
                } else {
                    AppNotification.success("Từ chối thành công");
                }

            })
            .catch((err) => {
                const errorMessage = err.response.data.defaultMessage || null;
                if (errorMessage) {
                    AppNotification.error(errorMessage);
                }
            });
        handleCustomerSchedules(formSearch);
    };
    const onPageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const handleSubmit = async () => {

        console.log(state)

        const isValid = formHandle.fullName && formHandle.phone && formHandle.email && formHandle.address;

        if (!isValid) {
            const errors = {
                fullName: !formHandle.name ? "Trường bắt buộc" : "",
                phone: !formHandle.price ? "Trường bắt buộc" : "",
                email: !formHandle.vaccineTypeId ? "Trường bắt buộc" : "",
                address: !formHandle.manufacturerId ? "Trường bắt buộc" : "",
            };
            await setFormErrors(errors);
            return;
        }

        const request = { ...formHandle, vaccineScheduleId: state }

        CustomerScheduleApi.createCustomerFindByIdSchedule(request)
            .then((res) => {
                AppNotification.success("Thêm mới thành công");
                setCustomerSchedules((prev) => [...prev, {
                    ...res.data, stt: prev.length + 1,
                },]);
                closeModal();
            })
            .catch((err) => {
                const errorMessage = err.response.data.defaultMessage
                if (err) {
                    AppNotification.error(errorMessage);
                } else {
                    AppNotification.error("Thêm mới thất bại");
                }
                console.log(err);
            });
    };

    const handleHealthStatusChange = (id, field, value) => {
        const customer = customerSchedules.find(item => item.id === id);

        const updateData = {
            id: id,
            healthStatusBefore: customer.healthStatusBefore, // Giữ nguyên giá trị hiện tại
            healthStatusAfter: customer.healthStatusAfter,   // Giữ nguyên giá trị hiện tại
            [field]: value // Chỉ cập nhật trường được chỉnh sửa
        };

        CustomerScheduleApi.UpdateCustomerSchedule(updateData)
            .then((res) => {
                setCustomerSchedules(prev =>
                    prev.map(item =>
                        item.id === id ? { ...item, healthStatusBefore: res.data.healthStatusBefore, healthStatusAfter: res.data.healthStatusAfter } : item
                    )
                );
                AppNotification.success("Cập nhật thành công");
            })
            .catch((err) => {
                const errorMessage = err.response?.data?.defaultMessage || "Cập nhật thất bại";
                AppNotification.error(errorMessage);
            });
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [detail, setDetail] = useState(null)
    const handleDetail = (values) => {
        setIsModalOpen(true);
        setDetail(values);
    }

    const [editingRows, setEditingRows] = useState({
        healthStatusBefore: null,
        healthStatusAfter: null
    });

    // New function to handle editing state
    const startEditing = (field, id) => {
        setEditingRows(prev => ({
            ...prev,
            [field]: id
        }));
    };

    const cancelEditing = (field) => {
        setEditingRows(prev => ({
            ...prev,
            [field]: null
        }));
    };
    useEffect(() => {
        if (state) {
            VaccineScheduleApi.vaccineSchedules().then(res => {
                // Tìm lịch tiêm cụ thể từ danh sách
                const schedule = res.data.find(item => item.id === state);
                
                if (schedule) {
                    const canRegister = !schedule.endDate || dayjs(schedule.endDate).isAfter(dayjs());
                    setCanRegisterCustomer(canRegister);
                }
            });
        }
    }, [state]);
    const [canRegisterCustomer, setCanRegisterCustomer] = useState(true);


    const columns = [{
        title: "STT", dataIndex: "stt", key: "stt",
    }, {
        title: "Tên Vaccine",
        dataIndex: "vaccineSchedule",
        key: "vaccineSchedule",
        render: (_, record) => record.vaccineScheduleTime?.vaccineSchedule?.vaccine?.name
    }, {
        title: "Tên khách hàng", dataIndex: "fullName", key: "fullName",
    },

    {
        title: "Trạng thái thanh toán",
        dataIndex: "payStatus",
        key: "payStatus",
        render: (payStatus) => (
          <div>
            {payStatus ? (
              <span style={{ color: "green" }}>Đã thanh toán</span>
            ) : (
              <span style={{ color: "red" }}>Chưa thanh toán</span>
            )}
          </div>
        ),
      }, {
        title: "Trạng Thái", dataIndex: "status", key: "status", align: "center", render: (text) => {
            return (<Tag
                color={text === "confirmed" ? "green" : text === "pending" ? "gold" : text === "cancelled" ? "red" : text === "injected" ? "blue" : text === "not_injected" ? "purple" : "default"}
            >
                {text === "confirmed" ? "Đủ điều kiện" : text === "pending" ? "Chưa đủ điều kiện" : text === "cancelled" ? "Đã từ chối" : text === "injected" ? "Đã tiêm" : text === "not_injected" ? "Chưa tiêm" : ""}
            </Tag>);
        },
    }, {
        title: "Tình trạng sức khỏe trước tiêm",
        dataIndex: "healthStatusBefore",
        key: "healthStatusBefore",
        align: "center",
        render: (text, record) => {
            // If this row is in editing mode for healthStatusBefore
            if (editingRows.healthStatusBefore === record.id) {
                return (
                    <div>
                        <Input
                            defaultValue={text}
                            onPressEnter={(e) => {
                                handleHealthStatusChange(record.id, 'healthStatusBefore', e.target.value);
                                cancelEditing('healthStatusBefore');
                            }}
                            onBlur={(e) => {
                                handleHealthStatusChange(record.id, 'healthStatusBefore', e.target.value);
                                cancelEditing('healthStatusBefore');
                            }}
                            autoFocus
                        />
                    </div>
                );
            }

            // Normal view with edit icon
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {text}
                    <Button
                        type="text"
                        icon={<FontAwesomeIcon icon={faEdit} />}
                        onClick={() => startEditing('healthStatusBefore', record.id)}
                    />
                </div>
            );
        }
    },
    {
        title: "Tình trạng sức khỏe sau tiêm",
        dataIndex: "healthStatusAfter",
        key: "healthStatusAfter",
        align: "center",
        render: (text, record) => {
            // If this row is in editing mode for healthStatusAfter
            if (editingRows.healthStatusAfter === record.id) {
                return (
                    <div>
                        <Input
                            defaultValue={text}
                            onPressEnter={(e) => {
                                handleHealthStatusChange(record.id, 'healthStatusAfter', e.target.value);
                                cancelEditing('healthStatusAfter');
                            }}
                            onBlur={(e) => {
                                handleHealthStatusChange(record.id, 'healthStatusAfter', e.target.value);
                                cancelEditing('healthStatusAfter');
                            }}
                            autoFocus
                        />
                    </div>
                );
            }

            // Normal view with edit icon
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {text}
                    <Button
                        type="text"
                        icon={<FontAwesomeIcon icon={faEdit} />}
                        onClick={() => startEditing('healthStatusAfter', record.id)}
                    />
                </div>
            );
        }
    }, {
        title: "Hành động",
        dataIndex: "hanhDong",
        key: "hanhDong",
        align: "center",
        render: (text, record) => (
            record.status === "pending" ? (
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <Popconfirm
                        title="Thông báo"
                        description="Bạn có chắc chắn muốn từ chối không?"
                        onConfirm={() => handleApprove(record.id, "cancelled")}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button
                            type="primary"
                            title="Từ chối"
                            style={{ backgroundColor: "red", borderColor: "red" }}
                        >
                            <FontAwesomeIcon icon={faRemove} />
                        </Button>
                    </Popconfirm>
                    <Popconfirm
                        title="Thông báo"
                        description="Bạn có chắc chắn muốn duyệt không?"
                        onConfirm={() => handleApprove(record.id, "confirmed")}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button
                            type="primary"
                            title="Duyệt"
                            style={{ backgroundColor: "green", borderColor: "green" }}
                        >
                            <FontAwesomeIcon icon={faCheck} />
                        </Button>
                    </Popconfirm>
                </div>
            ) : null  // Không hiển thị gì khi không phải trạng thái pending
        )
    }
    ];

    const checkCreateSuccess = (values) => {
        if (values) {
            handleCustomerSchedules(formSearch);
        }
    }

    const handleInputChange = (name, value) => {
        setFormHandle((prev) => ({
            ...prev, [name]: value,
        }));
    };
    const statusOptions = [{ label: "Tất cả", value: "" }, {
        label: "Chưa đủ điều kiện",
        value: "pending"
    }, { label: "Đủ điều kiện", value: "confirmed" },];
    return (<React.Fragment>
        <div style={{ marginBottom: "20px" }}>

        </div>
        <h3>Danh sách đăng ký</h3>
        {canRegisterCustomer && (
            <Button
                style={{ marginRight: 50, height: 40, marginTop: 20 }}
                onClick={() => setModalHandle({ ...modalHandle, status: true, type: "create" })}
            >
                Đăng ký cho khách
            </Button>
        )}
        <div
            style={{
                marginTop: 20, marginBottom: 20, display: "flex", alignItems: "center",
            }}
        >
            <Input
                style={{ width: "20%" }}
                placeholder="Tìm theo tên"
                onChange={(e) => {
                    setFormSearch({ ...formSearch, fullName: e.target.value });
                }}
            />

            <Select
                showSearch
                style={{
                    width: 170, marginLeft: "auto", display: "flex", alignItems: "center", marginRight: 30,
                }}
                optionFilterProp="children"
                onChange={(value) => {
                    setFormSearch({ ...formSearch, status: value });
                }}
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                value={formSearch?.status}
            >
                {statusOptions.map((status) => (<Option key={status.value} value={status.value}>
                    {status.label}
                </Option>))}
            </Select>
        </div>
        <>
            <Table
                columns={columns}
                dataSource={customerSchedules || []}
                pagination={false}
                loading={loading}
            />
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    marginTop: 30,
                    marginBottom: 30,
                    justifyContent: "space-between", // Căn nút quay lại sang trái, phân trang sang phải
                    alignItems: "center",
                }}
            >
                <Button
                    style={{
                        backgroundColor: "white", // Nền trắng
                        color: "black", // Chữ đen
                        border: "1px solid #d9d9d9", // Viền xám nhạt
                        height: "40px", // Chiều cao giống nút khác
                        padding: "0 20px", // Khoảng cách giữa chữ và viền
                        transition: "all 0.3s ease-in-out", // Hiệu ứng mượt khi hover
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.color = "#1890FF"; // Chữ chuyển thành xanh
                        e.target.style.border = "1px solid #1890FF"; // Viền chuyển xanh
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.color = "black"; // Chữ trở lại đen
                        e.target.style.border = "1px solid #d9d9d9"; // Viền trở lại xám
                    }}
                    type="primary"
                    onClick={() => nav(-1)} // Điều hướng về trang trước
                >
                    Quay lại
                </Button>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={total}
                    showSizeChanger
                    onChange={onPageChange}
                    style={{ marginLeft: "auto" }} // Phân trang căn phải
                />
            </div>
        </>

        <Modal
            title={"Đăng ký mới"}
            visible={modalHandle}
            onCancel={closeModal}
            okButtonProps={{ style: { display: "none" } }}
            cancelButtonProps={{ style: { display: "none" } }}
        >
            <Form name="validateOnly" layout="vertical" autoComplete="off">
                <Form.Item
                    label="Tên khách hàng"
                    validateStatus={formErrors["fullName"] ? "error" : ""}
                    help={formErrors["fullName"] || ""}
                >
                    <Input
                        className=""
                        name="fullName"
                        placeholder="Tên khách hàng"
                        value={formHandle["fullName"] || ""}
                        onChange={(e) => {
                            handleInputChange("fullName", e.target.value);
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="Email"
                    validateStatus={formErrors["email"] ? "error" : ""}
                    help={formErrors["email"] || ""}
                >
                    <Input
                        className=""
                        name="email"
                        placeholder="Email"
                        value={formHandle["email"] || ""}
                        onChange={(e) => {
                            handleInputChange("email", e.target.value);
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="Địa chỉ"
                    validateStatus={formErrors["address"] ? "error" : ""}
                    help={formErrors["address"] || ""}
                >
                    <Input
                        className=""
                        name="address"
                        placeholder="Địa chỉ"
                        value={formHandle["address"] || ""}
                        onChange={(e) => {
                            handleInputChange("address", e.target.value);
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="Số điện thoại"
                    validateStatus={formErrors["phone"] ? "error" : ""}
                    help={formErrors["phone"] || ""}
                >
                    <Input
                        className=""
                        name="phone"
                        placeholder="Số điện thoại"
                        value={formHandle["phone"] || ""}
                        onChange={(e) => {
                            handleInputChange("phone", e.target.value);
                        }}
                    />
                </Form.Item>

                <div style={{ display: "flex", marginTop: 20 }}>
                    <Button
                        style={{ marginLeft: "auto", marginRight: 10 }}
                        key="submit"
                        title="Thêm"
                        onClick={closeModal}
                    >
                        Hủy
                    </Button>
                    {modalHandle.type !== "detail" && (<Popconfirm
                        title="Thông báo"
                        description="Bạn có chắc chắn muốn thêm không ?"
                        onConfirm={() => {
                            handleSubmit();
                        }}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button
                            className="button-add-promotion"
                            key="submit"
                            title="Thêm"
                        >
                            Thêm
                        </Button>
                    </Popconfirm>)}
                </div>
            </Form>
        </Modal>
        <ModalUpdateCustomerSchedule visible={isModalOpen}
            detail={detail} onCancel={handleCancel}
            onCreateSuccess={checkCreateSuccess}
        />
    </React.Fragment>);
};
