import React, { useState } from "react";
import { Radio, Button, Input } from "antd";
import { DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import BookMarkIcon from "../images/AdminImages/bookmark.png";
import Swal from "sweetalert2";

export default function WarningPopup({ handleAction, text, action }) {
  const [confirmUpdate, setConfirmUpdate] = useState(null);
  const [reason, setReason] = useState("");
  const [reasonErrMsg, setReasonErrMsg] = useState("");

  const onClose = () => {
    Swal.close();
  };

  // save , update , Delete Action
  const onClickAction = () => {
    if (!reason.trim()) {
      setReasonErrMsg("* Please enter a reason");
      return;
    }
    handleAction(reason.trim());
  };

  return (
    <div className="warning-popup">
      <h3 className="warning-popup-header">Action Needed</h3>
      <p className="warning-popup-text">Are you sure you want to {text}?</p>

      <Radio.Group
        className="warning-popup-radio-group-btn"
        name="confirmUpdate"
        buttonStyle="solid"
        size="large"
        value={confirmUpdate}
        onChange={(e) => setConfirmUpdate(e.target.value)}
        options={[
          { value: false, label: "No", checked: confirmUpdate === false },
          { value: true, label: "Yes", checked: confirmUpdate },
        ]}
      />

      <div
        className={`warning-popup-container ${
          confirmUpdate ? "enable-input" : ""
        }`}
      >
        <label htmlFor="reasonInput">Reason for {text}</label>
        <Input.TextArea
          id="reasonInput"
          placeholder="Enter reason"
          value={reason}
          maxLength={250}
          onChange={(e) => {
            setReasonErrMsg("");
            setReason(e.target.value);
          }}
          rows={4}
          aria-describedby="reasonError"
        />
        {reasonErrMsg && (
          <span id="reasonError" className="text-danger">
            {reasonErrMsg}
          </span>
        )}
      </div>

      <div className="warning-popup-buttons mt-3">
        <Button
          type="solid"
          className="warning-popup-btn"
          onClick={onClose}
          icon={<CloseOutlined />}
        >
          Close
        </Button>

        {action === "Deactivate" ? (
          <Button
            disabled={!confirmUpdate || !reason.trim()}
            type="primary"
            danger
            className="warning-popup-btn"
            icon={<DeleteOutlined />}
            onClick={onClickAction}
          >
            Deactivate
          </Button>
        ) : (
          <Button
            disabled={!confirmUpdate || !reason}
            type="solid"
            className="warning-popup-btn act-save-btn"
            style={{ color: "#ffffff" }}
            icon={<img src={BookMarkIcon} alt="icon" style={{ width: 16 }} />}
            onClick={onClickAction}
          >
            {action}
          </Button>
        )}
      </div>
    </div>
  );
}
