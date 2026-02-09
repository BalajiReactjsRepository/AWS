import React from "react";
import Select from "react-select";

const ProfileDropdown = ({
  selectedProfile,
  onChangeProfile,
  profileDetailsList,
}) => {
  // Convert profileDetailsList to react-select format
  const options = profileDetailsList?.map((p) => ({
    value: p.profileID,
    label: p.profileName,
  }));

  return (
    <div className="me-3">
      <label className="label-primary" htmlFor="profileSelect">
        Select Profile *
      </label>
      <Select
        id="profileSelect"
        options={options}
        value={options?.find((option) => option.value === selectedProfile)}
        onChange={(selectedOption) =>
          onChangeProfile(selectedOption ? selectedOption.value : 0)
        }
        isSearchable
        placeholder="Select profile ..."
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "1rem",
          }),
          menu: (base) => ({
            ...base,
            zIndex: 1000,
            position: "absolute",
          }),
        }}
      />
      {selectedProfile === "" && <span>prilfe required</span>}
    </div>
  );
};

export default ProfileDropdown;
