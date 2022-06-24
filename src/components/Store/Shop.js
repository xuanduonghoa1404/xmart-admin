import React, { useEffect, useState } from "react";
import { Button, Form, Input, notification, TimePicker, Row, Col, InputNumber, Space } from "antd";
import moment from 'moment';
import shopApi from "../../api/shopApi";
import typeProductApi from "../../api/typeProductApi";
const format = 'HH:mm';

function Shop(props) {
    const [data, setData] = useState([]);
    const [dataType, setDataType] = useState([]);
    const [shopId, setShopId] = useState("");
    const [form] = Form.useForm();
    const onFill = (data) => {
        console.log(data);
        form.setFieldsValue(data);
        setShopId(data._id);
    };
    const layout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 11 },
    };
    const validateMessages = {
        required: "${label} is required!",
        types: {
            email: "${label} is not a valid email!",
            number: "${label} is not a valid number!",
        },
        number: {
            range: "${label} must be between ${min} and ${max}",
        },
    };
    const onFinish = async (values) => {
        console.log(values);
        // await shopApi.editShopById(shopId, values);
        // await getData();
    }
    const getData = async () => {
        let resDataShop = await shopApi.getShop();
        let resDataType = await typeProductApi.getAllTypeProduct();
        let time = moment(resDataShop.timeWarning, format);
        let warningType = [];
        let warningDateExpiration = resDataShop.warningDateExpiration
        let warningQuantity = resDataShop.warningQuantity
        console.log('warningQuantity, ', warningQuantity);
        resDataType.map((item) => {
            let warningQuantityType = warningQuantity.find((item2) => {
                return item2.type === item._id;
            })
            let warningDateExpirationType = warningDateExpiration.find((item2) => {
                return item2.type === item._id;
            })
            warningType.push({
                type: item._id,
                name: item.name,
                quantity: warningQuantityType ? warningQuantityType.quantity : 0,
                numberOfDate: warningDateExpirationType ? warningDateExpirationType.numberOfDate : 0
            })
        })

        resDataShop = {
            ...resDataShop,
            timeWarning: time,
            warningType: warningType,
        }
        setData(resDataShop);
        console.log('resDataType', resDataType);
        setDataType(resDataType);
        onFill(resDataShop);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div class="wrapper bg-white mt-sm-5">
            <h4 class="pb-4 border-bottom">Cấu hình cửa hàng</h4>
            <br></br>
            <Form
                labelCol={{
                    flex: '200px',
                }}
                labelAlign="left"
                labelWrap
                // wrapperCol={{
                //     flex: 1,
                // }}
                // colon={false}
                name="normal_login"
                onFill={onFill}
                form={form}
                onFinish={onFinish}
                validateMessages={validateMessages}
            >
                <Form.Item
                    name="fromEmailAdress"
                    rules={[
                        {
                            type: 'email',
                            message: 'Bạn nhập không đúng định dạng email!',
                        },
                        {
                            required: true,
                            message: 'Xin hãy nhập email của bạn!',
                        },
                    ]}
                    label="Email"
                >
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item
                    name="fromEmailPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Xin hãy nhập mật khẩu của bạn!',
                        },
                    ]}
                    label="Mật khẩu"
                >
                    <Input.Password placeholder="Mật khẩu" />
                </Form.Item>
                <Form.Item
                    name="schedule"
                    rules={[
                        {
                            required: true,
                            message: 'Xin hãy nhập số điện thoại của bạn!',
                        },
                    ]}
                    label="Lên kế hoạch"
                >
                    <Input placeholder="Số điện thoại" />
                </Form.Item>
                <Form.Item
                    name="timeWarning"
                    label="Thời gian thông báo"
                >
                    <TimePicker defaultValue={moment('07:15', format)} format={format} minuteStep={15} />

                </Form.Item>
                {/* <Form.Item
                    name="warningType"
                    label="Thông báo khi"
                >
                    {data.length !== 0 ? data.warningType.map((item, index) => {
                        return (
                            <>
                                <Input.Group >
                                    <Row gutter={18}>
                                        <Col span={5}>
                                            <Input readOnly defaultValue={item.name} />
                                        </Col>
                                        <Col span={7}>
                                            <Input name="" addonBefore="Số lượng còn lại" addonAfter="(đơn vị)" type="number" defaultValue={item.quantity} />
                                        </Col>
                                        <Col span={8}>
                                            <Input addonBefore="Số ngày trước khi hết hạn" addonAfter="(ngày)" type="number" defaultValue={item.numberOfDate} />
                                        </Col>
                                    </Row>
                                </Input.Group>
                                <br></br>
                            </>
                        )
                    }
                    ) : <></>}
                </Form.Item> */}
                <Form.List name="warningType" label="Thông báo khi">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map((field) => (
                                <Space key={field.key} align="baseline">
                                    <Form.Item
                                        {...field}
                                        name={[field.name, "name"]}

                                    >
                                        <Input addonBefore="Loại" readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        {...field}
                                        name={[field.name, "quantity"]}
                                    >
                                        <Input name="" addonBefore="Số lượng còn lại" addonAfter="(đơn vị)" type="number" />
                                    </Form.Item>
                                    <Form.Item
                                        {...field}
                                        name={[field.name, "numberOfDate"]}
                                    >
                                        <Input addonBefore="Số ngày trước khi hết hạn" addonAfter="(ngày)" type="number" />
                                    </Form.Item>
                                </Space>
                            ))}
                        </>
                    )}
                </Form.List>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Lưu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

Shop.propTypes = {};

export default Shop;