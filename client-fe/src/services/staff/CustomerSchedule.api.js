import { axios } from "./Vaccine.api";

export class CustomerScheduleApi {
  static customerSchedules = (data) => {
    console.log("Dữ liệu gửi lên server:", data);
    return axios({
      method: "POST",
      url: `/api/customer-schedule/customer/list`,
      data: data,
    });
  };

  static createCustomerSchedule = (data) => {
    return axios({
      method: "POST",
      url: `/api/customer-schedule/customer/create-guest`,
      data: data,
    });
  };


  static approveCustomerSchedule = (data) => {
    return axios({
      method: "POST",
      url: `/api/customer-schedule/customer/approve`,
      data: data,
    });
  };

  static createCustomerFindByIdSchedule = (data) => {
    return axios({
      method: "POST",
      url: `/api/customer-schedule/customer/create-customer-findById-schedule`,
      data: data,
    });
  };

  static UpdateCustomerSchedule = (data) => {
    return axios({
      method: "POST",
      url: `/api/customer-schedule/customer/update-customer-schedule`,
      data: data,
    });
  };

//   static sendRefundEmail = (id) => {
//     return axios({
//         method: "POST",
//         url: `/api/customer-schedule/customer/refund-email`,
//         data: { id: id }, // Truyền tham số qua body
//     });
// };
  
}
