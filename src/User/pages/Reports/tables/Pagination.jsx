import React from "react";

const Pagination = (props) => {
  const {
    currentPage,
    totalPages,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
  } = props;
  const getPaginationRange = (currentPage, totalPages, visiblePages = 10) => {
    let startPage = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
    let endPage = startPage + visiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - visiblePages + 1, 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };
  return (
    <div className="d-flex justify-content-between">
      <div className="flex align-self-end justify-end mt-2 space-x-2">
        Rows Per Page{" "}
        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(e.target.value)}
        >
          {["5", "10", "20", "50", "100"].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      <div className="flex align-self-end justify-end mt-2 space-x-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {getPaginationRange(currentPage, totalPages).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 mx-1 border rounded ${
              currentPage === page ? "bg-blue-600 text-white" : ""
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
