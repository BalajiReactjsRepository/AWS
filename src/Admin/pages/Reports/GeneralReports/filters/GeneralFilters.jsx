import React from "react";

import DistrictDropDown from "./DistrictDropDown";
import BlockDropDown from "./BlockDropDown";
import SelectDateRange from "../../SelectDateRange";
import ProfileDropdown from "../../ProfilesDrop";
import StationDropdown from "../../SatationDrop";
import DateRangeComponent from "../../DateRangeComponent";

const GeneralFilters = ({
  selectedProfile,
  onChangeProfile,
  selectedStations,
  setSelectedStations,
  stationError,
  setStationError,
  selectDateType,
  setSelectedDateType,
  setDateRange,
  District,
  setDistrict,
  districtError,
  Block,
  setBlock,
  blockError,
}) => (
  <>
    <div className="col-12 col-md-3 mb-2">
      <ProfileDropdown
        selectedProfile={selectedProfile}
        onChangeProfile={onChangeProfile}
      />
    </div>

    <div className="col-12 col-md-3 mb-2">
      <DistrictDropDown
        District={District}
        setDistrict={setDistrict}
        selectedProfile={selectedProfile}
        districtError={districtError}
      />
    </div>

    <BlockDropDown
      Block={Block}
      setBlock={setBlock}
      blockError={blockError}
      selectedProfile={selectedProfile}
      District={District}
    />

    <div className="col-12 col-md-3 mb-2">
      <StationDropdown
        selectedStations={selectedStations}
        setSelectedStations={setSelectedStations}
        profileId={selectedProfile}
        stationError={stationError}
        setStationError={setStationError}
        disctricts={District}
        Block={Block}
        reportsType={"genaralreport"}
      />
    </div>

    <div className="col-12 col-md-2 mb-2">
      <label className="label-primary" htmlFor="dateSelectType">
        Select Date *
      </label>
      <SelectDateRange
        setSelectedDateType={setSelectedDateType}
        selectDateType={selectDateType}
      />
    </div>

    {selectDateType === "custom" && (
      <div className="col-12 col-md-3 mb-2">
        <label className="label-primary" htmlFor="dateSelect">
          Date Range*
        </label>
        <DateRangeComponent setDateRange={setDateRange} />
      </div>
    )}
  </>
);

export default GeneralFilters;

// profileStations={profileStations}
