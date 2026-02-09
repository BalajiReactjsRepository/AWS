import React, { useCallback, useEffect, useState } from "react";
import { Table, Spin } from "antd";
import ErrorHandler from "../../../utils/errorhandler";
import Swal from "sweetalert2";
import api from "../../../api/axiosConfig";
import {
  callActionWarningPopup,
  IntactionActionBtns,
} from "../../../components/ActionsBtns";
import { apiCaller } from "../../../api/apihelper";

//
// ---------------- CUSTOM CHECKBOX ----------------
//
const CustomCheckbox = ({ checked, onChange }) => (
  <span
    onClick={(e) => {
      e.stopPropagation();
      onChange();
    }}
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 22,
      height: 22,
      borderRadius: 4,
      background: checked ? "#1677ff" : "#fff",
      border: "1.5px solid " + (checked ? "#1677ff" : "#bbb"),
      cursor: "pointer",
      transition: "all 0.2s",
      boxShadow: checked ? "0 0 0 2px #1677ff22" : "",
    }}
  >
    {checked && (
      <svg width="16" height="16" viewBox="0 0 16 16">
        <polyline
          points="4,9 7,12 12,5"
          style={{
            fill: "none",
            stroke: "#fff",
            strokeWidth: 2.2,
            strokeLinecap: "round",
            strokeLinejoin: "round",
          }}
        />
      </svg>
    )}
  </span>
);

