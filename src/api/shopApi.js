import axiosClient from "./axiosClient";
import { notification } from "antd";

const shopApi = {
  getShop: async () => {
    try {
      const response = await axiosClient.get(`api/shop`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  editShopById: async (id, data) => {
    try {
      const response = await axiosClient.patch(`api/shop/${id}`, data);
      notification.success({ message: "Sửa thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  
};

export default shopApi;
