import Axios from "axios";
var BASE_URL = "http://localhost:8080";

export const axios = Axios.create({
  baseURL: BASE_URL,
  timeout: 300000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export class VaccineApi {
  static vaccines = (data) => {
    return axios({
      method: "POST",
      url: `/api/vaccine/list`,
      data: data,
    });
  };

  static createVaccine = (data) => {
    return axios({
      method: "POST",
      url: `/api/vaccine/create`,
      data: data,
    });
  };
  static updateVaccine = (data) => {
    return axios({
      method: "POST",
      url: `/api/vaccine/update`,
      data: data,
    });
  };
  static detailVaccine = (data) => {
    return axios({
      method: "POST",
      url: `/api/vaccine/detail`,
      data: data,
    });
  };
  static deleteVaccine = (data) => {
    return axios({
      method: "POST",
      url: `/api/vaccine/delete`,
      data: data,
    });
  };
  static importVaccine = (data) => {
    return axios({
      method: "POST",
      url: `/api/vaccine/import`,
      data: data,
    });
  };
  static plusVaccine = (data) => {
    return axios({
      method: "POST",
      url: `/api/vaccine/plus`,
      data: data,
    });
  };
}
