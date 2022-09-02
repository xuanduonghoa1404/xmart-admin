import axiosClient from "./axiosClient";
import { notification } from "antd";

const marketingApi = {
  getAllMarketing: async () => {
    try {
      const response = await axiosClient.get(`api/marketing`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  deleteMarketingById: async (id) => {
    try {
      const response = await axiosClient.delete(`api/marketing/${id}`);
      notification.success({ message: "Xóa thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  editMarketingById: async (id, data) => {
    try {
      const response = await axiosClient.patch(`api/marketing/${id}`, data);
      notification.success({ message: "Sửa thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  createMarketing: async (data) => {
    try {
      const response = await axiosClient.post(`api/marketing`, data);
      notification.success({ message: "Thêm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  // importProduct: async (data) => {
  //   try {
  //     const response = await axiosClient.post(`api/import-product`, data);
  //     notification.success({ message: "Import sản phẩm thành công!" });
  //     return response;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
};

export default marketingApi;
