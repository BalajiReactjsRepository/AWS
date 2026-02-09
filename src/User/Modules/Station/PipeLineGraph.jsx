/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TfiReload } from "react-icons/tfi";
import ParameterDropdown from "./ParameterDrop";
import ZoomCtrlComp from "../../../components/ZoomCtrlComp";

import { useLocation } from "react-router-dom";
import { getSensorColor } from "../../../utils/sensorsFormater";
import dayjs from "dayjs";
import { apiCaller } from "../../../api/apihelper";
import api from "../../../api/axiosConfig";

const groupWeatherData = (weatherReport) => {
  const groupedData = {};
  weatherReport?.forEach(({ sensorName, currentValue, datetime }) => {
    if (!groupedData[datetime]) {
      groupedData[datetime] = { datetime };
    }
    groupedData[datetime][sensorName] = parseFloat(currentValue);
  });
  return Object.values(groupedData);
};

const MultiLineChart = ({ defaultParamerts }) => {
  const [weatherReport, setWeatherReport] = useState([]);
  const fullChartData = useMemo(
    () => groupWeatherData(weatherReport),
    [weatherReport]
  );
  const [startIndex, setStartIndex] = useState(0);
  const [windowSize, setWindowSize] = useState(1000);
  const [highlighteds, setHighlighteds] = useState(defaultParamerts);
  const [zoomFactor, setZoomFactor] = useState(10);

  const location = useLocation();
  const { station } = location.state || {};

  useEffect(() => {
    if (!station) return;

    const fetchGraphData = async () => {
      const url = `/User/UserViewStationDashboard/GetStationsWeatherStream`;

      const formData = new FormData();
      formData.append("stationCode", station.stationId);
      formData.append("profileId", station.profileId);

      apiCaller({
        apiCall: () => api.post(url, formData),
        onSuccess: (result) => setWeatherReport(result ?? []),
      });
    };

    fetchGraphData();
  }, [station]);

  const chartContainerRef = useRef(null);

  const chartData = useMemo(() => {
    return fullChartData.slice(startIndex, startIndex + windowSize);
  }, [fullChartData, startIndex, windowSize]);

  const handleScroll = () => {
    const container = chartContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    // → Scroll right
    if (scrollLeft + clientWidth >= scrollWidth - 50) {
      if (startIndex + windowSize < fullChartData.length) {
        setStartIndex((prev) => prev + 1000);
      }
    }

    // ← Scroll left
    if (scrollLeft <= 50) {
      if (startIndex >= 1000) {
        const prevScrollWidth = container.scrollWidth;
        setStartIndex((prev) => prev - 1000);

        setTimeout(() => {
          const newScrollWidth = container.scrollWidth;
          container.scrollLeft = newScrollWidth - prevScrollWidth + scrollLeft;
        }, 0);
      }
    }
  };

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startIndex, windowSize, fullChartData.length]);

  // --- Memoized sensor names ---
  const sensorNames = useMemo(
    () => [...new Set(weatherReport?.map((each) => each.sensorName))],
    [weatherReport]
  );

  // --- Map sensor names to colors ---
  const sensorColors = useMemo(() => {
    return sensorNames.reduce((acc, sensorName) => {
      acc[sensorName] = getSensorColor(sensorName) || "#A0A0A0";
      return acc;
    }, {});
  }, [sensorNames]);

  // --- Sensor units map (static or dynamic if needed) ---
  const sensorUnits = {
    "Air Temperature": "°C",
    Humidity: "%",
    "Battery Voltage": "V",
    "Atmospheric Pressure": "hPa",
    "Hourly Rain": "mm",
  };

  const getActiveSensorLines = () =>
    highlighteds.length === 0 ? Object.keys(sensorColors) : highlighteds;

  // --- Toggle highlight function ---
  const toggleHighlight = (sensorName) => {
    setHighlighteds((prev) =>
      prev.includes(sensorName)
        ? prev.filter((name) => name !== sensorName)
        : [...prev, sensorName]
    );
  };

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
        <h6 className="section-heading">Weather Streaming</h6>
        <div className="d-flex align-items-center">
          <ParameterDropdown
            parameters={Object.keys(sensorColors)}
            setHighlighteds={setHighlighteds}
            highlighteds={highlighteds}
          />
          <button onClick={() => setHighlighteds([])} className="btn">
            <TfiReload />
          </button>
        </div>
      </div>
      <ZoomCtrlComp setZoomFactor={setZoomFactor} />
      <div
        ref={chartContainerRef}
        style={{
          overflowX: "scroll",
          width: "100%",
          border: "1px solid #ddd",
          padding: "10px",
        }}
      >
        <div
          style={{
            width: `max(99%, ${chartData.length * zoomFactor}px)`,
          }}
        >
          <ResponsiveContainer height={450}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis
                dataKey="datetime"
                tick={{ fontSize: 10, angle: -45, dy: 10 }}
                interval={0}
                stroke="#555"
                tickFormatter={(value) => dayjs(value).format("HH:mm")}
              />
              <YAxis stroke="#555" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: 8,
                  padding: "10px",
                }}
                formatter={(value, name) => [
                  `${value} ${sensorUnits[name] || ""}`,
                  name,
                ]}
                labelFormatter={(label) =>
                  dayjs(label).format("DD-MMM-YYYY HH:mm")
                }
              />
              <Legend
                align="left"
                wrapperStyle={{
                  paddingBottom: 5,
                  cursor: "pointer",
                  marginLeft: 40,
                  marginTop: 40,
                  bottom: 0,
                }}
                onClick={(e) => toggleHighlight(e.value)}
              />

              {getActiveSensorLines().map((sensorName) => (
                <Line
                  key={sensorName.replace(/\s+/g, "_")}
                  type="monotone"
                  dataKey={sensorName}
                  stroke={
                    highlighteds.includes(sensorName) ||
                    highlighteds.length === 0
                      ? getSensorColor(sensorName)
                      : "#b0b0b0"
                  }
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default MultiLineChart;
