import React from "react";
import Select from "react-select";

const BlockDropDown = ({ Block, setBlock, districtBlocks, blockError }) => {
  const options = districtBlocks.map((b) => ({
    value: b.value,
    label: b.name,
  }));

  return (
    <div>
      <label htmlFor="Block" className="label-primary">
        Block
      </label>
      <Select
        inputId="Block"
        options={options}
        value={options.find((b) => b.value === Block) || null}
        onChange={(option) => setBlock(option.value)}
        isSearchable
        placeholder="Select Block"
        styles={{
          control: (base, state) => ({
            ...base,
            borderRadius: "1rem",
            minHeight: "40px",
            borderColor: blockError ? "red" : base.borderColor,
            boxShadow: state.isFocused ? "0 0 0 1px #2684FF" : "none",
            "&:hover": {
              borderColor: blockError ? "red" : "#2684FF",
            },
          }),
          menu: (base) => ({
            ...base,
            zIndex: 1000,
            position: "absolute",
          }),
        }}
      />
      {blockError && (
        <span className="text-danger">*Please select a block</span>
      )}
    </div>
  );
};

export default BlockDropDown;
