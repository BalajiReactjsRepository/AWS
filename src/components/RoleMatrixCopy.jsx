import React, { useState } from "react";
import { Table, Radio } from "antd";

import DownChervonIcon from "../../images/AdminImages/chevron-down.png";
import UpChervonIcon from "../../images/AdminImages/chevron-up.png";
import {
  callActionWarningPopup,
  IntactionActionBtns,
} from "../../components/ActionsBtns";
import ErrorHandler from "../../utils/errorhandler";
import Swal from "sweetalert2";

const roles = [
  { id: "system_admin", name: "System Admin" },
  { id: "admin", name: "Admin" },
  { id: "department", name: "Department" },
  { id: "general_user", name: "General User" },
  { id: "support", name: "Support" },
];

// Modules and children
const modules = [
  {
    key: "master",
    name: "Master Pages",
    children: [
      "Manage Menu",
      "Role Master",
      "Manage User",
      "Client Configuration",
    ],
  },
  {
    key: "sensor",
    name: "Sensor & Parameter",
    children: ["Manage Sensor", "Sensor Parameter Mapping"],
  },
  {
    key: "profile",
    name: "Profile & Station",
    children: ["Manage Profile", "Manage Station"],
  },
  {
    key: "notification",
    name: "Notification & Alert",
    children: ["Manage Notifications/Alerts", "Manage Banners & Ads"],
  },
  {
    key: "support",
    name: "Help & Support",
    children: ["FAQ & Manual", "Customer Support"],
  },
  {
    key: "reports",
    name: "Reports",
    children: ["Sensor Reports"],
  },
];

const permissions = ["View", "Create", "Edit", "Delete", "Export"];

// Helper for child keys
const getChildKey = (moduleKey, childName) =>
  `${moduleKey}__${childName.replace(/\s+/g, "_").toLowerCase()}`;

function getInitialPermissions() {
  const initial = {};
  roles.forEach((role) => {
    initial[role.id] = {};
    modules.forEach((module) => {
      module.children.forEach((child) => {
        const childKey = getChildKey(module.key, child);
        initial[role.id][childKey] = {};
        permissions.forEach((perm) => {
          initial[role.id][childKey][perm] = false;
        });
      });
    });
  });
  // For demo, pre-check some permissions for "admin"
  initial.admin[getChildKey("master", "Manage Menu")].View = true;
  initial.admin[getChildKey("master", "Manage Menu")].Create = true;
  initial.admin[getChildKey("master", "Manage Menu")].Edit = true;
  initial.admin[getChildKey("master", "Role Master")].Edit = true;
  initial.admin[getChildKey("sensor", "Manage Sensor")].View = true;
  initial.admin[getChildKey("sensor", "Manage Sensor")].Create = true;
  return initial;
}

// Helpers for parent-child logic

function areAllChildrenChecked(rolePermissions, role, module, perm) {
  return module.children.every((child) => {
    const childKey = getChildKey(module.key, child);
    return rolePermissions[role][childKey][perm];
  });
}

function areSomeChildrenChecked(rolePermissions, role, module, perm) {
  return module.children.some((child) => {
    const childKey = getChildKey(module.key, child);
    return rolePermissions[role][childKey][perm];
  });
}

// Custom Checkbox with indeterminate support
const CustomCheckbox = ({ checked, indeterminate, onChange }) => (
  <span
    onClick={onChange}
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 22,
      height: 22,
      borderRadius: 4,
      background: checked ? "#1677ff" : "#f0f0f0",
      border: checked ? "1.5px solid #1677ff" : "1.5px solid #bbb",
      cursor: "pointer",
      transition: "all 0.2s",
      boxShadow: checked ? "0 0 0 2px #1677ff22" : "none",
      position: "relative",
    }}
    tabIndex={0}
    role="checkbox"
    aria-checked={checked}
    // aria-indeterminate={indeterminate}
  >
    {indeterminate ? (
      // Indeterminate (horizontal line) "#1677ff"
      <svg width="16" height="16" viewBox="0 0 16 16">
        <rect x="4" y="7.25" width="8" height="1.5" rx="0.75" fill="#000" />
      </svg>
    ) : checked ? (
      // White checkmark
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
    ) : (
      // Gray minus //bbb
      <svg width="16" height="16" viewBox="0 0 16 16">
        <rect x="4" y="7.25" width="8" height="1.5" rx="0.75" fill="#000" />
      </svg>
    )}
  </span>
);

