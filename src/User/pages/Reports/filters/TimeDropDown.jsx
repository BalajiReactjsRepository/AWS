import React from "react";
import Select from "react-select";

import "../reports.css";

// Generate options for every minute of the day in HH:MM format
// const generateMinuteOptions = () => {
//   const options = [];
//   for (let h = 0; h < 24; h++) {
//     for (let m = 0; m < 60; m++) {
//       const time = `${String(h).padStart(2, "0")}:${String(m).padStart(
//         2,
//         "0"
//       )}`;
//       options.push({ value: time, label: time });
//     }
//   }
//   return options;
// };

const generateHourOptions = () => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    const time = `${String(h).padStart(2, "0")}:00`;
    options.push({ value: time, label: time });
  }
  return options;
};

const TimeDropDown = ({ selectedTimes, onChangeTime }) => {
  const options = generateHourOptions();

  return (
    <div className="me-3">
      <label className="label-primary" htmlFor="timeSelect">
        Select Time(s) *
      </label>
      <Select
        id="timeSelect"
        options={options}
        value={options.filter((opt) => selectedTimes.includes(opt.value))}
        onChange={(selectedOptions) =>
          onChangeTime(
            selectedOptions ? selectedOptions.map((opt) => opt.value) : []
          )
        }
        isMulti
        isSearchable
        placeholder="Select time(s)..."
        closeMenuOnSelect={false} // ⬅️ Keeps dropdown open on selection
        hideSelectedOptions={true} // ⬅️ Allows reselecting options
        className="no-scrollbar"
        styles={{
          control: (base, state) => ({
            ...base,
            height: "2rem",
            overflow: "auto",
            borderRadius: "1rem",
            scrollbarWidth: "none",
          }),

          menu: (base) => ({
            ...base,
            zIndex: 1000,
            position: "absolute",
            maxHeight: "300px", // limit menu height for performance
            overflowY: "auto",
          }),
        }}
      />
    </div>
  );
};

export default TimeDropDown;
