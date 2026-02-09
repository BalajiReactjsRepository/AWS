import React from "react";
import ProfileDropdown from "../ProfilesDrop";

const SummaryStationFilter = ({
  selectedProfile,
  onChangeProfile,
  profileDetailsList,
}) => (
  <div className="col-12 col-md-2 mb-2">
    <ProfileDropdown
      selectedProfile={selectedProfile}
      onChangeProfile={onChangeProfile}
      profileDetailsList={profileDetailsList}
    />
  </div>
);

export default SummaryStationFilter;
