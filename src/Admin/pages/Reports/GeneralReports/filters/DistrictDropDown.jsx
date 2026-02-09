import React, { useCallback, useEffect, useState } from "react";
import Select, { components } from "react-select";
import ErrorHandler from "../../../../../utils/errorhandler";
import api from "../../../../../api/axiosConfig";

const DistrictDropDown = ({
  District,
  setDistrict,
  selectedProfile,
  districtError,
}) => {
  const [profileDistricts, setProfileDistricts] = useState([]);

  const getDistricts = useCallback(async () => {
    try {
      ErrorHandler.onLoading();

      setDistrict([{ value: "0", label: "All" }]);
      setProfileDistricts([]);

      const formdata = new FormData();
      formdata.append("profileIds", selectedProfile);

      const { data } = await api.post(
        `/Report/Report/GetStationDistricts`,
        formdata
      );

      ErrorHandler.onLoadingClose();
      setProfileDistricts(data?.result ?? []);
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  }, [selectedProfile, setDistrict]);

  useEffect(() => {
    getDistricts();
  }, [selectedProfile, getDistricts]);

  // Add "Select All" at the top

  const options = profileDistricts.map((d) => ({
    value: d.value,
    label: d.name,
  }));

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
        Select Districts
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
