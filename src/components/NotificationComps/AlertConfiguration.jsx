import React from "react";
import { Select, Input, Button, Table, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import trashIcon from "../../images/AdminImages/trash.png";
import "../components.css";

const parameterOptions = [
  { label: "Water level", value: "water_level" },
  { label: "Temperature", value: "temperature" },
];

const operatorOptions = [
  { label: ">=", value: ">=" },
  { label: "<=", value: "<=" },
  { label: "=", value: "=" },
];

const AlertConfiguration = ({ configurations, setConfigurations }) => {
  // Add a new configuration row
  const addConfiguration = () => {
    setConfigurations([
      ...configurations,
      { key: Date.now(), parameter: "", operator: "", value: "" },
    ]);
  };

  // Update a configuration row
  const updateConfiguration = (key, field, newValue) => {
    setConfigurations((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, [field]: newValue } : item
      )
    );
  };

  // Delete a configuration row
  const deleteConfiguration = (key) => {
    setConfigurations((prev) => prev.filter((item) => item.key !== key));
  };

  // Memoized columns for better performance
  const columns = [
    {
      title: "Parameter",
      dataIndex: "parameter",
      render: (_, record) => (
        <Select
          showSearch
          className="w-100 add-user-input_container"
          placeholder="Select Parameter"
          notFoundContent={<Empty description="No matching options" />}
          value={record.parameter || undefined}
          onChange={(value) =>
            updateConfiguration(record.key, "parameter", value)
          }
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={parameterOptions}
          allowClear
        />
      ),
    },
    {
      title: "Operator",
      dataIndex: "operator",
      render: (_, record) => (
        <Select
          showSearch
          className="w-100 add-user-input_container"
          placeholder="Select Operator"
          notFoundContent={<Empty description="No matching options" />}
          value={record.operator || undefined}
          onChange={(value) =>
            updateConfiguration(record.key, "operator", value)
          }
          options={operatorOptions}
          allowClear
        />
      ),
    },
    // {
    //   title: "Value",
    //   dataIndex: "value",
    //   render: (_, record) => (
    //     <Input
    //       style={{ background: "#0000000a" }}
    //       value={record.value}
    //       onChange={(e) =>
    //         updateConfiguration(record.key, "value", e.target.value)
    //       }
    //       placeholder="Enter Value"
    //     />
    //   ),
    // },
    {
      title: "Value",
      dataIndex: "value",
      render: (_, record) => (
        <Input
          style={{ background: "#0000000a" }}
          value={record.value}
          onChange={(e) => {
            let val = e.target.value;
            // Remove all except digits and dots
            val = val.replace(/[^0-9.]/g, "");
            // Allow only one dot
            const parts = val.split(".");
            if (parts.length > 2) {
              val = parts[0] + "." + parts.slice(1).join("");
            }
            updateConfiguration(record.key, "value", val);
          }}
          placeholder="Enter Value"
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Button
          onClick={() => deleteConfiguration(record.key)}
          danger
          type="text"
          icon={
            <img
              src={trashIcon}
              alt="delete"
              style={{ width: 16, height: 16 }}
            />
          }
          aria-label="Delete Configuration"
        />
      ),
      width: 70,
      align: "center",
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Alert Configuration</h4>
        <Button
          icon={<PlusOutlined />}
          onClick={addConfiguration}
          style={{
            height: "2.4rem",
            borderRadius: "2rem",
            color: "#256DF0",
            border: "2px solid #B9B9B9",
            fontWeight: 500,
          }}
        >
          Add New Alert Configuration
        </Button>
      </div>

      <Table
        className="alert-config-table"
        columns={columns}
        dataSource={configurations}
        pagination={false}
        rowKey="key"
        locale={{
          emptyText: (
            <h6 style={{ color: "#000", fontWeight: 500 }}>No configuration</h6>
          ),
        }}
        size="small"
        bordered
        style={{ marginBottom: 20 }}
      />

      <hr style={{ border: "1px solid #E4E4E4", marginTop: 0 }} />
    </div>
  );
};

export default AlertConfiguration;
