import React, { useEffect, useState } from "react";
import DataTable from "../../../components/DataTable";
import ComponentTopSec from "../../../components/ComponentTopSec";
import { buildColumns } from "../../../utils/tableAction";
import { handleDownloadCsv } from "../../../utils/downloadData";
import { useStore } from "../../../Context/masterapis/MasterApisContext";
import { apiCaller } from "../../../api/apihelper";
import api from "../../../api/axiosConfig";

const ParameterSensor = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const { store } = useStore();
  const profiles = store.profiles;

  const [profileId, setProfileId] = useState("");

  useEffect(() => {
    setProfileId(profiles[0]?._id ?? "");
  }, [profiles]);

  useEffect(() => {
    if (!profileId) return;

    const fetchDataApi = async () => {
      const url = `/Admin/DerivedParameterMapping/GetAllDerivedParameterMapping`;

      const formdata = new FormData();
      formdata.append("profileId", profileId);

      apiCaller({
        setLoading,
        apiCall: () => api.post(url, formdata),
        onSuccess: (result) => setData(result ?? []),
      });
    };
    fetchDataApi();
  }, [profileId]);

  function onSelectChange(newSelectedRowKeys) {
    setSelectedRowKeys(newSelectedRowKeys);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const selectFields = ["performedBy", "status"];
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
    pagination.current * pagination.pageSize,
  );

  const handleDeleteRole = async (reason, record) => {
    const formData = new FormData();

    formData.append("_id", record._id);
    formData.append("IsActive", false);
    formData.append("Reason", reason);

    apiCaller({
      showSuccess: true,
      apiCall: () =>
        api.post(
          "/Admin/DerivedParameterMapping/ActiveDeactiveDerivedParameterMapping",
          formData,
        ),
      onSuccess: () => {
        const updatdData = data.map((d) =>
          d._id === record._id ? { ...d, status: "Inactive" } : d,
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

    columns = buildColumns(
      "Mapping",
      data,
      filterFields,
      handleDeleteRole,
      {},
      true,
      false,
      false,
    );
  }

  const onChangeProfile = (e) => {
    const id = e.target.value;
    setProfileId(id);
  };

  const handleDownload = () => {
    handleDownloadCsv(selectedRowKeys, filteredData, columns);
  };

  return (
    <>
      <ComponentTopSec
        searchText={searchText}
        setSearchText={setSearchText}
        to={"add-derived-parameter-mapping"}
        label={"Add Mapping"}
        handleDownload={handleDownload}
        paginatedData={paginatedData}
        importBtn={true}
        profiles={profiles}
        profileId={profileId}
        onChangeProfile={onChangeProfile}
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

export default ParameterSensor;
