import React from "react";
import Select from "react-select";

const ReportTypeDrop = ({ reportType, setReportType }) => {
  const options = [
    { label: "General", value: "gn" },
    { label: "Raingauge Station", value: "rgs" },
    { label: "Gauge and Discharge", value: "gd" },
    { label: "Weather Station", value: "ws" },
    { label: "Reservoirs Water Level", value: "rwl" },
  ];

  const onChangeReportType = (selectedOption) => {
    setReportType(selectedOption ? selectedOption.value : "gn");
  };

  const selectedOption = options.find((option) => option.value === reportType);

  return (
    <div className="me-3">
      <label htmlFor="reportType" className="label-primary">
        Report Type *
      </label>
      <Select
        inputId="reportType"
        options={options}
        value={selectedOption || options[0]} // fallback to first option
        onChange={onChangeReportType}
        isSearchable
        placeholder="Select report type..."
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "1rem",
            minHeight: "40px",
          }),
          menu: (base) => ({
            ...base,
            zIndex: 1000,
            position: "absolute",
          }),
        }}
      />
    </div>
  );
};

export default ReportTypeDrop;
