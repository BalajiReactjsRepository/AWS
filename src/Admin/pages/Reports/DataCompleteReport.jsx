import React, { useState } from "react";
import ReportFiler from "./ReportFiler";
import DataTable from "../../../components/DataTable";
import { buildColumns } from "../../../utils/tableAction";
import DownloadBtn from "../../../components/DownloadBtn.jsx";
import { handleDownloadCsv } from "../../../utils/downloadData.js";
import ParameterCard from "./ParameterCard.jsx";
import api from "../../../api/axiosConfig.js";
import { apiCaller } from "../../../api/apihelper.js";

const DataCompleteReport = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const [parameters, setParameters] = useState({
    averageCompletenessPercentage: "",
    totalExpectedCount: "",
    totalReceivedCount: "",
    totalMissingCount: "",
  });

  const callReportApi = async (body) => {
    const formData = new FormData();

    formData.append("profileId", body.selectedProfile);
    formData.append("stationId", body.selectedStationIds.join(","));
    formData.append("reportType", body?.reportType);
    formData.append("fromDate", body?.fromDate);
    formData.append("toDate", body?.toDate);

    const url = `/Report/Report/GetDataCompletenessReport`;

    apiCaller({
      setLoading,
      apiCall: () => api.post(url, formData),
      onSuccess: (result) => {
        setShowTable(true);

        const completeReport = result?.data ?? [];
        setParameters({
          averageCompletenessPercentage:
            result?.averageCompletenessPercentage ?? "-",
          totalExpectedCount: result?.totalExpectedCount ?? "-",
          totalReceivedCount: result?.totalReceivedCount ?? "-",
          totalMissingCount: result?.totalMissingCount ?? "-",
        });
        setData(completeReport);
      },
    });
  };

  const paginatedData = data.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
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
      isActionNeed
    );
  }

  function onSelectChange(newSelectedRowKeys) {
    setSelectedRowKeys(newSelectedRowKeys);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const handleDownload = () => {
    handleDownloadCsv(selectedRowKeys, data, columns);
  };

  return (
    <div>
      <div>
        <ReportFiler
          dataReportType={"completeReport"}
          callReportApi={callReportApi}
        />
      </div>

      {showTable && (
        <div>
          <div className="row">
            {Object.entries(parameters).map(([key, value], index) => (
              <div key={key} className="col-12 col-md-3 mb-2">
                <ParameterCard name={key} value={value} />
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-end my-2">
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

export default DataCompleteReport;
