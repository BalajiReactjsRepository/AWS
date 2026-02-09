import React from "react";
import Select, { components } from "react-select";

const DistrictDropDown = ({
  District,
  setDistrict,
  profileDistricts,
  districtError,
}) => {
  // Add "Select All" at the top
  const options = profileDistricts.map((d) => ({
    value: d.value,
    label: d.name,
  }));

  // const handleSelectChange = (selectedOptions) => {
  //   if (!selectedOptions || selectedOptions.length === 0) {
  //     setDistrict([]);
  //     return;
  //   }

  //   const isSelectAllSelected = selectedOptions.some(
  //     (opt) => opt.value === "0"
  //   );

  //   if (isSelectAllSelected) {
  //     // Select all (except duplicate "Select All" itself)
  //     setDistrict(options);
  //   } else if (selectedOptions.length === options.length - 1) {
  //     // If all districts selected manually, include Select All too
  //     setDistrict(options);
  //   } else {
  //     // Normal selection (exclude Select All if present)
  //     const filtered = selectedOptions.filter((opt) => opt.value !== "0");
  //     setDistrict(filtered);
  //   }
  // };

  // Custom checkbox option

  const handleSelectChange = (selectedOptions) => {
    //setStationError(false);

    if (!selectedOptions) {
      // if all cleared
      setDistrict([{ value: "0", label: "All" }]);
      return;
    }

    const hasSelectAll = selectedOptions.some((opt) => opt.value === "0");
    const isSelectAllPreviouslySelected = District.some(
      (opt) => opt.value === "0"
    );

    if (hasSelectAll && !isSelectAllPreviouslySelected) {
      // "Select All" just got selected → select everything
      setDistrict(options);
    } else if (!hasSelectAll && isSelectAllPreviouslySelected) {
      // "Select All" just got unselected → clear everything
      setDistrict([]);
    } else {
      // Normal selection logic
      const filtered = selectedOptions.filter((opt) => opt.value !== "0");
      setDistrict(filtered);
    }
  };

  const CustomOption = (props) => {
    const { data, isSelected, innerRef, innerProps } = props;
    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="custom-option ms-1 d-flex align-items-center"
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => null}
          className="form-check-input me-2"
        />
        <label className="m-0">{data.label}</label>
      </div>
    );
  };

  // Custom MultiValue (optional, to simplify chip display)
  const MultiValue = (props) => {
    const { data } = props;
    if (data.value === "0") return null; // hide "Select All" tag
    return <components.MultiValue {...props} />;
  };

  return (
    <div>
      <label htmlFor="District" className="label-primary">
        District
      </label>
      <div className="slect-drop-container">
        <Select
          id="District"
          options={options}
          value={District}
          onChange={handleSelectChange}
          isMulti
          isSearchable
          placeholder="Select districts..."
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{ Option: CustomOption, MultiValue }}
          styles={{
            control: (base, state) => ({
              ...base,
              border: "none",
              outline: "none",
              boxShadow: "none",
              minHeight: "1.9rem",
              height: "1.9rem",
              overflow: "auto",
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
      {districtError && (
        <span className="text-danger">*Please select a district</span>
      )}
    </div>
  );
};

export default DistrictDropDown;
