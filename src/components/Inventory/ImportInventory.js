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
  DatePicker,
  Select,
} from "antd";
import importInventoryApi from "../../api/importInventoryApi";
import locatorApi from "../../api/locatorApi";
import inventoryApi from "../../api/inventoryApi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Highlighter from "react-highlight-words";
import { DollarOutlined, SearchOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { Checkbox } from "antd";
import jwt from "jsonwebtoken";
import moment from "moment";
import "moment/locale/vi";
import locale from "antd/lib/locale/vi_VN";
const { Option } = Select;
const { RangePicker } = DatePicker;
// function onChange(e) {
//   console.log(`checked = ${e.target.checked}`);
// }
//
// ReactDOM.render(<Checkbox onChange={onChange}>Checkbox</Checkbox>, mountNode);
function ImportInventoryManager(props) {
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState("Sửa thông tin");
  const [editId, setEditId] = useState("");
  const [isImportInventoryTable, setIsImportInventoryTable] = useState(false);
  const [dataMenu, setDataMenu] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [dataInventory, setDataInventory] = useState([]);
  const [userEmail, setUserEmail] = useState(
    jwt.decode(localStorage.getItem("token")).email
  );
  const [listLocator, setListLocator] = useState([]);
  const [form] = Form.useForm();
  const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];
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
    // let importInventory = Object.keys(values).map((item, index) => {
    //   return values[item];
    // });
    // let newImportInventory = [];
    // for (let i = 1; i < importInventory.length; i += 2) {
    //   newImportInventory.push({
    //     inventory: importInventory[i],
    //     amount: importInventory[i + 1],
    //   });
    // }
    // console.log(newImportInventory);
    // let newValues = { ...values, import: [...newImportInventory] };
    // console.log(newValues);
    // if (isImportInventoryTable == false) {
    //   newValues = { ...values, email: userEmail, importInventory: [...newImportInventory] };
    // }
    if (action === "Sửa thông tin") {
      await importInventoryApi.editImportInventoryById(editId, values);
    } else {
      await importInventoryApi.createImportInventory(values);
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
      await getListLocator();
      await getDataInventory();
    }
    loadData();
  }, []);
  
  const getDataInventory = async () => {
    let res = await inventoryApi.getAllInventory();
    setDataInventory(res);
  };
  const getListLocator = async () => {
    let res = await locatorApi.getAllTable();
    setListLocator(res);
  };
  const getData = async () => {
    let res = await importInventoryApi.getAllImportInventory();
    let resData = res.map((item, index) => {
      return {
        ...item,
        locator: item.locator.name,
        key: index,
      };
    });

    console.log(resData);
    setData(resData);
  };

  // const handlePayMoney = async (id, status) => {
  //   console.log(id);
  //   const res = await importInventoryApi.payImportInventoryById(id, status);
  //   console.log(res);
  //   await getData();
  // };

  const handleDelete = async (id) => {
    console.log(id);
    const res = await importInventoryApi.deleteImportInventoryById(id);
    console.log(res);
    await getData();
  };

  const columns = [
    {
      title: "Tên đơn nhập",
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
    {
      title: "Chi nhánh",
      dataIndex: "locator",
      key: "locator",
      sorter: (a, b) => a.locator?.length - b.locator?.length,
    },
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
      dataIndex: "product",
      sorter: (a, b) => a.product.name?.length - b.product.name?.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "productID",
      sorter: (a, b) => a.productID?.length - b.productID?.length,
      ...getColumnSearchProps("productID"),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      sorter: (a, b) => a.sku - b.sku,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Đơn vị",
      dataIndex: "uom",
      sorter: (a, b) => a.uom - b.uom,
    },
    {
      title: "Ngày sản xuất",
      dataIndex: "date_manufacture",
      sorter: (a, b) =>a.date_manufacture?.length - b.date_manufacture?.length,
      render: (text, record) => {
        return new Date(record.date_manufacture).toLocaleDateString();
      },
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "date_manufacture",
      sorter: (a, b) =>a.date_expiration?.length - b.date_expiration?.length,
      render: (text, record) => {
        return new Date(record.date_expiration).toLocaleDateString();
      },
    },
  ];

  function onChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
    setPagination(pagination);
  }
  
  const handleChange = () => {
    form.setFieldsValue({
      imports: []
    });
  };
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
          Thêm đơn nhập kho
        </Button>
        <Modal
          footer={null}
          title={action}
          visible={isModalVisible}
          onOk={handleOkModal}
          onCancel={handleCancelModal}
          width={1500}
        >
          <Form
      form={form}
      name="dynamic_form_nest_item"
      onFinish={onFinishModal}
      validateMessages={validateMessages}
      autoComplete="off"
    >
            <Form.Item name={"name"} label="Tên" rules={[
              {
                required: true,
                message: "Bắt buộc"
              }
            ]}>
              <Input />
            </Form.Item>
            <Form.Item name={"locator"} label="Chi nhánh" rules={[
              {
                required: true,
                message: "Bắt buộc"
              }
            ]}>
            <Select
              style={{
                minWidth: 120,
                width: 'fitContent',
              }}
              placeholder="Chọn chi nhánh"
            // defaultValue={selectedLocator}
            // onChange={handleChangeLocator}
            >
              {listLocator.map((item, index) => {
                return <Option value={item._id}>{item.name}</Option>;
              })}
            </Select>
            </Form.Item>
      <Form.List name="imports">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Space key={field.key} align="baseline">
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.area !== curValues.area ||
                    prevValues.imports !== curValues.imports
                  }
                >
                  {() => (
                    <Form.Item
                      {...field}
                      label="Sản phẩm"
                      name={[field.name, "product"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing sight"
                        }
                      ]}
                    >
                      
                      <Select
                      showSearch
                      style={{
                        width: 'fitContent',
                        minWidth: 200,
                      }}
                      placeholder="Chọn sản phẩm"
                      optionFilterProp="children"
                      filterOption={(input, option) => option.children.includes(input)}
                      filterSort={(optionA, optionB) =>
                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                      }
                    >
                      {dataInventory.map((item, index) => {
                        return <Option value={item._id}>{item.name}</Option>;
                      })}
                    </Select>
                    </Form.Item>
                  )}
                </Form.Item>
                <Form.Item
                  {...field}
                  label="SKU"
                  name={[field.name, "sku"]}
                  rules={[
                    {
                      required: true,
                      message: "Missing price"
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...field}
                  label="Số lượng"
                  name={[field.name, "quantity"]}
                  rules={[
                    {
                      required: true,
                      message: "Missing price"
                    }
                  ]}
                >
                  <InputNumber min={1} />
                </Form.Item>
                <Form.Item
                  {...field}
                  label="NSX"
                  name={[field.name, "date_manufacture"]}
                  rules={[
                    {
                      required: true,
                      message: "Missing price"
                    }
                  ]}
                >
                  <DatePicker format={dateFormatList}/>
                </Form.Item>
                <Form.Item
                  {...field}
                  label="HSD"
                  name={[field.name, "date_expiration"]}
                  rules={[
                    {
                      required: true,
                      message: "Missing price"
                    }
                  ]}
                >
                  <DatePicker format={dateFormatList} />
                </Form.Item>

                <MinusCircleOutlined onClick={() => remove(field.name)} />
              </Space>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Thêm sản phẩm nhập
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
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
              let dataSourceRow = record.imports.map((item, index) => {
                return {
                  ...item.inventory,
                  product: item.product.name,
                  productID: item.product.productID,
                  uom: item.product.uom,
                  sku: item.sku,
                  quantity: item.quantity,
                  date_manufacture: item.date_manufacture,
                  date_expiration: item.date_expiration,
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

ImportInventoryManager.propTypes = {};

export default ImportInventoryManager;
