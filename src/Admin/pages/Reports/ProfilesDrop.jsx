import Select from "react-select";

import { useStore } from "../../../Context/masterapis/MasterApisContext.jsx";

const ProfileDropdown = ({ selectedProfile, onChangeProfile }) => {
  const { store } = useStore();

  const options = store.profiles.map((p) => ({
    value: p._id,
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
        value={options.find((option) => option.value === selectedProfile)}
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
      {/* {selectedProfile === "" && <span>prilfe required</span>} */}
    </div>
  );
};

export default ProfileDropdown;
