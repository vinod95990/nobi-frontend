import axios from "axios";

// const tag_base_url = "http://localhost:8081/tag";
const tag_base_url = "https://nobi-backend.vercel.app/tag";

export default class TagServices {
  static CREATE_TAG = `${tag_base_url}/createTag`;
  static DELETE_TAG = `${tag_base_url}/deleteTag`;
  static UPDATE_TAG = `${tag_base_url}/updateTag`;

  static async getAllTags() {
    try {
      const res = await axios.get(`${tag_base_url}/getAllTags`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return {
        data: res.data?.data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error:
          error?.response?.data?.message ||
          "Oops! Something went wrong while getting tags. Please try again later.",
        unauthorized: error?.response?.status == 401 ? true : false,
      };
    }
  }

  static async createTag(payload) {
    try {
      const res = await axios.post(this.CREATE_TAG, payload, {
        withCredentials: true,
      });
      return {
        data: res.data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error:
          error?.response?.data?.message ||
          "Oops! Something went wrong while creating tag. Please try again later.",
        unauthorized: error?.response?.status == 401 ? true : false,
      };
    }
  }

  static async updateTag(payload) {
    const { newName, tagId } = payload;

    try {
      const res = await axios.patch(
        this.UPDATE_TAG,
        { newName, tagId },
        {
          withCredentials: true,
        }
      );

      return {
        data: res.data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error:
          error?.response?.data?.message ||
          "Oops! Something went wrong while updating tag. Please try again later.",
        unauthorized: error?.response?.status == 401 ? true : false,
      };
    }
  }

  static async deleteTag(payload) {
    const { tagId } = payload;

    try {
      const res = await axios.delete(this.DELETE_TAG, {
        params: {
          tagId,
        },
        withCredentials: true,
      });

      return {
        data: res.data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error:
          error?.response?.data?.message ||
          "Oops! Something went wrong while deleting tag. Please try again later.",
        unauthorized: error?.response?.status == 401 ? true : false,
      };
    }
  }
}
