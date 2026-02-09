import React from "react";
import { useParams } from "react-router-dom";

import { Empty, Select } from "antd";
import { ErrorMessage } from "formik";

const NotificationInputs = (props) => {
  const { notificationInputs, values, setFieldValue } = props;
  const { action } = useParams();

  const isViewMode = action?.startsWith("view");
  return (
    <div className="row">
      {notificationInputs.map((item) => (
        <div
          key={item.key}
          className="add-user-input_container col-12 col-md-4 mb-3"
        >
          <label htmlFor={item.name}>{item.label}</label>
          <Select
            id={item.name}
            showSearch
            allowClear
            className="w-100 add-user-input_container"
            placeholder={`Select ${item.label}`}
            value={values[item.name] || undefined}
            onChange={(value) => setFieldValue(item.name, value)}
            disabled={isViewMode}
            notFoundContent={<Empty description="No matching options" />}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.label?.toLowerCase().includes(input.toLowerCase())
            }
            options={item.options}
          />
          <ErrorMessage
            name={item.name}
            component="div"
            className="text-danger mt-1"
          />
        </div>
      ))}
      <hr style={{ border: "1px solid #E4E4E4" }} />
    </div>
  );
};

export default NotificationInputs;
