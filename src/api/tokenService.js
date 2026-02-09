// src/api/tokenService.js
import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = process.env.REACT_APP_JWT_TOKEN;
const REFRESH_TOKEN_KEY = process.env.REACT_APP_REFRESH_TOKEN;

// Save tokens
export const setTokens = (accessToken, refreshToken) => {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 1 / 24 });
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken);
};

// Get tokens
export const getAccessToken = () => Cookies.get(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => Cookies.get(REFRESH_TOKEN_KEY);

// Clear tokens
export const clearTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
};
