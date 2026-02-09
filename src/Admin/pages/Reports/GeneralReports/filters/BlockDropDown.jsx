import React, { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import ErrorHandler from "../../../../../utils/errorhandler.js";
import api from "../../../../../api/axiosConfig.js";

const BlockDropDown = ({
  Block,
  setBlock,
  selectedProfile,
  District,
  blockError,
}) => {
  // Stores fetched blocks for selected districts
  const [districtBlocks, setDistrictBlocks] = useState([]);

  /**
   * Fetch blocks based on:
   * - Selected profile
   * - Selected district list
   */
  const getDistrictBlocks = useCallback(async () => {
    // Guard clause → avoid API call if required values are missing
    if (!selectedProfile || !District?.length) return;

    try {
      // Reset block selection before loading new blocks
      setBlock("0");
      setDistrictBlocks([]);

      // Extract valid district values (excluding default "0")
      const districtNames = District.filter((d) => d.value !== "0")
        .map((d) => d.value)
        .join(",");

      // Prepare form data for API
      const formData = new FormData();
      formData.append("profileIds", selectedProfile);
      formData.append("districtsName", districtNames);

      // API call
      const { data } = await api.post(
        "/Report/Report/GetStationBlocks",
        formData
      );

      ErrorHandler.onLoadingClose();

      // Store API response safely
      setDistrictBlocks(data?.result ?? []);
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  }, [selectedProfile, District, setBlock]);

  /**
   * Trigger block fetch whenever
   * profile or district changes
   */
  useEffect(() => {
    getDistrictBlocks();
  }, [getDistrictBlocks]);

  /**
   * Transform API blocks into react-select options format
   */
  const options = districtBlocks.map((block) => ({
    value: block.value,
    label: block.name,
  }));

  // ✅ Do not render dropdown if no blocks are available
  if (!districtBlocks.length) return null;

  return (
    <div className="col-12 col-md-3 mb-2">
      <div>
        <label htmlFor="Block" className="label-primary">
          Block
        </label>

        <Select
          inputId="Block"
          options={options}
          value={options.find((b) => b.value === Block) || null}
          onChange={(option) => setBlock(option?.value || "0")}
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

        {/* Validation error message */}
        {blockError && (
          <span className="text-danger">*Please select a block</span>
        )}
      </div>
    </div>
  );
};

export default BlockDropDown;
