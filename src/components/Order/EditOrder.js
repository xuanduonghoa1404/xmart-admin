import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  Table,
  Tag,
  Modal,
  Form,
  Column,
  Select,
  Descriptions,
  Badge,
} from "antd";
import orderApi from "../../api/orderApi";
import locatorApi from "../../api/locatorApi";
import productApi from "../../api/productApi";
import { FiClock, FiEdit, FiMail } from "react-icons/fi";
import { FaRegAddressBook, FaShippingFast } from "react-icons/fa";
import { FcCancel, FcProcess, FcShipped } from "react-icons/fc";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BsCheckCircle } from "react-icons/bs";
import Highlighter from "react-highlight-words";
import {
  DollarOutlined,
  SearchOutlined,
  EditOutlined,
  DeliveredProcedureOutlined,
  MailOutlined,
} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { Checkbox } from "antd";
import L from "leaflet";
import leafletKnn from "leaflet-knn";

const { Option } = Select;
const ORDER_STATUS = new Map();
ORDER_STATUS.set("Not processed", { color: "red", valueVN: "Chưa xử lý" });
ORDER_STATUS.set("Processing", { color: "orange", valueVN: "Đã xác nhận" });
ORDER_STATUS.set("Shipped", { color: "blue", valueVN: "Đang vận chuyển" });
ORDER_STATUS.set("Delivered", { color: "green", valueVN: "Đã giao hàng" });
ORDER_STATUS.set("Cancelled", { color: "grey", valueVN: "Đã hủy" });

