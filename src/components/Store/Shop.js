import React, { useEffect, useState } from "react";
import { Button, Form, Input, notification, TimePicker, Row, Col, InputNumber, Space } from "antd";
import moment from 'moment';
import shopApi from "../../api/shopApi";
import typeProductApi from "../../api/typeProductApi";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";

const format = "HH:mm";

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
    console.log("editShopById:", values);
    await shopApi.editShopById(shopId, values);
    // await getData();
  };
  const getData = async () => {
    let resDataShop = await shopApi.getShop();
    // let resDataType = await typeProductApi.getAllTypeProduct();
    // let time = moment(resDataShop.timeWarning, format);
    // let warningType = [];
    // let warningDateExpiration = resDataShop.warningDateExpiration;
    // let warningQuantity = resDataShop.warningQuantity;
    // console.log("warningQuantity, ", warningQuantity);
    // resDataType.map((item) => {
    //   let warningQuantityType = warningQuantity.find((item2) => {
    //     return item2.type === item._id;
    //   });
    //   let warningDateExpirationType = warningDateExpiration.find((item2) => {
    //     return item2.type === item._id;
    //   });
    //   warningType.push({
    //     type: item._id,
    //     name: item.name,
    //     quantity: warningQuantityType ? warningQuantityType.quantity : 0,
    //     numberOfDate: warningDateExpirationType
    //       ? warningDateExpirationType.numberOfDate
    //       : 0,
    //   });
    // });

    // resDataShop = {
    //   ...resDataShop,
    //   timeWarning: time,
    //   warningType: warningType,
    // };
    setData(resDataShop);
    // console.log("resDataType", resDataType);
    // setDataType(resDataType);
    onFill(resDataShop);
  };

  useEffect(() => {
    const loadData = async () => {
      await getData();
    };
    loadData();
  }, []);

  return (
    <div class="wrapper bg-white mt-sm-5" style={{ padding: "20px" }}>
      <h4 class="pb-4 border-bottom">Cấu hình cửa hàng</h4>
      <br></br>
      <Form
        labelCol={{
          flex: "200px",
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
          name="imageBanner"
          rules={[
            {
              required: true,
              message: "Vui lòng điền vào trường này!",
            },
          ]}
          label="Slide banner"
          tooltip="Ấn Enter để ngăn cách"
        >
          <TextArea placeholder="Ấn Enter để ngăn cách" rows={3} />
        </Form.Item>
        <Form.Item
          name="imageBannerSecondary"
          rules={[
            {
              required: true,
              message: "Vui lòng điền vào trường này!",
            },
          ]}
          label="Banner phụ"
          tooltip="Ấn Enter để ngăn cách"
        >
          <TextArea placeholder="Ấn Enter để ngăn cách" rows={2} />
        </Form.Item>

        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

Shop.propTypes = {};

export default Shop;