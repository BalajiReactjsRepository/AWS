import React from "react";
import Form from "react-bootstrap/Form";
import { DatePicker } from "antd";

import ProfileDropdown from "../ProfilesDrop";
import TimeDropDown from "./TimeDropDown";

const RainGuageFilters = ({
  selectedProfile,
  onChangeProfile,
  profileDetailsList,
  filterType,
  setFilterType,
  selectedDate,
  setSelectedDate,
  selectedTimes,
  onChangeTime,
}) => {
  const showDatePicker = filterType !== "c";
  const showTimePicker = filterType === "h";

  return (
    <>
      <div className="col-12 col-md-2 mb-2">
        <ProfileDropdown
          selectedProfile={selectedProfile}
          onChangeProfile={onChangeProfile}
          profileDetailsList={profileDetailsList}
        />
      </div>

      <div className="col-12 col-md-3 mt-4 fw-bold">
        {["c", "h", "d"].map((type) => (
          <Form.Check
            key={type}
            inline
            label={type === "c" ? "Current" : type === "h" ? "Hourly" : "Daily"}
            name="filterType"
            type="radio"
            value={type}
            checked={filterType === type}
            onChange={(e) => setFilterType(e.target.value)}
            id={`filter-radio-${type}`}
          />
        ))}
      </div>

      {showDatePicker && (
        <div className="col-12 col-md-3 mb-2">
          <label className="label-primary" htmlFor="dateSelect">
            Date *
          </label>
          <br />
          <DatePicker
            style={{
              width: "100%",
              border: "1px solid #E6E6E6",
              borderRadius: "1rem",
              padding: "0.5rem",
              maxWidth: "264px",
              color: "#171717",
            }}
            id="dateSelect"
            value={selectedDate}
            onChange={setSelectedDate}
            format="DD/MM/YYYY"
          />
        </div>
      )}

      {showTimePicker && (
        <div className="col-12 col-md-3 mb-2">
          <TimeDropDown
            selectedTimes={selectedTimes}
            onChangeTime={onChangeTime}
          />
        </div>
      )}
    </>
  );
};

export default RainGuageFilters;
