import React from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const AddBtn = ({ label, to }) => {
  const navigate = useNavigate();
  return (
    <Button
      type='primary'
      icon={<PlusOutlined />}
      style={{
        marginRight: 8,
        height: "2.4rem",
        cursor: "pointer",
        borderRadius: "2rem",
      }}
      onClick={() => navigate(to)}
    >
      {label}
    </Button>
  );
};

export default AddBtn;
