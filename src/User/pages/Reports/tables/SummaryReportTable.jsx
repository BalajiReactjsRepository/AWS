import React, { useMemo, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import DownloadReportBtn from "../DownloadReportBtn";
import { camelToTitle } from "../../../../utils/tableAction";
import Pagination from "./Pagination";

// Extract nested headers
const extractHeaders = (obj, parent = "") => {
  const headers = [];
  for (const key in obj) {
    const path = parent ? `${parent}.${key}` : key;
    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      headers.push(...extractHeaders(obj[key], path));
    } else {
      headers.push(path);
    }
  }
  return headers;
};

// Group headers with special case for "dynamicFileds"
const groupHeaders = (headers) => {
  const grouped = {};
  headers.forEach((fullPath) => {
    const [top, ...rest] = fullPath.split(".");
    if (top === "dynamicFileds") {
      grouped[fullPath] = [
        {
          label: rest.join(".") || top,
          path: fullPath,
        },
      ];
    } else {
      if (!grouped[top]) grouped[top] = [];
      grouped[top].push({
        label: rest.join(".") || top,
        path: fullPath,
      });
    }
  });
  return grouped;
};

// Utility to safely get nested values
const getValueByPath = (obj, path, fallback = "--") =>
  path.split(".").reduce((acc, key) => acc?.[key] ?? fallback, obj);

const SummaryReportTable = ({ data, fileName }) => {
  const displayTableRef = useRef(null);
  const hiddenTableRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const headers = useMemo(
    () => (data.length > 0 ? extractHeaders(data[0]) : []),
    [data]
  );

  const groupedHeaders = useMemo(() => groupHeaders(headers), [headers]);
  const flatHeaderArray = useMemo(
    () => Object.values(groupedHeaders).flat(),
    [groupedHeaders]
  );

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const { onDownload } = useDownloadExcel({
    currentTableRef: hiddenTableRef.current,
    filename: fileName,
    sheet: `Report_${new Date().toISOString().split("T")[0]}`,
  });

  const renderTableBody = (tableData) =>
    tableData.length > 0 ? (
      tableData.map((row, i) => (
        <tr key={i}>
          {flatHeaderArray.map(({ path }) => (
            <td key={path} className="border px-2 py-1">
              {getValueByPath(row, path, "N/A")}
            </td>
          ))}
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={flatHeaderArray.length} className="py-4 text-center">
          No data available
        </td>
      </tr>
    );

  // const renderHeaderRows = () => {
  //   const firstRowHeaders = [];
  //   const secondRowHeaders = [];

  //   Object.entries(groupedHeaders).forEach(([key, fields]) => {
  //     const isFlat = key.startsWith("dynamicFileds.");
  //     const isNested = fields.some((f) => f.label !== key);

  //     if (isFlat) {
  //       // Render each dynamic field directly
  //       fields.forEach(({ label, path }) => {
  //         firstRowHeaders.push(
  //           <th
  //             key={path}
  //             scope="col"
  //             className="border px-2 py-1 bg-gray-100 whitespace-normal"
  //             rowSpan={2}
  //           >
  //             {camelToTitle(label)
  //               .split("\n")
  //               .map((line, i) => (
  //                 <div key={i} className="block">
  //                   {line}
  //                 </div>
  //               ))}
  //           </th>
  //           // <th
  //           //   key={path}
  //           //   scope="col"
  //           //   className="border px-2 py-1 bg-gray-100"
  //           //   rowSpan={2}
  //           // >
  //           //   {camelToTitle(label)}
  //           // </th>
  //         );
  //       });
  //     } else {
  //       firstRowHeaders.push(
  //         <th
  //           scope="col"
  //           key={key}
  //           colSpan={isNested ? fields.length : 1}
  //           rowSpan={isNested ? 1 : 2}
  //           className={`border px-2 py-1 bg-gray-100 ${
  //             isNested ? "text-center" : ""
  //           }`}
  //         >
  //           {camelToTitle(key)}
  //         </th>
  //       );

  //       if (isNested) {
  //         fields.forEach(({ label, path }) => {
  //           secondRowHeaders.push(
  //             <th
  //               scope="col"
  //               key={path}
  //               className="border px-2 py-1 bg-gray-50"
  //             >
  //               {camelToTitle(label)}
  //             </th>
  //           );
  //         });
  //       }
  //     }
  //   });

  //   return (
  //     <>
  //       <tr>{firstRowHeaders}</tr>
  //       {secondRowHeaders.length > 0 && <tr>{secondRowHeaders}</tr>}
  //     </>
  //   );
  // };

  const renderMultilineHeader = (text) =>
    text.split("\n").map((line, i) => (
      <div key={i} className="block">
        {line}
      </div>
    ));

  const renderHeaderRows = () => {
    const firstRowHeaders = [];

    const secondRowHeaders = [];
    Object.entries(groupedHeaders).forEach(([key, fields]) => {
      const isFlat = key.startsWith("dynamicFileds.");
      const isNested = fields.some((f) => f.label !== key);

      if (isFlat) {
        // Render each dynamic field directly
        fields.forEach(({ label, path }) => {
          firstRowHeaders.push(
            <th
              key={path}
              scope="col"
              className="border px-2 py-1 bg-gray-100 whitespace-normal"
              rowSpan={2}
            >
              {renderMultilineHeader(camelToTitle(label))}
            </th>
          );
        });
      } else {
        firstRowHeaders.push(
          <th
            key={key}
            scope="col"
            className={`border px-2 py-1 bg-gray-100 whitespace-normal ${
              isNested ? "text-center" : ""
            }`}
            colSpan={isNested ? fields.length : 1}
            rowSpan={isNested ? 1 : 2}
          >
            {renderMultilineHeader(camelToTitle(key))}
          </th>
        );

        if (isNested) {
          fields.forEach(({ label, path }) => {
            secondRowHeaders.push(
              <th
                key={path}
                scope="col"
                className="border px-2 py-1 bg-gray-100 whitespace-normal"
              >
                {renderMultilineHeader(camelToTitle(label))}
              </th>
            );
          });
        }
      }
    });

    return (
      <>
        <tr>{firstRowHeaders}</tr>
        {secondRowHeaders.length > 0 && <tr>{secondRowHeaders}</tr>}
      </>
    );
  };

  return (
    <div className="d-flex flex-column">
      <div className="d-flex mb-1 justify-content-between align-items-center">
        <span>Showing {data.length} Records</span>
        <DownloadReportBtn
          disable={data.length === 0}
          downloadExcel={onDownload}
        />
      </div>

      {/* Visible Table */}
      <div className="summary-table-container">
        <table
          ref={displayTableRef}
          className="min-w-full border border-gray-300"
          style={{ minWidth: "100%" }}
        >
          <thead className="reports-header">{renderHeaderRows()}</thead>
          <tbody>{renderTableBody(currentData)}</tbody>
        </table>
      </div>

      {/* Hidden Table for Export */}
      {(() => {
        const hasDynamicFields = Object.keys(groupedHeaders).some((key) =>
          key.startsWith("dynamicFileds.")
        );

        return (
          <div style={{ display: "none" }}>
            <table
              ref={hiddenTableRef}
              style={{ position: "absolute", top: "-9999px" }}
            >
              <thead>{renderHeaderRows()}</thead>
              <tbody>
                {hasDynamicFields && (
                  <tr>
                    <td
                      colSpan={flatHeaderArray.length}
                      className="py-4 text-center"
                    ></td>
                  </tr>
                )}
                {renderTableBody(data)}
              </tbody>
            </table>
          </div>
        );
      })()}

      {/* Pagination */}
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

export default SummaryReportTable;
