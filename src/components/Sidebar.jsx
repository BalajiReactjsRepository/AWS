import React, { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";
import azistlogo from "../images/AdminImages/azista.png";
import masterIcon from "../images/AdminImages/sidebarIcons/master.png";
import sensorparameter from "../images/AdminImages/sidebarIcons/sensorparameter.png";
// import notificatioAlert from "../images/AdminImages/sidebarIcons/notificationAlert.png";
// import helSupport from "../images/AdminImages/sidebarIcons/helpSupport.png";
import reports from "../images/AdminImages/sidebarIcons/reports.png";

import manageMenu from "../images/AdminImages/sidebarIcons/manageMenu.png";
import roleMaster from "../images/AdminImages/sidebarIcons/roleMaster.png";
import roleMatrix from "../images/AdminImages/sidebarIcons/roleMatrix.png";
import manageUser from "../images/AdminImages/sidebarIcons/manageUser.png";
import ClientConfig from "../images/AdminImages/sidebarIcons/clientConfig.png";
import manageProfile from "../images/AdminImages/sidebarIcons/manageProfile.png";
import manageStation from "../images/AdminImages/sidebarIcons/manageStation.png";
import dataParameterMapping from "../images/AdminImages/sidebarIcons/derived_parameter_mapping.svg";
import hydraulics from "../images/AdminImages/sidebarIcons/hydraulics.svg";
import manualDataCheck from "../images/AdminImages/sidebarIcons/manual_data_check.svg";
import manageStationAccess from "../images/AdminImages/sidebarIcons/manage_station_access.svg";
// import mangeNotification from "../images/AdminImages/sidebarIcons/manageNotification.png";
// import manageAds from "../images/AdminImages/sidebarIcons/mangeAds.png";
// import faqmanual from "../images/AdminImages/sidebarIcons/faqmanual.png";
// import custSupport from "../images/AdminImages/sidebarIcons/customersupport.png";
import BackupIcon from "../images/AdminImages/sidebarIcons/backup-file.png";
//import stationAccess from "../images/AdminImages/sidebarIcons/stationAccess.png";
// import dataQuality from "../images/AdminImages/sidebarIcons/DataQuality.png";
import units from "../images/AdminImages/sidebarIcons/Units.png";
import sensorsettigs from "../images/AdminImages/sidebarIcons/sensorsetting.png";

import "./components.css";

const sidebarMenuList = [
  {
    menuCode: "m",
    menuName: "Master",
    path: "/master",
    menuIcon: masterIcon,
    subMenu: [
      {
        menuCode: "mm",
        menuName: "Manage Menu",
        menuIcon: manageMenu,
        path: "/manage-menu",
      },
      {
        menuCode: "rms",
        menuName: "Role Master",
        menuIcon: roleMaster,
        path: "/role-master",
      },
      {
        menuCode: "mu",
        menuName: "Manage User",
        menuIcon: manageUser,
        path: "/manage-user",
      },
      {
        menuCode: "rm",
        menuName: "Role Matrix",
        menuIcon: roleMatrix,
        path: "/role-matrix",
      },
      {
        menuCode: "cc",
        menuName: "Client Config",
        menuIcon: ClientConfig,
        path: "/client-config",
      },
      {
        menuCode: "uc",
        menuName: "Manage Unit ",
        menuIcon: units,
        path: "/manage-unit",
      },
      {
        menuCode: "pis",
        menuName: "Parameter In Sensor",
        menuIcon: sensorsettigs,
        path: "/parameter-in-sensor",
      },
      {
        menuCode: "dpm",
        menuName: "Derived Parameter Mapping",
        menuIcon: dataParameterMapping,
        path: "/derived-parameter-mapping",
      },
      {
        menuCode: "hd",
        menuName: "Hydraulic Details",
        menuIcon: hydraulics,
        path: "/hydraulic-details",
      },
      {
        menuCode: "dqp",
        menuName: "Manual Data Check",
        menuIcon: manualDataCheck,
        path: "/manual-data-check",
      },
    ],
  },
  {
    menuCode: "spc",
    menuName: "Sensor Parameter Configuration",
    path: "/sensor-parameter-configuration",
    menuIcon: sensorparameter,
    subMenu: [
      {
        menuCode: "ms",
        menuIcon: manageMenu,
        menuName: "Manage Sensor",
        path: "/manage-sensor",
      },
      {
        menuCode: "spm",
        menuIcon: roleMaster,
        menuName: "Sensor Parameter Mapping",
        path: "/sensor-parameter-mapping",
      },
    ],
  },
  {
    menuCode: "PS",
    menuName: "Profile & Station",
    path: "/profile-station",
    menuIcon: masterIcon,
    subMenu: [
      {
        menuCode: "mp",
        menuName: "Manage Profile",
        menuIcon: manageProfile,
        path: "/manage-profile",
      },
      {
        menuCode: "ms",
        menuName: "Manage Station",
        menuIcon: manageStation,
        path: "/manage-station",
      },
      {
        menuCode: "msa",
        menuName: "Manage Station Access",
        menuIcon: manageStationAccess,
        path: "/manage-station-access",
      },
    ],
  },
  // {
  //   menuCode: "NA",
  //   menuName: "Notification & Alert",
  //   path: "/notification-alert",
  //   menuIcon: notificatioAlert,
  //   subMenu: [
  //     {
  //       menuCode: "mna",
  //       menuName: "Manage Notifications/Alerts",
  //       menuIcon: mangeNotification,
  //       path: "/manage-notifications",
  //     },
  //     {
  //       menuCode: "mba",
  //       menuName: "Manage Banners & Ads",
  //       menuIcon: manageAds,
  //       path: "/manage-banners",
  //     },
  //   ],
  // },
  // {
  //   menuCode: "hs",
  //   menuName: "Help & Support",
  //   path: "/help-support",
  //   menuIcon: helSupport,
  //   subMenu: [
  //     {
  //       menuCode: "faqm",
  //       menuName: "FAQ & Manual",
  //       menuIcon: faqmanual,
  //       path: "/faq-manual",
  //     },
  //     {
  //       menuCode: "cus",
  //       menuName: "Customer Support",
  //       menuIcon: custSupport,
  //       path: "/customer-support",
  //     },
  //   ],
  // },
  {
    menuCode: "RE",
    menuName: "Report",
    path: "/report",
    menuIcon: reports,
    subMenu: [
      {
        menuCode: "gnr",
        menuIcon: reports,
        menuName: "General Report",
        path: "/general-report",
      },
      {
        menuCode: "dcr",
        menuIcon: reports,
        menuName: "Data Completness Report",
        path: "/data-completness-report",
      },
      {
        menuCode: "dqr",
        menuIcon: reports,
        menuName: "Data Quality Report",
        path: "/data-quality-report",
      },
      {
        menuCode: "mdr",
        menuIcon: reports,
        menuName: "Missing Data Report",
        path: "/data-missing-report",
      },
    ],
  },
  {
    menuCode: "MB",
    menuName: "Mange Backup",
    path: "/mange-backup",
    menuIcon: BackupIcon,
    subMenu: [
      {
        menuCode: "srp",
        menuIcon: reports,
        menuName: "Upload Backup",
        path: "/upload-backup",
      },
    ],
  },
  // {
  //   menuCode: "DQ",
  //   menuName: "Data Quality",
  //   path: "/data-quality",
  //   menuIcon: dataQuality,
  //   subMenu: [
  //     {
  //       menuCode: "dqp",
  //       menuIcon: dataQuality,
  //       menuName: "Data Quality",
  //       path: "/data-quality",
  //     },
  //   ],
  // },
];

const Sidebar = () => {
  const location = useLocation();
  const pathName = location.pathname;

  const [activeKey, setActiveKey] = useState("");

  useEffect(() => {
    const activeTab =
      sidebarMenuList.find((m) => pathName.startsWith(`/admin${m.path}`))
        ?.menuCode ?? null;
    setActiveKey(activeTab);
  }, [pathName]);

  const handleToggle = (menuCode) => {
    if (activeKey === menuCode) {
      setActiveKey(null);
    } else {
      setActiveKey(menuCode);
    }
  };

  const getActivePathClass = (path, mpath) => {
    if (!path || !mpath) return "text-dark"; // handle undefined/null

    // Remove query params and trailing slashes
    const cleanPath = `/${path.split("/").filter(Boolean).pop()}`;

    return cleanPath === mpath ? "activepath" : "text-dark";
  };

  return (
    <div className='sidebar-container'>
      <div className='text-center mb-2'>
        <img src={azistlogo} alt='logo' style={{ width: "60%" }} />
      </div>

      <div className='accordion  accordion-container-sidebar'>
        {sidebarMenuList.map((m) => (
          <div
            className='accordion-item'
            key={m.menuCode}
            style={{ border: "none" }}
          >
            <h2 className='accordion-header'>
              <button
                className={`accordion-button sidebar-acordian-btn ${
                  activeKey === m.menuCode ? "expanded" : "collapsed"
                }`}
                type='button'
                onClick={() => handleToggle(m.menuCode)}
              >
                <img
                  src={m.menuIcon}
                  alt='menuIcon'
                  className={`me-2 icon-img ${
                    activeKey === m.menuCode ? "expanded" : ""
                  }`}
                />
                {m.menuName}
              </button>
            </h2>

            {activeKey === m.menuCode && (
              <div className='accordion-body' style={{ whiteSpace: "nowrap" }}>
                <ul className='list-unstyled ps-2 '>
                  {m.subMenu.map((sm) => (
                    <li
                      key={sm.menuCode}
                      className={`mb-1 ${getActivePathClass(
                        pathName,
                        sm.path,
                      )}`}
                    >
                      {/* /manage-station-access */}
                      <Link
                        to={`/admin${m.path}${sm.path}`}
                        className='text-decoration-none d-flex align-items-center'
                      >
                        <img
                          src={sm.menuIcon}
                          alt='subIcon'
                          style={{
                            width: "16px",
                            height: "16px",
                            marginRight: "8px",
                            color: "inherit",
                          }}
                        />

                        <p
                          className={`mb-1 ${getActivePathClass(
                            pathName,
                            sm.path,
                          )}`}
                        >
                          {sm.menuName}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className='text-center mt-2'>
        <small style={{ color: "#000000" }}>
          <a
            style={{ color: "inherit", textDecoration: "none" }}
            href='https://www.azistaindustries.com/'
            target='_blank'
            rel='noopener noreferrer'
          >
            Copyright © {new Date().getFullYear()} Azista
          </a>
        </small>
      </div>
    </div>
  );
};

export default Sidebar;
