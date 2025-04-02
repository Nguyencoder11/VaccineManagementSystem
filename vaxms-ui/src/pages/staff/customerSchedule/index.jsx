import React, { useEffect, useState } from "react";
import { Button, Card, Col, DatePicker, Input, Pagination, Row, Select, Table } from "antd";
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFilter, faListAlt } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { VaccineScheduleApi } from "../../../services/staff/VaccineSchedule.api";

const { RangePicker } = DatePicker;
const { Option } = Select;

const sizeOptions = [10, 20, 50, 100];

export default function CustomerScheduleView() {
    const nav = useNavigate();
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // 1-based index for UI
    const [size, setSize] = useState(sizeOptions[0]); // Default page size
    const [formSearch, setFormSearch] = useState({
        vaccineName: "",
        centerName: "",
        status: "",
        startDate: null,
        endDate: null,
    });
    

    // Fetch vaccine schedule
    const getLichTiemChung = async () => {
        setLoading(true);
        try {
            const filters = {
                page: currentPage,
                size: size,
                vaccineName: formSearch.vaccineName,
                centerName: formSearch.centerName,
                status: formSearch.status,
                startDate: formSearch.startDate
                    ? dayjs(formSearch.startDate).format("YYYY-MM-DD")
                    : null,
                endDate: formSearch.endDate
                    ? dayjs(formSearch.endDate).format("YYYY-MM-DD")
                    : null,
            };
            console.log("Filters gửi lên API: ", filters);

            const result = await VaccineScheduleApi.findByFilters(filters);

            setItems(
                result.content.map((item, index) => ({
                    ...item,
                    stt: (currentPage - 1) * size + index + 1, // Add row index
                }))
            );
            setTotal(result.totalElements);
        } catch (error) {
            console.error("Error fetching schedule data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when formSearch or page changes
    useEffect(() => {
        getLichTiemChung();
    }, [formSearch, currentPage, size]);

    // Handle pagination changes
    const onPageChange = (page, pageSize) => {
        setCurrentPage(page);
        setSize(pageSize);
    };

    const onFilterChange = (key, value) => {
        setFormSearch({ ...formSearch, [key]: value });
        setCurrentPage(1); // Reset to first page on filter change
    };

    const onDateChange = (dates) => {
        if (dates && dates[0] && dates[1] && dayjs(dates[0]).isAfter(dayjs(dates[1]))) {
            alert("Ngày bắt đầu không thể lớn hơn ngày kết thúc!");
            return;
        }
        console.log("Date values:", {
            startDate: dates && dates[0] ? dayjs(dates[0]).format("YYYY-MM-DD") : null,
            endDate: dates && dates[1] ? dayjs(dates[1]).format("YYYY-MM-DD") : null
        });
    
        const newDates = {
            startDate: dates ? dates[0] : null,
            endDate: dates ? dates[1] : null,
        };
        
        console.log("Date values being set:", {
            startDate: newDates.startDate ? dayjs(newDates.startDate).format("YYYY-MM-DD") : null,
            endDate: newDates.endDate ? dayjs(newDates.endDate).format("YYYY-MM-DD") : null
        });
        
        setFormSearch({
            ...formSearch,
            startDate: dates ? dates[0] : null,
            endDate: dates ? dates[1] : null
        });
    };
    console.log("Form Search After Date Change:", formSearch);

    const statusOptions = [
        { label: "Tất cả", value: "" },
        { label: "Đang diễn ra", value: "ACTIVE" },
        { label: "Đã kết thúc", value: "INACTIVE" },
        { label: "Chưa bắt đầu", value: "UPCOMING" }, 
    ];

    const columns = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            align: "center",
        },
        {
            title: "Tên Vaccine",
            dataIndex: "vaccineName",
            key: "vaccineName",
            render: (_, record) => record.vaccine?.name || "Không có thông tin",
        },
        {
            title: "Trung tâm",
            dataIndex: "centerName",
            key: "centerName",
            render: (_, record) => record.center?.centerName || "Không có thông tin",
        },
        {
            title: "Thời gian bắt đầu",
            dataIndex: "startDate",
            key: "startDate",
            align: "center",
            render: (_, record) => (record.startDate ? dayjs(record.startDate).format("YYYY-MM-DD") : "Không có"),
        },
        {
            title: "Thời gian kết thúc",
            dataIndex: "endDate",
            key: "endDate",
            align: "center",
            render: (_, record) => (record.endDate ? dayjs(record.endDate).format("YYYY-MM-DD") : "Không có"),
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdDate",
            key: "createdDate",
            align: "center",
            render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "Không có"),
        },
        {
            title: "Hành động",
            dataIndex: "hanhDong",
            key: "hanhDong",
            align: "center",
            render: (_, record) => (
                <Button
                    type="primary"
                    title="Chi tiết"
                    onClick={() => nav(`/staff/customer-schedule-1-detail`, { state: record.id })}
                    style={{ backgroundColor: "#FF9900", color: "white" }}
                >
                    <FontAwesomeIcon icon={faEye} />
                </Button>
            ),
        },
    ];

    return (
        <>
            <Card>
                <div className="filter-container">
                    <FontAwesomeIcon icon={faFilter} size="2x" />
                    <span style={{ fontSize: "18px", fontWeight: "500" }}>Bộ lọc</span>
                </div>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Input
                            placeholder="Tìm theo tên vaccine"
                            style={{ width: "100%" }}
                            onChange={(e) => onFilterChange("vaccineName", e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Input
                            placeholder="Tìm theo tên trung tâm"
                            style={{ width: "100%" }}
                            onChange={(e) => onFilterChange("centerName", e.target.value)}
                        />
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Select
                            style={{ width: "100%" }}
                            placeholder="Trạng thái"
                            onChange={(value) => onFilterChange("status", value)}
                        >
                            {statusOptions.map((status) => (
                                <Option key={status.value} value={status.value}>
                                    {status.label}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
                
            </Card>

            <Card style={{ marginTop: "20px" }}>
                <div className="table-container-title">
                    <FontAwesomeIcon icon={faListAlt} style={{ fontSize: "26px", marginRight: "10px" }} />
                    <span style={{ fontSize: "18px", fontWeight: "500" }}>Danh sách lịch tiêm chủng</span>
                </div>
                <Table
                    dataSource={items}
                    columns={columns}
                    pagination={false}
                    loading={loading}
                    rowKey="id"
                />
                <Pagination
                    current={currentPage}
                    pageSize={size}
                    total={total}
                    showSizeChanger
                    pageSizeOptions={sizeOptions}
                    onChange={onPageChange}
                    style={{ marginTop: 20, textAlign: "right" }}
                />
            </Card>
        </>
    );
}
