import { Button, Form, Input, Modal, Popconfirm, Radio, Select, Upload, } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { VaccineTypeApi } from "../../../../services/staff/VaccineType.api";
import { AgeGroupApi } from "../../../../services/staff/AgeGroup.api";
import { ManufacturerApi } from "../../../../services/staff/Manufacturer.api";
import TextArea from "antd/es/input/TextArea";
import { VaccineApi } from "../../../../services/staff/Vaccine.api";
import { AppNotification } from "../../../../components/AppNotification";

const { Option } = Select;

function ModalHandle({ modalHandle, setModalHandle, setVaccines }) {
    const [formHandle, setFormHandle] = useState({
        status: "ACTIVE",
    });
    const [formErrors, setFormErrors] = useState({});
    const [vaccineTypes, setVaccineTypes] = useState([]);
    const [ageGroups, setAgeGroups] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);

    useEffect(() => {
        if (modalHandle.id) {
            VaccineApi.detailVaccine({ id: modalHandle.id }).then((res) => {
                const detailVaccine = res.data;
                setFormHandle({
                    ...detailVaccine,
                    vaccineTypeId: detailVaccine.vaccineType.id,
                    manufacturerId: detailVaccine.manufacturer.id,
                    ageGroupId: detailVaccine.ageGroup.id,
                });
            });
        }
        VaccineTypeApi.vaccineTypes().then((res) => {
            setVaccineTypes(res.data);
        });
        AgeGroupApi.ageGroups().then((res) => {
            setAgeGroups(res.data);
        });
        ManufacturerApi.manufacturers().then((res) => {
            setManufacturers(res.data);
        });
    }, [modalHandle.id]);

    const handleInputChange = (name, value) => {
        setFormHandle((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const isValid =
            formHandle.name &&
            formHandle.price &&
            formHandle.vaccineTypeId &&
            formHandle.manufacturerId &&
            formHandle.ageGroupId &&
            formHandle.description &&
            formHandle.inventory > 0;

        if (!isValid) {
            const errors = {
                name: !formHandle.name ? "Trường bắt buộc" : "",
                price: !formHandle.price ? "Trường bắt buộc" : "",
                inventory: !formHandle.inventory
                ? "Số lượng phải lớn hơn 0"
                : formHandle.inventory <= 0
                ? "Số lượng phải là số dương"
                : "",
                description: !formHandle.description ? "Trường bắt buộc" : "",
                vaccineTypeId: !formHandle.vaccineTypeId ? "Trường bắt buộc" : "",
                manufacturerId: !formHandle.manufacturerId ? "Trường bắt buộc" : "",
                ageGroupId: !formHandle.ageGroupId ? "Trường bắt buộc" : "",
                

            };
            await setFormErrors(errors);
            return;
        }
        console.log(formHandle);
        console.log("modalHandle.id", modalHandle.id);

        if (modalHandle.id) {
            VaccineApi.updateVaccine(formHandle)
                .then(() => {
                    return VaccineApi.detailVaccine({ id: modalHandle.id });
                })
                .then((res) => {
                    setVaccines((prev) =>
                        prev.map((vaccine, index) =>
                            vaccine.id === res.data.id
                                ? { ...vaccine, ...res.data, stt: index + 1 }
                                : { ...vaccine, stt: index + 1 }
                        )
                    );
                    AppNotification.success("Cập nhật thành công");
                    closeModal();
                })
                .catch((err) => {
                    AppNotification.error("Cập nhật thất bại");
                    console.log(err);
                });
        } else {
            VaccineApi.createVaccine(formHandle)
                .then((res) => {
                    setVaccines((prev) => [
                        ...prev,
                        {
                            ...res.data,
                            stt: prev.length + 1,
                        },
                    ]);
                    AppNotification.success("Thêm mới thành công");
                    closeModal();
                })
                .catch((err) => {
                    AppNotification.error("Thêm mới thất bại");
                    console.log(err);
                });
        }
    };

    const handleChange = (info) => {
        let reader = new FileReader();
        reader.readAsDataURL(info);
        reader.onload = function () {
            setFormHandle({ ...formHandle, image: reader.result });
        };
        reader.onerror = function (error) {
            console.log("Error: ", error);
        };
    };
    const closeModal = () => {
        setModalHandle({});
        setFormHandle({ status: "ACTIVE" });
        setFormErrors({});
    };
    return (
        <div>
            <Modal
                title={modalHandle.id ? "Cập nhật vaccine" : "Thêm mới vaccine"}
                visible={modalHandle.status}
                onCancel={closeModal}
                okButtonProps={{ style: { display: "none" } }}
                cancelButtonProps={{ style: { display: "none" } }}
            >
                <Form name="validateOnly" layout="vertical" autoComplete="off">
                    <Form.Item
                        label="Tên vaccine"
                        validateStatus={formErrors["name"] ? "error" : ""}
                        help={formErrors["name"] || ""}
                    >
                        <Input
                            className=""
                            name="name"
                            placeholder="Tên vaccine"
                            value={formHandle["name"] || ""}
                            onChange={(e) => {
                                handleInputChange("name", e.target.value);
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Giá vaccine"
                        validateStatus={formErrors["price"] ? "error" : ""}
                        help={formErrors["price"] || ""}
                    >
                        <Input
                            className=""
                            name="price"
                            placeholder="Giá vaccine"
                            value={formHandle["price"] || ""}
                            onChange={(e) => {
                                handleInputChange("price", e.target.value);
                            }}
                            type="number"
                            min={1}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Số lượng"
                        validateStatus={formErrors["inventory"] ? "error" : ""}
                        help={formErrors["inventory"] || ""}
                    >
                        <Input
                            className=""
                            name="inventory"
                            placeholder="Số lượng"
                            value={formHandle["inventory"] || ""}
                            onChange={(e) => {
                                handleInputChange("inventory", e.target.value);
                            }}
                            type="number"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Loại vaccine"
                        validateStatus={formErrors["vaccineTypeId"] ? "error" : ""}
                        help={formErrors["vaccineTypeId"] || ""}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn loại vaccine"
                            value={formHandle["vaccineTypeId"] || ""}
                            optionFilterProp="children"
                            onChange={(value) => handleInputChange("vaccineTypeId", value)}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {vaccineTypes.map((type) => (
                                <Option key={type.id} value={type.id}>
                                    {type.typeName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Độ tuổi"
                        validateStatus={formErrors["ageGroupId"] ? "error" : ""}
                        help={formErrors["ageGroupId"] || ""}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn độ tuôi"
                            optionFilterProp="children"
                            value={formHandle["ageGroupId"] || ""}
                            onChange={(value) => handleInputChange("ageGroupId", value)}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {ageGroups.map((type) => (
                                <Option key={type.id} value={type.id}>
                                    {type.ageRange}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Nhà sản xuất"
                        validateStatus={formErrors["manufacturerId"] ? "error" : ""}
                        help={formErrors["manufacturerId"] || ""}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn nhà sản xuất"
                            optionFilterProp="children"
                            value={formHandle["manufacturerId"] || ""}
                            onChange={(value) => handleInputChange("manufacturerId", value)}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {manufacturers.map((type) => (
                                <Option key={type.id} value={type.id}>
                                    {type.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Thông tin Vaccine"
                        validateStatus={formErrors["description"] ? "error" : ""}
                        help={formErrors["description"] || ""}
                    >
                        <TextArea
                            className=""
                            name="description"
                            placeholder="Mô tả"
                            value={formHandle["description"] || ""}
                            onChange={(e) => {
                                handleInputChange("description", e.target.value);
                            }}
                        />
                    </Form.Item>
                    {/* <Form.Item>
                        <Radio.Group
                            name="status"
                            onChange={(e) => handleInputChange("status", e.target.value)}
                            value={formHandle["status"] || ""}
                        >
                            <Radio value={"ACTIVE"}>Kinh doanh</Radio>
                            <Radio value={"INACTIVE"}>Ngừng kinh doanh</Radio>
                        </Radio.Group>
                    </Form.Item> */}
                    <div>
                        <Upload
                            beforeUpload={(file) => {
                                handleChange(file);
                                return false; // Prevent auto-upload
                            }}
                            showUploadList={false}
                        >
                            {formHandle.image ? (
                                <img
                                    src={formHandle.image}
                                    alt="Uploaded"
                                    style={{
                                        width: "150px",
                                        marginTop: "20px",
                                        height: 200,
                                        cursor: "pointer",
                                    }}
                                />
                            ) : (
                                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                            )}
                        </Upload>
                    </div>
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
                                    {modalHandle.id ? "Cập nhật" : "Thêm mới"}
                                </Button>
                            </Popconfirm>
                        )}
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

export default ModalHandle;
