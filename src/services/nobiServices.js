import axios from "axios";

const base_url = "https://nobi-backend.vercel.app/nobi";
// const base_url = "http://localhost:8081/nobi";

export default class NobiServices {
  static PUSH_TO_RECYCLE_BIN = `${base_url}/pushToRecycleBin`;
  static GET_RECYCLE_BIN_DATA = `${base_url}/getRecycleBinData`;
  static RESTORE_FROM_BIN = `${base_url}/restoreRecycledData`;

  static async getAllFolders(payload) {
    let { type, searchedString } = payload;

    try {
      const res = await axios.get(`${base_url}/getAllFolders`, {
        params: { type: type ? type : "all", searchedString },
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      return {
        data: res.data,
        error: null,
      };
    } catch (error) {
      if (error?.code == "ERR_NETWORK") {
        return {
          data: null,
          error:
            "Error getting data, I guess it's a wind sweeped away the cloud",
        };
      }
      return {
        data: null,
        unauthorized: error?.response?.status == 401 ? true : false,
        error:
          error?.response?.data?.message ||
          "Oops! Something went wrong while fetching data. Please try again later.",
      };
    }
  }

  static async searchQQuery(payload) {
    const { searchedString } = payload;

    try {
      const res = await axios.get(`${base_url}/searchQuery`, {
        withCredentials: true,
        params: {
          searchedString: searchedString,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      return {
        data: res?.data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        unauthorized: error?.response?.status == 401 ? true : false,
        error:
          error?.response?.data?.message ||
          "Oops! Something went wrong while fetching data. Please try again later.",
      };
    }
  }

  static async getFolderDetails(payload) {
    const { folderId = "null", searchedString } = payload;
    try {
      const res = await axios.get(`${base_url}/getFolder`, {
        params: { folderId, searchedString },
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return {
        data: res.data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        unauthorized: error?.response?.status == 401 ? true : false,
        error:
          error?.response?.data?.message ||
          "Oops! Something went wrong while fetching data. Please try again later.",
      };
    }
  }

  static async getRecycleBinData() {
    try {
      const res = await axios.get(this.GET_RECYCLE_BIN_DATA, {
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
          "Oops! Something went wrong while getting from recycle bin. Please try again later.",
        unauthorized: error?.response?.status == 401 ? true : false,
      };
    }
  }

  static async getValidFoldersToMove(payload) {
    const { docId } = payload;
    try {
      const res = await axios.get(`${base_url}/validMoveToFolders`, {
        params: { docId },
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return {
        data: res?.data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        unauthorized: error?.response?.status == 401 ? true : false,
        error:
          error?.response?.data?.message ||
          "Oops! Something went wrong while fetching data. Please try again later.",
      };
    }
  }

  static async moveFolder(payload) {
    const { childId, parentId } = payload;
    try {
      const res = await axios.post(`${base_url}/moveFolder`, null, {
        params: { childId, parentId },
        withCredentials: true,
      });

      return {
        data: res?.data,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error:
          error?.response?.data?.message ||
          "Oops! Something went wrong while adding folder. Please try again later.",
        unauthorized: error?.response?.status == 401 ? true : false,
      };
    }
  }

  static async addFolder(payload) {
    const { parentId = null, name } = payload;

    try {
      const res = await axios.post(`${base_url}/addFolder`, payload, {
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
          "Oops! Something went wrong while adding folder. Please try again later.",
        unauthorized: error?.response?.status == 401 ? true : false,
      };
    }
  }

  static async addLink(payload) {
    const { parentId = null, customName, link } = payload;

    try {
      const res = await axios.post(`${base_url}/addLink`, payload, {
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
          "Oops! Something went wrong while adding link. Please try again later.",
        unauthorized: error?.response?.status == 401 ? true : false,
      };
    }
  }

  static async deleteLink(payload) {
    const { linkId } = payload;
    try {
      const res = await axios.delete(`${base_url}/deleteLink`, {
        params: { linkId },
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
          "Oops! Something went wrong while deleting link. Please try again later.",
        unauthorized: error?.response?.status == 401 ? true : false,
      };
    }
  }

  static async deleteFolder(payload) {
    const { folderId } = payload;
    try {
      const res = await axios.delete(`${base_url}/deleteFolder`, {
        params: { folderId },
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
          "Oops! Something went wrong while deleting folder. Please try again later.r",
        unauthorized: error?.response?.status == 401 ? true : false,
      };
    }
  }

  static async updateFolderName(payload) {
    const { folderId, newName } = payload;
    try {
      const res = await axios.patch(`${base_url}/updateFolderName`, null, {
        params: { folderId, newName },
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
        error:
          error?.response?.data?.message ||
          "Oops! Something went wrong while updating folder. Please try again later.",
      };
    }
  }

  static async updateLinkName(payload) {
    const { linkId, newName } = payload;
    try {
      const res = await axios.patch(`${base_url}/updateLinkName`, null, {
        params: { linkId, newName },
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
        error:
          error?.response?.data?.message ||
          "Oops! Something went wrong while updating link. Please try again later.",
      };
    }
  }

  static async pushToRecycleBin(payload) {
    const { docId } = payload;
    try {
      const res = await axios.patch(this.PUSH_TO_RECYCLE_BIN, null, {
        params: { docId },
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
        error:
          error?.response?.data?.message ||
          "Oops! Something went wrong while deleting. Please try again later.",
      };
    }
  }

  static async restoreFromBin(payload) {
    const { docId } = payload;
    try {
      const res = await axios.patch(this.RESTORE_FROM_BIN, null, {
        params: { docId },
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
        error:
          error?.response?.data?.message ||
          "Oops! Something went wrong while restoring. Please try again later.",
      };
    }
  }

  static async generateSharedFolderToken(payload) {
    const { folderId } = payload;

    try {
      const res = await axios.get(`${base_url}/generateSharedFolderToken`, {
        params: {
          folderId,
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
        unauthorized: error?.response?.status == 401 ? true : false,
        error:
          error?.response?.data?.message ||
          "Oops! Something went wrong. Please try again later.",
      };
    }
  }

  static async decodeSharedFolderToken(payload) {
    const { encodedFolderToken } = payload;
    try {
      const res = await axios.get(`${base_url}/decodeSharedFolderToken`, {
        params: {
          encodedFolderToken,
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
        unauthorized: error?.response?.status == 401 ? true : false,
        error:
          error?.response?.data?.message ||
          "Oops! Something went wrong. Please try again later.",
      };
    }
  }

  static async deleteLink(payload) {
    const { linkId } = payload;
    try {
      const res = await axios.delete(`${base_url}/deleteLink`, {
        params: { linkId },
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
          "Oops! Something went wrong while deleting link. Please try again later.",
        unauthorized: error?.response?.status == 401 ? true : false,
      };
    }
  }

  static async getLinksByTag(payload) {
    const { tagIds } = payload;

    try {
      const res = await axios.get(`${base_url}/getLinksByTags`, {
        params: payload,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
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
          "Oops! Something went wrong while getting links. Please try again later.",
        unauthorized: error?.response?.status == 401 ? true : false,
      };
    }
  }

  static async getLinkTags(payload) {
    const { linkId } = payload;

    try {
      const res = await axios.get(`${base_url}/getLinkTags`, {
        params: { linkId },
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
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
          "Oops! Something went wrong while getting links. Please try again later.",
        unauthorized: error?.response?.status == 401 ? true : false,
      };
    }
  }

  static async updateTags(payload) {
    const { addTagIds, removeTagIds, linkId } = payload;

    try {
      const res = await axios.patch(`${base_url}/updateTags`, payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
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
          "Oops! Something went wrong while adding tag. Please try again later.",
        unauthorized: error?.response?.status == 401 ? true : false,
      };
    }
  }

  static async createTagAndAttach(payload) {
    const { name, linkId } = payload;

    try {
      const res = await axios.post(
        `${base_url}/createTagAndAttach`,
        { tagName: name, linkId },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
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
          "Oops! Something went wrong while removing tag. Please try again later.",
        unauthorized: error?.response?.status == 401 ? true : false,
      };
    }
  }
}
