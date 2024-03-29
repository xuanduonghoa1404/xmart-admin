import axiosClient from "./axiosClient";
import { notification } from "antd";

const orderApi = {
  getAllOrder: async () => {
    try {
      const response = await axiosClient.get(`api/order`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  deleteOrderById: async (id) => {
    try {
      const response = await axiosClient.delete(`api/order/${id}`);
      notification.success({ message: "Xóa thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  getOrderById: async (id) => {
    try {
      const response = await axiosClient.get(`api/order/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  editOrderById: async (id, data) => {
    try {
      const response = await axiosClient.patch(`api/order/${id}`, data);
      notification.success({ message: "Sửa thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  createOrder: async (data) => {
    try {
      const response = await axiosClient.post(`api/order`, data);
      notification.success({ message: "Thêm đơn thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  createOrderEmail: async (data) => {
    try {
      const response = await axiosClient.post(`api/orderemail`, data);
      notification.success({ message: "Thêm đơn thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  changeStatusOrderById: async (id, data) => {
    try {
      const response = await axiosClient.patch(
        `api/order/${id}/status/${data}`
      );
      notification.success({
        message: "Thay đổi trạng thái đơn hàng thành công!",
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  shippingOrderById: async (id, data) => {
    try {
      const response = await axiosClient.patch(`api/order-ship/${id}`, {
        locator: data,
      });
      notification.success({
        message: "Chọn cửa hàng vận chuyển thành công!",
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default orderApi;
