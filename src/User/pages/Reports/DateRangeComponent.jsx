import React from "react";
import { DatePicker, Space } from "antd";

const { RangePicker } = DatePicker;

const DateRangeComponent = (props) => {
  const { dateRange, setDateRange, dateFormat } = props;

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  return (
    <Space direction="vertical" size={14}>
      <RangePicker
        value={dateRange}
        onChange={handleDateChange}
        format={dateFormat}
        allowClear={false}
        style={{
          border: "1px solid #E6E6E6",
          borderRadius: "25px",
          padding: "0.6rem",
          maxWidth: "264px",
        }}
      />
    </Space>
  );
};

export default DateRangeComponent;
