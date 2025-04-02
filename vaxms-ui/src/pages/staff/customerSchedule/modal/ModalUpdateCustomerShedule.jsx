import {Form, Input, message, Modal, Select} from "antd";
import React, {useEffect} from "react";
import {CustomerScheduleApi} from "../../../../services/staff/CustomerSchedule.api";
const { Option } = Select;
export default function ModalUpdateCustomerSchedule(props) {
    const [form] = Form.useForm();
    const visible = props.visible;
    const onCancel = props.onCancel;
    const onCreateSuccess = props.onCreateSuccess;
    const detail = props.detail;

    const Status = {
        PENDING: "pending",         // Đã đăng ký
        CONFIRMED: "confirmed",     // Hoãn
        CANCELLED: "cancelled",     // Hoàn thành tiêm
        INJECTED: "injected",       // Đã tiêm
        NOT_INJECTED: "not_injected" // Chưa tiêm
    };

    useEffect(() => {
        if (detail) {
            form.setFieldsValue({
                note: detail.note,
                healthStatusBefore: detail.healthStatusBefore,
                healthStatusAfter: detail.healthStatusAfter,
                status: detail.status,
            });
        }
    }, [detail, form]);

    const onOk = () => {
        const value = {
            id: detail.id,
            note: form.getFieldValue('note'),
            healthStatusBefore: form.getFieldValue('healthStatusBefore'),
            healthStatusAfter: form.getFieldValue('healthStatusAfter'),
            status: form.getFieldValue('status')
        };

        console.log(value)
        CustomerScheduleApi.UpdateCustomerSchedule(value)
            .then((res) => {
                message.success("Thêm thành công")
                onCreateSuccess(true)
                onCancel();
            })
            .catch((err) => { console.log(err)});
    }

    return (
        <div>
            <Modal title="Cập nhập thông tin" open={visible} onOk={onOk} onCancel={onCancel} width={800}>
                <Form
                    name="basic"
                    form={form}
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    onFinish={onOk}
                    autoComplete="off"
                >
                    <Form.Item label="Ghi chú" name="note">
                        <Input/>
                    </Form.Item>
                    <Form.Item label="Trạng thái sức khỏe KH trước tiêm" name="healthStatusBefore">
                        <Input/>
                    </Form.Item>
                    <Form.Item label="Trạng thái sức khỏe KH sau tiêm" name="healthStatusAfter">
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Status"
                        name="status"
                    >
                        <Select placeholder="Select status">
                            <Option value={Status.PENDING}>Đã đăng ký</Option>
                            <Option value={Status.CONFIRMED}>Hoãn</Option>
                            <Option value={Status.CANCELLED}>Huỷ tiêm</Option>
                            <Option value={Status.INJECTED}>Đã tiêm</Option>
                            <Option value={Status.NOT_INJECTED}>Chưa tiêm</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )

}
