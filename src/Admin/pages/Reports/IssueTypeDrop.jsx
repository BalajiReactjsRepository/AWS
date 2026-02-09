import React from "react";
import Select from "react-select";

const IssueTypeDrop = ({ issueType, setIssueType }) => {
  const options = [
    { label: "select Issue Type", value: "" },
    { label: "OutOfRange", value: "OutOfRange" },
    { label: "InvalidDate", value: "InvalidDate" },
    { label: "BlankValue", value: "BlankValue" },
    { label: "InvalidTime", value: "InvalidTime" },
    {
      label: "Unexpected Character or Value",
      value: "Unexpected Character or Value",
    },
  ];

  // OutOfRange,
  // InvalidDate
  // BlankValue,
  // InvalidTime
  // Unexpected Character or Value

  const onChangeReportType = (selectedOption) => {
    setIssueType(selectedOption ? selectedOption.value : "");
  };

  const selectedOption = options.find((option) => option.value === issueType);

  return (
    <div className="me-3">
      <label htmlFor="issueType" className="label-primary">
        Select Issue Type
      </label>
      <Select
        inputId="issueType"
        options={options}
        value={selectedOption || options[0]} // fallback to first option
        onChange={onChangeReportType}
        isSearchable
        placeholder="Select issue type..."
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

export default IssueTypeDrop;
