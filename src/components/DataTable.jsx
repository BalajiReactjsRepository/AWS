import React from "react";

import { Table } from "antd";
import Loader from "./Loader";
import { tableSizes } from "../utils/tableAction";

const DataTable = (props) => {
  const {
    loading,
    rowSelection,
    columns,
    paginatedData,
    pagination,
    filteredData,
    setPagination,
    setFilteredInfo,
    height,
  } = props;

  const handleChange = (pagination, filters) => {
    if (setFilteredInfo) {
      setFilteredInfo(filters);
    }
    setPagination(pagination);
  };

  return (
    <Table
      className="custom-role-table"
      size="small"
      loading={{
        spinning: loading,
        indicator: <Loader />,
      }}
      rowKey={(record, i) => record._id ?? i}
      rowSelection={rowSelection}
      columns={columns}
      dataSource={paginatedData.length > 0 ? paginatedData : []}
      expandable={false}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: filteredData.length,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20", "50", "100"],
        position: ["bottomCenter"],
        onChange: (page, pageSize) =>
          setPagination({ current: page, pageSize }),
        itemRender: (current, type, originalElement) => {
          if (type === "prev") {
            return <span>«</span>;
          }
          if (type === "next") {
            return <span>»</span>;
          }
          return originalElement;
        },
      }}
      onChange={handleChange}
      scroll={tableSizes(columns.length, height)}
    />
  );
};

export default DataTable;
