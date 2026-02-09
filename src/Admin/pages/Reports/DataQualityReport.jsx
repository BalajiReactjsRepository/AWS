import React, { useState, useMemo } from "react";
import DataTable from "../../../components/DataTable";
import DownloadBtn from "../../../components/DownloadBtn";
import ReportFiler from "./ReportFiler";
import { handleDownloadCsv } from "../../../utils/downloadData";
import { buildColumns } from "../../../utils/tableAction";
import api from "../../../api/axiosConfig.js";
import { apiCaller } from "../../../api/apihelper.js";

const DataQualityReport = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const callReportApi = async (body) => {
    const formData = new FormData();
    formData.append("profileId", body.selectedProfile);
    formData.append("stationId", body.selectedStationIds.join(","));
    formData.append("fromDate", body.fromDate);
    formData.append("toDate", body.fromDate);
    formData.append("issueType", body.issueType);

    const url = `/Report/Report/GetDataQualityReport`;

    apiCaller({
      setLoading,
      apiCall: () => api.post(url, formData),
      onSuccess: (result) => {
        setShowTable(true);
        setData(result ?? []);
      },
    });
  };

  const paginatedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    return data.slice(start, start + pagination.pageSize);
  }, [data, pagination]);

  const columns = useMemo(() => {
    if (!data?.length) return [];

    const filterFields = {
      selectFields: [],
      numberFields: [],
      dateFields: [],
    };

    return buildColumns("quality", data, filterFields, () => {}, {}, false);
  }, [data]);

  const handleDownload = () => {
    handleDownloadCsv(selectedRowKeys, data, columns);
  };

  return (
    <div>
      <ReportFiler
        dataReportType="qualityReport"
        callReportApi={callReportApi}
      />

      {showTable && (
        <div>
          <div className="d-flex justify-content-end my-2">
            <DownloadBtn handleDownload={handleDownload} data={paginatedData} />
          </div>

          <DataTable
            loading={loading}
            rowSelection={{
              selectedRowKeys,
              onChange: setSelectedRowKeys,
            }}
            columns={columns}
            paginatedData={paginatedData}
            pagination={pagination}
            filteredData={data}
            setPagination={setPagination}
            height={460}
          />
        </div>
      )}
    </div>
  );
};

export default DataQualityReport;
