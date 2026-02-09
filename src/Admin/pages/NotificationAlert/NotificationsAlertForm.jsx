import React, { useState } from "react";

import { Radio } from "antd";
import Alert from "../../../components/NotificationComps/Alert";
import Notification from "../../../components/NotificationComps/Notification";

const NotificationsAlertForm = () => {
  const [notificatioType, setNotificatioType] = useState("alert");

  return (
    <>
      <div className="notification-heading-container">
        <h4 className="m-0 fs-5">Schedule Type:</h4>
        <Radio.Group
          className="mx-3"
          name="notificationType"
          value={notificatioType}
          onChange={(e) => setNotificatioType(e.target.value)}
          options={[
            { value: "alert", label: "Alert" },
            { value: "notification", label: "Notification" },
          ]}
        />
      </div>

      {notificatioType === "alert" ? <Alert /> : <Notification />}
    </>
  );
};

export default NotificationsAlertForm;
