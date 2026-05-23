import React, { useState } from "react";
import ProfileDropdown from "./ProfilesDrop";
import StationDropdown from "./SatationDrop";
import SelectDateRange from "./SelectDateRange.jsx";

import "./reports.css";
import ReportTypeDrop from "./ReportTypeDrop.jsx";
import IssueTypeDrop from "./IssueTypeDrop.jsx";

import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import DateRangeComponent from "./DateRangeComponent.jsx";
dayjs.extend(customParseFormat);

const ReportFiler = ({ dataReportType, callReportApi }) => {
  const [selectDateType, setSelectedDateType] = useState("today");

  const [dateRange, setDateRange] = useState([]);

  const [reportType, setReportType] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(0);
  const [issueType, setIssueType] = useState("");
  const [selectedStations, setSelectedStations] = useState([]);

  const [stationError, setStationError] = useState(false);

  const onChangeProfile = (profile) => {
    setSelectedProfile(profile);
    // getMyStations(profile);
  };

  const handleApicall = () => {
    const dates = { fromDate: "", toDate: "" };

    if (selectedStations.length === 0) {
      setStationError(true);
      return;
    }

    const selectedStationIds = selectedStations
      .filter((s) => s.value !== "0")
      .map((s) => s.value);

    switch (selectDateType) {
      case "yesterday":
        const yesterday = [
          dayjs().subtract(1, "day"),
          dayjs().subtract(1, "day"),
        ].map((d) => d.format("DD-MMM-YYYY"));

        dates.fromDate = yesterday[0];
        dates.toDate = yesterday[1];
        break;
      case "custom":
        dates.fromDate = dateRange[0];
        dates.toDate = dateRange[1];
        break;

      default:
        const today = [dayjs(), dayjs()].map((d) => d.format("DD-MMM-YYYY"));
        dates.fromDate = today[0];
        dates.toDate = today[1];
        break;
    }

    const body = {
      selectedProfile,
      selectedStationIds,
      ...dates,
      reportType,
      issueType,
    };
    callReportApi(body);
  };

  return (
    <div className='mb-4'>
      <div className='row '>
        {dataReportType === "completeReport" && (
          <div className='col-12 col-md-3 mb-2'>
            <ReportTypeDrop
              reportType={reportType}
              setReportType={setReportType}
            />
          </div>
        )}
        {dataReportType === "qualityReport" && (
          <div className='col-12 col-md-3 mb-2'>
            <IssueTypeDrop issueType={issueType} setIssueType={setIssueType} />
          </div>
        )}
        <div className='col-12 col-md-3 mb-2'>
          <ProfileDropdown
            selectedProfile={selectedProfile}
            onChangeProfile={onChangeProfile}
          />
        </div>

        <div className='col-12 col-md-3 mb-2'>
          <StationDropdown
            selectedStations={selectedStations}
            setSelectedStations={setSelectedStations}
            profileId={selectedProfile}
            stationError={stationError}
            // Block={Block}
            setStationError={setStationError}
            reportsType={"datareport"}
          />
        </div>

        <div className='col-12 col-md-2 mb-2'>
          <label className='label-primary' htmlFor='dateSelect'>
            Select Date *
          </label>
          <SelectDateRange
            setSelectedDateType={setSelectedDateType}
            selectDateType={selectDateType}
            dateRange={dateRange}
          />
        </div>

        {selectDateType === "custom" && (
          <div className='col-12 col-md-3 mb-2'>
            <label className='label-primary' htmlFor='dateSelect'>
              Date Range*
            </label>
            <DateRangeComponent setDateRange={setDateRange} />
          </div>
        )}
        <div className='col-12 col-md-3 ms-auto'>
          <label className='label-primary d-none' htmlFor='dateSelect'>
            action
          </label>
          <br />
          <button className='btn btn-primary' onClick={handleApicall}>
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportFiler;
