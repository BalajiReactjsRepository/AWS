import React, { useEffect, useState } from "react";
import DataTable from "../../../components/DataTable";
import ComponentTopSec from "../../../components/ComponentTopSec";
import { handleDownloadCsv } from "../../../utils/downloadData";
import { buildColumns } from "../../../utils/tableAction";
import { apiCaller } from "../../../api/apihelper";
import api from "../../../api/axiosConfig";

const UnitController = () => {
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
        apiCall: () => api.get("/Admin/Unit/GetAllUnits"),
        onSuccess: (result) => setData(result ?? []),
      });
    };
    fetchDataApi();
  }, []);

  function onSelectChange(newSelectedRowKeys) {
    setSelectedRowKeys(newSelectedRowKeys);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const selectFields = [
    "unitName",
    "unitSymbol",
    "unitCategory",
    "performedOn",
    "status",
  ];
  const searchColumns = ["unitName", "unitIcon", "unitCategory", "performedBy"];

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

  const handleDeleteRole = async (reason, record) => {
    const formData = new FormData();

    formData.append("_id", record._id);
    formData.append("IsActive", false);
    formData.append("Reason", reason);

    apiCaller({
      showSuccess: true,
      apiCall: () => api.post("/Admin/Unit/ActiveDeactiveUnit", formData),
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
    const excludeFields = ["_id"];
    const filterFields = {
      selectFields,
      numberFields,
      dateFields,
      excludeFields,
    };

    columns = buildColumns("unit", data, filterFields, handleDeleteRole);
  }

  const handleDownload = () => {
    handleDownloadCsv(selectedRowKeys, filteredData, columns);
  };

  return (
    <>
      <ComponentTopSec
        searchText={searchText}
        setSearchText={setSearchText}
        to={"add-unit"}
        label={"Add Unit"}
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

export default UnitController;
