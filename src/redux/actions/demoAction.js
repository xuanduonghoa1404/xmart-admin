const getting = () => ({
  type: "GETTING",
});
const getSuccess = (data) => ({
  type: "GET_SUCCESS",
  data,
});
const getFailed = () => ({
  type: "GET_FAILED",
});
export const getAsync = () => {
  return async (dispatch) => {
    dispatch(getting());
    try {
      //Lấy dữ liệu
      dispatch(getSuccess(data));
    } catch (err) {
      dispatch(getFailed());
    }
  };
};
