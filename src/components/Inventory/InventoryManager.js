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
  Switch,
  Dropdown,
  Menu
} from "antd";
import inventoryApi from "../../api/inventoryApi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Highlighter from "react-highlight-words";
import { SearchOutlined, DownOutlined, UserOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import locatorApi from "../../api/locatorApi";
const { Option } = Select;

function InventoryManager(props) {
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState("Sửa thông tin");
  const [editId, setEditId] = useState("");
  const [listLocator, setListLocator] = useState([]);
  const [selectedLocator, setSelectedLocator] = useState('all');


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
      await inventoryApi.editInventoryById(editId, values);
    } else {
      await inventoryApi.createInventory({ ...values });
    }
    await getData();
    setIsModalVisible(false);
  }
    ;

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
      await getListLocator();
    }
    loadData();
  }, []);

  const getListLocator = async () => {
    let res = await locatorApi.getAllLocator();
    setListLocator(res);
  };
  const handleChangeLocator = (value, option) => {
    setSelectedLocator(value)
    let resData = data.map((item, index) => {
      let quantity = 0
      if (!item.inventory.length) {
        quantity = 0
      } else {
        if (value !== 'all') {
          item.inventory.forEach((i) => {
            if (i.locator == value) {
              i.imports.forEach((j) => {
                quantity += j.quantity
              })
            }
          })
        } else {
          item.inventory.forEach((i) => {
            i.imports.forEach((j) => {
              quantity += j.quantity
            })
          })
        }
      }
      return {
        ...item,
        quantity: quantity
      };
    });
    setData(resData);
  };

  const handle = useCallback(async () => {
    await getInventoryDateExpiration();
  }
  , [data]);

  const getInventoryDateExpiration = async () => {
    console.log("getInventoryDateExpiration");
    let res = await inventoryApi.getInventoryDateExpiration();
    let resData = res.map((item, index) => {
      // let color;
      // switch (item.status) {
      //   case "admin":
      //     color = "red";
      //     break;
      //   case "cashier":
      //     color = "green";
      //     break;
      //   // case "customer": "blue"; break;
      //   case "inventoryManager":
      //     color = "blue";
      //     break;
      // }
      let quantity = 0
      if (!item.inventory.length) {
        quantity = 0
      } else {
        item.inventory.forEach((i) => {
          i.imports.forEach((j) => {
            quantity += j.quantity
          })
        })
      }
      return {
        ...item,
        quantity: quantity,
        // status: (
        //   <Tag color={color} key={item.status}>
        //     {item.status}
        //   </Tag>
        // ),
      };
    });
    setData(resData);
  };

  const getData = async () => {
    let res = await inventoryApi.getAllInventory();
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
      let quantity = 0
      if (!item.inventory.length) {
        quantity = 0
      } else {
        item.inventory.forEach((i) => {
          i.imports.forEach((j) => {
            quantity += j.quantity
          })
        })
      }
      return {
        ...item,
        quantity: quantity,
        status: (
          <Tag color={color} key={item.status}>
            {item.status}
          </Tag>
        ),
      };
    });
    setData(resData);
  };

  const handleDelete = async (id) => {
    console.log(id);
    const res = await inventoryApi.deleteInventoryById(id);
    console.log(res);
    await getData();
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      sorter: (a, b) => a.name?.length - b.name?.length,
      ...getColumnSearchProps("name"),
    },
    // {
    //   title: "Loại",
    //   ndataIndex: "type.name",
    //   sorter: (a, b) => a.typeName?.length - b.typeName?.length,
    // },
    // {
    //   title: "Mô tả",
    //   dataIndex: "description",
    //   sorter: (a, b) => a.description?.length - b.description?.length,
    // },
    // {
    //   title: "Số lượng nhập",
    //   dataIndex: "amountInput",
    //   sorter: (a, b) => a.amount - b.amount,
    // },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Đơn vị",
      dataIndex: "uom",
      sorter: (a, b) => a.uom?.length - b.uom?.length,
    },
    // {
    //   title: "Số lượng xuất",
    //   dataIndex: "amountOutput",
    //   sorter: (a, b) => a.description.length - b.description.length,
    // },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   filters: [
    //     {
    //       text: "Đang bán",
    //       value: true,
    //     },
    //     {
    //       text: "Không bán",
    //       value: false,
    //     },
    //   ],
    //   onFilter: (value, record) => record.status === value,
    //   sorter: (a, b) => a.status?.length - b.status?.length,
    //   render: (status) => {
    //     let color;
    //     let valueVN;
    //     switch (status) {
    //       case false:
    //         color = "red";
    //         valueVN = "Không bán";
    //         break;
    //       case true:
    //         color = "green";
    //         valueVN = "Đang bán";
    //         break;
    //     }
    //     return (
    //       <Tag color={color} key={status}>
    //         {valueVN}
    //       </Tag>
    //     );
    //   },
    // },
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

  function onChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
    setPagination(pagination);
  }

  return (
    <>
      <div>
        {/* <Button
          type="primary"
          onClick={() => {
            showModal("Thêm loại sản phẩm");
          }}
          style={{ marginBottom: "16px" }}
        >
          Thêm loại sản phẩm
          </Button> */}
        {/* <Dropdown overlay={<Menu
          onClick={handleMenuClick}
          items={[
            {
              label: '1st menu item',
              key: '1',
              icon: <UserOutlined />,
            },
            {
              label: '2nd menu item',
              key: '2',
              icon: <UserOutlined />,
            },
            {
              label: '3rd menu item',
              key: '3',
              icon: <UserOutlined />,
            },
          ]}
        />}>
          <Button>
            <Space>
              Button
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown> */}
        <Select
          style={{
            minWidth: 120,
            width: 'fitContent',
          }}
          placeholder="Chọn chi nhánh"
          // defaultValue={selectedLocator}
          onChange={handleChangeLocator}
        >
          <Option value={'all'}>All</Option>
          {listLocator.map((item, index) => {
            return <Option value={item._id}>{item.name}</Option>;
          })}
        </Select>
        <Button
          type="secondary"
          onClick={() => {
            handle()
          }}
          style={{ marginBottom: "16px" }}
        >
          Sản phẩm sắp hết hạn
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
            <Form.Item name={"name_type"} label="Loại" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={"unit"} label="Đơn vị" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name={"description"} label="Mô tả">
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

InventoryManager.propTypes = {};

export default InventoryManager;
