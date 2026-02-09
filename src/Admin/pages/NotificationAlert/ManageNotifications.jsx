import React, { useState, useEffect } from "react";

import "antd/dist/reset.css";
import "../../pages/pages.css";
import { buildColumns } from "../../utils/tableAction";
import { notifications } from "../../Data/Notificatons";
import { handleDownloadCsv } from "../../utils/downloadData";
import ComponentTopSec from "../../../components/ComponentTopSec";
import DataTable from "../../../components/DataTable";

const fetchData = async () => {
  return notifications;
};

const ManageNotifications = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDataApi = async () => {
      setLoading(true);
      await new Promise((rese) => {
        setTimeout(() => {
          rese();
        }, 2000);
      });

      const data = await fetchData(); // make sure to await here!
      setData(data);
      setLoading(false);
    };
    fetchDataApi();
  }, []);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const selectFields = [
    "notify",
    "title",
    "description",
    "clientName",
    "role",
    "user",
    "performedBy",
    "performedOn",
  ];
  const searchColumns = ["notify", "title", "clientName"];

  const filteredData = data.filter((item) => {
    // Dynamic search
    const searchMatch = searchColumns.some((col) => {
      return (
        item[col] &&
        item[col].toString().toLowerCase().includes(searchText.toLowerCase())
      );
    });

    // Dynamic filters
    const filterMatch = selectFields.every((field) => {
      if (filteredInfo[field]) {
        return filteredInfo[field].includes(item[field]);
      }
      return true;
    });

    return searchMatch && filterMatch;
  });

  const paginatedData = filteredData.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  const handleDeleteRole = (reason) => {
    alert(`deleeting Role , reason : ${reason}`);
  };

  let columns = [];

  if (data && data.length > 0) {
    const filterFields = { selectFields };
    columns = buildColumns("role", data, filterFields, handleDeleteRole);
  }

  const handleDownload = () => {
    handleDownloadCsv(selectedRowKeys, filteredData, columns);
  };

  return (
    <>
      <ComponentTopSec
        searchText={searchText}
        setSearchText={setSearchText}
        to={`add-${encodeURIComponent("notification/alert")}`}
        label={"Add Notification / Alert"}
        handleDownload={handleDownload}
        paginatedData={paginatedData}
      />
      <DataTable
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        paginatedData={paginatedData}
        pagination={pagination}
        filteredData={filteredData}
        setPagination={setPagination}
        setFilteredInfo={setFilteredInfo}
        height={330}
      />
    </>
  );
};

export default ManageNotifications;
