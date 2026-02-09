import React, { useMemo, useState } from "react";

const WidgetTable = (props) => {
  const {
    tableData,
    setTableData,
    stationFilter,
    currentPage,
    setCurrentPage,
    selectedTitle,
    setStationFilter,
  } = props;

  const [recordsPerPage, setRecordsPerPage] = useState(10);

  let tableHeaders = [];
  if (tableData.length) {
    tableHeaders = Object.keys(tableData[0]);
  }

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "desc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    // Sort by numeric or string
    const sorted = [...tableData].sort((a, b) => {
      const aVal = parseFloat(a[key]) || 0;
      const bVal = parseFloat(b[key]) || 0;
      if (direction === "asc") return aVal - bVal;
      return bVal - aVal;
    });

    setTableData(sorted);
  };

  // Filtered data
  const filteredStations = useMemo(() => {
    if (!stationFilter) return tableData;
    return tableData.filter((s) =>
      Object.values(s).some((v) =>
        v.toString().toLowerCase().includes(stationFilter.toLowerCase())
      )
    );
  }, [tableData, stationFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredStations.length / recordsPerPage) || 1;
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentData = filteredStations.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  // Export CSV
  const handleExportCSV = () => {
    if (!filteredStations.length) return alert("No data to export!");
    const headers = Object.keys(filteredStations[0]);
    const csvRows = [headers.join(",")];
    filteredStations.forEach((row) => {
      csvRows.push(headers.map((h) => `"${row[h] ?? ""}"`).join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTitle.replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{selectedTitle || "Station Data"}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={handleExportCSV}
              >
                Export CSV
              </button>
              <div className="d-flex align-items-center">
                <label className="me-2">Search:</label>
                <input
                  type="text"
                  value={stationFilter}
                  onChange={(e) => setStationFilter(e.target.value)}
                  className="form-control form-control-sm"
                  style={{ width: "200px" }}
                  placeholder="Type to search..."
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-striped table-hover align-middle mb-0">
                <thead className="table-light">
                  {/* <tr>
                      {tableData.length > 0 &&
                        Object.keys(tableData[0]).map((header, i) => (
                          <th key={i}>{header}</th>
                        ))}
                    </tr> */}
                  <tr>
                    {tableHeaders.map((h, i) => (
                      <th
                        key={i}
                        className="text-nowrap fw-bold align-middle"
                        style={{
                          cursor: ["MAX RAINFALL", "MAXTEMPERATURE"].includes(
                            h.toUpperCase()
                          )
                            ? "pointer"
                            : "default",
                        }}
                        onClick={() => {
                          // Only allow sorting for Max Rain or Max Temp columns
                          if (
                            ["MAX RAINFALL", "MAXTEMPERATURE"].includes(
                              h.toUpperCase()
                            )
                          ) {
                            handleSort(h);
                          }
                        }}
                      >
                        {h}
                        {["MAX RAINFALL", "MAXTEMPERATURE"].includes(
                          h.toUpperCase()
                        ) && (
                          <span className="ms-1">
                            {sortConfig.direction === "asc" ? "▲" : "▼"}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((row, i) => (
                      <tr key={i}>
                        {Object.values(row).map((val, j) => (
                          <td key={j}>{val}</td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={
                          tableData[0] ? Object.keys(tableData[0]).length : 1
                        }
                        className="text-center text-muted"
                      >
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="modal-footer justify-content-between">
            <p className="mb-0 small">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + recordsPerPage, filteredStations.length)}{" "}
              of {filteredStations.length} records
            </p>

            <nav>
              <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 w-100">
                {/* Rows per page */}
                <div className="d-flex align-items-center">
                  <label className="me-2 mb-0 small text-muted">
                    Rows per page:
                  </label>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: "70px" }}
                    value={recordsPerPage}
                    onChange={(e) => {
                      setCurrentPage(1);
                      // convert to number
                      const val = Number(e.target.value);
                      setRecordsPerPage(val);
                    }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                  </select>
                </div>

                {/* Pagination */}

                <ul className="pagination pagination-sm mb-0">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link me-2  btn  btn-sm"
                      onClick={handlePrev}
                    >
                      Previous
                    </button>
                  </li>
                  <li className="page-item active">
                    <span className="page-link ">{currentPage}</span>
                  </li>
                  <li
                    className={`page-item    ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link ms-2 btn  btn-sm"
                      onClick={handleNext}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetTable;
