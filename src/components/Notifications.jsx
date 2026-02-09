import React from "react";
import { CloseCircleOutlined } from "@ant-design/icons";
import "./components.css";

const Notifications = (props) => {
  const {
    toggleNotificationsBar,
    nofications = [],
    handleNotificationStatus,
  } = props;

  const closeNotificationBar = () => {
    toggleNotificationsBar(false);
  };
  const onChangeNotificationStatus = (i) => {
    handleNotificationStatus(i);
  };

  const getNoteText = (message) => {
    if (!message) return "";
    return message.length > 150 ? `${message.slice(0, 150)} ...` : message;
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <h5 className="notifican-container-title">Notifications</h5>
        <CloseCircleOutlined
          style={{ cursor: "pointer", color: "red", fontSize: "1.2rem" }}
          onClick={closeNotificationBar}
        />
      </div>
      <div className="notificationsBar">
        {nofications?.map((n, i) => (
          <div key={i}>
            <div
              className="notification my-1 "
              onClick={() => onChangeNotificationStatus(i)}
            >
              <div className="d-flex flex-column flex-md-row justify-content-md-between">
                <p className="m-0 text-dark font-bold">
                  {n?.notificationTitle}
                </p>
                <small>{n?.createdOn}</small>
              </div>
              <small>{getNoteText(n?.notificationMessage)}</small>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </>
  );
};

export default Notifications;
