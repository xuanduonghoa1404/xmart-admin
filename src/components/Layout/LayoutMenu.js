import React, { useState } from "react";
import PropTypes from "prop-types";
import "./LayoutMenu.css";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as Logo } from "../../assets/images/fashionpng.svg";
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Button } from "antd";
import {
  ScheduleOutlined,
  HomeOutlined,
  BarsOutlined,
  TeamOutlined,
  UserOutlined,
  TableOutlined,
  ImportOutlined,
  ExportOutlined,
  ExperimentOutlined,
  PercentageOutlined,
  TagsOutlined,
  ShopOutlined,
  MenuOutlined,
  DatabaseOutlined,
  ProfileOutlined,
  AntDesignOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { IconMap } from "antd/lib/result";
import { Link } from "react-router-dom";
import { logoutAction } from "../../redux/actions/authAction";
import jwt from "jsonwebtoken";
import logo from "../../assets/images/Screenshot2.png";
import logoFull from "../../assets/images/Screenshot1.png";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function LayoutMenu(props) {
  const { children } = props;
  const [collapsed, setCollapsed] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const onCollapse = (collapsed) => {
    console.log(collapsed);
    setCollapsed(collapsed);
  };

  const dispatch = useDispatch();

  const menu = (
    <Menu>
      <Menu.Item>{jwt.decode(localStorage.getItem("token")).email}</Menu.Item>
      <Menu.Item onClick={() => dispatch(logoutAction())}>Đăng xuất</Menu.Item>
    </Menu>
  );
  const name = jwt.decode(localStorage.getItem("token")).name;
  const role = jwt.decode(localStorage.getItem("token")).role;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        {/* <div className='logo' /> */}
        <div
          className="logo"
          style={collapsed ? { padding: "4px" } : { padding: "4px" }}
        >
          {/* <Logo height={collapsed ? "50px" : "100px"} /> */}
          <img
            src={
              collapsed
                ? "https://res.cloudinary.com/hoaduonghx/image/upload/v1669541451/image/wsf2f8vtuxfdcuzpmxpg.png"
                : "https://res.cloudinary.com/hoaduonghx/image/upload/v1669542110/image/yhoyntyb7v44rcecmxha.png"
            }
            height={"40px"}
          />
        </div>
        <Menu theme="dark" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">Trang chủ</Link>
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<ScheduleOutlined />}
            disabled={role == "inventoryManager" ? true : false}
          >
            <Link to="/order">Đơn hàng</Link>
          </Menu.Item>
          <SubMenu key="sub3" icon={<MenuOutlined />} title="Sản phẩm">
            <Menu.Item key="3" icon={<ProfileOutlined />}>
              <Link to="/product">Danh mục sản phẩm</Link>
            </Menu.Item>
            <Menu.Item key="10" icon={<TagsOutlined />}>
              <Link to="/typeProduct">Loại sản phẩm</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub30" icon={<PercentageOutlined />} title="Khuyến mại">
            <Menu.Item key="30" icon={<PercentageOutlined />}>
              <Link to="/marketing">Khuyến mại</Link>
            </Menu.Item>
            <Menu.Item key="100" icon={<AntDesignOutlined />}>
              <Link to="/design">Thiết kế</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub1"
            icon={<DatabaseOutlined />}
            title="Kho"
            disabled={role == "cashier" ? true : false}
          >
            <Menu.Item key="4" icon={<BarsOutlined />}>
              <Link to="/inventory">Hàng trong kho</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<ImportOutlined />}>
              <Link to="/inventory/import">Nhập kho</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="37" icon={<ShopOutlined />}>
            <Link to="/store/locator">Cửa hàng</Link>
          </Menu.Item>
          {/* <SubMenu key="sub2" icon={<ShopOutlined />} title="Cửa hàng">
            <Menu.Item key="7" icon={<TableOutlined />}>
              <Link to="/store/locator">Chi nhánh</Link>
            </Menu.Item>
            <Menu.Item key="102" icon={<ExperimentOutlined />}>
              <Link to="/store/shop">Cấu hình</Link>
            </Menu.Item>
          </SubMenu> */}
          <Menu.Item
            key="8"
            icon={<TeamOutlined />}
            disabled={role == "admin" ? false : true}
          >
            <Link to="/member">Thành viên</Link>
          </Menu.Item>
          <Menu.Item key="9" icon={<UserOutlined />}>
            <Link to="/account">Tài khoản</Link>
          </Menu.Item>
          <Menu.Item key="911" icon={<ShoppingCartOutlined />}>
            <a href="https://xmart-store-front.vercel.app/" target={"_blank"}>
              Trang đặt hàng
            </a>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="header">
          <div className="header-avatar">
            <Dropdown overlay={menu} placement="bottomRight" arrow>
              <Button
                shape="circle"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                icon={<UserOutlined />}
              ></Button>
            </Dropdown>
          </div>
          <div className="header-name">{name}</div>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}></Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360, height: "100%" }}
          >
            {children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            color: "#ffffff",
            backgroundColor: "#333333",
          }}
        >
          QUẢN LÝ CHUỖI CỬA HÀNG X MART
        </Footer>
      </Layout>
    </Layout>
  );
}

LayoutMenu.propTypes = {};

export default LayoutMenu;
