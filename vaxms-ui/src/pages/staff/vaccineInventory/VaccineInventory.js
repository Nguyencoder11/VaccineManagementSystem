import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Button,
  Tag,
  Modal,
  Select,
  Pagination,
  Popconfirm,
  InputNumber,
} from "antd";
import { VaccineApi } from "../../../services/staff/Vaccine.api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faRemove } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
// import ModalHandle from "./modal/modalHandle";
import { AppNotification } from "../../../components/AppNotification";
import * as XLSX from "xlsx";
import { VaccineInventoryApi } from "../../../services/staff/VaccineInventory.api";
const { Option } = Select;
const VaccineInventory = () => {
  const [modalHandle, setModalHandle] = useState({
    status: false,
    id: "",
    name: "",
  });
  const fileInputRef = useRef(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [vaccineInventorys, setVaccineInventorys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formSearch, setFormSearch] = useState({
    page: 1,
    limit: 10,
  });
  const [quantity, setQuantity] = useState(0);
  const closeModal = () => {
    setModalHandle({
      status: false,
      id: "",
      name: "",
    });
  };
  useEffect(() => {
    handleGetVaccineInventorys(formSearch);
  }, [formSearch]);
  useEffect(() => {
    handleGetVaccineInventorys({
      ...formSearch,
      page: currentPage,
      limit: pageSize,
    });
  }, [currentPage, pageSize]);

  const handleGetVaccineInventorys = async (formSearch) => {
    setLoading(true);
    await VaccineInventoryApi.vaccineInventorys(formSearch)
      .then((res) => {
        setTotal(res.data.totalElements);
        setCurrentPage(res.data.pageable.pageNumber + 1);
        setPageSize(res.data.size);
        const dataVacines = res.data.content.map((item) => ({
          ...item,
          expiryDate: item.expiryDate, // Đảm bảo API trả về trường expiryDate
        }));
        setVaccineInventorys(
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
  const handleDelete = (id) => {
    VaccineInventoryApi.deleteVaccineInventory({ id: id })
      .then((res) => {
        setVaccineInventorys(
          vaccineInventorys.filter((item) => item.id !== id)
        );
        AppNotification.success("Xóa thành công");
      })
      .catch((err) => {
        const errorMessage = err.response.data.defaultMessage || null;
        if (errorMessage) {
          AppNotification.error(errorMessage);
        }
      });
  };

  const handlePlusVaccine = (name) => {
    if (!quantity) {
      AppNotification.error("Nhập số lượng vaccine muốn xuất");
      return;
    }
    VaccineApi.plusVaccine({ name: name, quantity: quantity })
      .then((res) => {
        handleGetVaccineInventorys(formSearch);
        AppNotification.success("Xuất vaccine thành công");
        closeModal();
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

  const handleFileChange = async (e) => {
    const fileUpload = e.target.files[0];

    if (!fileUpload) {
      AppNotification.error("Vui lòng chọn file");
      return;
    }
    const formData = new FormData();
    formData.append("file", fileUpload);
    VaccineInventoryApi.importVaccineInventory(formData)
      .then((response) => {
        AppNotification.success("Nhập dữ liệu thành công");
        handleGetVaccineInventorys(formSearch);
      })
      .catch((err) => {
        const message = err.response.data.defaultMessage;
        if (message) {
          AppNotification.error(message);
          return;
        }
        AppNotification.error("Nhập dữ liệu không thành công");
      });
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleExport = () => {
    try {
      const formattedData = vaccineInventorys.map((item, index) => ({
        STT: index + 1,
        "Tên Vaccine": item?.vaccine?.name,
        "Số lượng Vaccine": item?.quantity,
        "Ngày tạo": item?.createdDate
          ? dayjs(item?.createdDate).format("HH:mm:ss DD-MM-YYYY")
          : null,
        "Trạng thái":
          item?.status === "ACTIVE" ? "Kinh doanh" : "Ngừng kinh doanh",
      }));
      const worksheet = XLSX.utils.json_to_sheet(formattedData, {
        header: [
          "STT",
          "Tên Vaccine",
          "Số lượng tồn kho",
          "Ngày tạo",
          "Trạng thái",
        ],
      });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
      XLSX.writeFile(workbook, "vaccine_inventory_data.xlsx");
      AppNotification.success("Xuất dữ liệu thành công");
    } catch (error) {
      AppNotification.success("Xuất dữ liệu không thành công");
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Tên Vaccine",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return <div>{record?.vaccine?.name}</div>;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      render: (quantity) => quantity,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      align: "center",
      render: (date) => dayjs(date).format(" DD-MM-YYYY"),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (text) => {
        return (
          <Tag color={text === "ACTIVE" && "green"}>
            {text === "ACTIVE" && "Kinh doanh"}
          </Tag>
        );
      },
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      align: "center",
      render: (date) => {
        return date ? dayjs(date).format("DD-MM-YYYY") : "01/01/2026";
      }
    },
    {
      title: "Hành động",
      dataIndex: "hanhDong",
      key: "hanhDong",
      align: "center",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Popconfirm
            title="Thông báo"
            description="Bạn có chắc chắn muốn xóa không ?"
            onConfirm={() => {
              handleDelete(record.id);
            }}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              title="Chi tiết thể loại"
              style={{ backgroundColor: "red", borderColor: "red" }}
            >
              <FontAwesomeIcon icon={faRemove} />
            </Button>
          </Popconfirm>
          <Button
            type="primary"
            title="Xuất kho"
            style={{ backgroundColor: "green", borderColor: "green" }}
            onClick={() =>
              setModalHandle({
                status: true,
                id: record.vaccine.id,
                name: record.vaccine.name,
              })
            }
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <React.Fragment>
      <h3>Kho Vaccine</h3>
      <div
        style={{
          marginTop: 20,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ marginRight: 10 }}>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Button
            title="Import"
            icon={<UploadOutlined />}
            onClick={handleIconClick}
          >Import</Button>
        </div>
        <Button
          title="Export"
          icon={<DownloadOutlined />}
          onClick={handleExport}
        >Export</Button>
      </div>
      <Table
        columns={columns}
        dataSource={vaccineInventorys || []}
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
        title={"Xuất vaccine"}
        visible={modalHandle.status}
        onCancel={closeModal}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40% 60%",
            marginBottom: 20,
          }}
        >
          <div>Tên vaccine</div>
          <div>{modalHandle.name}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "40% 60%" }}>
          <div>Số lượng vaccine xuất</div>
          <div>
            <InputNumber
              onChange={(value) => setQuantity(value)}
              min={1}
              type="number"
            />
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <Button style={{ marginLeft: "auto" }} onClick={closeModal}>
            Hủy
          </Button>
          <Button
            style={{ marginLeft: 10 }}
            onClick={() => handlePlusVaccine(modalHandle.name)}
          >
            Xuất
          </Button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default VaccineInventory;
