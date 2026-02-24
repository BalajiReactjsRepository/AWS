import React, { useEffect, useState } from "react";
import DataTable from "../../../components/DataTable";
import ComponentTopSec from "../../../components/ComponentTopSec";
import { buildColumns } from "../../../utils/tableAction";
// import { handleDownloadCsv } from "../../../utils/downloadData";
import { apiCaller } from "../../../api/apihelper";
import api from "../../../api/axiosConfig";

const TrackRequestsPage = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDataApi = async () => {
      // --- API call ---
      apiCaller({
        setLoading,
        apiCall: () => api.get("/Admin/DataQuality/GetStatus"),
        onSuccess: (result) => setData(result ?? []),
      });
    };
    fetchDataApi();
  }, []);

  // function onSelectChange(newSelectedRowKeys) {
  //   setSelectedRowKeys(newSelectedRowKeys);
  // }

  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: onSelectChange,
  // };

  const selectFields = ["status"];
  const searchColumns = ["requestId", "checkType", "status"];

  const handleRefreshBtn = () => {
    apiCaller({
      setLoading,
      apiCall: () => api.get("/Admin/DataQuality/GetStatus"),
      onSuccess: (result) => setData(result ?? []),
    });
  };

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
    pagination.current * pagination.pageSize,
  );

  let columns = [];

  if (data && data.length > 0) {
    const numberFields = [];
    const dateFields = ["requestId"];
    const excludeFields = ["_id"];
    const filterFields = {
      selectFields,
      numberFields,
      dateFields,
      excludeFields,
    };

    columns = buildColumns(
      "manual data check",
      data,
      filterFields,
      false,
      {},
      false,
    );
  }

  return (
    <>
      <ComponentTopSec
        searchText={searchText}
        setSearchText={setSearchText}
        paginatedData={paginatedData}
        showAddBtn={false}
        showDownloadBtn={false}
        refreshBtn={true}
        refreshFun={handleRefreshBtn}
      />

      <DataTable
        loading={loading}
        // rowSelection={rowSelection}
        columns={columns}
        paginatedData={paginatedData}
        pagination={pagination}
        filteredData={filteredData}
        setPagination={setPagination}
        setFilteredInfo={setFilteredInfo}
        height={350}
      />
    </>
  );
};

export default TrackRequestsPage;
