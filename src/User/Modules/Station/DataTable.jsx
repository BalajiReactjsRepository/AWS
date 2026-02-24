import React from "react";
import moment from "moment";

import Table from "react-bootstrap/Table";

import { LuFileDown } from "react-icons/lu";
import calendar from "../../../images/UserImages/calendar.png";

const DataTable = (props) => {
  const {
    data = [],
    headers,
    SelectDate,
    selectDateType,
    setDataDetialDate,
    fileName,
    title,
    offDateLabel,
  } = props;

  console.log(data, "kkkk");

  const downloadCSV = (array, fileName) => {
    if (!array || array.length === 0) return;
    const csvContent = [
      headers.join(","),
      ...array.map((item) =>
        headers
          .map((key) => {
            if (key === "Statistical Metrics") {
              return item["title"];
            } else if (key === "Time") {
              return item["time"];
            } else if (key === "Date") {
              return item["date"];
            } else {
              return item?.sensorDataList?.[key] || "N/A"; // Handle missing values
            }
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dateFormatter = (date) => {
    return moment(date, "ddd MMM DD YYYY HH:mm:ss [GMT]Z").format(
      "DD-MMM-YYYY",
    );
  };

  const fromDate = SelectDate[0]?.$d;
  const toDate = SelectDate[1]?.$d;

  const getCellValue = (each, val) => {
    const lookup = {
      "Statistical Metrics": each.title,
      Date: each.date,
      Time: each.time,
    };
    return lookup[val] ? lookup[val] : each.sensorDataList?.[val];
  };

  return (
    <div className='table-cont'>
      <div className='tableInfo d-flex justify-content-between'>
        <p>
          <strong>{title} :</strong>
          {!offDateLabel && (
            <>
              {selectDateType === "custom" ? (
                <span>
                  {dateFormatter(fromDate)} - {dateFormatter(toDate)}{" "}
                </span>
              ) : (
                <span className='data-table-title'>{selectDateType}</span>
              )}
              <img
                className='ms-2'
                src={calendar}
                alt='calendar'
                style={{ width: "16px" }}
              />
            </>
          )}
        </p>

        <button
          className='exportBtn'
          style={{ border: "none", backgroundColor: "none" }}
          onClick={() => downloadCSV(data, fileName)}
        >
          <strong>Export Data </strong> <LuFileDown size={20} />
        </button>
      </div>
      <div style={{ overflow: "scroll" }}>
        {data?.length > 0 ? (
          <Table
            className='custom-table'
            bordered
            hover
            style={{ whiteSpace: "nowrap" }}
          >
            <thead className='table-dark'>
              <tr>
                {headers.map((each, i) => (
                  <th key={i}>{each}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((each, index) => (
                <tr
                  key={index}
                  onClick={() =>
                    title === "OverView" ? setDataDetialDate(each.date) : null
                  }
                  style={{ cursor: title === "OverView" ? "pointer" : "" }}
                >
                  {headers.map((val, i) => (
                    <td key={i}>{getCellValue(each, val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className='text-center fw-medium'>No Data Found</div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
