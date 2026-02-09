import React, { useEffect, useState } from "react";

import { buildColumns } from "../../../utils/tableAction";
import DataTable from "../../../components/DataTable";
import ComponentTopSec from "../../../components/ComponentTopSec";
import { handleDownloadCsv } from "../../../utils/downloadData";
import api from "../../../api/axiosConfig";
import { tableTooltip } from "../../../utils/utilfuns";
import { apiCaller } from "../../../api/apihelper";

const SensorParameterMapping = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDataApi = async () => {
      apiCaller({
        setLoading,
        apiCall: () =>
          api.get(`/Admin/SensorParameterMapping/GetAllSensorParameterMapping`),
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
    "sensorName",
    "profileName",
    "performedBy",
    "performedOn",
    "isActive",
    "status",
  ];

  const searchColumns = ["sensorName", "profileName"];

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

  const handleDeleteSensorParameter = async (reason, record) => {
    const formData = new FormData();

    formData.append("_id", record?._id.split(",")[0] ?? "");
    formData.append("IsActive", false);
    formData.append("Reason", reason);

    const url = `/Admin/SensorParameterMapping/ActiveDeactiveSensorParameterMapping`;

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
    const numberFields = [];
    const dateFields = ["performedOn"];
    const excludeFields = ["_id", "profileId", "sensorId", "sensorParameterId"];
    const filterFields = {
      selectFields,
      numberFields,
      dateFields,
      excludeFields,
    };
    const customRenderMap = {
      parameters: (value) => {
        if (!value) return "";

        // If value is an array
        if (Array.isArray(value)) {
          return (
            <p>
              {tableTooltip(value.map((p) => p.parameterName).join(", "), 20)}
            </p>
          );
        }

        // If value is a single object
        if (typeof value === "object") {
          return <p>{value.parameterName || ""}</p>;
        }

        return value; // fallback
      },
    };

    columns = buildColumns(
      "parameter",
      data,
      filterFields,
      handleDeleteSensorParameter,
      customRenderMap
    );
  }

  const handleDownload = () => {
    handleDownloadCsv(selectedRowKeys, filteredData, columns, "parameterName");
  };

  return (
    <>
      <ComponentTopSec
        searchText={searchText}
        setSearchText={setSearchText}
        to={`add-sensor-prameter-mapping`}
        label={"Add Prameter Mapping"}
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

export default SensorParameterMapping;
