import React, { useEffect, useState } from "react";
import { Button, Card, Col, DatePicker, Input, Pagination, Row, Table } from "antd";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMethod, postMethodPayload } from "../../services/request";

const { RangePicker } = DatePicker;

const AdminAddLichTiemChung = () => {
  const [item, setItem] = useState(null);
  const [vacxin, setVacxin] = useState([]);
  const [center, setCenter] = useState([]);
  const [textButton, setTextButton] = useState("Thêm lịch tiêm chủng");
  const [formSearch, setFormSearch] = useState({
    vaccineName: "",
    centerName: "",
    startDate: null,
    endDate: null,
  });
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      var uls = new URL(document.URL);
      var id = uls.searchParams.get("id");
      if (id) {
        setTextButton("Cập nhật lịch tiêm chủng");
        const response = await getMethod(`/api/vaccine-schedule/all/find-by-id?id=${id}`);
        const result = await response.json();
        setItem(result);
      }
    };
    fetchData();
    loadVaccines();
    loadCenters();
    fetchSchedules();
  }, [currentPage, pageSize, formSearch]);

  const loadVaccines = async () => {
    const response = await getMethod("/api/vaccine/all/find-all");
    const result = await response.json();
    setVacxin(result);
  };

  const loadCenters = async () => {
    const response = await getMethod("/api/center/public/find-all");
    const result = await response.json();
    setCenter(result);
  };

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const filters = {
        page: currentPage,
        size: pageSize,
        vaccineName: formSearch.vaccineName,
        centerName: formSearch.centerName,
        startDate: formSearch.startDate,
        endDate: formSearch.endDate,
      };
      const response = await postMethodPayload("/api/vaccine-schedule/admin/search", filters);
      const result = await response.json();
      setItems(result.content);
      setTotalItems(result.totalElements);
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (key, value) => {
    setFormSearch({ ...formSearch, [key]: value });
    setCurrentPage(1); // Reset to the first page
  };

  const handlePaginationChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleDateChange = (dates) => {
    if (dates && dates[0] && dates[1] && dates[0].isAfter(dates[1])) {
      toast.error("Ngày bắt đầu không thể lớn hơn ngày kết thúc!");
      return;
    }

    setFormSearch({
      ...formSearch,
      startDate: dates ? dates[0].format("YYYY-MM-DD") : null,
      endDate: dates ? dates[1].format("YYYY-MM-DD") : null,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const uls = new URL(document.URL);
    const id = uls.searchParams.get("id");
    const lichtiem = {
      id: id,
      startDate: event.target.elements.ngaybatdau.value,
      endDate: event.target.elements.ngayketthuc.value,
      limitPeople: event.target.elements.gioihan.value,
      idPreSchedule: event.target.elements.idPreSchedule.value,
      description: event.target.elements.description.value,
      center: { id: event.target.elements.centerselect.value },
      vaccine: { id: event.target.elements.vacxinselect.value },
    };

    let response;
    if (!id) {
      response = await postMethodPayload("/api/vaccine-schedule/admin/create", lichtiem);
    } else {
      response = await postMethodPayload("/api/vaccine-schedule/admin/update", lichtiem);
    }

    if (response.status < 300) {
      Swal.fire({
        title: "Thông báo",
        text: "Thêm/cập nhật thành công!",
        preConfirm: () => {
          window.location.href = "lich-tiem-chung";
        },
      });
    } else {
      if (response.status === 417) {
        const result = await response.json();
        toast.warning(result.defaultMessage);
      } else {
        toast.error("Thêm/ sửa lịch tiêm thất bại");
      }
    }
  };

  const columns = [
    {
      title: "Tên Vaccine",
      dataIndex: "vaccine",
      key: "vaccine",
      render: (vaccine) => vaccine?.name || "Không có thông tin",
    },
    {
      title: "Trung Tâm",
      dataIndex: "center",
      key: "center",
      render: (center) => center?.centerName || "Không có thông tin",
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "endDate",
      key: "endDate",
    },
  ];

  return (
    <>
      <Card>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm theo tên vaccine"
              onChange={(e) => handleSearchChange("vaccineName", e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Tìm theo tên trung tâm"
              onChange={(e) => handleSearchChange("centerName", e.target.value)}
            />
          </Col>
          <Col xs={24} sm={24} md={8}>
            <RangePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              onChange={handleDateChange}
            />
          </Col>
        </Row>
      </Card>
      <Table
        dataSource={items}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          showSizeChanger: true,
          onChange: handlePaginationChange,
        }}
        loading={loading}
        rowKey="id"
      />
      <form onSubmit={handleSubmit}>
        {/* Add your form here */}
      </form>
    </>
  );
};

export default AdminAddLichTiemChung;
