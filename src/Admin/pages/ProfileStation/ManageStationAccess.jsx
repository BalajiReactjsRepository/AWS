import React, { useEffect, useState } from "react";
import DataTable from "../../../components/DataTable";

import { handleDownloadCsv } from "../../../utils/downloadData";
import { buildColumns } from "../../../utils/tableAction";
import { apiCaller } from "../../../api/apihelper";
import api from "../../../api/axiosConfig";
import { useStore } from "../../../Context/masterapis/MasterApisContext";
import SearchBar from "../../../components/SearchBar";
import AddBtn from "../../../components/AddBtn";
import DownloadBtn from "../../../components/DownloadBtn";
import SensorsTable from "./SensorsTable";

const ManageStationAccess = () => {
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
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");

  const hiddenColumns = ["_id", "userId", "stationIds", "profileId"];

  // useEffect(() => {
  //   apiCaller({
  //     setLoading,
  //     apiCall: () => api.get("/Admin/Client/GetAllClients"),
  //     onSuccess: (result) => setData(result ?? []),
  //   });
  // }, []);

  useEffect(() => {
    if (!profileId) return;

    const formData = new FormData();
    formData.append("profileId", profileId);
    formData.append("userId", userId);
    apiCaller({
      setLoading,
      apiCall: () =>
        api.post(`/Admin/ShowStationAccess/GetAllStationsAccess`, formData),
      onSuccess: (result) => setData(result ?? []),
    });
  }, [profileId, userId]);

  useEffect(() => {
    apiCaller({
      setLoading,
      apiCall: () => api("/Admin/User/GetUsersList"),
      onSuccess: (result) => setUsers(result),
    });
  }, []);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleDeleteProfile = async (reason, record) => {
    // const formData = new FormData();

    // formData.append("_id", record._id);
    // formData.append("IsActive", false);
    // formData.append("Reason", reason);

    const body = {
      IsActive: false,
      Reason: "Checking the working of multiple de-active",
      stationAccessList: [
        {
          _id: record._id,
        },
      ],
    };

    const url = `/Admin/ShowStationAccess/ActiveDeactiveStationAccess`;

    apiCaller({
      apiCall: () => api.post(url, body),
      onSuccess: () => {
        const updatdData = data.map((d) =>
          d._id === record._id ? { ...d, status: "Inactive" } : d,
        );
        setData(updatdData);
      },
      showSuccess: true,
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const selectFields = ["stationId", "userName", "profileId"];
  const searchColumns = ["stationId", "userName", "profileId"];

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

  const handleProfileClick = (id) => {
    setStationId(id);
    setIsModalVisible(true);
  };

  const customRenderMap = {
    profileName: (text, record) => (
      <span
        style={{
          // color: "#0084FF",
          // textDecoration: "underline",
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
    const filterFields = {
      selectFields,
      numberFields,
      dateFields,
      excludeFields: hiddenColumns,
    };
    columns = buildColumns(
      "Station Access",
      data,
      filterFields,
      handleDeleteProfile,
      customRenderMap,
      true,
      false,
      false,
    );
  }

  const handleDownload = () => {
    handleDownloadCsv(selectedRowKeys, filteredData, columns);
  };

  return (
    <>
      <div className='component-top-sec d-flex align-items-center'>
        <SearchBar value={searchText} setFun={setSearchText} />
        <div className='d-flex'>
          <select
            className='form-select mapping-drop-input me-3'
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value=''>Select User</option>
            {users?.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
          {userId && (
            <select
              className='form-select mapping-drop-input me-3'
              value={profileId}
              onChange={(e) => setProfileId(e.target.value)}
            >
              <option value=''>Select Profile</option>
              {profiles?.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.profileName}
                </option>
              ))}
            </select>
          )}
          <AddBtn label={"Add Station Access"} to='add-station-access' />
          <DownloadBtn handleDownload={handleDownload} data={paginatedData} />
        </div>
      </div>
      <SensorsTable
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        stationId={stationId}
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
        height={380}
      />
    </>
  );
};

export default ManageStationAccess;
