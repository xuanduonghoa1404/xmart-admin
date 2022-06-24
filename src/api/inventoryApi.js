import axiosClient from "./axiosClient";
import { notification } from "antd";

const inventoryApi = {
  getAllInventory: async () => {
    try {
      const response = await axiosClient.get(`api/inventory`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  getInventoryInput: async () => {
    try {
      const response = await axiosClient.get(`api/inventoryInput`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  getInventoryOutput: async () => {
    try {
      const response = await axiosClient.get(`api/inventoryOutput`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  deleteInventoryById: async (id) => {
    try {
      const response = await axiosClient.delete(`api/inventory/${id}`);
      notification.success({ message: "Xóa thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  editInventoryById: async (id, data) => {
    try {
      const response = await axiosClient.patch(`api/updateImportInventory/${id}`, data);
      notification.success({ message: "Sửa thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  createInventoryInput: async (data) => {
    try {
      const response = await axiosClient.post(`api/importInventory`, data);
      notification.success({ message: "Thêm sản phẩm thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  createInventoryOutput: async (data) => {
    try {
      const response = await axiosClient.post(`api/exportInventory`, data);
      notification.success({ message: "Xóa thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default inventoryApi;