function EditOrder(props) {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const validateMessages = {
    required: "${label} is required!",
    types: {
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };
  const [form] = Form.useForm();
  const [orderDetail, setOrderDetail] = useState([]);
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });
  const [loading, setLoading] = useState(false);
  const [lnglat, setLnglat] = useState({});
  const [shipping, setShipping] = useState(false);
  const [errorShipping, setErrorShipping] = useState(false);
  const [selectedLocator, setSelectedLocator] = useState(null);
  const [dataMenu, setDataMenu] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [listLocator, setListLocator] = useState([]);

  const addMenu = () => {
    let newDataMenu = [...dataMenu];
    newDataMenu.push("1");
    setDataMenu(newDataMenu);
  };

  const orderId = props.match.params.id.toString();
  const listLocatorsFeature = {
    type: "FeatureCollection",
    features: [],
  };
  const convertLngLatToObjectJSON = (lng, lat) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
    };
  };

  useEffect(() => {
    const loadData = async () => {
      await getData();
      await getListLocator();
    };
    loadData();
  }, []);

  const handleSelectLocator = async (id, selectedLocator) => {
    const res = await orderApi.shippingOrderById(id, selectedLocator);
    await getData();
  };
  const handleChangeLocator = (value) => {
    setSelectedLocator(value);
  };
  const handleSelectLocatorByDistance = () => {
    listLocator.map((locator) => {
      listLocatorsFeature.features.push(
        convertLngLatToObjectJSON(locator?.lng || 0, locator?.lat || 0)
      );
    });
    console.log("listLocatorsFeature", listLocatorsFeature);
    let gj = L.geoJson(listLocatorsFeature);
    console.log("gj", gj);
    let nearest = leafletKnn(gj).nearest(
      L.latLng(lnglat.lat, lnglat.lng),
      1
    )[0];
    let selected = listLocator.find(
      (locator) =>
        locator?.lat?.toString() == nearest?.lat?.toString() &&
        locator?.lng?.toString() == nearest?.lon?.toString()
    );
    setSelectedLocator(selected?._id);
  };
  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yy = date.getFullYear().toString();
    return `${dd}/${mm}/${yy} ${hh}:${min}`;
  };
  const getData = async () => {
    let res = await orderApi.getOrderById(orderId);
    let r = res.map((item, index) => {
      let result = {
        created: formatDate(item.created),
        status: item.status,
        total: item.total,
        cart: item.cart,
        user: item.user.name,
        phone: item.user.phone,
        email: item.user.email,
        address: item.address,
        city: item.city,
        country: item.country,
        state: item.state,
        zipCode: item.zipCode,
        lat: item.lat,
        lng: item.lng,
        locator: item.locator,
      };
      return result;
    });
    setLnglat({
      lng: r[0].lng,
      lat: r[0].lat,
    });
    setSelectedLocator(r[0].locator);
    setOrderDetail(r[0]);
  };

  const getListLocator = async () => {
    let res = await locatorApi.getAllLocator();
    setListLocator(res);
  };
  const columnsOrderDetail = [
    {
      title: "Tên sản phẩm",
      dataIndex: "product",
      key: "name",
      sorter: (a, b) => a.name?.length - b.name?.length,
      render: (item) => item.name,
    },
    {
      title: "Giá",
      dataIndex: "purchasePrice",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice?.length - b.totalPrice?.length,
    },
  ];
  return (
    <>
      <div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="text"
            onClick={() => {}}
            style={{ marginBottom: "16px", marginRight: "16px" }}
          >
            Hủy đơn
          </Button>
          <Button
            onClick={() => {}}
            style={{ marginBottom: "16px", marginRight: "16px" }}
          >
            Giao hàng
          </Button>
          <Button
            type="primary"
            onClick={() => {
              handleSelectLocator(orderId, selectedLocator);
            }}
            style={{ marginBottom: "16px" }}
          >
            Vận chuyển
          </Button>
        </div>
        Chọn địa chỉ vận chuyển
        <Select
          style={{
            minWidth: 120,
            width: "fitContent",
            marginLeft: "16px",
          }}
          placeholder="Chọn chi nhánh"
          value={selectedLocator}
          defaultValue={selectedLocator}
          onChange={handleChangeLocator}
        >
          <Option value={""}>Chọn chi nhánh</Option>
          {listLocator.map((item, index) => {
            return <Option value={item._id}>{item.name}</Option>;
          })}
        </Select>
        <Button
          type="primary"
          onClick={() => {
            handleSelectLocatorByDistance();
          }}
          style={{ marginBottom: "16px", marginLeft: "16px" }}
        >
          Chọn chi nhánh vận chuyển gần nhất
        </Button>
        <Form
          {...layout}
          name="nest-messages"
          validateMessages={validateMessages}
          form={form}
        >
          <Descriptions title="Thông tin đơn hàng " bordered>
            <Descriptions.Item label="Họ tên khách hàng">
              {orderDetail.user}
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={2}>
              {orderDetail.email}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian đặt hàng">
              {orderDetail.created}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại" span={2}>
              {orderDetail.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag
                color={ORDER_STATUS.get(orderDetail.status || "")?.color}
                key={orderDetail.status}
              >
                {ORDER_STATUS.get(orderDetail.status || "")?.valueVN}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ" span={2}>
              {`${orderDetail.address}, ${orderDetail.state}, ${orderDetail.city},
              ${orderDetail.country}, ${orderDetail.zipCode}`}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền hàng">
              {orderDetail.total}
            </Descriptions.Item>
            {/* <Descriptions.Item label="Giảm giá">0d</Descriptions.Item> */}
            <Descriptions.Item label="Thành tiền">
              {orderDetail.total}
            </Descriptions.Item>
            {/* <Descriptions.Item label="Chi tiết">
                
              </Descriptions.Item> */}
          </Descriptions>
          <br />
          <Table
            columns={columnsOrderDetail}
            dataSource={orderDetail.cart?.products}
            pagination={pagination}
            loading={loading}
          />

          {dataMenu.map((item, index) => {
            return (
              <div
                key={index}
                className="itemMenu"
                style={{
                  borderBottom: "1px solid #000",
                  padding: "8px 0px",
                  marginBottom: "8px",
                }}
              >
                <Form.Item
                  key={index}
                  name={"product." + index}
                  label={
                    "Sản phẩm" + (dataMenu.length > 1 ? " " + (index + 1) : "")
                  }
                >
                  <Select
                    placeholder="Chọn sản phẩm"
                    // onChange={onRoleChange}
                    allowClear
                  >
                    {dataProduct.map((item, index) => {
                      return <Option value={item._id}>{item.name}</Option>;
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  name={"amount." + index}
                  label="Số lượng"
                  rules={[{ number: "range", min: 1 }]}
                >
                  <Input type="number" min="1" />
                </Form.Item>
              </div>
            );
          })}
          {orderDetail.status === "Not processed" && (
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button htmlType="button" onClick={() => addMenu()}>
                Thêm sản phẩm
              </Button>
            </Form.Item>
          )}
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

EditOrder.propTypes = {};

export default EditOrder;
