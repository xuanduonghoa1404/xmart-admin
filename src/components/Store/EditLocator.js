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
import { BsArrowLeft, BsArrowLeftShort } from "react-icons/bs";
import { RiDeleteBin6Line, RiCheckboxCircleLine } from "react-icons/ri";
import { GiCancel } from "react-icons/gi";
import Highlighter from "react-highlight-words";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { Map, Marker, TileLayer, Tooltip as TooltipMap } from "react-leaflet";
import L from "leaflet";
import * as ELG from "esri-leaflet-geocoder";
import leafletKnn from "leaflet-knn";
import { useHistory } from "react-router-dom";
const { Option } = Select;

function EditLocator(props) {
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState("Sửa thông tin");
  const [editId, setEditId] = useState(props.match.params.id.toString());
  const [form] = Form.useForm();
  const history = useHistory();
  const onFill = (data) => {
    form.setFieldsValue(data);
    setEditId(data._id);
  };
  const locatorId = props.match.params.id.toString();
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
          form.setFieldsValue({
            lat: Math.round(result.latlng.lat * 100000) / 100000,
            lng: Math.round(result.latlng.lng * 100000) / 100000,
          });
          marker.openPopup();
        });
    });
  }, []);

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
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
    if (locatorId !== "new") {
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

  useEffect(() => {
    const loadData = async () => {
      await getData();
    };
    loadData();
  }, []);

  const getData = async () => {
    if (editId !== "new") {
      let res = await locatorApi.getLocatorById(editId);
      setData(res);
      onFill(res);
      setLat(res?.lat || 0);
      setLng(res?.lng || 0);
    } else {
      setData({});
    }
  };

  const handleDelete = async (id) => {
    const res = await locatorApi.deleteLocatorById(id);
    await getData();
  };
  const handleStatus = async (id, status) => {
    const res = await locatorApi.setStatusById(id, status);
    await getData();
  };

  return (
    <>
      <div>
        <Button
          icon={<BsArrowLeftShort style={{ fontSize: "18px" }} />}
          // icon={<ArrowLeftOutlined />}
          onClick={() => {
            history.push("/store/locator");
          }}
          style={{ marginBottom: "10px", fontSize: "18px" }}
        />
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
            {data && data._id ? (
              <Marker
                position={[data?.lat || 0, data?.lng || 0]}
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
                  <b>{data.address}</b>
                </TooltipMap>
              </Marker>
            ) : (
              <></>
            )}
          </Map>
        </Row>
        <br />
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
          <Form.Item name={"lat"} label="Lat" rules={[{ required: true }]}>
            <Input placeholder="Chọn vị trí trên bản đồ" value={lat} />
          </Form.Item>
          <Form.Item name={"lng"} label="Lng" rules={[{ required: true }]}>
            <Input placeholder="Chọn vị trí trên bản đồ" value={lng} />
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

          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}

EditLocator.propTypes = {};

export default EditLocator;
