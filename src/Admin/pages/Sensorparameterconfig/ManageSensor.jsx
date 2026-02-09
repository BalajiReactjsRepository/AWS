import React, { useEffect, useState } from "react";
import { buildColumns } from "../../../utils/tableAction";

import ComponentTopSec from "../../../components/ComponentTopSec";
import DataTable from "../../../components/DataTable";
import { handleDownloadCsv } from "../../../utils/downloadData";
import api from "../../../api/axiosConfig";
import { apiCaller } from "../../../api/apihelper";

const ManageSensor = () => {
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
        apiCall: () => api.get(`/Admin/Sensor/GetAllSensors`),
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
    "aliasName",
    "shortName",
    "sensorType",
    "modelNo",
    "make",
    "parameterMapping",
    "performedBy",
    "performedOn",
    "isActive",
    "remark",
  ];

  const searchColumns = [
    "sensorName",
    "aliasName",
    "shortName",
    "sensorType",
    "modelNo",
  ];

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

  const handleDeleteSensor = async (reason, record) => {
    const formData = new FormData();

    formData.append("_id", record._id);
    formData.append("IsActive", false);
    formData.append("Reason", reason);

    const url = `/Admin/Sensor/ActiveDeactiveSensor`;

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

    const filterFields = { selectFields, numberFields, dateFields };
    columns = buildColumns("sensor", data, filterFields, handleDeleteSensor);
  }

  const handleDownload = () => {
    handleDownloadCsv(selectedRowKeys, filteredData, columns);
  };

  return (
    <>
      <ComponentTopSec
        searchText={searchText}
        setSearchText={setSearchText}
        to={`add-sensor`}
        label={"Add Sensor"}
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

export default ManageSensor;
