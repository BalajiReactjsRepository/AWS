import React, { useEffect, useState } from "react";

import { buildColumns } from "../../../utils/tableAction";
import { handleDownloadCsv } from "../../../utils/downloadData";
import DataTable from "../../../components/DataTable";
import ComponentTopSec from "../../../components/ComponentTopSec";

import ErrorHandler from "../../../utils/errorhandler.js";
import api from "../../../api/axiosConfig.js";
import { apiCaller } from "../../../api/apihelper.js";

const ClientConfig = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDataApi = async () => {
      apiCaller({
        setLoading,
        apiCall: () => api.get("/Admin/Client/GetAllClients"),
        onSuccess: (result) => setData(result),
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
    "clientName",
    "clientCode",
    "status",
    "performedBy",
    "performedOn",
  ];
  const searchColumns = ["clientName", "emailId", "performedBy"];

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

  const handleDeleteUser = async (reason, record) => {
    try {
      const formData = new FormData();

      formData.append("_id", record._id);
      formData.append("IsActive", false);
      formData.append("Reason", reason);

      ErrorHandler.onLoading();

      const url = `/Admin/Client/ActiveDeactiveClient`;

      const res = await api.post(url, formData);

      ErrorHandler.onLoadingClose();
      if (res?.data?.statusCode === 200) {
        ErrorHandler.onSuccess(res?.data?.message);
        const updatdData = data.map((d) =>
          d._id === record._id ? { ...d, status: "Inactive" } : d
        );
        setData(updatdData);
      } else {
        ErrorHandler.onError({ message: res?.data?.message ?? "" });
      }
    } catch (error) {
      ErrorHandler.onLoadingClose();
      ErrorHandler.onError(error);
    }
  };

  let columns = [];

  if (data && data.length > 0) {
    const numberFields = [];
    const dateFields = ["performedOn"];

    const filterFields = { selectFields, numberFields, dateFields };
    columns = buildColumns("client", data, filterFields, handleDeleteUser);
  }

  const handleDownload = () => {
    handleDownloadCsv(selectedRowKeys, filteredData, columns);
  };

  return (
    <>
      <ComponentTopSec
        searchText={searchText}
        setSearchText={setSearchText}
        to={"add-client"}
        label={"Add Client"}
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
        height={350}
      />
    </>
  );
};

export default ClientConfig;
