import React from "react";
import Select from "react-select";

const ParameterDropdown = ({ highlighteds, setHighlighteds, parameters }) => {
  const options = parameters.map((s) => ({ value: s, label: s }));

  // Custom Option with Checkboxes
  const CustomOption = ({ data, isSelected, innerRef, innerProps }) => (
    <div ref={innerRef} {...innerProps} className="custom-option ms-1">
      <input id={data?.label} type="checkbox" checked={isSelected} readOnly />
      <label className="ms-2">{data?.label}</label>
    </div>
  );

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span
        style={{ fontWeight: "bold", fontSize: "14px", marginRight: "5px" }}
      >
        Select:
      </span>
      <div className="slect-drop-container">
        <Select
          id="stationSelect"
          options={options}
          value={options.filter((option) =>
            highlighteds.includes(option.value)
          )}
          onChange={(selectedOptions) =>
            setHighlighteds(
              selectedOptions ? selectedOptions.map((opt) => opt.value) : []
            )
          }
          isMulti
          isSearchable
          placeholder="select parameter"
          components={{ Option: CustomOption }}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          styles={{
            control: (base, state) => ({
              ...base,
              border: "none",
              outline: "none",
              boxShadow: state.isFocused ? "none" : base.boxShadow,
              minWidth: "280px",
              maxWidth: "500px",
              minHeight: "36px",
              height: "36px",
              overflow: "auto",
            }),
            menu: (base) => ({
              ...base,
              zIndex: 1000,
              position: "absolute",
            }),
          }}
        />
      </div>
    </div>
  );
};

export default ParameterDropdown;
