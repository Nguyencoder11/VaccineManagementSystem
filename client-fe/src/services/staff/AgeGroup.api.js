import { axios } from "./Vaccine.api";
export class AgeGroupApi {
  static ageGroups = (data) => {
    return axios({
      method: "POST",
      url: `/api/age-group/find-all`,
      data: data,
    });
  };
}
