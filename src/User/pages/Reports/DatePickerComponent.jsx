import React from "react";
import { DatePicker } from "antd";
const dateFormat = "DD-MMM-YYYY";

const DatePickerComponent = ({ setSelectDate }) => {
  const onChange = (date, dateString) => {
    setSelectDate(dateString);
  };
  return (
    <div>
      <DatePicker
        onChange={onChange}
        format={dateFormat}
        style={{
          border: "1px solid #E6E6E6",
          borderRadius: "25px",
          padding: "0.6rem",
          maxWidth: "264px",
          color: "#171717",
        }}
      />
    </div>
  );
};

export default DatePickerComponent;
