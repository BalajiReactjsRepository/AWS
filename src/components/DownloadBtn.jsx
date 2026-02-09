import React from "react";
import DownloadIcon from "../images/AdminImages/downloadIcon.png";
import { Button } from "antd";

const DownloadBtn = ({ handleDownload, data = [] }) => {
  const isDisabled = !Array.isArray(data) || data.length === 0;

  return (
    <Button
      icon={
        <img
          src={DownloadIcon}
          alt="Download"
          style={{ width: "0.8rem", marginRight: 2 }}
        />
      }
      style={{
        marginRight: 6,
        height: "2.4rem",
        cursor: isDisabled ? "not-allowed" : "pointer",
        borderRadius: "2rem",
        background: "#F2F2F2",
        color: "#000",
        border: "none",
      }}
      onClick={handleDownload}
      disabled={isDisabled}
    >
      Download
    </Button>
  );
};

export default DownloadBtn;
