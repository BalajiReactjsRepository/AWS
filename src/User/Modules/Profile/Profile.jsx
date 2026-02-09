import React, { useState } from "react";

import { RxPerson } from "react-icons/rx";

import "./profile.css";

import ResetPasswordForm from "./ResetPassword";
import EditProfile from "./EditProfile";

const Profile = () => {
  const admin_key = process.env.REACT_APP_ADMIN_KEY;
  const userData = JSON.parse(localStorage.getItem(admin_key));

  const [currentForm, setCurrentForm] = useState("");

  const ProfileDetails = () => {
    return (
      <>
        <div className="row d-flex align-itmes-center">
          <div className="col-12 col-md-2">
            <div className="profile-img-cont">
              {userData.userImage ? (
                <img
                  className="user-img"
                  src={userData.userImage}
                  alt="profile"
                />
              ) : (
                <RxPerson className="fs-4" />
              )}
            </div>
          </div>

          <div className="col-12 col-md-4">
            <button
              className="profile-action_btn"
              type="button"
              onClick={() => setCurrentForm("editProfile")}
            >
              Edit Profile
            </button>
          </div>
          <div className="col-12 col-md-5">
            <button
              className="profile-action_btn"
              type="button"
              onClick={() => setCurrentForm("resetPassword")}
            >
              Reset Password
            </button>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-12 col-md-4">
            <label htmlFor="name" className="profile-input_label">
              Full Name
            </label>
            <input
              type="text"
              value={`${userData.firstName} ${userData.middleName} ${userData.lastName}`}
              className="form-control"
              readOnly
              autoComplete="name"
              style={{ color: "#000000" }}
              name="name"
              id="name"
              placeholder="Enter your Full Name"
            />
          </div>
          <div className="col-12 col-md-4">
            <label htmlFor="mobileNumber" className="profile-input_label">
              MobileNumber
            </label>
            <input
              type="text"
              className="form-control"
              value={userData.mobileNumber}
              readOnly
              autoComplete="mobileNumber"
              style={{ color: "#000000" }}
              name="mobileNumber"
              id="mobileNumber"
              placeholder="Enter MobileNumber"
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 col-md-4">
            <label htmlFor="emailAddress" className="profile-input_label">
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              value={userData.emailAddress}
              readOnly
              style={{ color: "#000000" }}
              name="emailAddress"
              autoComplete="email"
              id="emailAddress"
              placeholder="Enter your email address"
            />
          </div>
          <div className="col-12 col-md-3">
            <label htmlFor="Role" className="profile-input_label">
              Role
            </label>
            <input
              type="text"
              disabled
              value={userData.roleName}
              readOnly
              autoComplete="Role"
              className="form-control"
              style={{ color: "#000000" }}
              name="Role"
              id="Role"
              placeholder=""
            />
          </div>
        </div>
      </>
    );
  };

  const currentView = () => {
    switch (currentForm) {
      case "editProfile":
        return (
          <EditProfile
            userDataInfo={userData}
            setCurrentForm={setCurrentForm}
          />
        );

      case "resetPassword":
        return <ResetPasswordForm setCurrentForm={setCurrentForm} />;

      default:
        return ProfileDetails();
    }
  };

  return <div className="row">{currentView()}</div>;
};

export default Profile;
