import React from "react";
import { LuFileDown } from "react-icons/lu";

const DownloadReportBtn = ({ disable, downloadExcel }) => {
  return (
    <button
      className="btn btn-primary ms-4"
      disabled={disable === 0}
      onClick={downloadExcel}
    >
      Download Report <LuFileDown />
    </button>
  );
};

export default DownloadReportBtn;
