import { Link, useLocation } from "react-router-dom";
import { Tooltip } from "antd";
import { IoHomeOutline } from "react-icons/io5";
import { TbFileDatabase } from "react-icons/tb";

export const UserRightSection = () => {
  const { pathname } = useLocation();

  return (
    <>
      {/* Home */}
      <Tooltip title="Home">
        <Link
          to="/"
          className={`nav-item-link ${pathname === "/" ? "active-nav" : ""}`}
        >
          <IoHomeOutline />
        </Link>
      </Tooltip>

      {/* Reports */}
      <Tooltip title="Reports">
        <Link
          to="/reports"
          className={`nav-item-link ${
            pathname === "/reports" ? "active-nav" : ""
          }`}
        >
          <TbFileDatabase />
        </Link>
      </Tooltip>
    </>
  );
};
