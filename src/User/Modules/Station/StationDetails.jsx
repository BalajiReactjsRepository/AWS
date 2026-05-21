import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import StationView from "./StationView";

import GraphsIcon from "../../../images/UserImages/Graphs-icon.svg";
import ActiveGraphsIcon from "../../../images/UserImages/ActiveGraphs-icon.svg";
import TabularViewIcon from "../../../images/UserImages/TabularView-icon.svg";
import ActiveTabularViewIcon from "../../../images/UserImages/ActiveTabularView-icon.svg";

import GraphicalData from "../Graphs/GraphicalData";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";

import SelectDateRange from "../../../components/SelectDateRange";
import moment from "moment";

import DataTable from "./DataTable";
import CustomOverviewTable from "./CustormOverviewTable";
import api from "../../../api/axiosConfig";
import { apiCaller } from "../../../api/apihelper";

dayjs.extend(customParseFormat);

const StationDetails = () => {
  const [reqView, setRequiredView] = useState("tabularView");
  const [selectDateType, setSelectedDateType] = useState("today");
  const [SelectDate, setSelectedDate] = useState("");
  const [dataDetialDate, setDataDetialDate] = useState("");

  const location = useLocation();
  const {
    stationData = {},
    profileId = "",
    district = "",
  } = location.state || {};

  const navigateTo = (path) => {
    setRequiredView(path);
  };

  const handleCustomRangeDate = (date) => {
    setSelectedDate(date);
  };

  const [summaryData, setSummaryData] = useState([]);
  const [detailedData, setDetailedData] = useState([]);
  const [overviewData, setOverviewData] = useState([]);

  const { stationId = "" } = stationData;

  const today = moment().format("DD-MMM-YYYY");
  const yesterday = moment().subtract(1, "day").format("DD-MMM-YYYY");
  const last7Days = moment().subtract(7, "day").format("DD-MMM-YYYY");
  const last30Days = moment().subtract(30, "day").format("DD-MMM-YYYY");
  const isRangeType = ["custom", "last 7 days", "last 30 days"].includes(
    selectDateType,
  );

  const fromDate = SelectDate[0]?.$d;
  const toDate = SelectDate[1]?.$d;

  const dateFormatter = (date) => {
    return moment(date, "ddd MMM DD YYYY HH:mm:ss [GMT]Z").format(
      "DD-MMM-YYYY",
    );
  };

  useEffect(() => {
    const fetchSummary = async () => {
      const url = `/User/UserViewStationDashboard/GetStationSummary`;

      const formData = new FormData();

      formData.append("stationCode", stationId);
      formData.append("profileId", profileId);

      if (selectDateType === "custom") {
        formData.append("fromDate", dateFormatter(fromDate));
        formData.append("toDate", dateFormatter(toDate));
      } else if (selectDateType === "last 7 days") {
        formData.append("fromDate", last7Days);
        formData.append("toDate", today);
      } else if (selectDateType === "last 30 days") {
        formData.append("fromDate", last30Days);
        formData.append("toDate", today);
      } else {
        formData.append(
          "fromDate",
          selectDateType === "today" ? today : yesterday,
        );
        formData.append(
          "toDate",
          selectDateType === "today" ? today : yesterday,
        );
      }

      apiCaller({
        apiCall: () => api.post(url, formData),
        onSuccess: (result) => setSummaryData(result),
      });
    };
    fetchSummary();
  }, [
    stationId,
    profileId,
    fromDate,
    toDate,
    selectDateType,
    today,
    yesterday,
    last7Days,
    last30Days,
  ]);

  const stationDataDetails = useCallback(
    async (dataDetialDate) => {
      const url = `/User/UserViewStationDashboard/GetStationDataDetails`;

      const formData = new FormData();

      formData.append("stationCode", stationId);
      formData.append("profileId", profileId);
      if (dataDetialDate) {
        formData.append("fromDate", dataDetialDate);
        formData.append("toDate", dataDetialDate);
      } else {
        formData.append(
          "fromDate",
          selectDateType === "today" ? today : yesterday,
        );
        formData.append(
          "toDate",
          selectDateType === "today" ? today : yesterday,
        );
      }

      apiCaller({
        apiCall: () => api.post(url, formData),
        onSuccess: (result) => setDetailedData(result),
      });
    },
    [stationId, profileId, selectDateType, today, yesterday],
  );

  useEffect(() => {
    if ((isRangeType && dataDetialDate) || (!isRangeType && !dataDetialDate)) {
      stationDataDetails(dataDetialDate);
    }
  }, [stationDataDetails, dataDetialDate, selectDateType, isRangeType]);

  useEffect(() => {
    const stationDataOverview = async () => {
      const url = `/User/UserViewStationDashboard/GetStationDataOverview`;

      const formData = new FormData();
      formData.append("stationCode", stationId);
      formData.append("profileId", profileId);
      if (selectDateType === "last 7 days") {
        formData.append("fromDate", last7Days);
        formData.append("toDate", today);
      }
      if (selectDateType === "last 30 days") {
        formData.append("fromDate", last30Days);
        formData.append("toDate", today);
      }
      if (selectDateType === "custom") {
        formData.append("fromDate", dateFormatter(fromDate));
        formData.append("toDate", dateFormatter(toDate));
      }

      apiCaller({
        apiCall: () => api.post(url, formData),
        onSuccess: (result) => setOverviewData(result),
      });
    };
    if (isRangeType) {
      stationDataOverview();
    }
  }, [
    stationId,
    profileId,
    fromDate,
    toDate,
    selectDateType,
    last30Days,
    last7Days,
    today,
    isRangeType,
  ]);

  const sensorKeys = (data) => {
    return Array.isArray(data) && data[0]?.sensorDataList
      ? Object.keys(data[0].sensorDataList)
      : [];
  };

  const summaryHeaders = ["Statistical Metrics", ...sensorKeys(summaryData)];
  const datalistHeaders = ["Date", "Time", ...sensorKeys(detailedData)];
  const overViewHeaders = [...sensorKeys(overviewData)];

  const formatDataByDate = (data) => {
    const grouped = {};

    data.forEach((item) => {
      const date = item.date;
      if (!grouped[date]) grouped[date] = {};
      grouped[date][item.title] = item.sensorDataList;
    });

    return Object.entries(grouped).map(([date, titles]) => {
      const row = { date };

      overViewHeaders.forEach((header) => {
        row[header] = {
          High: titles["High"]?.[header] ?? "N/A",
          Low: titles["Low"]?.[header] ?? "N/A",
          Average: titles["Average"]?.[header] ?? "N/A",
        };
      });

      return row;
    });
  };

  const fomatedOverivewData = formatDataByDate(overviewData);
  if (Object.keys(stationData).length < 1)
    return (
      <div className='h-100 d-flex justifiy-content-center text-center align-items-center '>
        <p>Please select Station</p>
      </div>
    );

  return (
    <div className='mainContInfo mb-5'>
      <StationView stationData={stationData} district={district} />

      <div className='d-flex justify-content-between align-items-center mt-4'>
        <div className='left-sec'>
          <img
            src={reqView === "graphicalView" ? ActiveGraphsIcon : GraphsIcon}
            alt='GraphsIcon'
            style={{ width: "2.5rem", height: "2.5rem", cursor: "pointer" }}
            onClick={() => navigateTo("graphicalView")}
          />
          <img
            src={
              reqView === "tabularView"
                ? ActiveTabularViewIcon
                : TabularViewIcon
            }
            alt='GraphsIcon'
            style={{ width: "2.5rem", height: "2.5rem", cursor: "pointer" }}
            onClick={() => navigateTo("tabularView")}
          />
        </div>
        <div className='right-sec'>
          <div className='d-flex align-items-center'>
            <strong>View by :</strong>
            <SelectDateRange
              handleCustomRangeDate={handleCustomRangeDate}
              setSelectedDateType={setSelectedDateType}
              selectDateType={selectDateType}
              SelectDate={SelectDate}
              value='tabularData'
              setDataDetialDate={setDataDetialDate}
              view={reqView}
            />
          </div>
        </div>
      </div>
      {reqView === "tabularView" ? (
        <>
          <DataTable
            data={summaryData}
            headers={summaryHeaders}
            SelectDate={SelectDate}
            selectDateType={selectDateType}
            fileName={`${stationData.stationId}-${
              stationData.stationName
            }-${dateFormatter(fromDate)}-${dateFormatter(toDate)}-summary-data`}
            title={"Summary"}
          />
          {isRangeType ? (
            <CustomOverviewTable
              data={fomatedOverivewData}
              headers={overViewHeaders}
              SelectDate={SelectDate}
              selectDateType={selectDateType}
              setDataDetialDate={setDataDetialDate}
              fileName={`${stationData.stationId}-${
                stationData.stationName
              }-${dateFormatter(fromDate)}-${dateFormatter(
                toDate,
              )}-overView-data`}
              title={"OverView"}
            />
          ) : (
            <DataTable
              data={detailedData}
              headers={datalistHeaders}
              SelectDate={SelectDate}
              selectDateType={selectDateType}
              fileName={`${stationData.stationId}-${
                stationData.stationName
              }-${dateFormatter(fromDate)}-${dateFormatter(
                toDate,
              )}-detail-data`}
              title={"DetailData"}
            />
          )}

          {dataDetialDate !== "" && isRangeType ? (
            <DataTable
              data={detailedData}
              headers={datalistHeaders}
              SelectDate={SelectDate}
              selectDateType={selectDateType}
              fileName={`${stationData.stationId}-${
                stationData.stationName
              }-${dateFormatter(fromDate)}-${dateFormatter(
                toDate,
              )}-detail-data`}
              title={`Showing Detailed Data for ${dataDetialDate}`}
              offDateLabel={true}
            />
          ) : null}
        </>
      ) : (
        <GraphicalData
          selectDateType={selectDateType}
          SelectDate={SelectDate}
          dataDetialDate={dataDetialDate}
          setDataDetialDate={setDataDetialDate}
          summaryData={summaryData}
          detailedData={detailedData}
          overviewData={overviewData}
        />
      )}
    </div>
  );
};

export default StationDetails;
