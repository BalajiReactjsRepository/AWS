import React from "react";
import Select from "react-select";

const StationDropdown = (props) => {
  const {
    selectedStations,
    setSelectedStations,
    profileStations,
    stationError,
    setStationError,
  } = props;

  const options = profileStations.map((s) => ({
    value: s.value,
    label: s.name,
  }));

  // Custom Option with Checkboxes
  const CustomOption = (props) => {
    const { data, isSelected, innerRef, innerProps } = props;

    return (
      <div ref={innerRef} {...innerProps} className="custom-option ms-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => null} // avoid React warnings
        />
        <label className="ms-2">{data.label}</label>
      </div>
    );
  };

  const handleSelectChange = (selectedOptions) => {
    setStationError(false);

    if (!selectedOptions) {
      // if all cleared
      setSelectedStations([]);
      return;
    }

    const hasSelectAll = selectedOptions.some((opt) => opt.value === "0");
    const isSelectAllPreviouslySelected = selectedStations.some(
      (opt) => opt.value === "0"
    );

    if (hasSelectAll && !isSelectAllPreviouslySelected) {
      // "Select All" just got selected → select everything
      setSelectedStations(options);
    } else if (!hasSelectAll && isSelectAllPreviouslySelected) {
      // "Select All" just got unselected → clear everything
      setSelectedStations([]);
    } else {
      // Normal selection logic
      const filtered = selectedOptions.filter((opt) => opt.value !== "0");
      setSelectedStations(filtered);
    }
  };

  return (
    <div className="me-3">
      <label className="label-primary" htmlFor="stationSelect">
        Select Station *
      </label>
      <div className="slect-drop-container">
        <Select
          id="stationSelect"
          options={options}
          value={selectedStations}
          onChange={handleSelectChange}
          isMulti
          isSearchable
          placeholder="Select stations..."
          components={{ Option: CustomOption }}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          styles={{
            control: (base, state) => ({
              ...base,
              border: "none",
              outline: "none",
              boxShadow: state.isFocused ? "none" : base.boxShadow,
              minHeight: "1.9rem",
              height: "1.9rem",
              overflow: "auto",
              scrollbarWidth: "none",
            }),
            menu: (base) => ({
              ...base,
              zIndex: 1000,
              position: "absolute",
              width: "180%",
            }),
          }}
        />
      </div>
      {stationError ? (
        <span className="text-danger">*please select stations</span>
      ) : (
        <span></span>
      )}
    </div>
  );
};

export default StationDropdown;
