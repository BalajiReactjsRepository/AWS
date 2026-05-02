import React, { useRef } from "react";
import moment from "moment";
import Table from "react-bootstrap/Table";
import { LuFileDown } from "react-icons/lu";
import calendar from "../../../images/UserImages/calendar.png";

import { useDownloadExcel } from "react-export-table-to-excel";

const CustomOverviewTable = (props) => {
  const {
    data = [],
    headers = [],
    SelectDate,
    selectDateType,
    setDataDetialDate,
    fileName,
    title,
    offDateLabel,
  } = props;

  const dateFormatter = (date) => {
    return moment(date, "ddd MMM DD YYYY HH:mm:ss [GMT]Z").format(
      "DD-MMM-YYYY",
    );
  };

  const fromDate = SelectDate?.[0]?.$d;
  const toDate = SelectDate?.[1]?.$d;

  const getCellValue = (row, header, type) => {
    if (header === "Date") return row.date;
    return row?.[header]?.[type] ?? "N/A";
  };

  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: fileName,
    sheet: "overviewData",
  });

  const downloadExcel = () => {
    if (!tableRef.current) return;
    onDownload();
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
                  {dateFormatter(fromDate)} - {dateFormatter(toDate)}
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
          onClick={downloadExcel}
        >
          <strong>Export Data </strong> <LuFileDown size={20} />
        </button>
      </div>

      <div style={{ overflow: "auto" }}>
        {data?.length > 0 ? (
          <Table
            ref={tableRef}
            className='custom-table'
            bordered
            hover
            style={{ whiteSpace: "nowrap" }}
          >
            <thead className='table-dark'>
              <tr>
                <th rowSpan={2} className='text-center align-middle'>
                  Date
                </th>
                {headers.map((header) => (
                  <th key={header} colSpan={3} className='text-center '>
                    {header}
                  </th>
                ))}
              </tr>
              <tr>
                {headers.map((header) => (
                  <>
                    <th key={`${header}-high`}>High</th>
                    <th key={`${header}-low`}>Low</th>
                    <th key={`${header}-avg`}>Average</th>
                  </>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => setDataDetialDate?.(row.date)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{row.date}</td>
                  {headers.map((header) => (
                    <>
                      <td key={`${idx}-${header}-high`}>
                        {getCellValue(row, header, "High")}
                      </td>
                      <td key={`${idx}-${header}-low`}>
                        {getCellValue(row, header, "Low")}
                      </td>
                      <td key={`${idx}-${header}-avg`}>
                        {getCellValue(row, header, "Average")}
                      </td>
                    </>
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

export default CustomOverviewTable;
