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
        error: error?.response?.data?.message || "Something broke",
      };
    }
  }

  static async googleLogin() {
    return (window.location.href = `${base_url}/google`);
  }
  static async githubLogin() {
    return (window.location.href = `${base_url}/github`);
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
      if (error.code === "ERR_NETWORK") {
        return {
          data: null,
          error: "Request timed out. Please try again later.",
          serverError: true,
        };
      }
      return {
        data: null,
        unauthorized: error?.response?.status == 401 ? true : false,
        error: error?.response?.data?.message || "Something broke",
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
