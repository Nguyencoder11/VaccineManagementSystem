import { axios } from "./Vaccine.api";

export class VaccineInventoryApi {
  static vaccineInventorys = (data) => {
    return axios({
      method: "POST",
      url: `/api/vaccine-inventory/list`,
      data: data,
    });
  };

  static detailVaccineInventory = (data) => {
    return axios({
      method: "POST",
      url: `/api/vaccine-inventory/detail`,
      data: data,
    });
  };
  static deleteVaccineInventory = (data) => {
    return axios({
      method: "POST",
      url: `/api/vaccine-inventory/delete`,
      data: data,
    });
  };
  static importVaccineInventory = (data) => {
    return axios({
      method: "POST",
      url: `/api/vaccine-inventory/import`,
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
      data: data,
    });
  };
}
