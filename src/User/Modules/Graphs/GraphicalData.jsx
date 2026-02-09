import React, { useState } from "react";
import LineChartContainer from "./LineChartContainer";
import "../dashboard.css";
import ZoomCtrlComp from "../../../components/ZoomCtrlComp";

const GraphicalData = ({ selectDateType, detailedData, overviewData }) => {
  const [zoomFactor, setZoomFactor] = useState(1); // Zoom factor state
  const transformData = (data, sensorName) => {
    const groupedData = data.reduce((acc, curr) => {
      const { date, time, title, sensorDataList } = curr;
      const accumKey = selectDateType === "custom" ? date : time;

      if (!acc[accumKey]) {
        acc[accumKey] = {
          time: accumKey,
          avg: null,
          high: null,
          low: null,
          current: null,
        };
      }

      let rawValue = sensorDataList[sensorName];

      // Check if rawValue is a valid numeric string
      if (typeof rawValue !== "string" || !/\d/.test(rawValue)) {
        rawValue = "0"; // Default to '0' if no digits are found
      }

      const numericValue = parseFloat(rawValue.replace(/[^\d.]/g, "")) || 0;

      if (title === "Average") acc[accumKey].avg = numericValue;
      else if (title === "High") acc[accumKey].high = numericValue;
      else if (title === "Low") acc[accumKey].low = numericValue;
      else if (title === "Current") acc[accumKey].current = numericValue;

      return acc;
    }, {});

    return Object.values(groupedData);
  };

  const getSensorNames = (data) => {
    const sensors = data[0]?.sensorDataList;
    return Object.keys(sensors);
  };

  const getSensorUnits = (data) => {
    const sensors = data[0].sensorDataList;
    const units = {};

    Object.keys(sensors).forEach((key) => {
      const match = key.match(/\(([^)]+)\)/); // Match content inside parentheses
      if (match) {
        units[key] = match[1].trim();
      }
    });

    return units;
  };

  return (
    <>
      <ZoomCtrlComp setZoomFactor={setZoomFactor} />
      <div className="graphicalView">
        {(
          selectDateType === "custom"
            ? overviewData.length > 0
            : detailedData.length > 0
        ) ? (
          getSensorNames(
            selectDateType === "custom" ? overviewData : detailedData
          ).map(
            (sensor) =>
              sensor !== "Station ID" && (
                <div className="Chart mt-5 mb-5" key={sensor}>
                  <LineChartContainer
                    data={transformData(
                      selectDateType === "custom" ? overviewData : detailedData,
                      sensor
                    )}
                    sensorUnits={getSensorUnits(
                      selectDateType === "custom" ? overviewData : detailedData
                    )}
                    sensorName={sensor}
                    iconType="circle"
                    selectDateType={selectDateType}
                    zoomFactor={zoomFactor}
                  />
                </div>
              )
          )
        ) : (
          <p className="text-center my-1">No Data Found</p>
        )}
      </div>
    </>
  );
};

export default GraphicalData;
