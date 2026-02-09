import { useState } from "react";

import { HiOutlineEye } from "react-icons/hi";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { IoMdArrowBack } from "react-icons/io";

import { apiCaller } from "../../../api/apihelper";
import api from "../../../api/axiosConfig";

import "./profile.css";

const ResetPasswordForm = ({ setCurrentForm }) => {
  const [resetPassword, setResetPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [passwordTypes, setPasswordTypes] = useState({
    currentPassword: true,
    newPassword: true,
    confirmPassword: true,
  });

  const PasswordIcons = (id, value) => {
    return value ? (
      <HiOutlineEye
        className="pass-eye-icon"
        onClick={() => setPasswordTypes({ ...passwordTypes, [id]: !value })}
      />
    ) : (
      <AiOutlineEyeInvisible
        className="pass-eye-icon "
        onClick={() => setPasswordTypes({ ...passwordTypes, [id]: !value })}
      />
    );
  };

  const onChnagePasswords = (e) => {
    const { id, value } = e.target;
    setResetPassword((prev) => ({ ...prev, [id]: value }));
  };

  const resetPasswordSubmit = async () => {
    if (resetPassword.newPassword !== resetPassword.confirmPassword) {
      setError(`Password didn't match`);
      return;
    }

    const url = `/UserAuthenticate/ResetPassword`;

    const formdata = new FormData();

    formdata.append("CurrentPassword", resetPassword.currentPassword);
    formdata.append("NewPassword", resetPassword.newPassword);
    formdata.append("ConfirmPassword", resetPassword.confirmPassword);
    apiCaller({
      apiCall: () => api.post(url, formdata),
      onSuccess: () => setCurrentForm(""),
    });
  };

  return (
    <>
      <div className="d-flex align-items-center">
        <IoMdArrowBack
          onClick={() => setCurrentForm("")}
          style={{
            cursor: "pointer",
            fontSize: "1.2rem",
            marginRight: ".5rem",
          }}
        />
        <span className="fw-bold fs-5">Reset Password</span>
      </div>

      <div className="mt-2 ">
        <div className="row p-0">
          <div className="col-12 col-xl-6 mb-3">
            <label htmlFor="currentPassword" className="profile-input_label">
              Current Password
            </label>
            <div className="d-flex align-items-center">
              <input
                type={passwordTypes.currentPassword ? "password" : "text"}
                value={resetPassword.currentPassword}
                onChange={onChnagePasswords}
                className={`form-control ${
                  passwordTypes.currentPassword ? "large-dots" : ""
                }`}
                name="currentPassword"
                id="currentPassword"
                placeholder="Enter Current Password"
              />
              {PasswordIcons("currentPassword", passwordTypes.currentPassword)}
            </div>
          </div>
          <div className="col-12  col-xl-6 mb-3">
            <label htmlFor="newPassword" className="profile-input_label">
              New Password
            </label>
            <div className="d-flex align-items-center">
              <input
                type={passwordTypes.newPassword ? "password" : "text"}
                className={`form-control ${
                  passwordTypes.newPassword ? "large-dots" : ""
                }`}
                value={resetPassword.newPassword}
                onChange={onChnagePasswords}
                name="newPassword"
                id="newPassword"
                placeholder="Enter New Password"
              />

              {PasswordIcons("newPassword", passwordTypes.newPassword)}
            </div>
          </div>
          <div className="col-12  col-xl-6 mb-3">
            <label htmlFor="confirmPassword" className="profile-input_label">
              Confirm New Password
            </label>
            <div className="d-flex align-items-center">
              <input
                type={passwordTypes.confirmPassword ? "password" : "text"}
                value={resetPassword.confirmPassword}
                onChange={onChnagePasswords}
                className={`form-control ${
                  passwordTypes.confirmPassword ? "large-dots" : ""
                }`}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Enter Confirm Password"
              />
              {PasswordIcons("confirmPassword", passwordTypes.confirmPassword)}
            </div>
          </div>
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button
          className="btn btn-primary custom-radius"
          onClick={resetPasswordSubmit}
        >
          Save and Update
        </button>
      </div>
    </>
  );
};

export default ResetPasswordForm;
