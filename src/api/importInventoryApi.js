import axiosClient from "./axiosClient";
import { notification } from "antd";

const importInventoryProductApi = {
  getAllImportInventory: async () => {
    try {
      const response = await axiosClient.get(`api/importInventory`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  deleteImportInventoryById: async (id) => {
    try {
      const response = await axiosClient.delete(`api/importInventory/${id}`);
      notification.success({ message: "Xóa thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  editImportInventoryById: async (id, data) => {
    try {
      const response = await axiosClient.patch(`api/importInventory/${id}`, data);
      notification.success({ message: "Sửa thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  createImportInventory: async (data) => {
    try {
      const response = await axiosClient.post(`api/importInventory`, data);
      notification.success({ message: "Nhập kho thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default importInventoryProductApi;
