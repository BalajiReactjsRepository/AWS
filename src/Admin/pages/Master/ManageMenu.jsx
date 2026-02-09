import React, { useEffect, useState } from "react";
import { buildColumns } from "../../../utils/tableAction";

import { handleDownloadCsv } from "../../../utils/downloadData";
import DataTable from "../../../components/DataTable";
import ComponentTopSec from "../../../components/ComponentTopSec";
import api from "../../../api/axiosConfig";
import { apiCaller } from "../../../api/apihelper";

const ManageMenu = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDataApi = async () => {
      // --- API call ---
      apiCaller({
        setLoading,
        apiCall: () => api.get(`/Admin/Menu/GetAllMenus`),
        onSuccess: (result) => setData(result ?? []),
      });
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
    "menuCode",
    "menuName",
    "menuPath",
    "parentMenuName",
    "performedBy",
    "performedOn",
    "status",
  ];
  const searchColumns = ["menuCode", "menuName", "parentMenuName"];

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

  const handleDeleteMenu = async (reason, record) => {
    const formData = new FormData();

    formData.append("_id", record._id);
    formData.append("IsActive", false);
    formData.append("Reason", reason);

    const url = `/Admin/Menu/ActiveDeactiveMenu`;

    apiCaller({
      showSuccess: true,
      apiCall: () => api.post(url, formData),
      onSuccess: () => {
        const updatdData = data.map((d) =>
          d._id === record._id ? { ...d, status: "Inactive" } : d
        );
        setData(updatdData);
      },
    });
  };

  let columns = [];

  if (data && data.length > 0) {
    const numberFields = ["menuSequenceOrder"];
    const dateFields = ["performedOn"];

    const excludeFields = ["_id", "parentMenuId"];

    const filterFields = {
      selectFields,
      numberFields,
      dateFields,
      excludeFields,
    };
    columns = buildColumns("menu", data, filterFields, handleDeleteMenu);
  }

  const handleDownload = () => {
    handleDownloadCsv(selectedRowKeys, filteredData, columns);
  };

  return (
    <>
      <ComponentTopSec
        searchText={searchText}
        setSearchText={setSearchText}
        to={"add-menu"}
        label={"Add Menu"}
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
        height={390}
      />
    </>
  );
};

export default ManageMenu;
