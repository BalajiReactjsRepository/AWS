import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
//import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import Azistalogo from "../images/AdminImages/azista.png";

import "./login.css";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { setTokens } from "../api/tokenService";
import { apiCaller } from "../api/apihelper";

const Login = () => {
  const [userData, setUserData] = useState({ emailAddress: "", password: "" });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const tokenKey = process.env.REACT_APP_JWT_TOKEN || "token";
  const jwtToken = Cookies.get(tokenKey);
  const navigate = useNavigate();

  useEffect(() => {
    if (jwtToken) navigate("/");
  }, [jwtToken, navigate]);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // const handleInputChange = (e, stateSetter) => {
  //   setErrorMessage("");
  //   const { id, value } = e.target;
  //   stateSetter((prev) => ({ ...prev, [id]: value }));
  // };

  const onSubmitSuccess = (userData) => {
    const {
      token,
      refreshToken,
      clientCode,
      emailAddress,
      firstName,
      isActive,
      lastName,
      middleName,
      mobileNumber,
      profileDetails,
      roleName,
      userCode,
      userId,
      userImage,
      userName,
      profileDetailsList,
      accessiblePortals,
    } = userData;

    setTokens(token, refreshToken);

    localStorage.setItem(
      process.env.REACT_APP_ADMIN_KEY,
      JSON.stringify({
        clientCode,
        emailAddress,
        firstName,
        isActive,
        lastName,
        middleName,
        mobileNumber,
        profileDetails,
        roleName,
        userCode,
        userId,
        userImage,
        userName,
        profileDetailsList,
        accessiblePortals,
      }),
    );
    navigate("/");
  };

  useEffect(() => {
    //onSubmitSuccess();
    if (jwtToken) navigate("/");
  }, [jwtToken, navigate]); //jwtToken, navigate

  const handleOnChange = (e) => {
    setErrorMessage("");
    const { id, value } = e.target;
    setUserData((prev) => ({ ...prev, [id]: value }));
  };

  const validateEmail = (email) => {
    //return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return email.length > 4;
  };

  const validatePassword = (password) => {
    return password.length >= 5;
  };

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // reset previous errors

    const email = userData.emailAddress.trim();
    const password = userData.password.trim();

    // --- Validation ---
    if (!validateEmail(email)) {
      setErrorMessage("Invalid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage("Password must be at least 5 characters long.");
      return;
    }

    // --- Prepare form data ---
    const formData = new FormData();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formData.append("emailAddress", email);
    } else {
      formData.append("userName", email);
    }

    formData.append("password", password);

    // --- API call ---
    apiCaller({
      setErrorMessage,
      apiCall: () => api.post("/UserAuthenticate/Login", formData),
      onSuccess: (result) => {
        onSubmitSuccess(result);
      },
    });
  };

  const handleKeyDown = (e) => e.key === "Enter" && onSubmitLogin(e);

  // const onHandleChangeViewType = (type) => {
  //   // setView(type);
  //   setErrorMessage("");
  // };

  return (
    <div className='bg-image'>
      <div className='login-container'>
        <img src={Azistalogo} alt='logo' className='logo-img' />
        <p>Weather Web Portal</p>

        <form onSubmit={onSubmitLogin} className='w-100 text-center'>
          <h5 className='my-3'>Login</h5>
          <div className='form-floating w-100 mb-4'>
            <input
              type='text'
              id='emailAddress'
              className='form-control login-input'
              minLength={5}
              maxLength={100}
              value={userData.emailAddress}
              onChange={handleOnChange}
              placeholder='name@example.com'
              autoComplete='email'
            />
            <label htmlFor='emailAddress'>Username / Email Address</label>
          </div>

          <div className='password-cont w-100'>
            <div className='form-floating w-100'>
              <input
                type={showPassword ? "text" : "password"}
                id='password'
                minLength={2}
                maxLength={12}
                className='form-control login-input'
                value={userData.password}
                onChange={handleOnChange}
                onKeyDown={handleKeyDown}
                placeholder='Password'
                autoComplete='off'
              />
              <label htmlFor='password'>Password</label>
            </div>
            <div onClick={togglePasswordVisibility} className='eye-icon'>
              {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </div>
          </div>

          <div className='my-4 w-100'>
            <button
              type='submit'
              style={{ fontWeight: "600", fontSize: "medium" }}
              className='btn btn-light btn-lg btn-block w-100 btn-outline-primary'
            >
              LOG IN
            </button>
            {/* <small
              onClick={() => onHandleChangeViewType("reset-request")}
              className="text-center d-block mt-2"
              style={{ cursor: "pointer" }}
            >
              Forget Password?
            </small> */}
          </div>
        </form>

        {errorMessage && (
          <p className='text-danger text-center'>{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
