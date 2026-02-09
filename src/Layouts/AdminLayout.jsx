import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavbarModule from "../components/NavbarComps/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import BreadcrumbComp from "../components/BreadCrum.jsx";
import ErrorHandler from "../utils/errorhandler.js";

import { useStore } from "../Context/masterapis/MasterApisContext.jsx";
import api from "../api/axiosConfig.js";

import "../App.css";

const AdminLayout = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const navigate = useNavigate();
  const { dispatch } = useStore();

  const dropDownMenu = [
    {
      key: "user",
      label: <span onClick={() => navigate("/")}>User Protal</span>,
    },
  ];

  useEffect(() => {
    const load = async () => {
      const sensorUrl = `/Admin/SensorParameterMapping/GetSensorNameAndId`;
      const profileUrl = `/Admin/Profile/GetProfiles`;

      const [sensorResult, profileResult] = await Promise.allSettled([
        api.get(sensorUrl),
        api.get(profileUrl),
      ]);

      let sensors = [];
      let profiles = [];

      // Handle sensors
      if (sensorResult.status === "fulfilled") {
        const res = sensorResult.value;
        if (res?.data?.statusCode === 200) {
          sensors = res.data.result ?? [];
        } else {
          ErrorHandler.onError({
            message: res?.data?.message ?? "Failed to load sensors",
          });
        }
      } else {
        ErrorHandler.onError(sensorResult.reason);
      }

      // Handle profiles
      if (profileResult.status === "fulfilled") {
        const res = profileResult.value;
        if (res?.data?.statusCode === 200) {
          profiles = res.data.result ?? [];
        } else {
          ErrorHandler.onError({
            message: res?.data?.message ?? "Failed to load profiles",
          });
        }
      } else {
        ErrorHandler.onError(profileResult.reason);
      }

      // 🎯 ONE SAFE DISPATCH — EVEN IF ONE API FAILED
      dispatch({
        type: "SET_MASTER_DATA",
        payload: { profiles, sensors },
      });
    };

    load();
  }, [dispatch]);

  return (
    <div className="webpage">
      <section
        className={
          showSidebar ? "displaySidebar" : "displaySidebar hideSidebar"
        }
      >
        <Sidebar />
      </section>
      <section className={`mainCont ${showSidebar ? "" : "fullWidth"}`}>
        <NavbarModule
          showSidebar={showSidebar}
          toggleSidebar={toggleSidebar}
          dropDownMenu={dropDownMenu}
        />
        <div className="outlet-container">
          <BreadcrumbComp />
          <div
            style={{
              border: "1px solid #E4E4E4",
              padding: "10px",
              borderRadius: 8,
            }}
          >
            <Outlet />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminLayout;
