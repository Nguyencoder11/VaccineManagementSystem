import { axios } from "./Vaccine.api";
import dayjs from "dayjs";

export class VaccineScheduleApi {
  static vaccineSchedules = (data) => {
    return axios({
      method: "POST",
      url: `/api/vaccine-schedule/all/find-all`,
      data: data,
    });
  };
  /**
   * Tìm kiếm vaccine schedules với bộ lọc nâng cao.
   * @param {Object} filters Bộ lọc tìm kiếm và phân trang.
   * @returns {Promise} Axios Promise
   */
  static findByFilters = (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append("page", filters.page - 1);
    if (filters.size) params.append("size", filters.size);
    if (filters.vaccineName) params.append("vaccineName", filters.vaccineName);
    if (filters.centerName) params.append("centerName", filters.centerName);
    if (filters.status) params.append("status", filters.status);
    
    // Format ngày tháng theo định dạng ISO cho LocalDate
    if (filters.startDate) {
        params.append("fromDate", dayjs(filters.startDate).format("YYYY-MM-DD"));
    }
    if (filters.endDate) {
        params.append("toDate", dayjs(filters.endDate).format("YYYY-MM-DD"));
    }
    
    // Log để debug
    console.log("Search params:", params.toString());
    
    return axios({
        method: "GET",
        url: `/api/vaccine-schedule/search-advanced?${params.toString()}`,
    })
    .then((response) => response.data)
    .catch((error) => {
        console.error("Error fetching vaccine schedules:", error);
        throw error;
    });
};
}
