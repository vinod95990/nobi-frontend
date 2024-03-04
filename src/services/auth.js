import axios from "axios";
// const base_url = "https://nobi-backend.vercel.app";

const base_url = "http://localhost:8081";

export default class AuthService {
  static async signup(payload) {
    const { userName, emailId, password } = payload;

    try {
      const res = await axios.post(`${base_url}/user/signup`, payload, {
        withCredentials: true,
      });
      return {
        data: res.data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error.response.data.message || "signup error",
      };
    }
  }

  static async login(payload) {
    try {
      const res = await axios.post(`${base_url}/user/login`, payload, {
        withCredentials: true,
      });

      const { data } = res;
      return {
        data: data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        unauthorized: error?.response?.status == 401 ? true : false,
        error: error?.response?.data?.message || "Somethiunbg broke",
      };
    }
  }
  static async me() {
    try {
      const res = await axios.get(`${base_url}/user/me`, {
        withCredentials: true,
      });

      return {
        data: res.data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        unauthorized: error?.response?.status == 401 ? true : false,
        error: error?.response?.data?.message || "Somethiunbg broke",
      };
    }
  }

  static async logout() {
    try {
      const res = await axios.get(`${base_url}/user/logout`, {
        withCredentials: true,
      });
      return {
        data: res.data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        unauthorized: error?.response?.status == 401 ? true : false,
        error: error?.response?.data?.message || "Something broke",
      };
    }
  }
}
