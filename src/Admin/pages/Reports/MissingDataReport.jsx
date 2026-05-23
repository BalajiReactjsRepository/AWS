import React, { useState } from "react";
import ReportFiler from "./ReportFiler";
import { buildColumns } from "../../../utils/tableAction";
import DataTable from "../../../components/DataTable.jsx";
import { handleDownloadCsv } from "../../../utils/downloadData.js";
import DownloadBtn from "../../../components/DownloadBtn.jsx";
import api from "../../../api/axiosConfig.js";
import { apiCaller } from "../../../api/apihelper.js";
import { useStore } from "../../../Context/masterapis/MasterApisContext.jsx";

const MissingDataReport = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState("");

  const { store } = useStore();

  const options = store.profiles.map((p) => ({
    value: p._id,
    label: p.profileName,
  }));

  const profileNameSelected = options.find(
    (opt) => opt.value === selectedProfile,
  )?.label;

  const callReportApi = async (body) => {
    setSelectedProfile(body.selectedProfile);
    const formData = new FormData();

    // formData.append("profileId", body.selectedProfile);
    formData.append("stationId", body.selectedStationIds.join(","));
    formData.append("fromDate", body?.fromDate);
    formData.append("toDate", body?.toDate);

    const url = `/Report/Report/GetMissingDataPeriods`;
    setShowTable(true);
    apiCaller({
      setLoading,
      apiCall: () => api.post(url, formData),
      onSuccess: (result) => setData(result),
    });
  };

  const paginatedData = data.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize,
  );

  let columns = [];

  if (data && data.length > 0) {
    const filterFields = {
      selectFields: [],
      numberFields: [],
      dateFields: [],
    };
    const isActionNeed = false;
    columns = buildColumns(
      "role",
      data,
      filterFields,
      () => {},
      {},
      isActionNeed,
    );
  }

  function onSelectChange(newSelectedRowKeys) {
    setSelectedRowKeys(newSelectedRowKeys);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const fileKey = "Missing-Data-Report";

  const handleDownload = () => {
    handleDownloadCsv(
      selectedRowKeys,
      data,
      columns,
      profileNameSelected,
      fileKey,
    );
  };

  return (
    <div>
      <div>
        <ReportFiler
          dataReportType={"missingReport"}
          callReportApi={callReportApi}
        />
      </div>
      {showTable && (
        <div>
          <div className='d-flex justify-content-end my-2'>
            <DownloadBtn handleDownload={handleDownload} data={paginatedData} />
          </div>

          <DataTable
            loading={loading}
            rowSelection={rowSelection}
            columns={columns}
            paginatedData={paginatedData}
            pagination={pagination}
            filteredData={data}
            setPagination={setPagination}
            // setFilteredInfo={()}
            height={330}
          />
        </div>
      )}
    </div>
  );
};

export default MissingDataReport;
