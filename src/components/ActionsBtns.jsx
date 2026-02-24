import React from "react";
import { Button, Space } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactDOM from "react-dom/client";
import Swal from "sweetalert2";

import trashIcon from "../images/AdminImages/trash.png";
import editIcon from "../images/AdminImages/file-edit.png";
import eyeIcon from "../images/AdminImages/eye.png";
import arrowIcon from "../images/AdminImages/arrow-small-left.png";
import saveIcon from "../images/AdminImages/save-small.png";
import crossIcon from "../images/AdminImages/cross-small.png";

import "./components.css";
import UpdateMenuPopup from "./WarningPopup";

export const callActionWarningPopup = (
  action = "Delete",
  actionFunction,
  menu,
  row,
) => {
  const handleAction = (reason) => {
    Swal.close();
    actionFunction(reason, row);
  };

  const actionText =
    action === "Delete"
      ? `Deactivate ${menu || ""}`
      : action.startsWith("add")
        ? `Save ${menu || ""}`
        : `Update ${menu || ""}`;

  const meaningAction =
    action === "Delete"
      ? `Deactivate`
      : action.startsWith("add")
        ? `Save`
        : `Update`;

  const loaderDiv = document.createElement("div");
  const root = ReactDOM.createRoot(loaderDiv);

  root.render(
    <UpdateMenuPopup
      handleAction={handleAction}
      text={actionText}
      action={meaningAction}
    />,
  );

  Swal.fire({
    html: loaderDiv,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didDestroy: () => {
      root.unmount(); // clean up React root when Swal closes
    },
  });
};

export const TableActionsBtns = ({
  menu,
  row,
  deleteFun,
  editShow,
  viewShow,
}) => {
  return (
    <Space>
      {editShow && (
        <Link
          to={`edit-${menu}`}
          state={{ record: row }}
          aria-label={`Edit ${menu}`}
        >
          <img src={editIcon} alt='edit' style={{ width: 16, height: 16 }} />
        </Link>
      )}

      {menu !== "parameter" && (
        <Button
          type='link'
          danger
          icon={
            <img
              src={trashIcon}
              alt='delete'
              style={{ width: 16, height: 16 }}
            />
          }
          onClick={() => callActionWarningPopup("Delete", deleteFun, menu, row)}
          aria-label='Delete Role'
        />
      )}

      {viewShow && (
        <Link
          to={`view-${menu}`}
          state={{ record: row }}
          aria-label='View Role'
        >
          <img src={eyeIcon} alt='view' style={{ width: 16, height: 16 }} />
        </Link>
      )}
    </Space>
  );
};

export const IntactionActionBtns = ({ actionFunction, setFunc }) => {
  const navigate = useNavigate();
  const { action = "add" } = useParams();

  const isViewMode = action.startsWith("view");
  const isAddMode = action.startsWith("add");

  return (
    <Space>
      <Button
        className='custom-button'
        style={{
          background: "#F2F2F2",
          color: "#000",
          border: "none",
        }}
        icon={<img src={arrowIcon} alt='back' />}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      {!isViewMode && (
        <>
          <Button
            className='custom-button'
            type='primary'
            icon={<img src={saveIcon} alt='save' />}
            onClick={actionFunction}
          >
            {isAddMode ? "Save" : "Update"}
          </Button>

          <Button
            className='custom-button'
            style={{
              border: "2px solid #1890ff",
              color: "#1890ff",
              background: "transparent",
            }}
            icon={<img src={crossIcon} alt='clear' />}
            onClick={setFunc}
          >
            Clear
          </Button>
        </>
      )}
    </Space>
  );
};
