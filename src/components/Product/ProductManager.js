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
} from "antd";
import productApi from "../../api/productApi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Highlighter from "react-highlight-words";
import {
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import typeProductApi from "../../api/typeProductApi";
import CSVReader from 'react-csv-reader';
import {CSVLink} from "react-csv";
const { Option } = Select;

function ProductManager(props) {
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState("Sửa thông tin");
  const [editId, setEditId] = useState("");
  const [dataOption, setDataOption] = useState([]);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [imageUrl, setImageUrl] = useState("5fd78fde0e6bc02a98b3d090");
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "http://localhost:5001/photo/5fd78fde0e6bc02a98b3d090",
    },
  ]);

  const [form] = Form.useForm();
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

  const handleChangeAvatar = (info) => {
    setFileList(info.fileList);
    if (info.file.status === "uploading") {
      setLoadingPhoto(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setImageUrl(info.file.response.photo);
        setLoadingPhoto(false);
      });
      console.log(info.file.response);
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
    console.log("data[0]", data[0])
    setEditId(data[0]._id);
  };

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

  const onFinishModal = async (values) => {
    console.log(values);
    if (action === "Sửa thông tin") {
      await productApi.editProductById(editId, { ...values, photo: imageUrl });
    } else {
      await productApi.createProduct({ ...values, photo: imageUrl });
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
      await getDataOption();
    }
    loadData();
  }, []);

  const getDataOption = async () => {
    let res = await typeProductApi.getAllTypeProduct();
    console.log(res);
    setDataOption(res);
  };

  const getData = async () => {
    let res = await productApi.getAllProduct();
    let resData = res.map((item, index) => {
      return {
        ...item,
        type: item.type._id,
        typeName: item.type.name,
        key: index,
      };
    });
    console.log(res);
    if (res.photo) setImageUrl(res.photo);
    setData(resData);
  };

  const handleDelete = async (id) => {
    console.log(id);
    const res = await productApi.deleteProductById(id);
    console.log(res);
    await getData();
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Mô tả",
      dataIndex: "productID",
      key: "productID",
      sorter: (a, b) => a.productID.length - b.productID.length,
      ...getColumnSearchProps("productID"),
    },
    {
      title: "Loại",
      dataIndex: "typeName",
      key: "typeName",
      sorter: (a, b) => a.typeName.length - b.typeName.length,
      filters: [
        {
          text: "Đang bán",
          value: true,
        },
        {
          text: "Không bán",
          value: false,
        },
      ],
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price?.length - b.price?.length,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Đang bán",
          value: true,
        },
        {
          text: "Không bán",
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
            valueVN = "Không bán";
            break;
          case true:
            color = "green";
            valueVN = "Đang bán";
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
  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
}
  function onChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
    setPagination(pagination);
  }
  function changeClick() {
    const e = document.getElementById(`file-input`)
    e.click()
}
  const handleBulkCreate = async (data) => {
    var dataArr = [];
    var mess = 'Error, no column '
    try {
        var check = true;
        var rowArrayError = []
        for (var i = 0; i < data.length; i++) {
          let rowItem = {}
          rowItem.status = data[i].status == 'active' ? 1 : 0;
          rowItem.name = data[i].name !== null ? data[i].name : '';
          rowItem.productID = data[i].productID !== null ? data[i].productID : '';
          rowItem.description = data[i].description !== null ? data[i].description : '';
          rowItem.photo = data[i].photo !== null ? data[i].photo : '';
          rowItem.uom = data[i].uom !== null ? data[i].uom : '';
          rowItem.type = data[i].type !== null ? data[i].type : '';
          rowItem.price = data[i].price !== null ? data[i].price : 0;
          dataArr.push(rowItem)
        }
console.log('dataArr', dataArr)

        //     let rowItem = {}
        //     var rowCheck = true;

        //     rowItem.status = data[i].status == 'active' ? 1 : 0;
        //     rowItem.storeName = data[i].storeName !== null ? data[i].storeName : '';
        //     rowItem.lat = data[i].lat;
        //     rowItem.lng = data[i].lng;
        //     rowItem.marker = (data[i].marker === null || data[i].marker === '') ? `/image/location-pin.svg` : data[i].marker;



        //     if ((data[i].storeName === null || data[i].storeName === "")) {
        //         rowArrayError.push(i + 1);
        //         check = false;
        //     }


        //     if (data[i].address === null || data[i].address === "") {
        //         rowArrayError.push(i + 1);
        //         check = false;
        //     }
            
        // }
        await productApi.importProduct({ dataArr });
        

        if (!check) {
            dataArr = [];
        }

        
    } catch (e) {
        console.log(e)
    }
}
  return (
    <>
      <div>
      <CSVReader inputId={`file-input`}
                                   fileEncoding={'ANSI'}
                                   onFileLoaded={(data) => handleBulkCreate(data)}
                                   parserOptions={papaparseOptions} inputStyle={{display: 'none'}}/>
        <Button
          type="primary"
          onClick={() => {
            form.resetFields();
            showModal("Thêm sản phẩm");
          }}
          style={{ marginBottom: "16px" }}
        >
          Thêm sản phẩm
        </Button>
        <Button
          type="primary"
          onClick={() => changeClick()}
          style={{ marginBottom: "16px", marginLeft: "5px" }}
        >
          Import sản phẩm
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
              name={"productID"}
              label="Mã sản phẩm"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name={"description"} label="Mô tả">
              <TextArea rows="4" />
            </Form.Item>
            <Form.Item name={"price"} label="Giá">
              <Input type="number" min="0" />
            </Form.Item>
            <Form.Item name={"type"} label="Loại" rules={[{ required: true }]}>
              <Select
                placeholder="Chọn loại sản phẩm"
                defaultValue={data.type}
                allowClear
              >
                {dataOption.map((item, index) => {
                  return <Option value={item._id}>{item.name}</Option>;
                })}
              </Select>
            </Form.Item>
            <Form.Item name={"status"} label="Trạng thái">
              <Switch defaultChecked={data.status ? true : true}/>
            </Form.Item>
            <Form.Item name={"photo"} label="Ảnh sản phẩm">
              <Upload
                name="photo"
                listType="picture-card"
                className="avatar-uploader"
                fileList={fileList}
                showUploadList={false}
                // action="http://localhost:5001/uploadphoto"
                action={data.photo}
                beforeUpload={beforeUpload}
                onChange={handleChangeAvatar}
              >
                {imageUrl ? (
                  <img
                    src={
                      "http://localhost:5001/photo/" + (data.photo || imageUrl)
                    }
                    alt="avatar"
                    style={{ width: "100%" }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
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
          expandable={{
            expandedRowRender: (record) => (
              <p style={{ margin: 0 }}>
                <img
                  // src={
                  //   "http://localhost:5001/photo/" + (record.photo || imageUrl)
                  // }
                  src={
                    record.photo ? record.photo : null
                  }
                  alt="avatar"
                  style={{ width: "200px" }}
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

ProductManager.propTypes = {};

export default ProductManager;
