import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb } from "antd";

import "./components.css";

const BreadcrumbComp = () => {
  const location = useLocation();

  const pathnames = location.pathname
    .split("/")
    .filter((x) => x !== "" && x !== "admin");

  const navigate = useNavigate();

  const formatLabel = (str, isBack) => {
    const decoded = decodeURIComponent(str); // Decode safely
    return decoded
      .split("/") // Show slashes as sections
      .map((part) =>
        part
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      )
      .join(" / ");
  };

  const gobackPage = (isBack) => {
    if (isBack) {
      navigate(-1);
    }
  };

  const breadcrumbItems =
    pathnames.length > 0
      ? [
          ...pathnames.map((name, index) => {
            const isLast = index === pathnames.length - 1;
            const isBack = index === pathnames.length - 2;

            return {
              title: (
                <span
                  className={isLast ? "active-crum" : "deactive-crum"}
                  onClick={() => gobackPage(isBack)}
                >
                  {formatLabel(name)}
                </span>
              ),
            };
          }),
        ]
      : [
          {
            title: <span>Home</span>,
          },
        ];

  return (
    <>
      <Breadcrumb
        separator="<"
        style={{ marginBottom: "4px" }}
        items={breadcrumbItems}
      />
      {pathnames.length > 0 && (
        <h4 style={{ color: "#000000", fontSize: "1.2rem" }}>
          {formatLabel(pathnames[pathnames.length - 1])}
        </h4>
      )}
    </>
  );
};

export default BreadcrumbComp;
