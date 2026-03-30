import React, { useEffect, useState } from "react";
import Select from "react-select";
import ErrorHandler from "../../../utils/errorhandler.js";
import api from "../../../api/axiosConfig.js";

const StationDropdown = (props) => {
  const {
    selectedStations,
    setSelectedStations,
    profileId,
    stationError,
    setStationError,
    disctricts,
    Block,
    reportsType,
  } = props;

  const [profileStations, setProfileStations] = useState([]);

  useEffect(() => {
    if (!profileId) return;

    const getMyStations = async () => {
      try {
        ErrorHandler.onLoading();
        setSelectedStations([]);
        setProfileStations([]);

        const formdata = new FormData();

        const profileKey =
          reportsType === "genaralreport" ? "profileIds" : "profileId";

        formdata.append(profileKey, profileId);

        if (disctricts) {
          const disctrictId = disctricts
            .filter((o) => o.value !== "0")
            .map((opt) => opt.value)
            .join(",");

          formdata.append("districtsName", disctrictId);
        }

        if (Block) {
          formdata.append("blocksName", Block);
        }

        const url =
          reportsType === "genaralreport"
            ? `/Report/Report/GetStations`
            : `/Admin/ShowStationAccess/GetStationList`;

        const res = await api.post(url, formdata);
        const { data } = res;
        ErrorHandler.onLoadingClose();

        if (data.statusCode === 200) {
          if (reportsType === "genaralreport") {
            const stations = data?.result ?? [];
            const options = stations.map((s) => ({
              value: s.value,
              label: s.name,
            }));
            setProfileStations(options);
          } else {
            const stations = data?.result ?? [];
            const options = stations.map((s) => ({
              value: s._id,
              label: `${s.stationName} (${s.stationId})`,
            }));
            setProfileStations(options);
          }
        } else {
          ErrorHandler.onError({ message: data.message || "Unknown error" });
        }
      } catch (error) {
        ErrorHandler.onLoadingClose();
        ErrorHandler.onError(error);
      }
    };

    getMyStations();
  }, [profileId, disctricts, Block, reportsType, setSelectedStations]);

  // Custom Option with Checkboxes
  const CustomOption = (props) => {
    const { data, isSelected, innerRef, innerProps } = props;

    return (
      <div ref={innerRef} {...innerProps} className='custom-option ms-1'>
        <input
          type='checkbox'
          checked={isSelected}
          onChange={() => null} // avoid React warnings
        />
        <label className='ms-2'>{data.label}</label>
      </div>
    );
  };

  const modifiedStationData = profileStations.map((each) => {
    if (each.value === "0") {
      return { ...each, label: "All" };
    }
    return each;
  });

  const handleSelectChange = (selectedOptions) => {
    setStationError(false);

    if (!selectedOptions) {
      // if all cleared
      setSelectedStations([]);
      return;
    }

    const hasSelectAll = selectedOptions.some((opt) => opt.value === "0");

    const isSelectAllPreviouslySelected = selectedStations.some(
      (opt) => opt.value === "0",
    );

    if (hasSelectAll && !isSelectAllPreviouslySelected) {
      // "Select All" just got selected → select everything
      setSelectedStations(modifiedStationData);
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
    <div className='me-3'>
      <label className='label-primary' htmlFor='stationSelect'>
        Select Station *
      </label>
      <div className='slect-drop-container'>
        <Select
          id='stationSelect'
          options={modifiedStationData}
          value={selectedStations}
          onChange={handleSelectChange}
          isMulti
          isSearchable
          placeholder='Select stations...'
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
        <span className='text-danger'>*please select stations</span>
      ) : (
        <span></span>
      )}
    </div>
  );
};

export default StationDropdown;
