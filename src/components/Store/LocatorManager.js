import React, { useEffect, useRef, useState } from "react";
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
  Row,
  Select,
  Switch,
} from "antd";
import locatorApi from "../../api/locatorApi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line, RiCheckboxCircleLine } from "react-icons/ri";
import { GiCancel } from "react-icons/gi";
import Highlighter from "react-highlight-words";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { Map, Marker, TileLayer, Tooltip as TooltipMap } from "react-leaflet";
import L from "leaflet";
import * as ELG from "esri-leaflet-geocoder";
import leafletKnn from "leaflet-knn";
import { Link, useHistory } from "react-router-dom";
const { Option } = Select;

function LocatorManager(props) {
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState("Sửa thông tin");
  const [editId, setEditId] = useState("");

  const [form] = Form.useForm();
  const history = useHistory();
  const onFill = (data) => {
    form.setFieldsValue(data[0]);
    setEditId(data[0]._id);
  };

  const mapRef = useRef();
  const apiKey =
    "AAPK661c00092e8147b19f0b8bf899d4f0e6W_YfjO_fYZBp7nkrzKroPOYBvs51S34bi_5lNfzk6083PK2__8j8O3awEieuNM47";

  const [addressMap, setAddressMap] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  useEffect(() => {
    const map = mapRef?.current?.leafletElement;

    const searchControl = new ELG.geosearch({
      useMapBounds: false,
      position: "topleft",
      placeholder: "Tìm địa chỉ",
      providers: [
        ELG.arcgisOnlineProvider({
          apikey: apiKey,
          nearby: {
            lat: 21.00146,
            lng: 105.84651,
          },
        }),
      ],
    }).addTo(map);

    const results = new L.LayerGroup().addTo(map);
    // results.addLayer(L.marker({ lat: 21.00146, lng: 105.84651 }));
    searchControl.on("results", function (data) {
      results.clearLayers();
      for (let i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(L.marker(data.results[i].latlng));
      }
    });
    map.on("click", function (e) {
      ELG.reverseGeocode({
        apikey: apiKey,
      })
        .latlng(e.latlng)

        .run(function (error, result) {
          if (error) {
            return;
          }

          results.clearLayers();

          let marker = L.marker(result.latlng).addTo(results);

          const lngLatString = `${
            Math.round(result.latlng.lng * 100000) / 100000
          }, ${Math.round(result.latlng.lat * 100000) / 100000}`;

          marker.bindPopup(
            `<b>${lngLatString}</b><p>${result.address.Match_addr}</p>`
          );
          setCity(result.address.City);
          setCountry(result.address.CntryName);
          setAddressMap(
            `${result.address.Address} ${result.address.Neighborhood}`
          );

          setState(result.address.District);
          setZipcode(result.address.Postal);
          setLat(Math.round(result.latlng.lat * 100000) / 100000);
          setLng(Math.round(result.latlng.lng * 100000) / 100000);
          marker.openPopup();
        });
    });
  }, []);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
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

  const onFinishModal = async (values) => {
    console.log(values);
    if (action == "Sửa thông tin") {
      await locatorApi.editLocatorById(editId, values);
    } else {
      await locatorApi.createLocator({ ...values });
    }
    await getData();
    setIsModalVisible(false);
  };
  const showModal = (type) => {
    setAction(type);
    setIsModalVisible(true);
  };

  const handleOkModal = () => {
    setIsModalVisible(false);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  let searchInput;

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  useEffect(() => {
    const loadData = async () => {
      await getData();
    };
    loadData();
  }, []);

  const getData = async () => {
    let res = await locatorApi.getAllLocator();
    let resData = res.map((item, index) => {
      let color;
      switch (item.status) {
        case "admin":
          color = "red";
          break;
        case "cashier":
          color = "green";
          break;
        // case "customer": "blue"; break;
        case "inventoryManager":
          color = "blue";
          break;
      }
      return {
        ...item,
        status: (
          <Tag color={color} key={item.status}>
            {item.status}
          </Tag>
        ),
      };
    });
    console.log(res);
    setData(res);
  };

  const handleDelete = async (id) => {
    const res = await locatorApi.deleteLocatorById(id);
    await getData();
  };
  const handleStatus = async (id, status) => {
    const res = await locatorApi.setStatusById(id, status);
    await getData();
  };
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Mã chi nhánh",
      dataIndex: "storeID",
      sorter: (a, b) => a.storeID.length - b.storeID.length,
      ...getColumnSearchProps("storeID"),
    },
    {
      title: "Mô tả",
      dataIndex: "address",
      sorter: (a, b) => a.address.length - b.address.length,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Hoạt động",
          value: true,
        },
        {
          text: "Không hoạt động",
          value: false,
        },
      ],
      onFilter: (value, record) => record.status === value,
      sorter: (a, b) => a.status?.length - b.status?.length,
      render: (status) => {
        let color;
        let valueVN;
        switch (status) {
          case false:
            color = "red";
            valueVN = "Không hoạt động";
            break;
          case true:
            color = "green";
            valueVN = "Hoạt động";
            break;
        }
        return (
          <Tag color={color} key={status}>
            {valueVN}
          </Tag>
        );
      },
    },

    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Link
            // onClick={() => {
            //   onFill(data.filter((item) => item._id == record._id));
            //   showModal("Sửa thông tin");
            // }}
            to={`/store/locator/${record._id}`}
          >
            <FiEdit color={"green"} size={"18px"} />
          </Link>
          <Popconfirm
            title="Bạn có muốn xóa?"
            onConfirm={() => handleDelete(record._id)}
          >
            <a>
              <RiDeleteBin6Line color={"red"} size={"18px"} />
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  function onChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
    setPagination(pagination);
  }

  return (
    <>
      <div>
        <Row map style={{ height: 300, with: 600 }}>
          <Map
            style={{ height: "100%", width: "100%" }}
            zoom={15}
            center={[21.00146, 105.84651]}
            zoomControl={false}
            ref={mapRef}
          >
            <TileLayer
              attribution=""
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data?.map((locator, index) => {
              return (
                <Marker
                  position={[locator.lat, locator.lng]}
                  icon={L.icon({
                    iconUrl:
                      "https://res.cloudinary.com/hoaduonghx/image/upload/v1669541451/image/wsf2f8vtuxfdcuzpmxpg.png",
                    iconSize: [41, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41],
                  })}
                >
                  <TooltipMap offset={[12.5, -22.5]}>
                    <b>{locator.address}</b>
                  </TooltipMap>
                </Marker>
              );
            })}
          </Map>
        </Row>
        <Button
          type="primary"
          onClick={() => {
            history.push("/store/locator/new");
          }}
          style={{ marginBottom: "16px", marginTop: "16px" }}
        >
          Thêm chi nhánh
        </Button>
        <Modal
          footer={null}
          title={action}
          visible={isModalVisible}
          onOk={handleOkModal}
          onCancel={handleCancelModal}
        >
          <Form
            {...layout}
            name="nest-messages"
            onFinish={onFinishModal}
            validateMessages={validateMessages}
            form={form}
          >
            <Form.Item name={"name"} label="Tên" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name={"storeID"}
              label="Mã chi nhánh"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name={"address"} label="Mô tả">
              <TextArea rows="5" />
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Table
          columns={columns}
          dataSource={data}
          onChange={onChange}
          pagination={pagination}
          loading={loading}
        />
      </div>
    </>
  );
}

LocatorManager.propTypes = {};

export default LocatorManager;
