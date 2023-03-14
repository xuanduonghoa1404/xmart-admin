import axiosClient from "./axiosClient";
import { notification } from "antd";

const homeApi = {
  getStatistic: async (begin, end, locator) => {
    try {
      const response = await axiosClient.get(
        `api/statistic?begin=${begin}&end=${end}&locator=${
          locator && locator !== "All" ? locator : null
        }`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  getStatisticProduct: async (locator) => {
    try {
      const response = await axiosClient.get(
        `api/statistic/product?locator=${
          locator && locator !== "all" ? locator : null
        }`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  getStatisticOrder: async (locator) => {
    try {
      const response = await axiosClient.get(
        `api/statistic/order?locator=${
          locator && locator !== "all" ? locator : null
        }`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  getStatisticNumberOrder: async (begin, end, locator) => {
    try {
      const response = await axiosClient.get(
        `api/statistic-number-order?begin=${begin}&end=${end}&locator=${
          locator && locator !== "all" ? locator : null
        }`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default homeApi;
