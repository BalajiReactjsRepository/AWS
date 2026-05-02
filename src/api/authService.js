// src/api/authService.js
import axios from "axios";
import { clearTokens, getRefreshToken, setTokens } from "./tokenService";
import { apiCaller } from "./apihelper";
import api from "./axiosConfig";

const baseUrl = process.env.REACT_APP_BASE_URL;

export const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    const response = await axios.post(`${baseUrl}/Auth/RefreshToken`, {
      refreshToken,
    });

    if (response.data.statusCode === 200) {
      const { accessToken, refreshToken: newRefreshToken } =
        response.data.result;

      setTokens(accessToken, newRefreshToken);
      return accessToken;
    }

    return null;
  } catch (err) {
    return null;
  }
};

export const onLogOutUser = async (navigate) => {
  const url = `/UserAuthenticate/Logout`;
  const refreshToken = getRefreshToken();

  const formdata = new FormData();
  formdata.append("refreshToken", refreshToken);

  apiCaller({
    apiCall: () => api.post(url, formdata),
    onSuccess: () => {
      clearTokens();
      localStorage.removeItem(process.env.REACT_APP_ADMIN_KEY);
      navigate("/login");
    },
  });
};