//
// ---------------- MAIN COMPONENT ----------------
//
const RoleMatrix = () => {
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);

  const [selectedRole, setSelectedRole] = useState("");
  const [selectedModule, setSelectedModule] = useState("");

  const [loading, setLoading] = useState(false);

  const [permissionList, setPermissionList] = useState([]);
  const [matrixData, setMatrixData] = useState([]);

  const [showTable, setShowTable] = useState(false);

  //
  // Load roles + menus
  //
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [roleRes, menuRes] = await Promise.all([
          api.get(`/Admin/Role/GetActiveRoles`),
          api.get(`/Admin/Menu/GetParentMenuList`),
        ]);

        const rolesData = roleRes?.data?.result ?? [];
        const menuData = menuRes?.data?.result ?? [];

        setRoles(rolesData);
        setModules(menuData);

        // if (rolesData.length > 0) setSelectedRole(rolesData[0]._id);
        // if (menuData.length > 0) setSelectedModule(menuData[0]._id);
      } catch (err) {
        ErrorHandler.onError(err);
      }
    };

    loadInitialData();
  }, []);

  //
  // Load matrix on role/module change
  //

  const loadMatrix = useCallback(async () => {
    const fd = new FormData();
    fd.append("roleId", selectedRole);
    fd.append("moduleId", selectedModule);
    setShowTable(true);
    apiCaller({
      setLoading,
      apiCall: () => api.post(`/Admin/RoleMatrix/GetModuleMenus`, fd),
      onSuccess: (result) => {
        const raw = result?.[0]?.subMenu ?? [];

        if (!raw.length) {
          setPermissionList([]);
          setMatrixData([]);
          return;
        }

        const permNames = raw?.[0]?.permissions?.map((p) => p.permission) ?? [];

        setPermissionList(permNames);
        setMatrixData(raw);
      },
    });
  }, [selectedModule, selectedRole]);

  useEffect(() => {
    if (!selectedRole || !selectedModule) return;

    loadMatrix();
  }, [loadMatrix, selectedRole, selectedModule]);

  //
  // Toggle permission
  //
  // const togglePermission = (menuId, permName) => {
  //   const updatedData = matrixData.map((menu) => {
  //     if (menu.menuId === menuId) {
  //       return {
  //         ...menu,
  //         isChanged: true,
  //         permissions: menu.permissions.map((p) => {
  //           if ("CanAll" === permName) {
  //             const checked = menu.permissions.find(
  //               (a) => a.permission === "CanAll"
  //             ).isEnabled;
  //             return { ...p, isEnabled: !checked };
  //           } else {
  //             return p.permission === permName
  //               ? { ...p, isEnabled: !p.isEnabled }
  //               : p;
  //           }
  //         }),
  //       };
  //     }
  //     return menu;
  //   });

  //   setMatrixData(updatedData);
  // };

  const togglePermission = (menuId, permName) => {
    const updatedData = matrixData.map((menu) => {
      if (menu.menuId !== menuId) return menu;

      const canAllPerm = menu.permissions.find(
        (p) => p.permission === "CanAll"
      );

      let newPermissions = [];

      if (permName === "CanAll") {
        // Toggle everything based on the new state
        const newValue = !canAllPerm.isEnabled;

        newPermissions = menu.permissions.map((p) => ({
          ...p,
          isEnabled: newValue,
        }));
      } else {
        // Toggle the clicked permission
        newPermissions = menu.permissions.map((p) =>
          p.permission === permName ? { ...p, isEnabled: !p.isEnabled } : p
        );

        // After updating individual permissions, recompute CanAll
        const updatedAllPerms = newPermissions.filter(
          (p) => p.permission !== "CanAll"
        );

        const isAllTrue = updatedAllPerms.every((p) => p.isEnabled === true);

        newPermissions = newPermissions.map((p) =>
          p.permission === "CanAll" ? { ...p, isEnabled: isAllTrue } : p
        );
      }

      return {
        ...menu,
        isChanged: true,
        permissions: newPermissions,
      };
    });

    setMatrixData(updatedData);
  };

  //
  // Table Columns
  //
  const columns = [
    {
      title: "Sub Menu",
      dataIndex: "menuName",
      render: (value) => <span style={{ fontSize: 16 }}>{value}</span>,
      //fontWeight: 600,style={{ fontSize: 16 }}
    },

    ...permissionList.map((perm) => ({
      title: perm.replace("Can", ""), // For example: View, Create, Edit...
      align: "center",
      width: 120,
      render: (_, record) => (
        <CustomCheckbox
          checked={
            record.permissions.find((p) => p.permission === perm)?.isEnabled
          }
          onChange={() => togglePermission(record.menuId, perm)}
        />
      ),
    })),
  ];

  //
  // Submit Payload
  //
  const submitForm = async (reason) => {
    // "RoleId": "676a9d88402534a7f42c284f",
    //   "MenuId": "68905d1a246edca27fdcf6c8",
    //   "Permissions": 7

    const getPermissionCount = (permissions) => {
      const isCanAll = permissions.find((p) => p.permission === "CanAll");

      if (isCanAll.isEnabled) {
        return isCanAll.permissionCode;
      }

      return permissions.reduce(
        (acc, p) => (p.isEnabled ? acc + parseInt(p.permissionCode) : acc),
        0
      );
    };

    const payload = matrixData
      .filter((m) => m.isChanged)
      .map((m) => ({
        MenuId: m.menuId,
        RoleId: selectedRole,
        Permissions: getPermissionCount(m.permissions),
        Reason: reason,
      }));

    // API CALL TO UPDATE ROLE MATRIX

    apiCaller({
      showSuccess: true,
      apiCall: () => api.post("/Admin/RoleMatrix/UpdateRoleMatrix", payload),
      onSuccess: () => {
        ErrorHandler.SuccessToast("Role Matrix updated successfully");
      },
    });
  };

  //
  // Confirm Popup
  //
  const handleExternalSubmit = () => {
    callActionWarningPopup("add", (reason) => {
      Swal.close();
      submitForm(reason);
    });
  };

  return (
    <>
      <div className=" row">
        <div className="add-user-input_container col-12 col-md-4 mb-3">
          <label>Role</label>
          <select
            className="form-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value={""}>select Role</option>
            {roles.map((r) => (
              <option key={r._id} value={r._id}>
                {r.roleName}
              </option>
            ))}
          </select>
        </div>

        <div className="add-user-input_container col-12 col-md-4 mb-3">
          <label>Menu</label>
          <select
            className="form-select"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
          >
            <option value={""}>select Menu</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.parentMenuName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showTable && (
        <main>
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={matrixData}
              rowKey={(record, i) => record.menuId ?? i}
              pagination={false}
              bordered
            />
          </Spin>

          <div className="m-4 text-center">
            <IntactionActionBtns
              actionFunction={handleExternalSubmit}
              setFunc={() => {
                loadMatrix();
              }}
            />
          </div>
        </main>
      )}
    </>
  );
};

export default RoleMatrix;
