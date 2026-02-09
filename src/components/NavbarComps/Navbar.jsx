import { Dropdown, Layout, Tooltip } from "antd"; //Badge
import { DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

import Notifications from "../Notifications";
import { notificatioList } from "../../Data/Notificatons";

import { Link, useLocation, useNavigate } from "react-router-dom";

//import { LuBellDot } from "react-icons/lu";
import { RxPerson } from "react-icons/rx";
import { UserRightSection } from "./UserNavItems";
import { onLogOutUser } from "../../api/authService";

import "../components.css";
///import api from "../../api/axiosConfig";
import { AdminLeftSection } from "./AdminNavitems";

const { Header } = Layout;

const NavbarModule = (props) => {
  const { toggleSidebar, showSidebar, dropDownMenu } = props;

  const { pathname } = useLocation();
  const [nofications, setNotofications] = useState(notificatioList);

  const [showNotificationsBar, setShowNotificationsBar] = useState(false);
  // const [unreadCount, setUnreadCount] = useState(nofications.length);

  const admin_key = process.env.REACT_APP_ADMIN_KEY;
  const userData = JSON.parse(localStorage.getItem(admin_key));
  const navigate = useNavigate();

  const handleSidebar = () => {
    toggleSidebar(!showSidebar);
  };

  // useEffect(() => {
  //   const getNotifications = async () => {
  //     try {
  //       const url = `/Admin/Notification/GetAllNotifications`;
  //       const res = await api.get(url);
  //       const { statusCode, result } = res.data;
  //       console.log(result);
  //       if (statusCode === 200) {
  //         const notifications =  result ?? []

  //         setNotofications(notifications);
  //         const unreadCount = notifications.filter((n) => n.status === "Unread");
  //         setUnreadCount(unreadCount.length);
  //       } else {
  //       }
  //     } catch (error) {}
  //   };
  //   getNotifications();
  // }, []);

  const MenuItems = [
    ...dropDownMenu,

    {
      key: "logout",
      label: <span onClick={() => onLogOutUser(navigate)}>Logout</span>,
    },
  ];

  const handleNotificationStatus = (id) => {
    const unredData = nofications.filter((n, i) => i !== id);
    setNotofications(unredData);
    // setUnreadCount((prev) => prev - 1);
  };

  return (
    <>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 0,
          background: "#fff",
          zIndex: 1000,
        }}
      >
        {/* Left Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Tooltip title={showSidebar ? "Collapse Menu" : "Expand Menu"}>
            <FaBars onClick={handleSidebar} className="nav-collaps-icon" />
          </Tooltip>
          {userData?.roleName === "Admin" && <AdminLeftSection />}
        </div>

        {/* Right Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {!pathname.startsWith("/admin") && <UserRightSection />}
          {/* Notifications */}
          {/* <Tooltip title="Notifications">
            <Badge
              onClick={() => setShowNotificationsBar(true)}
              className={`nav-item-link notification ${
                showNotificationsBar && nofications.length ? "active-nav" : ""
              }`}
            >
              <LuBellDot />
              {unreadCount > 0 && (
                <p className="notific-count">
                  {unreadCount > 999 ? "999+" : `${unreadCount}`}
                </p>
              )}
            </Badge>
          </Tooltip> */}
          {/* Profile */}
          <Tooltip title="Profile">
            <Link
              to="/profile"
              className={`nav-item-link ${
                pathname.startsWith("/profile") ? "active-nav" : ""
              }`}
            >
              {userData?.userImage ? (
                <img
                  src={userData.userImage}
                  alt="profile"
                  style={{ width: "100%", borderRadius: "50%" }}
                />
              ) : (
                <RxPerson />
              )}
            </Link>
          </Tooltip>
          <Dropdown menu={{ items: MenuItems }} trigger={["click"]}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              {/* <Avatar
                style={{
                  background: "#F1F1F1",
                  color: "#000",
                  width: "34px",
                  height: "34px",
                }}
                src={userData?.userImage || null}
                icon={!userData?.userImage ? <UserOutlined /> : null}
              /> */}
              <span
                style={{ fontWeight: 600, color: "#000000", fontSize: "14px" }}
              >
                {userData?.firstName} {userData?.lastName}
              </span>
              <DownOutlined
                style={{ fontWeight: 800, color: "#000000", fontSize: "10px" }}
              />
            </div>
          </Dropdown>
        </div>
      </Header>
      <section
        className={
          showNotificationsBar && nofications.length
            ? "notification-cont"
            : "notification-cont hideNotification-cont"
        }
      >
        <Notifications
          toggleNotificationsBar={setShowNotificationsBar}
          nofications={nofications}
          handleNotificationStatus={handleNotificationStatus}
        />
      </section>
    </>
  );
};

export default NavbarModule;
