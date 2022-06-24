import axiosClient from "./axiosClient";
import { notification } from "antd";

const exportInventoryProductApi = {
  getAllExportInventory: async () => {
    try {
      const response = await axiosClient.get(`api/exportInventory`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  deleteExportInventoryById: async (id) => {
    try {
      const response = await axiosClient.delete(`api/exportInventory/${id}`);
      notification.success({ message: "Xóa thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  editExportInventoryById: async (id, data) => {
    try {
      const response = await axiosClient.patch(`api/exportInventory/${id}`, data);
      notification.success({ message: "Sửa thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  createExportInventory: async (data) => {
    try {
      const response = await axiosClient.post(`api/exportInventory`, data);
      notification.success({ message: "Xuất sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default exportInventoryProductApi;