const RoleMatrix = () => {
  const [selectedRole, setSelectedRole] = useState(roles[0].id);
  const [rolePermissions, setRolePermissions] = useState(
    getInitialPermissions()
  );
  const [openModules, setOpenModules] = useState(modules[0].key);

  // Toggle accordion open/close
  const handleToggleModule = (moduleKey) => {
    const newModuleKey = openModules === moduleKey ? "-1" : moduleKey;
    setOpenModules(newModuleKey);
  };

  // // Handle permission checkbox (parent or child)
  const handlePermissionChange = (record, perm) => {
    if (record.isModule) {
      // Parent/module row: toggle all children
      const module = modules.find((m) => m.key === record.moduleKey);
      const allChecked = areAllChildrenChecked(
        rolePermissions,
        selectedRole,
        module,
        perm
      );
      setRolePermissions((prev) => {
        const updated = { ...prev[selectedRole] };
        module.children.forEach((child) => {
          const childKey = getChildKey(module.key, child);
          updated[childKey] = {
            ...updated[childKey],
            [perm]: !allChecked,
          };
        });
        return { ...prev, [selectedRole]: updated };
      });
    } else {
      // Child row: toggle just this child
      const childKey = record.childKey;
      setRolePermissions((prev) => {
        const updated = {
          ...prev[selectedRole],
          [childKey]: {
            ...prev[selectedRole][childKey],
            [perm]: !prev[selectedRole][childKey][perm],
          },
        };
        return { ...prev, [selectedRole]: updated };
      });
    }
  };

  // Table columns
  const columns = [
    {
      title: "Module / Page",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span
          style={{
            fontWeight: record.isModule ? 600 : 500,
            fontSize: 16,
            letterSpacing: record.isModule ? "0.5px" : "0px",
            color: "#000000",
          }}
        >
          {record.name}
        </span>
      ),
    },
    ...permissions.map((perm) => ({
      title: perm,
      dataIndex: perm,
      key: perm,
      align: "center",

      render: (checked, record) => {
        if (record.isModule) {
          const module = modules.find((m) => m.key === record.moduleKey);
          const allChecked = areAllChildrenChecked(
            rolePermissions,
            selectedRole,
            module,
            perm
          );
          const someChecked = areSomeChildrenChecked(
            rolePermissions,
            selectedRole,
            module,
            perm
          );
          return (
            <CustomCheckbox
              checked={allChecked}
              indeterminate={!allChecked && someChecked}
              onChange={(e) => {
                e.stopPropagation();
                handlePermissionChange(record, perm);
              }}
            />
          );
        } else {
          return (
            <CustomCheckbox
              checked={checked}
              indeterminate={false}
              onChange={(e) => {
                e.stopPropagation();
                handlePermissionChange(record, perm);
              }}
            />
          );
        }
      },
    })),
    {
      title: "",
      key: "caret",
      width: 48,
      align: "center",
      render: (_, record) =>
        record.isModule ? (
          <span
            style={{ cursor: "pointer", display: "inline-block" }}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleModule(record.moduleKey);
            }}
          >
            {openModules === record.moduleKey ? (
              <img
                src={UpChervonIcon}
                alt="ddsd"
                style={{ width: 16, color: "#444" }}
              />
            ) : (
              <img
                src={DownChervonIcon}
                alt="ddsd"
                style={{ width: 16, color: "#444" }}
              />
            )}
          </span>
        ) : null,
    },
  ];

  // // Build table data
  let data = [];
  modules.forEach((module) => {
    // Module row
    data.push({
      key: module.key,
      name: module.name,
      isModule: true,
      moduleKey: module.key,
    });
    // Child rows
    if (openModules === module.key) {
      module.children.forEach((child) => {
        const childKey = getChildKey(module.key, child);
        data.push({
          key: childKey,
          name: child,
          isModule: false,
          childKey,
          ...permissions.reduce(
            (acc, perm) => ({
              ...acc,
              [perm]: rolePermissions[selectedRole][childKey][perm],
            }),
            {}
          ),
        });
      });
    }
  });

  // Sidebar for roles
  const sidebar = (
    <aside className="rolematrix_sider_bar">
      <h5 className="rolematrix_sider_bar-heading">Roles</h5>
      <Radio.Group
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        className="rolematrix_sider_bar-radio-cont"
      >
        {roles.map((role) => (
          <Radio key={role._id} value={role._id} style={{ fontSize: 18 }}>
            {role.roleName}
          </Radio>
        ))}
      </Radio.Group>
    </aside>
  );

  // Custom row class for module rows
  const rowClassName = (record) =>
    record.isModule ? "ant-table-row-module" : "";

  const resetForm = () => {};

  const submitForm = (reason) => {
    alert("reason to update role matrix : " + reason);
    ErrorHandler.SuccessToast("Role Matrix updated successfully");
  };

  const handleExternalSubmit = async () => {
    callActionWarningPopup("add", async (reason) => {
      Swal.close();
      submitForm(reason);
    });
  };

  return (
    <div style={{ display: "flex" }}>
      {sidebar}
      <main style={{ flex: 1, paddingLeft: 36 }}>
        <div className="custom-small-padding-table">
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowClassName={rowClassName}
            bordered
            style={{ background: "#fff" }}
          />
        </div>
        <div className="m-4 text-center">
          <IntactionActionBtns
            actionFunction={handleExternalSubmit}
            setFunc={resetForm}
          />
        </div>
      </main>
    </div>
  );
};

export default RoleMatrix;
