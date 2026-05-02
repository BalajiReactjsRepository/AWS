import Swal from "sweetalert2";
import ReactDOM from "react-dom/client";
import { ThreeDot } from "react-loading-indicators";
import successIcon from "../images/AdminImages/success.png";
import "sweetalert2/dist/sweetalert2.min.css";
import "./popup.css";

// 🔢 GLOBAL LOADER COUNTER
const loaderState = {
  activeCount: 0,
};

/* =========================
   ✅ LOADING POPUP (CONCURRENT SAFE)
========================= */
const onLoading = () => {
  loaderState.activeCount += 1;

  // show loader only once
  if (loaderState.activeCount > 1) return;

  const loaderDiv = document.createElement("div");
  ReactDOM.createRoot(loaderDiv).render(
    <ThreeDot color='#f58142' size='medium' text='' textColor='' />,
  );

  return Swal.fire({
    html: loaderDiv,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    backdrop: true,
    customClass: {
      popup: "custom-swal-container",
    },
  });
};

/* =========================
   ✅ SAFE LOADING CLOSE (CONCURRENT SAFE)
========================= */
const onLoadingClose = () => {
  if (loaderState.activeCount === 0) return;

  loaderState.activeCount -= 1;

  // close loader only when all requests finish
  if (loaderState.activeCount === 0) {
    Swal.close();
  }
};

/* =========================
   ✅ SUCCESS POPUP
========================= */
const onSuccess = (message = "Successfully completed") => {
  onLoadingClose(); // ✅ closes only if this was last request

  return Swal.fire({
    position: "center",
    icon: "success",
    text: message,
    showConfirmButton: false,
    timer: 2000,
  });
};

/* =========================
   ✅ ERROR HANDLER
========================= */
const onError = (error) => {
  onLoadingClose(); // ✅ safe with counter

  let message = "Oops! Something went wrong.";

  if (error?.response) {
    message =
      error.response.data?.message ||
      error.response.statusText ||
      "Server Error";
  } else if (typeof error === "string") {
    message = error;
  } else if (error?.message) {
    message = error.message;
  }

  return Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
  });
};

/* =========================
   ✅ ERROR MESSAGE ONLY (NO POPUP)
========================= */
const errMsg = (error) => {
  onLoadingClose(); // ✅ safe

  if (error?.response?.data?.errors) {
    return Object.values(error.response.data.errors)
      .map((value) => value.join(", "))
      .join(" | ");
  }

  return "Oops! Something went wrong.";
};

/* =========================
   ✅ TOAST SUCCESS
========================= */
const SuccessToast = async (message) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    customClass: {
      popup: "colored-toast",
      icon: "swal2-icon-custom",
    },
    showConfirmButton: false,
    timer: 5000,
  });

  Toast.fire({
    iconHtml: `<img src="${successIcon}" style="width: 35px; height: 35px;">`,
    title: "Success!",
    text: message,
  });
};

/* =========================
   ✅ EXPORT
========================= */
const ErrorHandler = {
  onLoading,
  onLoadingClose,
  onSuccess,
  onError,
  SuccessToast,
  errMsg,
};

export default ErrorHandler;
