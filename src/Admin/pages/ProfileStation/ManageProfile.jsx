import React, { useEffect, useState } from "react";

import { buildColumns } from "../../../utils/tableAction";

import { handleDownloadCsv } from "../../../utils/downloadData";
import ComponentTopSec from "../../../components/ComponentTopSec";
import DataTable from "../../../components/DataTable";
import api from "../../../api/axiosConfig";
import { tableTooltip } from "../../../utils/utilfuns";
import { apiCaller } from "../../../api/apihelper";

const ManageProfile = () => {
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
        apiCall: () => api.get(`/Admin/Profile/GetAllProfiles`),
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
    "profileName",
    "aliasProfileName",
    "delimiter",
    "dateFormat",
    "validationType",
    "performedBy",
    "performedOn",
  ];

  const searchColumns = ["profileName", "sensorName"];

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

  const handleDeleteProfile = async (reason, record) => {
    const formData = new FormData();

    formData.append("_id", record._id);
    formData.append("IsActive", false);
    formData.append("Reason", reason);

    const url = `/Admin/Profile/ActiveDeactiveProfile`;

    apiCaller({
      apiCall: () => api.post(url, formData),
      onSuccess: () => {
        const updatdData = data.map((d) =>
          d._id === record._id ? { ...d, status: "Inactive" } : d
        );
        setData(updatdData);
      },
      showSuccess: true,
    });
  };

  let columns = [];

  if (data && data.length > 0) {
    const numberFields = ["roleId"];
    const dateFields = ["performedOn"];
    const excludeFields = ["_id", "sensorIds"];
    const filterFields = {
      selectFields,
      numberFields,
      dateFields,
      excludeFields,
    };

    const customRenderMap = {
      sensors: (value) => {
        if (!value) return "";

        // If value is an array
        if (Array.isArray(value)) {
          return (
            <p>{tableTooltip(value.map((s) => s.sensorName).join(", "))}</p>
          );
        }

        // If value is a single object
        if (typeof value === "object") {
          return <p>{value.sensorName || ""}</p>;
        }

        return value; // fallback
      },
    };

    columns = buildColumns(
      "profile",
      data,
      filterFields,
      handleDeleteProfile,
      customRenderMap
    );
  }

  const handleDownload = () => {
    handleDownloadCsv(selectedRowKeys, filteredData, columns, "sensorName");
  };

  return (
    <>
      <ComponentTopSec
        searchText={searchText}
        setSearchText={setSearchText}
        to={`add-profile`}
        label={"Add Profile"}
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

export default ManageProfile;
