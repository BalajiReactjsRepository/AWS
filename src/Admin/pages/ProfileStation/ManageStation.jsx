import React, { useEffect, useState } from "react";

import { buildColumns } from "../../../utils/tableAction";

import SensorsTable from "./SensorsTable";
import { handleDownloadCsv } from "../../../utils/downloadData";
import DataTable from "../../../components/DataTable";
import ComponentTopSec from "../../../components/ComponentTopSec";
import api from "../../../api/axiosConfig";
import { useStore } from "../../../Context/masterapis/MasterApisContext";
import { apiCaller } from "../../../api/apihelper";

const ManageStation = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [stationId, setStationId] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { store } = useStore();
  const profiles = store.profiles;

  const [profileId, setProfileId] = useState("");

  useEffect(() => {
    setProfileId(profiles[0]?._id ?? "");
  }, [profiles]);

  useEffect(() => {
    if (!profileId) return;

    const fetchDataApi = async () => {
      const url = `/Admin/Station/GetAllStations`;

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

  const onChangeProfile = (e) => {
    const id = e.target.value;
    setProfileId(id);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const selectFields = [
    "stationId",
    "stationName",
    "district",
    "state",
    "status",
    "performedBy",
    "performedOn",
  ];

  const searchColumns = [
    "stationId",
    "stationName",
    "district",
    "block",
    "address",
    "city",
    "state",
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
    pagination.current * pagination.pageSize,
  );

  const handleDeleteStation = async (reason, record) => {
    const formData = new FormData();

    formData.append("_id", record._id);
    formData.append("IsActive", false);
    formData.append("Reason", reason);

    const url = `/Admin/Station/ActiveDeactiveStation`;

    apiCaller({
      showSuccess: true,
      apiCall: () => api.post(url, formData),
      onSuccess: () => {
        const updatdData = data.map((d) =>
          d._id === record._id ? { ...d, status: "Inactive" } : d,
        );
        setData(updatdData);
      },
    });
  };

  const handleProfileClick = (id) => {
    setStationId(id);
    setIsModalVisible(true);
  };

  const customRenderMap = {
    profileName: (text, record) => (
      <span
        style={{
          color: "#0084FF",
          textDecoration: "underline",
          cursor: "pointer",
        }}
        onClick={() => handleProfileClick(record._id)}
      >
        {text}
      </span>
    ),
  };

  let columns = [];

  if (data && data.length > 0) {
    const numberFields = [];
    const dateFields = ["performedOn"];
    const excludeFields = ["_id", "profileId"];
    const filterFields = {
      selectFields,
      numberFields,
      dateFields,
      excludeFields,
    };
    columns = buildColumns(
      "station",
      data,
      filterFields,
      handleDeleteStation,
      customRenderMap,
    );
  }

  const handleDownload = () => {
    handleDownloadCsv(selectedRowKeys, filteredData, columns);
  };

  return (
    <>
      <ComponentTopSec
        searchText={searchText}
        setSearchText={setSearchText}
        to={`add-station`}
        label={"Add Station"}
        handleDownload={handleDownload}
        paginatedData={paginatedData}
        importBtn={true}
        profiles={profiles}
        profileId={profileId}
        onChangeProfile={onChangeProfile}
      />

      <SensorsTable
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        stationId={stationId}
      />
      {/* {isModalVisible && ()} */}
      <DataTable
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        paginatedData={paginatedData}
        pagination={pagination}
        filteredData={filteredData}
        setPagination={setPagination}
        setFilteredInfo={setFilteredInfo}
        height={370}
      />
    </>
  );
};

export default ManageStation;
