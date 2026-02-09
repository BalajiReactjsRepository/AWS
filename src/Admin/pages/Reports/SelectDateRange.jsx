import React from "react";

const SelectDateRange = (props) => {
  const { setSelectedDateType, selectDateType, value, setDataDetialDate } =
    props;

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
    </div>
  );
};

export default SelectDateRange;
