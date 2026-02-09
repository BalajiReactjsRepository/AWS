import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { TfiReload } from "react-icons/tfi";
import HeatIndex from "../../../images/UserImages/sensorIcons/Heat-Index.png";
import RainFall from "../../../images/UserImages/sensorIcons/rain.png";
import BatteryVoltage from "../../../images/UserImages/sensorIcons/battery Voltage.png";
import WindDirection from "../../../images/UserImages/sensorIcons/Wind Directio.png";
import WindSpeed from "../../../images/UserImages/sensorIcons/Wind Speed.png";
import Humidity from "../../../images/UserImages/sensorIcons/Humidity.png";
import Pressure from "../../../images/UserImages/sensorIcons/Air Temp.png";
import PipeLineGraph from "./PipeLineGraph";
import StationView from "./StationView.jsx";

import { apiCaller } from "../../../api/apihelper.js";
import api from "../../../api/axiosConfig.js";

import "../dashboard.css";

const StationSummary = () => {
  const [stationData, setStationData] = useState({});
  const [stationPanelList, setStationPanelList] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    stationId = "",
    profileId = 0,
    district = "",
    stationEnvDataList,
  } = location?.state?.station || {};

  const getStationSummary = async (stationId, profileId) => {
    const url = `/User/UserViewStationDashboard/GetStationsBoxList`;

    const formData = new FormData();

    formData.append("stationCode", stationId);
    formData.append("profileId", profileId);

    apiCaller({
      apiCall: () => api.post(url, formData),
      onSuccess: (result) => {
        const stationData = result[0] ?? {};

        setStationData(stationData);
        setStationPanelList(stationData.stationPanelList);
      },
    });
  };

  useEffect(() => {
    getStationSummary(stationId, profileId);
  }, [stationId, profileId]);

  const getSensorIcon = (key) => {
    switch (key) {
      case "Wind Direction":
        return WindDirection;
      case "Daily Rain":
        return RainFall;
      case "Hourly Rainfall":
        return RainFall;
      case "Wind Speed":
        return WindSpeed;
      case "Battery Voltage":
        return BatteryVoltage;
      case "Air Temperature":
        return HeatIndex;
      case "Humidity":
        return Humidity;
      case "Atmospheric Pressure":
        return Pressure;
      default:
        return null;
    }
  };

  const navigetDetailsPage = () => {
    navigate("/station/details", {
      state: {
        stationId,
        profileId,
        district,
        stationData: stationData,
      },
    });
  };

  return Object.keys(stationData).length > 0 ? (
    <section className="mainContInfo">
      <StationView stationData={stationData} district={district} />
      <div className="row">
        <div className="col-sm-12 ">
          <div className="live-weather-sec">
            <div className="d-flex flex-column flex-md-row justify-content-md-between mb-2">
              <h6 className="section-heading">Live Weather</h6>
              <div className="d-flex align-items-center">
                <span> Showing Data of: {stationData.lastRefreshTime}</span>
                <span
                  className="mx-md-3 me-2 detail-view-btn"
                  onClick={navigetDetailsPage}
                >
                  Detailed View
                </span>

                <span
                  className="side-heading"
                  onClick={() => getStationSummary(stationId, profileId)}
                >
                  <TfiReload className="ms-2" />
                </span>
              </div>
            </div>
            <div className="row">
              {stationPanelList.map((sensor) => (
                <div className="col-sm-6 col-md-3" key={sensor.userSensorName}>
                  <div className="weather-report">
                    <div className="d-flex justify-content-between">
                      <span>{sensor.sensorName}</span>
                      {getSensorIcon(sensor.sensorName) ? (
                        <img
                          src={getSensorIcon(sensor.sensorName)}
                          alt="heat-icon"
                          className="reportIcon"
                        />
                      ) : (
                        <span>{sensor.unitIcon}</span>
                      )}
                    </div>
                    <div className="text-center">
                      <span className="report-val">
                        {sensor.currentValue ?? 0}{" "}
                        <sup>{sensor.unitSymbol}</sup>
                      </span>
                    </div>
                    <div className="full-report-values">
                      <div className="d-flex justify-content-between">
                        <span className="property">Min</span>
                        <span className="value">
                          {sensor.min} <sup>{sensor.unitSymbol}</sup>
                        </span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="property">Max</span>
                        <span className="value">
                          {" "}
                          {sensor.max} <sup>{sensor.unitSymbol}</sup>
                        </span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="property">Avg</span>
                        <span className="value">
                          {sensor.avg} <sup>{sensor.unitSymbol}</sup>
                        </span>
                      </div>
                      <span
                        onClick={navigetDetailsPage}
                        className="view-graph-btn"
                      >
                        Detailed View
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-sm-12">
          <div className="live-weather-sec">
            <PipeLineGraph defaultParamerts={Object.keys(stationEnvDataList)} />
          </div>
        </div>
      </div>
    </section>
  ) : (
    <div className="h-75 d-flex justify-content-center align-items-center">
      <h3 className="text-danger">Station Data Not Found</h3>
    </div>
  );
};

export default StationSummary;
