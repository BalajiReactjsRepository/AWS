/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getSensorColor } from "../../../utils/sensorsFormater";

import "../dashboard.css";

const LineChartContainer = (props) => {
  const {
    data,
    sensorName,
    sensorUnits,
    iconType = "circle",
    selectDateType,
    zoomFactor,
  } = props;

  // const data = getDummySensorData();

  const chartContainerRef = useRef(null);

  const [windowSize, setWindowSize] = useState(800);
  const [startIndex, setStartIndex] = useState(0);

  const chartData = useMemo(() => {
    return data.slice(startIndex, startIndex + windowSize);
  }, [data, startIndex, windowSize]);

  const handleScroll = () => {
    const container = chartContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    // → Scroll right
    if (scrollLeft + clientWidth >= scrollWidth - 50) {
      if (startIndex + windowSize < data.length) {
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
  }, [startIndex, windowSize, data.length]);

  return (
    <div className="chart-wrapper" style={{ paddingLeft: "10px" }}>
      <div
        className="chart-inner"
        style={{
          width: `${Math.max(500 * zoomFactor, 760)}px`,
        }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 12, marginLeft: 200 }} />
            <YAxis
              label={{
                value: `${sensorName}`,
                angle: -90,
                position: "insideLeft",
                dy: "50%",
                dx: -15,
                style: { textAnchor: "middle" },
              }}
              tickFormatter={(value) =>
                `${value} ${sensorUnits[sensorName] || ""}`
              }
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => `${value} ${sensorUnits[sensorName] || ""}`}
            />
            <Legend verticalAlign="bottom" align="center" iconType={iconType} />
            {selectDateType === "custom" && (
              <Line
                type="monotone"
                dataKey="low"
                stroke="#007bff"
                dot={{ r: 5 }}
                strokeWidth={2}
              />
            )}
            {selectDateType === "custom" && (
              <Line
                type="monotone"
                dataKey="high"
                stroke="#ff4d4d"
                dot={{ r: 5 }}
                strokeWidth={2}
              />
            )}
            {selectDateType === "custom" && (
              <Line
                type="monotone"
                dataKey="avg"
                stroke="#4CAF50"
                dot={{ r: 5 }}
                strokeWidth={2}
              />
            )}
            {selectDateType !== "custom" && (
              <Line
                type="monotone"
                dataKey="current"
                name={sensorName}
                stroke={
                  getSensorColor(
                    sensorName.replace(/\s*\(.*?\)/g, "").trim()
                  ) || "#4CAF50"
                }
                dot={{ r: 5 }}
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartContainer;
