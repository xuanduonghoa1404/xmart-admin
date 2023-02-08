import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Row, Col, ConfigProvider, DatePicker, Space, Statistic } from "antd";
import { useState } from "react";
import homeApi from "../../api/homeApi";

import moment from "moment";
import "moment/locale/vi";
import locale from "antd/lib/locale/vi_VN";
import { Bar, Line } from "react-chartjs-2";
import { FiUserCheck, FiUserPlus, FiUsers } from "react-icons/fi";
import { FaRegListAlt, FaShippingFast } from "react-icons/fa";
import { FcCancel, FcProcess, FcShipped } from "react-icons/fc";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiListPlus } from "react-icons/bi";
import { BsCheckCircle } from "react-icons/bs";
import NumberCard from "./NumberCard";

const { RangePicker } = DatePicker;

function Home(props) {
  const [value, setValue] = useState([]);
  const [valueProduct, setValueProduct] = useState([]);
  const [valueOrder, setValueOrder] = useState([]);
  const [valueNumberOrder, setValueNumberOrder] = useState([]);
  const [numberOfOrderNew, setNumberOfOrderNew] = useState(0);
  const [numberOfOrderNotProcess, setNumberOfOrderNotProcess] = useState(0);
  const [numberOfOrderNotShipping, setNumberOfOrderNotShipping] = useState(0);
  const [numberOfOrderShipping, setNumberOfOrderShipping] = useState(0);
  const [numberOfOrder, setNumberOfOrder] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      let resProduct = await homeApi.getStatisticProduct();
      let resOrder = await homeApi.getStatisticOrder();
      let resNumberOrder = await homeApi.getStatisticNumberOrder();
      setValueProduct(resProduct);
      setValueOrder(resOrder);
      setValueNumberOrder(resNumberOrder);
      let orderNotProcess = resOrder.filter(o => o.status === 'Not processed')
      let orderNotShipping = resOrder.filter(o => o.status === 'Processing')
      let orderShipping = resOrder.filter(o => o.status === 'Shipped')
      let orderNew = resOrder
      setNumberOfOrderNotProcess(orderNotProcess.length);
      setNumberOfOrderNotShipping(orderNotShipping.length);
      setNumberOfOrderShipping(orderShipping.length);
      setNumberOfOrderNew(orderNew.length);
      setNumberOfOrder(resOrder.length);
    }
    loadData();
  }, []);

  const handleSuccess = (res) => {
    console.log(res);
  };

  async function onChange(value, dateString) {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
    let res = await homeApi.getStatistic(
      value[0].valueOf(),
      value[1].valueOf()
    );
    console.log(res);
    setValue(res);
  }

  function onOk(value) {
    console.log("onOk: ", value);
  }

  const dataBar = {
    labels: valueProduct.map((item, index) => item.name),
    datasets: [
      {
        label: "Tổng số sản phẩm bán từng đơn hàng",
        fill: false,
        // lineTension: 0.1,
        backgroundColor: "green",
        borderColor: "green",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "green",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "green",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: valueProduct.map((item) => item.total),
      },
    ],
  };

  const data = {
    labels: value.map((item, index) =>
      moment(item.time).format("DD-MM-YYYY HH:mm:ss")
    ),
    datasets: [
      {
        label: "Giá tiền theo từng đơn hàng",
        fill: false,
        // lineTension: 0.1,
        backgroundColor: "blue",
        borderColor: "blue",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "blue",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "blue",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: value.map((item) => item.totalPrice),
      },
    ],
  };

  const options = {
    title: {
      display: true,
      text: "Chart Title"
    },
    scales: {
      yAxes: [
        {
          ticks: {
            suggestedMin: 0,
            // suggestedMax: 500,
            stepSize: 10
          }
        }
      ]
    }
  };

  const dataNumberOfOrder = {
    labels: valueNumberOrder.map((item, index) =>
      moment(item.date).format("DD-MM-YYYY")
    ),
    datasets: [
      {
        label: "Số đơn hàng theo ngày",
        fill: false,
        // lineTension: 0.1,
        backgroundColor: "blue",
        borderColor: "blue",
        // borderCapStyle: "butt",
        // borderDash: [],
        // borderDashOffset: 0.0,
        // borderJoinStyle: "miter",
        pointBorderColor: "blue",
        pointBackgroundColor: "#fff",
        // pointBorderWidth: 1,
        // pointHoverRadius: 5,
        pointHoverBackgroundColor: "blue",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        // pointHoverBorderWidth: 2,
        // pointRadius: 1,
        // pointHitRadius: 10,
        data: valueNumberOrder.map((item) => item.total),
      },
    ],
  };
  const config = {
    dataNumberOfOrder,
    padding: "auto",
    xField: "date",
    yField: "total",
    annotations: [
      // 低于中位数颜色变化
      {
        type: "regionFilter",
        start: ["min", "median"],
        end: ["max", "0"],
        color: "#F4664A",
      },
      {
        type: "text",
        position: ["min", "median"],
        content: "中位数",
        offsetY: -4,
        style: {
          textBaseline: "bottom",
        },
      },
      {
        type: "line",
        start: ["min", "median"],
        end: ["max", "median"],
        style: {
          stroke: "#F4664A",
          lineDash: [2, 2],
        },
      },
    ],
  };
  return (
    <div>
      <Row gutter={16}>
        <Col span={4}>
          <NumberCard
            number={numberOfOrderNew}
            icon={<BiListPlus style={{ color: "green" }} />}
            title={"Đơn hàng mới"}
          />
        </Col>
        <Col span={4}>
          <NumberCard
            number={numberOfOrderNotProcess}
            icon={<FcProcess />}
            title={"Chưa xử lý"}
          />
        </Col>
        <Col span={5}>
          <NumberCard
            number={numberOfOrderNotShipping}
            icon={<BsCheckCircle style={{ color: "orange" }} />}
            title={"Chưa vận chuyển"}
          />
        </Col>
        <Col span={5}>
          <NumberCard
            number={numberOfOrderShipping}
            icon={<FaShippingFast style={{ color: "green" }} />}
            title={"Đang vận chuyển"}
          />
        </Col>
        <Col span={4}>
          <NumberCard
            number={numberOfOrder}
            icon={<FaRegListAlt style={{ color: "blue" }} />}
            title={"Tổng số đơn"}
          />
        </Col>
        {/* <Col span={4}>
          <NumberCard number={numberOfOrderNew} icon={<FiUserPlus style={{ color: "green" }}/>} title={"Số khách mới"} />
        </Col>
        <Col span={4}>
          <NumberCard number={numberOfOrderNotProcess} icon={<FiUsers style={{ color: "blue" }}/>} title={"Tổng số khách"} />
        </Col> */}
      </Row>
      {/* <Row gutter={16}>
        <Col span={4}>
          <Statistic title="Đơn hàng mới" value={numberOfOrderNew} prefix={<BiListPlus />} />
        </Col>
        <Col span={4}>
          <Statistic title="Đơn hàng chưa xử lý" value={numberOfOrderNotProcess} prefix={<FcProcess />} />
        </Col>
        <Col span={4}>
          <Statistic title="Đơn hàng chưa vận chuyển" value={numberOfOrderNotShipping} prefix={<BsCheckCircle style={{ color: "orange" }} />} />
        </Col>
        <Col span={4}>
          <Statistic title="Đơn hàng đang vận chuyển" value={numberOfOrderShipping} prefix={<FaShippingFast style={{ color: "green" }} />} />
        </Col>
        <Col span={4}>
          <Statistic title="Tổng số đơn" value={numberOfOrder} prefix={<FaRegListAlt style={{ color: "green" }} />} />
        </Col>
      </Row> */}
      <br />
      <Row gutter={16}>
        {/* <Col span={6}>
          <Statistic title="Tổng số khách hàng" value={1128} prefix={<FiUsers />} />
        </Col>
        <Col span={6}>
          <Statistic title="Số khách hàng mới" value={1128} prefix={<FiUserPlus />} />
        </Col> */}
        {/* <Col span={6}>
          <Statistic title="Số khách hàng hoạt động" value={1128} prefix={<FiUserCheck />} />
        </Col> */}
      </Row>
      <br />
      <Row>
        <Col span={12}>
          <div
            style={{
              backgroundColor: "green",
              // height: "40px",
              borderRadius: "3px",
              padding: "16px",
              marginBottom: "16px",
              fontSize: "16px",
              color: "white",
            }}
          >
            Thống kê tổng giá tiền theo từng đơn hàng
          </div>
        </Col>
      </Row>
      <Row style={{ marginBottom: "16px" }}>
        <Col span={24}>
          <ConfigProvider locale={locale}>
            <RangePicker
              showTime={{ format: "HH:mm:ss" }}
              format="DD-MM-YYYY HH:mm:ss"
              onChange={onChange}
              onOk={onOk}
              ranges={{
                "Hôm nay": [moment().startOf("day"), moment().endOf("day")],
                "Hôm qua": [
                  moment().startOf("day").subtract(1, "day"),
                  moment().endOf("day").subtract(1, "day"),
                ],
                "Tháng này": [
                  moment().startOf("month"),
                  moment().endOf("month"),
                ],
                "Tháng trước": [
                  moment().startOf("month").subtract(1, "month"),
                  moment().endOf("month").subtract(1, "month"),
                ],
              }}
            />
          </ConfigProvider>
        </Col>
      </Row>
      <Row>
        <Col
          span={20}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Line
            data={data}
            // {...config}
            // options={{
            //   responsive: true,
            //   maintainAspectRatio: false,
            // }}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <div
            style={{
              backgroundColor: "green",
              // height: "40px",
              borderRadius: "3px",
              padding: "16px",
              marginBottom: "16px",
              fontSize: "16px",
              color: "white",
            }}
          >
            Thống kê tổng số đơn hàng theo ngày
          </div>
        </Col>
      </Row>
      <Row style={{ marginBottom: "16px" }}>
        <Col span={24}>
          <ConfigProvider locale={locale}>
            <RangePicker
              showTime={{ format: "HH:mm:ss" }}
              format="DD-MM-YYYY HH:mm:ss"
              onChange={onChange}
              onOk={onOk}
              ranges={{
                "Hôm nay": [moment().startOf("day"), moment().endOf("day")],
                "Hôm qua": [
                  moment().startOf("day").subtract(1, "day"),
                  moment().endOf("day").subtract(1, "day"),
                ],
                "Tháng này": [
                  moment().startOf("month"),
                  moment().endOf("month"),
                ],
                "Tháng trước": [
                  moment().startOf("month").subtract(1, "month"),
                  moment().endOf("month").subtract(1, "month"),
                ],
              }}
            />
          </ConfigProvider>
        </Col>
      </Row>
      <Row>
        <Col
          span={20}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Line
            // data={dataNumberOfOrder}
            {...config}
          />
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <div
            style={{
              backgroundColor: "blue",
              // height: "40px",
              borderRadius: "3px",
              padding: "16px",
              margin: "16px",
              fontSize: "16px",
              color: "white",
            }}
          >
            Thống kê tổng số sản phẩm của từng đơn hàng
          </div>
        </Col>
      </Row>
      <Row>
        <Col
          span={20}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bar
            data={dataBar}
            // options={{
            //   responsive: true,
            //   maintainAspectRatio: false,
            // }}
          />
        </Col>
      </Row>
    </div>
  );
}

Home.propTypes = {};

export default Home;
