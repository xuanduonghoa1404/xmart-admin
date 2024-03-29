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
} from "antd";
import exportInventoryApi from "../../api/exportInventoryApi";
import inventoryApi from "../../api/inventoryApi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Highlighter from "react-highlight-words";
import { DollarOutlined, SearchOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { Checkbox } from "antd";
import jwt from "jsonwebtoken";
const { Option } = Select;

// function onChange(e) {
//   console.log(`checked = ${e.target.checked}`);
// }
//
// ReactDOM.render(<Checkbox onChange={onChange}>Checkbox</Checkbox>, mountNode);
function ExportInventoryManager(props) {
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState("Sửa thông tin");
  const [editId, setEditId] = useState("");
  const [isExportInventoryTable, setIsExportInventoryTable] = useState(false);
  const [dataMenu, setDataMenu] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [dataInventory, setDataInventory] = useState([]);
  const [userEmail, setUserEmail] = useState(
    jwt.decode(localStorage.getItem("token")).email
  );

  const [form] = Form.useForm();

  const onFill = (data) => {
    form.setFieldsValue(data[0]);
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
    let exportInventory = Object.keys(values).map((item, index) => {
      return values[item];
    });
    let newExportInventory = [];
    for (let i = 1; i < exportInventory.length; i += 2) {
      newExportInventory.push({
        inventory: exportInventory[i],
        amount: exportInventory[i + 1],
      });
    }
    console.log(newExportInventory);
    let newValues = { ...values, export: [...newExportInventory] };
    // console.log(newValues);
    // if (isExportInventoryTable == false) {
    //   newValues = { ...values, email: userEmail, exportInventory: [...newExportInventory] };
    // }
    if (action === "Sửa thông tin") {
      await exportInventoryApi.editExportInventoryById(editId, values);
    } else {
      await exportInventoryApi.createExportInventory(newValues);
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

  const addMenu = () => {
    let newDataMenu = [...dataMenu];
    newDataMenu.push("1");
    console.log(dataMenu);
    setDataMenu(newDataMenu);
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
      await getDataInventory();
    }
    loadData();
  }, []);
  
  const getDataInventory = async () => {
    let res = await inventoryApi.getAllInventory();

    console.log(res);
    setDataInventory(res);
  };

  const getData = async () => {
    let res = await exportInventoryApi.getAllExportInventory();
    let resData = res.map((item, index) => {
      return {
        ...item,
        key: index,
      };
    });

    console.log(resData);
    setData(resData);
  };

  // const handlePayMoney = async (id, status) => {
  //   console.log(id);
  //   const res = await exportInventoryApi.payExportInventoryById(id, status);
  //   console.log(res);
  //   await getData();
  // };

  const handleDelete = async (id) => {
    console.log(id);
    const res = await exportInventoryApi.deleteExportInventoryById(id);
    console.log(res);
    await getData();
  };

  const columns = [
    {
      title: "Tên đơn xuất",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name?.length - b.name?.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Thời gian",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) => a.updatedAt?.length - b.updatedAt?.length,
      render: (text, record) => {
        return new Date(record.updatedAt).toLocaleString();
      },
    },
    // {
    //   title: "Thành tiền",
    //   dataIndex: "totalPrice",
    //   key: "totalPrice",
    //   sorter: (a, b) => a.totalPrice?.length - b.totalPrice?.length,
    // },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          {/* <Popconfirm
            title="Xác nhận thanh toán?"
            onConfirm={() => handlePayMoney(record._id, "paid")}
          >
            <a>
              <DollarOutlined style={{ color: "green", fontSize: "18px" }} />
            </a>
          </Popconfirm> */}
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

  const columnsRow = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      sorter: (a, b) => a.name?.length - b.name?.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      sorter: (a, b) =>a.unit?.length - b.unit?.length,
    },
  ];

  function onChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
    setPagination(pagination);
  }

  return (
    <>
      <div>
        <Button
          type="primary"
          onClick={() => {
            showModal("Thêm đơn");
          }}
          style={{ marginBottom: "16px" }}
        >
          Thêm đơn xuất kho
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
            <Form.Item name={"name"} label="Tên">
              <Input />
            </Form.Item>
            {dataMenu.map((item, index) => {
              return (
                <div
                  key={index}
                  className="itemMenu"
                  style={{
                    bexportInventoryBottom: "1px solid #000",
                    padding: "8px 0px",
                    marginBottom: "8px",
                  }}
                >
                  <Form.Item
                    key={index}
                    name={"inventory." + index}
                    label={
                      "Sản phẩm" +
                      (dataMenu.length > 1 ? " " + (index + 1) : "")
                    }
                  >
                    <Select placeholder="Chọn sản phẩm" allowClear>
                      {dataInventory.map((item, index) => {
                        return <Option value={item._id}>{item.name}</Option>;
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name={"amount." + index}
                    label="Số lượng"
                    rules={[{ number: "range", min: 0 }]}
                  >
                    <Input type="number" min="0" />
                  </Form.Item>
                </div>
              );
            })}
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button htmlType="button" onClick={() => addMenu()}>
                Thêm sản phẩm xuất
              </Button>
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
            expandedRowRender: (record) => {
              let dataSourceRow = record.export.map((item, index) => {
                return {
                  ...item.inventory,
                  amount: item.amount,
                  totalPrice: item.amount * item.inventory.priceperunit,
                  priceperunit: item.inventory.priceperunit,
                  key: index,
                };
              });
              return <Table columns={columnsRow} dataSource={dataSourceRow} />;
            },
            rowExpandable: (record) => record.name !== "Not Expandable",
          }}
        />
      </div>
    </>
  );
}

ExportInventoryManager.propTypes = {};

export default ExportInventoryManager;
