import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

const AddBtn = ({ label }) => {
  return (
    <Button
      type="primary"
      icon={<PlusOutlined />}
      style={{
        marginRight: 8,
        height: "2.4rem",
        cursor: "pointer",
        borderRadius: "2rem",
      }}
    >
      {label}
    </Button>
  );
};

export default AddBtn;
