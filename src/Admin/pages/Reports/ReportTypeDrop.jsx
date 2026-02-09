import React from "react";
import Select from "react-select";

const ReportTypeDrop = ({ reportType, setReportType, goptions }) => {
  const dropOptions = goptions
    ? goptions
    : [
        { label: "Summary", value: "SM" },
        { label: "Detail", value: "DE" },
      ];

  const options = [{ label: "Select Report Type", value: "" }, ...dropOptions];

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
