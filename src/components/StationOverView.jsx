import React from "react";
import { useNavigate } from "react-router-dom";

// import barometer from "../images/UserImages/barometer.png";
// import humidity from "../images/UserImages/humidity.png";
// import thermometer from "../images/UserImages/thermometer.png";

// import RainFall from "../images/UserImages/sensorIcons/rain.png";
// import BatteryVoltage from "../images/UserImages/sensorIcons/battery Voltage.png";
// import WindDirection from "../images/UserImages/sensorIcons/Wind Directio.png";
// import WindSpeed from "../images/UserImages/sensorIcons/Wind Speed.png";

import "./map.css";
import { FaCircle } from "react-icons/fa";
import { useStationProfile } from "../Context/usercontext";

const StationOverView = (props) => {
  const { stations, viewSummary, activeEffect, profileName } = props;

  const { activeStationId, setActiveStationId } = useStationProfile();

  const navigate = useNavigate();
  const goToSummary = (station) => {
    sessionStorage.setItem("activeStation", station.stationId);
    sessionStorage.setItem("activeprofileId", station.profileId);
    setActiveStationId(station.stationId);
    navigate("/station/summary", {
      state: {
        station: {
          ...station,
          profileName: profileName || station.profileName,
        },
      },
    });
  };

  // const getSensorIcon = (key) => {
  //   switch (key) {
  //     case "Wind Direction":
  //       return WindDirection;
  //     case "Daily Rain":
  //       return RainFall;
  //     case "Hourly Rainfall":
  //       return RainFall;
  //     case "Wind Speed":
  //       return WindSpeed;
  //     case "Battery Voltage":
  //       return BatteryVoltage;
  //     case "Air Temperature":
  //       return thermometer;
  //     case "Humidity":
  //       return humidity;
  //     case "Atmospheric Pressure":
  //       return barometer;
  //     default:
  //       return null;
  //   }
  // };

  // console.log(stations, "fardin");

  console.log(stations, "llll");

  return (
    <>
      {stations.map((station, i) => {
        const isActiveTab =
          activeEffect && station.stationId === activeStationId
            ? "activestation"
            : "";

        return (
          <div key={station.stationId}>
            <div
              className={`station-weather-report ${isActiveTab}`}
              onClick={() => goToSummary(station)}
            >
              <span
                className={`stationName ${isActiveTab}`}
                style={{ minWidth: activeEffect ? "auto" : "20rem" }}
              >
                {station.stationName} -
                <span title={station.stationId}>{station.stationId}</span>
              </span>
              <span className='profileName'>
                {station.profileName} , {station.district}
              </span>
              <div className='tool-status-container'>
                <FaCircle
                  size='8'
                  className='me-1'
                  fill={station.stationStatus === "Yes" ? "#00FF09" : "#FF0000"}
                />
                {station.stationStatus === "Yes" ? "Online" : "Offline"}
              </div>
              <div className='report-data d-flex justify-content-between my-2'>
                {/* sensorName: 'Air Temperature', sensorValue: '--', sensorUnit: 'N/A', sensorIcon: '' */}
                {station?.stationEnvDataList?.map((sensor) => (
                  <div
                    key={sensor.sensorName}
                    className='d-flex flex-column align-items-center mx-1'
                  >
                    <span className='instrument-icon'>
                      {sensor.sensorIcon || "--"}
                    </span>

                    <span className='d-block instrument-icon-val'>
                      {`${sensor?.sensorValue}  ${sensor?.sensorUnit}`}
                    </span>
                  </div>
                ))}
              </div>
              {viewSummary && (
                <span className='link-item_btn'>View Station Summary</span>
              )}
            </div>
            {i !== stations.length - 1 && <hr style={{ margin: "0px" }} />}
          </div>
        );
      })}
    </>
  );
};

export default StationOverView;
