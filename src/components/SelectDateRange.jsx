import React, { useEffect, useState } from "react";
import DateRangeComponent from "../User/pages/Reports/DateRangeComponent";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
dayjs.extend(customParseFormat);
const dateFormat = "DD-MMM-YYYY";

const SelectDateRange = (props) => {
  const {
    handleCustomRangeDate,
    setSelectedDateType,
    selectDateType,
    value,
    setDataDetialDate,
  } = props;

  const [dateRange, setDateRange] = useState([
    dayjs(), // Current date as a dayjs object
    dayjs(), // Current date as a dayjs object
  ]);

  useEffect(() => {
    const handleCallback = () => {
      handleCustomRangeDate(dateRange);
    };
    handleCallback();
  }, [dateRange, handleCustomRangeDate]);

  const handleDateChange = (e) => {
    if (setDataDetialDate) {
      setDataDetialDate("");
    }
    setSelectedDateType(e.target.value);
  };

  return (
    <div className="d-flex align-items-center">
      <div
        className="report_input-container me-1"
        style={value === "tabularData" ? { border: "none" } : {}}
      >
        <select
          id="selectdate"
          className="date_container_dropdown"
          onChange={handleDateChange}
          value={selectDateType}
        >
          {["Today", "Yesterday", "Custom"].map((label) => (
            <option key={label} value={label.toLocaleLowerCase()}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {selectDateType === "custom" && (
        <DateRangeComponent
          dateFormat={dateFormat}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      )}
    </div>
  );
};

export default SelectDateRange;
