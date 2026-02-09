// const location = useLocation();
// const pathnames = location.pathname.split("/").filter((x) => x);

import * as XLSX from "xlsx-js-style";

export const handleDownloadCsv = (
  selectedRowKeys,
  filteredData,
  columns,
  spclCol
) => {
  const fileName =
    window.location.pathname.split("/").filter(Boolean).at(-1) || "export";

  const exportData = selectedRowKeys.length
    ? filteredData.filter((item) => selectedRowKeys.includes(item._id))
    : filteredData;

  const visibleColumns = columns.filter(
    (col) => col.title !== "Action" && col.dataIndex
  );

  const excelData = exportData.map((item) => {
    const row = {};
    visibleColumns.forEach((col) => {
      const value = item[col.dataIndex];

      if (Array.isArray(value)) {
        row[col.title] = value.map((v) => v[spclCol]).join(", ");
      } else if (value && typeof value === "object") {
        row[col.title] = value[spclCol] ?? "";
      } else {
        row[col.title] = value ?? "";
      }
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);

  /* ===== BOLD HEADER STYLE (WORKS) ===== */
  const range = XLSX.utils.decode_range(worksheet["!ref"]);

  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
    if (worksheet[cellRef]) {
      worksheet[cellRef].s = {
        font: { bold: true },
      };
    }
  }
  /* =================================== */

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// export const handleDownloadCsv = (
//   selectedRowKeys,
//   filteredData,
//   columns,
//   spclCol
// ) => {
//   // Step 0: Determine the filename from the URL path if not provided
//   //const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
//   const fileName =
//     window.location.pathname.split("/").filter(Boolean).at(-1) || "export"; // -${timestamp}

//   // Step 1: Determine which rows to export
//   const exportData = selectedRowKeys.length
//     ? filteredData.filter((item) => selectedRowKeys.includes(item._id))
//     : filteredData;

//   // Step 2: Filter out columns with no dataIndex or "Action" title
//   const visibleColumns = columns.filter(
//     (col) => col.title !== "Action" && col.dataIndex
//   );

//   const headers = visibleColumns.map((col) => col.title);
//   const fieldKeys = visibleColumns.map((col) => col.dataIndex);

//   // Step 3: Build the CSV rows
//   const csvRows = [
//     headers, // CSV header row
//     ...exportData.map((item) =>
//       fieldKeys.map((key) => {
//         const value = item[key];

//         //  1. Array If value is an array
//         if (Array.isArray(value)) {
//           return `"${value.map((c) => c[spclCol]).join(", ")}"`;
//         }

//         // 2. Object but NOT null
//         else if (value !== null && typeof value === "object") {
//           return value[spclCol] || "";
//         }

//         // 3. Primitive or null
//         else {
//           return `"${String(value ?? "").replace(/"/g, '""')}"`; // Escape double quotes
//         }
//       })
//     ),
//   ];

//   // Step 4: Combine rows into CSV content
//   // const csvContent = csvRows.map((row) => row.join(",")).join("\n");
//   const csvContent = "\uFEFF" + csvRows.map((row) => row.join(",")).join("\n");

//   // Step 5: Create and download the file
//   // const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const blob = new Blob([csvContent], {
//     type: "text/csv;charset=utf-8;",
//   });

//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.setAttribute("download", `${fileName}.csv`);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url); // Cleanup
// };
