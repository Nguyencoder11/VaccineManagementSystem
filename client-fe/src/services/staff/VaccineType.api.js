import { axios } from "./Vaccine.api";
export class VaccineTypeApi {
  static vaccineTypes = () => {
    return axios({
      method: "GET",
      url: `/api/vaccine-type/find-all`,
    });
  };
}
