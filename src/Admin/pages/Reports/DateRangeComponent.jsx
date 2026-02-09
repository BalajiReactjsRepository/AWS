import React, { useEffect, useState, useCallback } from "react";
import { DatePicker, Space } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const DateRangeComponent = ({ setDateRange }) => {
  /**
   * Stores selected date range as dayjs objects
   * Default: Today → Today
   */
  const [selectedDates, setSelectedDates] = useState([dayjs(), dayjs()]);

  /**
   * Sync formatted date range with parent component
   * Runs whenever selected dates change
   */
  useEffect(() => {
    if (!selectedDates?.length) return;

    const formattedDates = selectedDates.map((date) =>
      date.format("DD-MMM-YYYY")
    );

    setDateRange(formattedDates);
  }, [selectedDates, setDateRange]);

  /**
   * Handles date change from RangePicker
   * Updates both:
   * - Local state (dayjs objects)
   * - Parent state (formatted strings)
   */
  const handleDateChange = useCallback(
    (dates) => {
      if (!dates) return;

      setSelectedDates(dates);

      const formattedDates = dates.map((date) => date.format("DD-MMM-YYYY"));

      setDateRange(formattedDates);
    },
    [setDateRange]
  );

  return (
    <div className="d-flex align-items-center">
      <Space direction="vertical" size={14}>
        <RangePicker
          value={selectedDates}
          onChange={handleDateChange}
          format="DD-MMM-YYYY"
          allowClear={false} // Prevents empty date selection
          style={{
            border: "1px solid #E6E6E6",
            borderRadius: "25px",
            padding: "0.6rem",
            maxWidth: "264px",
          }}
        />
      </Space>
    </div>
  );
};

export default DateRangeComponent;
