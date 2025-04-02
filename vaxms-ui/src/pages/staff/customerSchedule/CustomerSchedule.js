import React, {useEffect, useRef, useState} from "react";
import {Button, Form, Input, Modal, Pagination, Popconfirm, Select, Table, Tag,} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faRemove} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
// import ModalHandle from "./modal/modalHandle";
import {AppNotification} from "../../../components/AppNotification";
import {CustomerScheduleApi} from "../../../services/staff/CustomerSchedule.api";
import {VaccineScheduleApi} from "../../../services/staff/VaccineSchedule.api";

const { Option } = Select;
const CustomerSchedule = () => {
  const [modalHandle, setModalHandle] = useState(false);
  const [formHandle, setFormHandle] = useState({
    status: "ACTIVE",
  });
  const fileInputRef = useRef(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [customerSchedules, setCustomerSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formSearch, setFormSearch] = useState({
    fullName: "",
    status: "",
    page: 1,
    limit: 10,
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
      ...formSearch,
      page: currentPage,
      limit: pageSize,
    });
  }, [currentPage, pageSize]);

  const handleCustomerSchedules = async (formSearch) => {
    setLoading(true);
    await CustomerScheduleApi.customerSchedules(formSearch)
      .then((res) => {
        setTotal(res.data.totalElements);
        setCurrentPage(res.data.pageable.pageNumber + 1);
        setPageSize(res.data.size);
        const dataVacines = res.data.content;
        setCustomerSchedules(
          updatedList(dataVacines, formSearch.page, formSearch.limit)
        );
        setTimeout(() => {
          setLoading(false);
        }, 500);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updatedList = (data, currentPage, pageSize) => {
    return data.map((item, index) => ({
      ...item,
      stt: (currentPage - 1) * pageSize + index + 1,
    }));
  };
  const handleApprove = (id, status) => {
    CustomerScheduleApi.approveCustomerSchedule({
      customerScheduleId: id,
      status: status,
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
  };
  const onPageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleSubmit = async () => {
    console.log('')

    const isValid =
      formHandle.fullName &&
      formHandle.phone &&
      formHandle.email &&
      formHandle.address &&
      formHandle.vaccineScheduleId;

    if (!isValid) {
      const errors = {
        fullName: !formHandle.name ? "Trường bắt buộc" : "",
        phone: !formHandle.price ? "Trường bắt buộc" : "",
        email: !formHandle.vaccineTypeId ? "Trường bắt buộc" : "",
        address: !formHandle.manufacturerId ? "Trường bắt buộc" : "",
        vaccineScheduleId: !formHandle.ageGroupId ? "Trường bắt buộc" : "",
      };
      await setFormErrors(errors);
      return;
    }

    CustomerScheduleApi.createCustomerSchedule(formHandle)
      .then((res) => {
        AppNotification.success("Thêm mới thành công");
        setCustomerSchedules((prev) => [
          ...prev,
          {
            ...res.data,
            stt: prev.length + 1,
          },
        ]);
        closeModal();
      })
      .catch((err) => {
        const errorMessage = err.response.data.defaultMessage
        if(err){
          AppNotification.error(errorMessage);
        }else{
          AppNotification.error("Thêm mới thất bại");
        }
        console.log(err);
      });
  };
  
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Tên Vaccine",
      dataIndex: "vaccineSchedule",
      key: "vaccineSchedule",
      render: (_, record) => record.vaccineScheduleTime?.vaccineSchedule?.vaccine?.name
    },
    {
      title: "Tên khách hàng",
      dataIndex: "fullName",
      key: "fullName",
    },

    {
      title: "Thanh toán",
      dataIndex: "payStatus",
      key: "payStatus",
      align: "center",
      render: (_, record) => {
        return (
          <div>{record?.payStatus ? "Đã thanh toán" : "Chưa thanh toán"}</div>
        );
      },
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "vaccineSchedule",
      key: "vaccineSchedule",
      align: "center",
      render: (date) => date?.startDate ? dayjs(date.startDate).format("HH:mm DD-MM-YYYY") : "N/A",
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "vaccineSchedule",
      key: "vaccineSchedule",
      align: "center",
      render: (date) => date?.endDate ? dayjs(date.endDate).format("HH:mm DD-MM-YYYY") : "N/A",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      align: "center",
      render: (date) => dayjs(date).format("HH:mm:ss DD-MM-YYYY"),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text) => {
        return (
          <Tag
            color={
              text === "confirmed"
                ? "green"
                : text === "pending"
                ? "gold"
                : "red"
            }
          >
            {text === "confirmed"
              ? "Đã duyệt"
              : text === "pending"
              ? "Chờ duyệt"
              : "Đã từ chối"}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "hanhDong",
      key: "hanhDong",
      align: "center",
      render: (text, record) =>
        record.status === "pending" && (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <Popconfirm
              title="Thông báo"
              description="Bạn có chắc chắn muốn từ chối không ?"
              onConfirm={() => {
                handleApprove(record.id, "cancelled");
              }}
              okText="Có"
              cancelText="Không"
            >
              <Button
                type="primary"
                title="Từ chối"
                style={{ backgroundColor: "red", borderColor: "red" }}
              >
                <FontAwesomeIcon icon={faRemove} />
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Thông báo"
              description="Bạn có chắc chắn muốn duyệt không ?"
              onConfirm={() => {
                handleApprove(record.id, "confirmed");
              }}
              okText="Có"
              cancelText="Không"
            >
              <Button
                type="primary"
                title="Duyệt"
                style={{ backgroundColor: "green", borderColor: "green" }}
              >
                <FontAwesomeIcon icon={faCheck} />
              </Button>
            </Popconfirm>
          </div>
        ),
    },
  ];

  const handleInputChange = (name, value) => {
    setFormHandle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const statusOptions = [
    { label: "Tất cả", value: "" },
    { label: "Chờ duyệt", value: "pending" },
    { label: "Đã duyêt", value: "confirmed" },
    { label: "Từ chối", value: "cancelled" },
  ];
  return (
    <React.Fragment>
      <h3>Danh sách đăng ký</h3>
      <Button
        style={{ marginRight: 50, height: 40, marginTop: 20 }}
        onClick={() =>
          setModalHandle({ ...modalHandle, status: true, type: "create" })
        }
      >
        Đăng ký cho khách
      </Button>
      <div
        style={{
          marginTop: 20,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
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
            width: 170,
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            marginRight: 30,
          }}
          optionFilterProp="children"
          onChange={(value) => {
            setFormSearch({ ...formSearch, status: value });
          }}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
          value={formSearch?.status}
        >
          {statusOptions.map((status) => (
            <Option key={status.value} value={status.value}>
              {status.label}
            </Option>
          ))}
        </Select>
      </div>
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
        }}
      >
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          onChange={onPageChange}
          style={{ marginLeft: "auto" }}
        />
      </div>
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
          <Form.Item
            label="Lịch tiêm vaccine"
            validateStatus={formErrors["vaccineScheduleId"] ? "error" : ""}
            help={formErrors["vaccineScheduleId"] || ""}
          >
            <Select
              showSearch
              placeholder="Chọn lịch tiêm vaccine"
              value={formHandle["vaccineScheduleId"] || ""}
              optionFilterProp="children"
              onChange={(value) =>
                handleInputChange("vaccineScheduleId", value)
              }
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {vaccineSchedules.map((type) => (
                <Option key={type.id} value={type.id}>
                  {type.vaccine.name}
                </Option>
              ))}
            </Select>
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
            {modalHandle.type !== "detail" && (
              <Popconfirm
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
              </Popconfirm>
            )}
          </div>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default CustomerSchedule;
