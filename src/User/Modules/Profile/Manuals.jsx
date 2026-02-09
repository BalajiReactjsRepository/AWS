import React from "react";
import pdfImage from "../../../images/UserImages/pdf-img.png";

import { LuFileDown } from "react-icons/lu";

import "./profile.css";

const Manuals = () => {
  const manuals = [
    { title: "Why do we use it ?", data: "" },
    { title: "What are sensor specifications ?", data: "" },
    { title: "Why do we use it ?", data: "" },
    { title: "Why do we use it ?", data: "" },
    { title: "Why do we use it ?", data: "" },
    { title: "Why do we use it ?", data: "" },
    { title: "Why do we use it ?", data: "" },
    { title: "Why do we use it ?", data: "" },
  ];
  const downloadFile = () => {};

  return (
    <div>
      {manuals.map((m, i) => (
        <div
          key={i}
          className="d-flex text-dark justify-content-between align-items-center my-3 pb-3  border-0 border-bottom"
        >
          <div>
            <img
              src={pdfImage}
              alt="pdf"
              className="me-3"
              style={{ width: "1.5rem" }}
            />
            {m.title}
          </div>
          <button
            className="btn btn-primary custom-radius me-3"
            onClick={downloadFile}
          >
            Download <LuFileDown style={{ fontWeight: "bold" }} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Manuals;
