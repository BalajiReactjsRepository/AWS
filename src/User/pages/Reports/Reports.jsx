/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from "react";

import dayjs from "dayjs";
import moment from "moment";

import ReportTypeDrop from "./ReportTypeDrop";

import { ThreeDot } from "react-loading-indicators";
import { reportTypeConfig } from "./config";

import "./reports.css";

import { getDatebyInputChange } from "./funs";
import { useStationProfile } from "../../../Context/usercontext";
import { apiCaller } from "../../../api/apihelper";
import api from "../../../api/axiosConfig";

const Reports = () => {
  const userData = JSON.parse(
    localStorage.getItem(process.env.REACT_APP_ADMIN_KEY),
  );
  const { profileDetailsList } = userData;

  const { isRjProfile, isKaranataka } = useStationProfile();

  const getCurrentHourTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    return `${hours}:00`;
  };

  const [reportType, setReportType] = useState("gn");
  const [reportsData, setReportsData] = useState([]);
  const [selectDateType, setSelectedDateType] = useState("today");
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);
  const [profileStations, setProfileStations] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(
    profileDetailsList?.length > 0 ? profileDetailsList[0].profileID : "",
  );
  const [selectedStations, setSelectedStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNodata, setShowNodata] = useState(false);
  const [stationError, setStationError] = useState(false);
  const [fileName, setFileName] = useState("station-list.csv");
  const [filterType, setFilterType] = useState("c");
  const [selectedTimes, onChangeTime] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  /// KA FILTERS

  const [District, setDistrict] = useState([{ value: "0", label: "All" }]);
  const [profileDistricts, setProfileDistricts] = useState([]);
  const [districtError, setDistrictError] = useState("");
  const [Block, setBlock] = useState("0");
  const [districtBlocks, setDistrictBlocks] = useState([]);
  const [blockError, setBlockError] = useState("");

  const handleCustomRangeDate = (date) => setDateRange(date);
  const onChangeProfile = (e) => setSelectedProfile(e);

  const isFirstRender = useRef(true);

  const getDistricts = async (profileId) => {
    setDistrict([{ value: "0", label: "All" }]);
    setProfileDistricts([]);
    const formdata = new FormData();
    formdata.append("profileIds", profileId);

    apiCaller({
      apiCall: () => api.post("/Report/Report/GetStationDistricts", formdata),
      onSuccess: (result) => setProfileDistricts(result ?? []),
    });
  };

  const getDistrictsBlocks = useCallback(
    async (profileId, district) => {
      if (!profileId || !district) return; // guard clause

      setBlock("0");
      setDistrictBlocks([]);
      const disctricts = district
        .filter((o) => o.value !== "0")
        .map((opt) => opt.value)
        .join(",");
      const formdata = new FormData();
      formdata.append("profileIds", profileId);
      formdata.append("districtsName", disctricts);

      apiCaller({
        apiCall: () => api.post("/Report/Report/GetStationBlocks", formdata),
        onSuccess: (result) => setDistrictBlocks(result ?? []),
      });
    },
    [], // only re-create when token changes
  );

  const getMyStations = async (profileId, district, Block) => {
    if (reportType !== "gn") return;

    setSelectedStations([]);
    setProfileStations([]);
    const disctricts = district
      .filter((o) => o.value !== "0")
      .map((opt) => opt.value)
      .join(",");

    const formdata = new FormData();
    formdata.append("profileIds", profileId);
    formdata.append("districtsName", disctricts);
    formdata.append("blocksName", Block);

    apiCaller({
      apiCall: () => api.post("/Report/Report/GetStations", formdata),
      onSuccess: (result) => setProfileStations(result ?? []),
    });
  };

  useEffect(() => {
    getDistricts(selectedProfile);
  }, [selectedProfile]);

  // useEffect(() => {
  //   getDistrictsBlocks(selectedProfile, District);
  // }, [selectedProfile, District]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const hasValidDistrict = District.some((d) => d.value !== "0");

    if (!selectedProfile || !hasValidDistrict) return;

    getDistrictsBlocks(selectedProfile, District);
  }, [selectedProfile, District]);

  useEffect(() => {
    getMyStations(selectedProfile, District, Block);
  }, [selectedProfile, District, Block]);

  const fetchGeneralReport = async () => {
    setReportsData([]);

    const ids = selectedStations
      .filter((o) => o.value !== "0")
      .map((opt) => opt.value)
      .join(",");

    const disctricts = District.filter((o) => o.value !== "0")
      .map((opt) => opt.value)
      .join(",");

    const { formDate, toDate } = getDatebyInputChange(
      selectDateType,
      dateRange,
    );

    if (!selectedStations.length) return setStationError(true);
    if (!formDate || !toDate) return alert("Please select date");

    setShowNodata(true);

    const formdata = new FormData();
    formdata.append("StationIds", ids);
    formdata.append("fromDate", formDate);
    formdata.append("toDate", toDate);
    formdata.append("District", disctricts);
    formdata.append("Block", Block);

    apiCaller({
      setLoading,
      apiCall: () => api.post("/Report/Report/DataReport", formdata),
      onSuccess: (result) => {
        setReportsData(result ?? []);
        const profile = profileDetailsList.find(
          (p) => p.profileID === selectedProfile,
        );
        const filename =
          selectedStations.length > 1
            ? `ZIP-${profile?.profileName}-${moment().format("DD-MMM-YYYY")}`
            : `ZIP-${selectedStations[0]?.label}-${moment().format(
                "DD-MMM-YYYY",
              )}`;
        setFileName(filename);
      },
    });
  };

  const fetchSummaryReport = async (subPath, formdata) => {
    setShowNodata(true);

    apiCaller({
      setLoading,
      apiCall: () => api.post(`/Report/Report/${subPath}`, formdata),
      onSuccess: (result) => {
        setReportsData(result ?? []);

        const profile = profileDetailsList.find(
          (p) => p.profileID === selectedProfile,
        );
        const now = new Date();
        const formattedDate = now
          .toLocaleDateString("en-GB")
          .replace(/\//g, "-");

        setFileName(
          `${subPath}_${profile?.profileName || ""}_${formattedDate}`,
        );
      },
    });
  };

  const config = reportTypeConfig[reportType];

  // Utility function to get FormData for summary reports
  const createBaseFormData = () => {
    const formdata = new FormData();
    if (!selectedProfile) {
      // ErrorHandler.onError({ message: "Please select a profile." });
      return null;
    }
    formdata.append("profileId", selectedProfile);
    return formdata;
  };

  // Utility: summary report mapping
  const summaryReportMap = {
    rwl: "WaterLevelSummaryReport",
    ws: "AWSSummaryReport",
    gd: "GDSummaryReport",
    rgs: "SummaryDetailsReport",
  };

  const handleApicall = () => {
    const formdata = createBaseFormData();
    if (!formdata) return;

    switch (reportType) {
      case "rwl":
      case "ws":
      case "gd":
        fetchSummaryReport(summaryReportMap[reportType], formdata);
        break;

      case "rgs":
        const formattedDate = selectedDate
          ? dayjs(selectedDate).format("DD-MMM-YYYY")
          : "";
        const hours =
          selectedTimes.length > 0
            ? selectedTimes.join(",")
            : getCurrentHourTime();
        formdata.append("date", formattedDate);
        formdata.append("filterType", filterType);
        formdata.append("hours", hours);

        fetchSummaryReport(summaryReportMap[reportType], formdata);
        break;

      default:
        fetchGeneralReport();
        break;
    }
  };

  const onChangeReportType = (selectedOption) => {
    setReportsData([]);
    setShowNodata(false);
    onChangeTime([]);
    setSelectedDate(dayjs());
    setFilterType("c");
    setSelectedStations([]);
    setReportType(selectedOption);
  };

  useEffect(() => {
    onChangeTime([]);
    setSelectedDate(dayjs());
  }, [filterType]);

  return (
    <div className='mainContInfo'>
      <h5 className='report-title'>Reports</h5>
      <div className='row inputs-containr_header'>
        {isRjProfile && (
          <div className='col-12 col-md-3 mb-2'>
            <ReportTypeDrop
              reportType={reportType}
              setReportType={onChangeReportType}
              setReportsData={setReportsData}
              setShowNodata={setShowNodata}
            />
          </div>
        )}

        {config?.renderFilters({
          selectedProfile,
          onChangeProfile,
          profileDetailsList,
          selectedStations,
          setSelectedStations,
          profileStations,
          stationError,
          setStationError,
          selectDateType,
          setSelectedDateType,
          handleCustomRangeDate,
          filterType,
          setFilterType,
          selectedTimes,
          onChangeTime,
          selectedDate,
          setSelectedDate,
          reportsData,
          // ka filters
          isKaranataka,
          District,
          setDistrict,
          profileDistricts,
          districtError,
          setDistrictError,
          Block,
          setBlock,
          districtBlocks,
          blockError,
          setBlockError,
        })}

        <div className='col-12 col-md-2 mt-3'>
          <button className='btn btn-primary' onClick={handleApicall}>
            Generate Report
          </button>
        </div>
      </div>

      <div>
        {loading ? (
          <div
            className='text-center'
            style={{
              minHeight: "5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThreeDot color='#f58142' size='small' />
          </div>
        ) : reportsData?.length > 0 ? (
          config?.TableComponent && (
            <config.TableComponent
              selectDateType={selectDateType}
              data={reportsData}
              fileName={fileName}
              dateRange={dateRange}
            />
          )
        ) : (
          <div
            className='text-center h-50'
            style={{
              minHeight: "5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {showNodata && (
              <div className='my-3 text-danger'>No Data found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
