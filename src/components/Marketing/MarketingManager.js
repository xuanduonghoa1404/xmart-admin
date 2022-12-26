import React, { useEffect, useState } from "react";
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
  Upload,
  message,
  Switch,
  Image,
  Row,
  Col,
  DatePicker,
  TimePicker,
} from "antd";
import productApi from "../../api/productApi";
import marketingApi from "../../api/marketingApi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Highlighter from "react-highlight-words";
import {
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
// import CSVReader from 'react-csv-reader';
// import {CSVLink} from "react-csv";
import typeProductApi from "../../api/typeProductApi";
import axios from "axios";
import { useHistory } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// import cloudinary from "../../configs/cloudinary.config";
// const cloudinary = require('cloudinary').v2;

const { Option } = Select;
function MarketingManager(props) {
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState("Sửa thông tin");
  const [editId, setEditId] = useState("");
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([
    // {
    //   uid: "-1",
    //   name: "image.png",
    //   status: "done",
    //   url: "https://res.cloudinary.com/hoaduonghx/image/upload/v1662886625/Project/banner_1_870-X-180-Good-Pro_jt6kls.jpg",
    // },
  ]);
  const [form] = Form.useForm();
  const [typeList, setTypeList] = useState([]);
  const [productList, setProductList] = useState([]);
  const cloudName = "hoaduonghx"; // replace with your own cloud name
  const uploadPreset = "anhakazk"; // replace with your own upload preset
  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY"];
  // dayjs.extend(customParseFormat);

  // const [image, setImage] = useState('');
  // const [loadingImage, setLoadingImage] = useState(false);

  const history = useHistory();
  const openWidget = () => {
    // create the widget
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
      },
      (error, result) => {
        if (result.event === "success") {
          setImageUrl(result.info.secure_url);
          form.setFieldsValue({
            photo: result.info.secure_url,
          });
        }
      }
    );
    widget.open(); // open up the widget after creation
  };

  // const uploadImg = async info => {
  //       const file = info.target.files;
  //       // const file = info.fileList[0];
  //       console.log('file', file);
  //       // setFileList(info.fileList);
  //       const formData = new FormData();
  //       formData.append("file", file[0]);
  //       formData.append("upload_preset", uploadPreset);
  //       setLoadingImage(true)
  //       const res = await fetch(
  //         `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  //         {
  //           method: 'POST',
  //           body: formData
  //         }
  //       )
  //       const response = await res.json();
  //       setLoadingImage(true)
  //       console.log('response', response)
  //       setImage(response.secure_url)
  // }

  // const serverUpload = async (options) => {
  //   const { onSuccess, file, onError, onProgress } = options;
  //   console.log("imageFilesList: ", fileList);
  //   try {
  //     const result = [];
  //     for (let i = 0; i < fileList.length; i++) {
  //       let file = fileList[i];
  //       console.log("FILE: ", file);
  //       const formData = new FormData();
  //       formData.append("file", file);
  //       formData.append(
  //         "upload_preset",
  //         uploadPreset
  //       );
  //       const res = await fetch(
  //         `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  //         {
  //           method: 'POST',
  //           body: formData
  //         }
  //       )
  //       const response = await res.json();
  //       setLoadingImage(true)
  //       console.log('response', response)
  //       setImage(response.secure_url)
  //       setImageUrl(response.secure_url)
  //       // result.push(
  //       //   axios.post(cloudinary.CLOUDINARY_IMAGE_UPLOAD_URL, formData)
  //       // );
  //     }
  //     onSuccess("ok");
  //   } catch (err) {
  //     console.log(err);
  //     onError(err);
  //   }
  // };

  // const uploadProps = {
  //   name: "file",
  //   customRequest: { serverUpload },
  //   onChange(info) {
  //     if (info.file.status !== "uploading") {
  //       console.log("Not uploading ", info.file, info.fileList);
  //     }
  //     if (info.file.status === "done") {
  //       message.success(`${info.file.name} file uploaded successfully`);
  //     } else if (info.file.status === "error") {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //     setFileList(info.fileList);
  //   },
  //   listType: "picture",
  //   maxCount: 1,
  //   multiple: true,
  //   onDrop: true
  // };

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChangeAvatar = async (info) => {
    setFileList(info.fileList);
    if (info.file.status === "uploading") {
      setLoadingPhoto(true);
      return;
    }
    console.log(info.file.status);
    if (info.file.status === "done") {
      // Get this url from response in real world.
      // getBase64(info.file.originFileObj, (imageUrl) => {
      //   setImageUrl(info.file.response.photo);
      //   setLoadingPhoto(false);
      // });
      // console.log(info.file.response);
      // console.log('file', file);
      //   // setFileList(info.fileList);
      //   const formData = new FormData();
      //   formData.append("file", file[0]);
      //   formData.append("upload_preset", uploadPreset);
      //   setLoadingImage(true)
      //   const res = await fetch(
      //     `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      //     {
      //       method: 'POST',
      //       body: formData
      //     }
      //   )
      //   const response = await res.json();
      //   setLoadingImage(true)
      //   console.log('response', response)
      //   setImage(response.secure_url)
    }
  };

  const uploadButton = (
    <div>
      {loadingPhoto ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const onFill = (data) => {
    form.setFieldsValue(data[0]);
    if (data[0].photo) setImageUrl(data[0].photo);
    setEditId(data[0]._id);
    setApply(data[0].apply);
    setCondition(data[0].condition);
    console.log("data[0].status", data[0].status);
    setStatus(data[0].status);
  };

  const layout = {
    labelCol: { span: 6 },
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
    if (action === "Sửa thông tin") {
      await marketingApi.editMarketingById(editId, {
        ...values,
        photo: imageUrl,
      });
    } else {
      await marketingApi.createMarketing({ ...values, photo: imageUrl });
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
  function removeAscent(str) {
    if (str === null || str === undefined) return str;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str;
  }
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
      await getDataType();
      await getDataProduct();
    };
    loadData();
  }, []);

  const getData = async () => {
    let res = await marketingApi.getAllMarketing();

    let resData = res.map((item, index) => {
      return { ...item, key: index };
    });
    setData(resData);
  };

  const getDataType = async () => {
    let res = await typeProductApi.getAllTypeProduct();
    setTypeList(res);
  };
  const getDataProduct = async () => {
    let res = await productApi.getAllProduct();
    setProductList(res);
  };

  const handleDelete = async (id) => {
    const res = await marketingApi.deleteMarketingById(id);
    await getData();
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name?.length - b.name?.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description?.length - b.description?.length,
    },
    {
      title: "Áp dụng sản phẩm",
      dataIndex: "apply",
      key: "apply",
      sorter: (a, b) => a.apply.length - b.apply.length,
      filters: [
        {
          text: "Tất cả sản phẩm",
          value: "ALL",
        },
        {
          text: "Loại sản phẩm",
          value: "TYPE",
        },
        {
          text: "Từng sản phẩm",
          value: "PRODUCT",
        },
      ],
      render: (value) => {
        let valueVN;
        switch (value) {
          case "ALL":
            valueVN = "Tất cả sản phẩm";
            break;
          case "TYPE":
            valueVN = "Loại sản phẩm";
            break;
          case "PRODUCT":
            valueVN = "Từng sản phẩm";
            break;
        }
        return valueVN;
      },
    },
    {
      title: "Khuyến mãi",
      dataIndex: "discount",
      key: "discount",
      sorter: (a, b) => a.discount.length - b.discount.length,
    },
    {
      title: "Điều kiện",
      dataIndex: "condition_text",
      key: "condition_text",
      sorter: (a, b) => a.condition_text.length - b.condition_text.length,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Đang áp dụng",
          value: true,
        },
        {
          text: "Ngừng áp dụng",
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
            valueVN = "Ngừng áp dụng";
            break;
          case true:
            color = "green";
            valueVN = "Đang áp dụng";
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
          <a
            onClick={() => {
              onFill(data.filter((item) => item._id == record._id));
              showModal("Sửa thông tin");
            }}
          >
            <FiEdit color={"green"} size={"18px"} />
          </a>

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

  const [apply, setApply] = useState("ALL");
  const [condition, setCondition] = useState("ALL");
  const [status, setStatus] = useState(true);
  const [discount, setDiscount] = useState("PERCENT");
  const handleFormValuesChange = (changedValues) => {
    const formFieldName = Object.keys(changedValues)[0];
    if (formFieldName === "apply") {
      setApply(changedValues[formFieldName]);
      // form.setFieldsValue({ apply: undefined }); //reset product selection
    } else if (formFieldName === "condition") {
      setCondition(changedValues[formFieldName]);
    } else if (formFieldName === "status") {
      setStatus(changedValues[formFieldName]);
    } else if (formFieldName === "discount_type") {
      setDiscount(changedValues[formFieldName]);
    }
  };
  function onChange(pagination, filters, sorter, extra) {
    setPagination(pagination);
  }

  return (
    <>
      <div>
        <Button
          type="primary"
          onClick={() => {
            form.resetFields();
            showModal("Thêm chương trình khuyến mãi");
          }}
          style={{ marginBottom: "16px" }}
        >
          Thêm chương trình khuyến mãi
        </Button>
        <Button
          type="primary"
          onClick={() => {
            history.push("/design");
          }}
          style={{ marginBottom: "16px", marginLeft: "10px" }}
        >
          Thiết kế ảnh
        </Button>
        <Modal
          footer={null}
          title={action}
          style={{ top: 20 }}
          width={1000}
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
            onValuesChange={handleFormValuesChange}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  name={"name"}
                  label="Tên"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={"apply"} label="Áp dụng">
                  <Select defaultValue={data.apply}>
                    <Option value="ALL">Tất cả sản phẩm</Option>
                    <Option value="TYPE">Loại sản phẩm</Option>
                    <Option value="PRODUCT">Từng sản phẩm</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item name={"description"} label="Mô tả">
                  <TextArea rows="3" />
                </Form.Item>
              </Col>
              <Col span={12}>
                {apply === "TYPE" && (
                  <Form.Item name={"apply_type"} label="Loại">
                    <Select
                      placeholder="Chọn loại sản phẩm"
                      defaultValue={data.apply_type}
                      allowClear
                      showSearch
                      mode="multiple"
                      filterOption={(input, option) =>
                        removeAscent(option.children)
                          .toLowerCase()
                          .includes(removeAscent(input).toLowerCase())
                      }
                    >
                      {typeList.map((item) => {
                        return <Option value={item._id}>{item.name}</Option>;
                      })}
                    </Select>
                  </Form.Item>
                )}
                {apply === "PRODUCT" && (
                  <Form.Item name={"apply_product"} label="Sản phẩm">
                    <Select
                      placeholder="Chọn sản phẩm"
                      defaultValue={data.apply_product}
                      allowClear
                      showSearch
                      mode="multiple"
                      filterOption={(input, option) =>
                        removeAscent(option.children)
                          .toLowerCase()
                          .includes(removeAscent(input).toLowerCase())
                      }
                    >
                      {productList.map((item) => {
                        return <Option value={item._id}>{item.name}</Option>;
                      })}
                    </Select>
                  </Form.Item>
                )}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  name={"status"}
                  label="Trạng thái"
                  valuePropName={status ? "checked" : ""}
                  initialValue
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={"condition"} label="Điều kiện">
                  <Select defaultValue={data.apply}>
                    <Option value="ALL">Không</Option>
                    <Option value="DATE">Dựa theo ngày sắp hết hạn</Option>
                    <Option value="QTY">Dựa theo số lượng còn lại</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* {data.apply !== "ALL" && <Form.Item name={"apply"} label="Sản phẩm">
              <Select defaultValue={data.apply}>
                <Option value="ALL">Tất cả sản phẩm</Option>
                <Option value="TYPE">Loại sản phẩm</Option>
                <Option value="PRODUCT">Từng sản phẩm</Option>
              </Select>
            </Form.Item>} */}

            {/* <Form.Item name={"photo"} label="Ảnh quảng cáo">
              <input onChange={(e) => uploadImg(e)} type="file"/>
              </Form.Item> */}
            <Row>
              <Col span={12}>
                <Form.Item
                  name={"discount_type"}
                  label="Khuyến mại"
                  rules={[{ required: true }]}
                >
                  <Select defaultValue={data.discount_type}>
                    <Option value="PERCENT">KM theo phần trăm</Option>
                    <Option value="FLAT">KM đồng giá</Option>
                    <Option value="FIX_AMOUNT">KM theo số tiền</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                {condition === "ALL" && (
                  <Form.Item name={"dateFrom"} label="Từ ngày">
                    {/* <DatePicker
                      format={dateFormatList}
                      showTime={{
                        defaultValue: dayjs("00:00:00", "HH:mm:ss"),
                      }}
                    /> */}
                  </Form.Item>
                )}
                {condition === "DATE" && (
                  <Form.Item name={"condition_value"} label="Ngày">
                    <InputNumber />
                  </Form.Item>
                )}
                {condition === "QTY" && (
                  <Form.Item name={"condition_value"} label="Số lượng">
                    <InputNumber />
                  </Form.Item>
                )}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                {discount === "PERCENT" && (
                  <Form.Item
                    name={"value"}
                    label="Phần trăm"
                    rules={[{ required: true }]}
                  >
                    <Input addonAfter="%" type="number" />
                  </Form.Item>
                )}
                {discount === "FLAT" && (
                  <Form.Item
                    name={"value"}
                    label="Số tiền"
                    rules={[{ required: true }]}
                  >
                    <Input addonAfter="đ" type="number" />
                  </Form.Item>
                )}
                {discount === "FIX_AMOUNT" && (
                  <Form.Item
                    name={"value"}
                    label="Số tiền"
                    rules={[{ required: true }]}
                  >
                    <Input addonAfter="đ" type="number" />
                  </Form.Item>
                )}
              </Col>
              <Col span={12}></Col>
            </Row>
            <Form.Item name={"photo"} label="Đường dẫn ảnh">
              <Input />
            </Form.Item>
            <Form.Item label="Ảnh quảng cáo">
              <Space size={12}>
                {imageUrl ? (
                  <Image
                    width={500}
                    src={imageUrl}
                    placeholder={<Image preview={false} src="" width={200} />}
                  />
                ) : (
                  <Image
                    width={200}
                    height={200}
                    src="error"
                    fallback="data:image/png;base64,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"
                  />
                )}
                <Button type="primary" onClick={openWidget}>
                  Chọn ảnh
                </Button>
              </Space>
            </Form.Item>
            {/* <input onChange={(e) => uploadImg(e)} type="file"/> */}
            {/* <Form.Item name={"photo"} label="Ảnh quảng cáo">
              <Upload
                name="photo"
                listType="picture-card"
                className="avatar-uploader"
                fileList={fileList}
                showUploadList={false}
                action=""
                beforeUpload={beforeUpload}
                // onChange={handleChangeAvatar}
                onClick={openWidget}
                // {...uploadProps}
              >
                {imageUrl ? (
                  <img
                    src={
                      `${data.photo || imageUrl}`
                    }
                    alt="image"
                    style={{ width: "100%" }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item> */}
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 12 }}>
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
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>
                <img
                  src={`${record.photo || imageUrl}`}
                  alt="image"
                  style={{}}
                />
              </p>
            ),
            rowExpandable: (record) => record.name !== "Not Expandable",
          }}
        />
      </div>
    </>
  );
}

MarketingManager.propTypes = {};

export default MarketingManager;
