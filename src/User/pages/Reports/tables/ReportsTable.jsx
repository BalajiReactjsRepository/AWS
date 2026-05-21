import React, { useState } from "react";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";
import { apiCaller } from "../../../../api/apihelper";
import api from "../../../../api/axiosConfig";
//import * as XLSX from "xlsx-js-style";

import Pagination from "./Pagination";
import DownloadReportBtn from "../DownloadReportBtn";

import "../reports.css";
import { getDatebyInputChange } from "../funs";

const WeatherTable = (props) => {
  const {
    data,
    fileName,
    selectDateType,
    dateRange,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    paginationData,
    selectedStations,
  } = props;
  const [rowsChecked, setRowsChecked] = useState(false);
  const [rows, setRows] = useState(
    data.map((r) => ({ ...r, isChecked: false })),
  );
  const [loading, setLoading] = useState(false);

  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  const { totalPages } = paginationData;

  if (!data || data.length === 0) return <p>No data available</p>;

  const sensorNames = Array.from(
    new Set(data.flatMap((entry) => Object.keys(entry.rowData || {}))),
  );
  const headers = ["Date Time", "StationId", ...sensorNames];

  // const escapeCSV = (value) => {
  //   if (value === null || value === undefined) return "";

  //   const stringValue = String(value);

  //   // If value contains comma, quote, or newline → wrap in quotes
  //   if (/[",\n]/.test(stringValue)) {
  //     return `"${stringValue.replace(/"/g, '""')}"`;
  //   }

  //   return stringValue;
  // };

  // const downloadZipByStation = () => {
  //   const selectedRows = rows.filter((row) => row.isChecked);
  //   const exportData = selectedRows.length > 0 ? selectedRows : rows;

  //   if (exportData.length === 0) return;

  //   const stationMap = {};

  //   // ✅ Group by StationId instead of Date
  //   exportData.forEach((item) => {
  //     const stationId = item.stationId;

  //     if (!stationMap[stationId]) stationMap[stationId] = [];
  //     stationMap[stationId].push(item);
  //   });

  //   const zip = new JSZip();

  //   Object.keys(stationMap).forEach((stationId) => {
  //     const rowsForStation = stationMap[stationId];
  //     const csvContent = [
  //       headers.join(","),

  //       ...rowsForStation.map((item) =>
  //         headers
  //           .map((key) => {
  //             let value;

  //             if (key === "Date Time") value = item.dateTime;
  //             else if (key === "StationId") value = item.stationId;
  //             else value = item?.rowData?.[key] ?? "N/A";

  //             return escapeCSV(value);
  //           })
  //           .join(","),
  //       ),
  //     ].join("\n");

  //     // ✅ File name format → StationId_formdate_todate.csv
  //     const { formDate, toDate } = getDatebyInputChange(
  //       selectDateType,
  //       dateRange,
  //     );
  //     const fileName = `${stationId}_${formDate}_${toDate}.csv`;

  //     zip.file(fileName, "\uFEFF" + csvContent);
  //   });

  //   console.log(stationMap, "stationMap");

  //   zip.generateAsync({ type: "blob" }).then((zipFile) => {
  //     saveAs(zipFile, (fileName || "Report") + ".zip");
  //   });
  // };

  const selectedStationIds = selectedStations
    .filter((each) => each.value !== "0")
    .map((each) => each.value);

  const downloadZipByStation = () => {
    const { formDate, toDate } = getDatebyInputChange(
      selectDateType,
      dateRange,
    );

    const formdata = new FormData();

    formdata.append("StationIds", selectedStationIds);
    formdata.append("fromDate", formDate);
    formdata.append("toDate", toDate);

    apiCaller({
      setLoading,

      apiCall: () => api.post(`/Report/Report/ExportDataReport`, formdata),

      onSuccess: (result) => {
        const zipUrl = result?.dataReportZipURL;

        if (!zipUrl) return;

        const link = document.createElement("a");

        link.href = zipUrl;
        link.download = fileName;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
      },
    });
  };

  // const downloadZipExcelByStation = async () => {
  //   const selectedRows = rows.filter((row) => row.isChecked);
  //   const exportData = selectedRows.length > 0 ? selectedRows : rows;
  //   if (exportData.length === 0) return;

  //   const stationMap = {};

  //   // 🔹 Group rows by station
  //   exportData.forEach((item) => {
  //     const stationId = item.stationId;
  //     if (!stationMap[stationId]) stationMap[stationId] = [];
  //     stationMap[stationId].push(item);
  //   });

  //   const zip = new JSZip();
  //   const { formDate, toDate } = getDatebyInputChange(
  //     selectDateType,
  //     dateRange,
  //   );

  //   for (const stationId of Object.keys(stationMap)) {
  //     const rowsForStation = stationMap[stationId];

  //     const sheetData = [
  //       headers,
  //       ...rowsForStation.map((item) =>
  //         headers.map((key) => {
  //           if (key === "Date Time") return item.dateTime;
  //           if (key === "StationId") return item.stationId;
  //           return item?.rowData?.[key] ?? "N/A";
  //         }),
  //       ),
  //     ];

  //     const ws = XLSX.utils.aoa_to_sheet(sheetData);

  //     // ✅ Bold header row
  //     headers.forEach((_, colIndex) => {
  //       const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
  //       if (ws[cellAddress]) {
  //         ws[cellAddress].s = { font: { bold: true } };
  //       }
  //     });

  //     // ✅ Auto column width
  //     ws["!cols"] = headers.map((h) => ({ wch: Math.max(h.length + 2, 12) }));

  //     const wb = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, `${stationId}`);

  //     // Convert workbook to binary
  //     const excelBuffer = XLSX.write(wb, {
  //       bookType: "xlsx",
  //       type: "array",
  //     });

  //     const fileName = `${stationId}_${formDate}_${toDate}.xlsx`;

  //     zip.file(fileName, excelBuffer);
  //   }
  //   console.log(fileName);
  //   // 📦 Generate ZIP
  //   const zipBlob = await zip.generateAsync({ type: "blob" });
  //   saveAs(zipBlob, `${fileName ?? "Weather_Report"}.zip`);
  // };

  const onChangeRowsSelected = (e) => {
    const { checked } = e.target;
    setRowsChecked(checked);
    setRows(rows.map((r) => ({ ...r, isChecked: checked })));
  };

  const onChangeSingleRowSelected = (e, index) => {
    const { checked } = e.target;
    const updatedRows = rows.map((r, i) =>
      i === index ? { ...r, isChecked: checked } : r,
    );
    setRows(updatedRows);
    setRowsChecked(updatedRows.every((r) => r.isChecked));
  };

  // const totalPages = Math.ceil(data.length / rowsPerPage);
  // const currentData = data.slice(
  //   (currentPage - 1) * rowsPerPage,
  //   currentPage * rowsPerPage,
  // );

  return (
    <div className='d-flex flex-column'>
      <div className='d-flex mb-1 justify-content-between align-items-center'>
        <span>Showing {data.length} Records</span>
        <DownloadReportBtn
          disable={data.length}
          downloadExcel={downloadZipByStation}
          loading={loading}
        />
      </div>
      <div
        className='report-table-container'
        style={{ maxHeight: selectDateType === "custom" ? "54vh" : "60vh" }}
      >
        <table
          className='min-w-full border border-gray-300 report-table'
          style={{ minWidth: "100%" }}
        >
          <thead className='reports-header'>
            <tr className='bg-gray-200'>
              <th className='border p-2'>
                <input
                  type='checkbox'
                  checked={rowsChecked}
                  onChange={onChangeRowsSelected}
                />
              </th>
              {headers.map((header) => (
                <th key={header} className='border p-2 text-left'>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={index} className='border'>
                <td className='border p-2'>
                  <input
                    type='checkbox'
                    checked={entry.isChecked}
                    onChange={(e) => onChangeSingleRowSelected(e, index)}
                  />
                </td>
                <td className='border p-2'>{entry.dateTime}</td>
                <td className='border p-2'>{entry.stationId}</td>
                {sensorNames.map((sensor) => (
                  <td key={sensor} className='border p-2'>
                    {entry.rowData?.[sensor] || "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <Pagination
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default WeatherTable;
