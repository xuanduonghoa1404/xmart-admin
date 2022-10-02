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
import { MdOutlineLocalShipping } from "react-icons/md";
import Highlighter from "react-highlight-words";
import { DollarOutlined, SearchOutlined, EditOutlined, DeliveredProcedureOutlined, MailOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { Checkbox } from "antd";
import Board from '@asseinfo/react-kanban';
import YourCard from '@asseinfo/react-kanban';
import '@asseinfo/react-kanban/dist/styles.css';
import jwt from "jsonwebtoken";
const { Option } = Select;


// function onChange(e) {
//   console.log(`checked = ${e.target.checked}`);
// }
//
// ReactDOM.render(<Checkbox onChange={onChange}>Checkbox</Checkbox>, mountNode);
function OrderManager(props) {
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState("Sửa thông tin");
  const [editId, setEditId] = useState("");
  const [isOrderTable, setIsOrderTable] = useState(false);
  const [dataMenu, setDataMenu] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [orderDetail, setOrderDetail] = useState({});
  const [userEmail, setUserEmail] = useState(
    jwt.decode(localStorage.getItem("token")).email
  );
  const ORDER_STATUS = new Map();
  ORDER_STATUS.set('Not processed', { color: "red", valueVN: "Chưa xử lý" });
  ORDER_STATUS.set('Processing', { color: "orange", valueVN: "Đã xác nhận" });
  ORDER_STATUS.set('Shipped', { color: "blue", valueVN: "Đang vận chuyển" });
  ORDER_STATUS.set('Delivered', { color: "green", valueVN: "Đã giao hàng" });
  ORDER_STATUS.set('Cancelled', { color: "grey", valueVN: "Đã hủy" });
  const [form] = Form.useForm();

  const [displayType, setDisplayType] = useState("board");
  const specific = {
    columns: [
      {
        id: 'Not processed',
        title: 'Chưa xử lý',
        cards: []
      },
      {
        id: 'Processing',
        title: 'Đã xác nhận',
        cards: []
      },
      {
        id: 'Shipped',
        title: 'Đang vận chuyển',
        cards: []
      },
      {
        id: 'Delivered',
        title: 'Đã giao hàng',
        cards: []
      },
      {
        id: 'Cancelled',
        title: 'Đã hủy',
        cards: []
      },
    ]
  }
  const [controlledBoard, setBoard] = useState(specific);

  const onFill = (data) => {
    form.setFieldsValue(data[0]);
    setEditId(data[0]._id);
    setOrderDetail(data[0])
  };

  console.log(orderDetail);
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
    let order = Object.keys(values).map((item, index) => {
      return values[item];
    });
    let newOrder = [];
    for (let i = 2; i < order.length; i += 2) {
      newOrder.push({ product: order[i], amount: order[i + 1] });
    }
    let newValues = { ...values, order: [...newOrder] };
    console.log(newValues);
    if (isOrderTable == false) {
      newValues = { ...values, email: userEmail, order: [...newOrder] };
    }
    console.log(isOrderTable);
    if (action === "Sửa thông tin") {
      await orderApi.editOrderById(editId, values);
    } else {
      await orderApi.createOrderEmail(newValues);
    }
    await getData();
    await getDataTable();
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

  const onChangeCheckBoxOrderTable = (e) => {
    setIsOrderTable(e.target.checked);
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
      await getDataTable();
      await getDataProduct();
    }
    loadData();

  }, []);

  const getDataTable = async () => {
    let res = await locatorApi.getAllTable();

    let resData = res.filter((item, index) => {
      return item.status === "free";
    });
    setDataTable(resData);
  };

  const getDataProduct = async () => {
    let res = await productApi.getAllProduct();

    setDataProduct(res);
  };

  const getData = async () => {
    let res = await orderApi.getAllOrder();
    let result = [];
    for (let index = 0; index < res.length; index++) {
      const element = res[index];
      let r = {
        _id: element._id,
        status: element.status,
        user: element.user !== null ? element.user?.name : "",
        email: element.user !== null ? element.user?.email : "",
        totalPrice: element.totalPrice,
        key: index,
      };
      result.push(r);
    }
    let resData = res.map((item, index) => {
      const created = new Date(item.created).toLocaleString();
      const updated = new Date(item.updatedAt).toLocaleString();
      return {
        ...item,
        user: item.user?.name,
        email: item.user?.email,
        key: index,
        created: created,
        updated: updated,
        // tableId: item.table?._id,
      };
    });

    setData(resData);
    for (let i in resData) {
      if (resData[i].status === "Not processed") {
        let d = {
          id: resData[i]._id,
          title: resData[i].user,
          description: (
            <>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '5px' }}><FiMail /> <span>{resData[i].email}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '5px' }}><DollarOutlined /> <span><strong>{resData[i].total}đ</strong></span></div>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '5px' }}><FiClock /> <span>{resData[i].created}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '5px' }}><FaRegAddressBook /> <span>{resData[i]?.address || 'Chưa có dữ liệu'}</span></div>
            </>
          ),
          price: resData[i].totalPrice
        }
        specific.columns[0].cards.push(d)
      } else if (resData[i].status === "Processing") {
        let d = {
          id: resData[i]._id,
          title: resData[i].user,
          description: (
            <>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '5px' }}><FiMail /> <span>{resData[i].email}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '5px' }}><DollarOutlined /> <span><strong>{resData[i].total}đ</strong></span></div>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '5px' }}><FiClock /> <span>{resData[i].created}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '5px' }}><FaRegAddressBook /> <span>{resData[i]?.address || 'Chưa có dữ liệu'}</span></div>
            </>
          ),
          price: resData[i].totalPrice
        }
        specific.columns[1].cards.push(d)
      } else if (resData[i].status === "Shipped") {
        let d = {
          id: resData[i]._id,
          title: resData[i].user,
          description: (
            <>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '5px' }}><FiMail /> <span>{resData[i].email}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '5px' }}><DollarOutlined /> <span><strong>{resData[i].total}đ</strong></span></div>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '5px' }}><FiClock /> <span>{resData[i].created}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '5px' }}><FaRegAddressBook /> <span>{resData[i]?.address || 'Chưa có dữ liệu'}</span></div>
            </>
          ),
          price: resData[i].totalPrice
        }
        specific.columns[2].cards.push(d)
      } else if (resData[i].status === "Delivered") {
        let d = {
          id: resData[i]._id,
          title: resData[i].user,
          description: (
            <>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '5px' }}><FiMail /> <span>{resData[i].email}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '5px' }}><DollarOutlined /> <span><strong>{resData[i].total}đ</strong></span></div>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '5px' }}><FiClock /> <span>{resData[i].created}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '5px' }}><FaRegAddressBook /> <span>{resData[i]?.address || 'Chưa có dữ liệu'}</span></div>
            </>
          ),
          price: resData[i].totalPrice
        }
        specific.columns[3].cards.push(d)
      } else if (resData[i].status === "Cancelled") {
        let d = {
          id: resData[i]._id,
          title: resData[i].user,
          description: (
            <>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '5px' }}><FiMail /> <span>{resData[i].email}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '5px' }}><DollarOutlined /> <span><strong>{resData[i].total}đ</strong></span></div>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '5px' }}><FiClock /> <span>{resData[i].created}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', gap: '5px' }}><FaRegAddressBook /> <span>{resData[i]?.address || 'Chưa có dữ liệu'}</span></div>
            </>
          ),
          price: resData[i].totalPrice
        }
        specific.columns[4].cards.push(d)
      }
    }

    setBoard(specific)
  };

  const handleChangeStatus = async (record, status) => {
    const res = await orderApi.changeStatusOrderById(record._id, status);
    console.log(res);
    await getData();
  };

  const handleDelete = async (id) => {
    console.log(id);
    const res = await orderApi.deleteOrderById(id);
    // const resStatus = await locatorApi.setStatusById(id, "free");
    console.log(res);
    await getData();
  };

  const columnsRow = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Loại",
      dataIndex: "typeName",
      key: "typeName",
      sorter: (a, b) => a.typeName.length - b.typeName.length,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price?.length - b.price?.length,
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount?.length - b.amount?.length,
    },
    {
      title: "Thành tiền",
      dataIndex: "totalProduct",
      key: "totalProduct",
      sorter: (a, b) => a.totalProduct?.length - b.totalProduct?.length,
    },
  ];

  const columns = [
    {
      title: "Tên khách hàng",
      dataIndex: "user",
      sorter: (a, b) => a.user?.length - b.user?.length,
      ...getColumnSearchProps("user"),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email?.length - b.email?.length,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      sorter: (a, b) => a.total?.length - b.total?.length,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      filters: [
        {
          text: "Chưa xử lý",
          value: "Not processed",
        },
        {
          text: "Đã xác nhận",
          value: "Processing",
        },
        {
          text: "Đang vận chuyển",
          value: "Shipped",
        },
        {
          text: "Đã giao hàng",
          value: "Delivered",
        },
        {
          text: "Đã hủy",
          value: "Cancelled",
        },
      ],
      onFilter: (value, record) => record.status === value,
      sorter: (a, b) => a.status?.length - b.status?.length,
      render: (status) => {
        let color;
        let valueVN;
        switch (status) {
          case "Not processed":
            color = "red";
            valueVN = "Chưa xử lý";
            break;
          case "Processing":
            color = "orange";
            valueVN = "Đã xác nhận";
            break;
          case "Shipped":
            color = "blue";
            valueVN = "Đang vận chuyển";
            break;
          case "Delivered":
            color = "green";
            valueVN = "Đã giao hàng";
            break;
          case "Cancelled":
            color = "grey";
            valueVN = "Đã hủy";
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
              onFill(data.filter((item) => item._id === record._id));
              showModal("Sửa thông tin");
            }}
          >
            <FiEdit style={{ color: "green", fontSize: "18px" }} />
          </a>
          <a
            onClick={() => handleChangeStatus(record, "Not processed")}
          >
            <FcProcess style={{ color: "green", fontSize: "18px" }} />
          </a>
          <a
            onClick={() => handleChangeStatus(record, "Processing")}
          >
            <BsCheckCircle style={{ color: "green", fontSize: "18px" }} />
          </a>

          <a
            onClick={() => handleChangeStatus(record, "Shipped")}
          >
            <FaShippingFast style={{ color: "green", fontSize: "18px" }} />
          </a>
          <a
            onClick={() => handleChangeStatus(record, "Delivered")}
            title={"Xác nhận nhận hàng"}
          >
            <FcShipped style={{ color: "green", fontSize: "18px" }} />
          </a>
          {/* <Popconfirm
            title="Xác nhận thanh toán?"
            onConfirm={() => handleChangeStatus(record, "paid")}
          >
            <a>
              <DollarOutlined style={{ color: "green", fontSize: "18px" }} />
            </a>
          </Popconfirm> */}
          <Popconfirm
            title="Bạn có muốn hủy đơn?"
            onConfirm={() => handleChangeStatus(record, "Cancelled")}
          >
            <a>
              <FcCancel color={"red"} size={"20px"} />
            </a>
          </Popconfirm>
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
  const columnsOrderDetail = [
    {
      title: "Tên sản phẩm",
      dataIndex: "product",
      key: 'name',
      sorter: (a, b) => a.name?.length - b.name?.length,
      render: item => item.name,
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
    }
  ];

  function onChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
    setPagination(pagination);
  }

  const changeStatusInBoard = async (board, card, source, destination) => {
    const res = await orderApi.changeStatusOrderById(card.id, destination.toColumnId);
    await getData();
  }


  return (
    <>
      <div>
        <Button
          type="primary"
          onClick={() => {
            form.resetFields();
            setDataMenu([]);
            showModal("Thêm đơn");
          }}
          style={{ marginBottom: "16px" }}
        >
          Thêm sản phẩm
        </Button>
        <Button
          type="primary"
          onClick={() => {
            if (displayType === 'board') {
              setDisplayType("table");
            } else {
              setDisplayType("board");
            }
          }}
          style={{ marginBottom: "16px" }}
        >
          {displayType === 'board' ? 'Hiển thị bảng' : 'Hiển thị lưới'}
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
          >
            {/* <Form.Item
              name={"isOrderTable"}
              label=""
              rules={[{ required: false }]}
            >
              <Checkbox onChange={(e) => onChangeCheckBoxOrderTable(e)}>
                Khách hàng đã đặt bàn trước
              </Checkbox>
            </Form.Item> */}
            {/* <Form.Item
              name={"email"}
              label="Email khách hàng"
            >
              <Input disabled={true} />
            </Form.Item>
            <Form.Item
              name={"created"}
              label="Thời gian đặt hàng"
            >
              
              <Input disabled={true} />
            </Form.Item> */}
            <Descriptions title="Thông tin đơn hàng " bordered>
              <Descriptions.Item label="Họ tên khách hàng">{orderDetail.user}</Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>
                {orderDetail.email}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian đặt hàng">{orderDetail.created}</Descriptions.Item>
              <Descriptions.Item label="Thời gian chỉnh sửa" span={2}>
                {orderDetail.updated}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" span={3}>
                <Tag color={ORDER_STATUS.get(orderDetail.status || "")?.color} key={orderDetail.status}>
                  {ORDER_STATUS.get(orderDetail.status || "")?.valueVN}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền hàng">{orderDetail.total}</Descriptions.Item>
              <Descriptions.Item label="Giảm giá">0d</Descriptions.Item>
              <Descriptions.Item label="Thành tiền">{orderDetail.total}</Descriptions.Item>
              {/* <Descriptions.Item label="Chi tiết">
                
              </Descriptions.Item> */}
            </Descriptions>
            <br />
            <Table
              columns={columnsOrderDetail}
              dataSource={orderDetail?.cart?.products}
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
                      "Sản phẩm" +
                      (dataMenu.length > 1 ? " " + (index + 1) : "")
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
            {orderDetail.status === "Not processed" &&
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button htmlType="button" onClick={() => addMenu()}>
                  Thêm sản phẩm
                </Button>
              </Form.Item>
            }
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        {displayType === "table" &&
          <Table
            columns={columns}
            dataSource={data}
            onChange={onChange}
            pagination={pagination}
            loading={loading}
          // expandable={{
          //   expandedRowRender: (record) => {
          //     let dataSourceRow = record.order.map((item, index) => {
          //       return {
          //         ...item.product,
          //         amount: item.amount,
          //         totalProduct: item.amount * item.product.price,
          //         key: index,
          //         typeName: item.product.type.name,
          //       };
          //     });
          //     return <Table columns={columnsRow} dataSource={dataSourceRow} />;
          //   },
          //   rowExpandable: (record) => record.name !== "Not Expandable",
          // }}
          />}
        {displayType === "board" &&
          <Board initialBoard={controlledBoard} disableColumnDrag
            onCardDragEnd={(board, card, source, destination) => {
              changeStatusInBoard(board, card, source, destination)
            }
            }
            // renderCard={({ card, cardBag }, { removeCard, dragging }) => (
            //   <div dragging={dragging.toString()}>
            //     {card}
            //     {/* <button type="button" onClick={removeCard}>Remove Card</button> */}
            //   </div>
            // )}
          />

        }
      </div>
    </>
  );
}

OrderManager.propTypes = {};

export default OrderManager;
