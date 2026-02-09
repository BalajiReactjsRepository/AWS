/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import dayjs from "dayjs";
import moment from "moment";
import ErrorHandler from "../../../../utils/errorhandler.js";

//import ReportTypeDrop from "./ReportTypeDrop";

import { ThreeDot } from "react-loading-indicators";
import { getDatebyInputChange, reportTypeConfig } from "./config";

import "./reports.css";
import api from "../../../../api/axiosConfig.js";
import ReportTypeDrop from "../ReportTypeDrop.jsx";
import { useStore } from "../../../../Context/masterapis/MasterApisContext.jsx";

const Reports = () => {
  const { store } = useStore();

  const profileDetailsList = store.profiles;

  const getCurrentHourTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    return `${hours}:00`;
  };

  const [reportType, setReportType] = useState("gn");
  const [reportsData, setReportsData] = useState([]);
  const [selectDateType, setSelectedDateType] = useState("today");
  const [dateRange, setDateRange] = useState([]);

  const [selectedProfile, setSelectedProfile] = useState("");
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

  const [districtError, setDistrictError] = useState("");
  const [Block, setBlock] = useState("0");

  const [blockError, setBlockError] = useState("");

  const onChangeProfile = (e) => setSelectedProfile(e);

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
      dateRange
    );
    if (!selectedStations.length) return setStationError(true);
    if (!formDate || !toDate) return alert("Please select date");

    try {
      setLoading(true);
      setShowNodata(true);

      const formdata = new FormData();
      formdata.append("StationIds", ids);
      formdata.append("fromDate", formDate);
      formdata.append("toDate", toDate);
      formdata.append("District", disctricts);
      formdata.append("Block", Block);

      const res = await api.post(`/Report/Report/DataReport`, formdata);

      const { data } = res;

      if (data.statusCode === 200) {
        setLoading(false);
        setReportsData(data.result);
        const profile = profileDetailsList.find(
          (p) => p._id === selectedProfile
        );

        const filename =
          selectedStations.length > 1
            ? `ZIP-${profile?.profileName}-${moment().format("DD-MMM-YYYY")}`
            : `ZIP-${selectedStations[0]?.label}-${moment().format(
                "DD-MMM-YYYY"
              )}`;
        setFileName(filename);
      } else {
        setLoading(false);
        ErrorHandler.onError({ message: data.message || "Unknown error" });
      }
    } catch (error) {
      setLoading(false);

      ErrorHandler.onError(error);
    }
  };

  const fetchSummaryReport = async (subPath, formdata) => {
    try {
      setLoading(true);
      setShowNodata(true);

      const { data } = await api.post(`/Report/Report/${subPath}`, formdata);

      setLoading(false);
      if (data.statusCode === 200) {
        setReportsData(data.result);
        const profile = profileDetailsList.find(
          (p) => p._id === selectedProfile
        );
        const now = new Date();
        const formattedDate = now
          .toLocaleDateString("en-GB")
          .replace(/\//g, "-");

        setFileName(
          `${subPath}_${profile?.profileName || ""}_${formattedDate}`
        );
      } else {
        ErrorHandler.onError({ message: data.message || "Unknown error" });
      }
    } catch (error) {
      setLoading(false);
      ErrorHandler.onError(error);
    }
  };

  const config = reportTypeConfig[reportType];

  // Utility function to get FormData for summary reports
  const createBaseFormData = () => {
    const formdata = new FormData();
    if (!selectedProfile) {
      ErrorHandler.onError({ message: "Please select a profile." });
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

  const options = [
    { label: "General", value: "gn" },
    { label: "Raingauge Station", value: "rgs" },
    { label: "Gauge and Discharge", value: "gd" },
    { label: "Weather Station", value: "ws" },
    { label: "Reservoirs Water Level", value: "rwl" },
  ];

  return (
    <div className="mainContInfo">
      <h5 className="report-title">Reports</h5>
      <div className="row inputs-containr_header">
        <div className="col-12 col-md-3 mb-2">
          <ReportTypeDrop
            reportType={reportType}
            setReportType={onChangeReportType}
            goptions={options}
          />
        </div>

        {config?.renderFilters({
          selectedProfile,
          onChangeProfile,
          profileDetailsList,
          selectedStations,
          setSelectedStations,
          stationError,
          setStationError,
          selectDateType,
          setSelectedDateType,
          filterType,
          setFilterType,
          selectedTimes,
          onChangeTime,
          selectedDate,
          setSelectedDate,
          reportsData,
          District,
          setDistrict,
          districtError,
          setDistrictError,
          Block,
          setBlock,
          blockError,
          setBlockError,
          setDateRange,
        })}

        <div className="col-12 col-md-2 mt-3">
          <button className="btn btn-primary" onClick={handleApicall}>
            Generate Report
          </button>
        </div>
      </div>

      <div>
        {loading ? (
          <div
            className="text-center"
            style={{
              minHeight: "5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ThreeDot color="#f58142" size="small" />
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
            className="text-center h-50"
            style={{
              minHeight: "5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {showNodata && (
              <div className="my-3 text-danger">No Data found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
