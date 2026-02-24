import ErrorHandler from "../utils/errorhandler";

// 🔧 Normalize axios / JS errors
const normalizeError = (error) => {
  if (error?.response) {
    return error.response.data?.message || "Server error occurred.";
  }
  if (error?.request) {
    return "Network error. Please check your internet connection.";
  }
  return error?.message || "Unexpected error occurred.";
};

export const apiCaller = async (args) => {
  const {
    apiCall,
    setLoading,
    onSuccess,
    setErrorMessage,
    showSuccess = false,
    showLoading = true,
    showError = true,
  } = args;

  const useLocalLoader = typeof setLoading === "function";

  let loaderShown = false;

  try {
    // ⏳ Delayed loader
    if (showLoading) {
      loaderShown = true;
      if (useLocalLoader) setLoading(true);
      else ErrorHandler.onLoading();
    }

    // 🚀 Execute API call
    const res = await apiCall();

    if (!res?.data) {
      throw new Error("Unexpected server response.");
    }

    const { statusCode, message, result } = res.data;

    if (statusCode === 200) {
      onSuccess?.(result);
      if (showSuccess && message) ErrorHandler.onSuccess(message);
      return result;
    }

    // ⚠️ API-level error
    const apiErrorMsg = message || "Something went wrong.";
    if (showError) {
      if (setErrorMessage) setErrorMessage(apiErrorMsg);
      else ErrorHandler.onError(apiErrorMsg);
    }
  } catch (error) {
    if (showError) {
      const errMsg = normalizeError(error);
      if (setErrorMessage) setErrorMessage(errMsg);
      else ErrorHandler.onError(errMsg);
    }
  } finally {
    // 🔚 Close loader ONLY if it was actually shown
    if (loaderShown) {
      if (useLocalLoader) setLoading(false);
      else ErrorHandler.onLoadingClose();
    }
  }
};
