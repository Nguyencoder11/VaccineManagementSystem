import { axios } from "./Vaccine.api";
export class ManufacturerApi {
  static manufacturers = (data) => {
    return axios({
      method: "POST",
      url: `/api/manufacturer/find-all`,
      data: data,
    });
  };
}
