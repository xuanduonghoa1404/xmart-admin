import axiosClient from "./axiosClient";
import { notification } from "antd";

const locatorApi = {
  getAllLocator: async () => {
    try {
      const response = await axiosClient.get(`api/locator`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  deleteLocatorById: async (id) => {
    try {
      const response = await axiosClient.delete(`api/locator/${id}`);
      notification.success({ message: "Xóa thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  editLocatorById: async (id, data) => {
    try {
      const response = await axiosClient.patch(`api/locator/${id}`, data);
      notification.success({ message: "Sửa thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  createLocator: async (data) => {
    try {
      const response = await axiosClient.post(`api/locator`, data);
      notification.success({ message: "Thêm bàn thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  setStatusById: async (id, data) => {
    try {
      const response = await axiosClient.patch(
        `api/locator/status/${data}/${id}`
      );
      notification.success({ message: "Thay đổi trạng thái thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default locatorApi;
