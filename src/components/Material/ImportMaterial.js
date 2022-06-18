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
import importMaterialApi from "../../api/importMaterialApi";
import locatorApi from "../../api/locatorApi";
import materialApi from "../../api/materialApi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Highlighter from "react-highlight-words";
import { DollarOutlined, SearchOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { Checkbox } from "antd";
import jwt from "jsonwebtoken";
const { Option } = Select;

// function onChange(e) {
//   console.log(`checked = ${e.target.checked}`);
// }
//
// ReactDOM.render(<Checkbox onChange={onChange}>Checkbox</Checkbox>, mountNode);
function ImportMaterialManager(props) {
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState("Sửa thông tin");
  const [editId, setEditId] = useState("");
  const [isImportMaterialTable, setIsImportMaterialTable] = useState(false);
  const [dataMenu, setDataMenu] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [dataMaterial, setDataMaterial] = useState([]);
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
    let importMaterial = Object.keys(values).map((item, index) => {
      return values[item];
    });
    let newImportMaterial = [];
    for (let i = 1; i < importMaterial.length; i += 2) {
      newImportMaterial.push({
        material: importMaterial[i],
        amount: importMaterial[i + 1],
      });
    }
    console.log(newImportMaterial);
    let newValues = { ...values, import: [...newImportMaterial] };
    // console.log(newValues);
    // if (isImportMaterialTable == false) {
    //   newValues = { ...values, email: userEmail, importMaterial: [...newImportMaterial] };
    // }
    if (action === "Sửa thông tin") {
      await importMaterialApi.editImportMaterialById(editId, values);
    } else {
      await importMaterialApi.createImportMaterial(newValues);
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

  useEffect(async () => {
    await getData();
    await getListLocator();
    await getDataMaterial();
  }, []);

  const getDataMaterial = async () => {
    let res = await materialApi.getAllMaterial();
    setDataMaterial(res);
  };
  const getListLocator = async () => {
    let res = await locatorApi.getAllTable();
    setListLocator(res);
  };
  const getData = async () => {
    let res = await importMaterialApi.getAllImportMaterial();
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
  //   const res = await importMaterialApi.payImportMaterialById(id, status);
  //   console.log(res);
  //   await getData();
  // };

  const handleDelete = async (id) => {
    console.log(id);
    const res = await importMaterialApi.deleteImportMaterialById(id);
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
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: (a, b) => a.totalPrice?.length - b.totalPrice?.length,
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
  
  const handleChange = () => {
    form.setFieldsValue({
      sights: []
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
      <Form.List name="sights">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <Space key={field.key} align="baseline">
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, curValues) =>
                    prevValues.area !== curValues.area ||
                    prevValues.sights !== curValues.sights
                  }
                >
                  {() => (
                    <Form.Item
                      {...field}
                      label="Sản phẩm"
                      name={[field.name, "sight"]}
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
                      placeholder="Search to Select"
                      optionFilterProp="children"
                      filterOption={(input, option) => option.children.includes(input)}
                      filterSort={(optionA, optionB) =>
                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                      }
                    >
                      {dataMaterial.map((item, index) => {
                        return <Option value={item._id}>{item.name}</Option>;
                      })}
                    </Select>
                    </Form.Item>
                  )}
                </Form.Item>
                <Form.Item
                  {...field}
                  label="SKU"
                  name={[field.name, "SKU"]}
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
                  label="Số lương"
                  name={[field.name, "quantity"]}
                  rules={[
                    {
                      required: true,
                      message: "Missing price"
                    }
                  ]}
                >
                  <InputNumber />
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
                  <DatePicker format={dateFormatList}/>
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
              let dataSourceRow = record.import.map((item, index) => {
                return {
                  ...item.material,
                  amount: item.amount,
                  totalPrice: item.amount * item.material.priceperunit,
                  priceperunit: item.material.priceperunit,
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

ImportMaterialManager.propTypes = {};

export default ImportMaterialManager;
