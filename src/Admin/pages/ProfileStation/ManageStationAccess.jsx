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

const ManageStationAccess = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);

  const { store } = useStore();
  const profiles = store.profiles;

  const [profileId, setProfileId] = useState("");
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    apiCaller({
      setLoading,
      apiCall: () => api.get("/Admin/Client/GetAllClients"),
      onSuccess: (result) => setData(result ?? []),
    });
  }, []);

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

  let columns = [];

  if (data && data.length > 0) {
    const numberFields = [];
    const dateFields = ["performedOn"];
    const filterFields = {
      selectFields,
      numberFields,
      dateFields,
    };
    columns = buildColumns("station", data, filterFields, handleDeleteProfile);
  }

  const handleDownload = () => {
    handleDownloadCsv(selectedRowKeys, filteredData, columns);
  };

  return (
    <>
      <div className="component-top-sec">
        <SearchBar value={searchText} setFun={setSearchText} />
        <div className="d-flex">
          <select
            className="form-select mapping-drop-input me-3"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
          <select
            className="form-select mapping-drop-input me-3"
            value={profileId}
            onChange={(e) => setProfileId(e.target.value)}
          >
            <option value="">Select Profile</option>
            {profiles.map((p) => (
              <option key={p._id} value={p._id}>
                {p.profileName}
              </option>
            ))}
          </select>
          <AddBtn label={"Add Station Access"} />
          <DownloadBtn handleDownload={handleDownload} data={paginatedData} />
        </div>
      </div>

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
