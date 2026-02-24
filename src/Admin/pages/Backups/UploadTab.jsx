import React, { useEffect, useMemo, useState, useCallback } from "react";
import dayjs from "dayjs";
import { Table } from "antd";
import Loader from "../../../components/Loader.jsx";
import { tableSizes } from "../../../utils/tableAction";
import api from "../../../api/axiosConfig.js";
import { Alert } from "antd";
import { apiCaller } from "../../../api/apihelper.js";

import "./backup.css";
import axios from "axios";

const UploadTab = () => {
  // ================================
  // State Management
  // ================================

  // Selected files for upload
  const [files, setFiles] = useState([]);

  // Selected source type
  const [sourceName, setSourceName] = useState("B");

  // Destination options
  const [IsOverwrite, setIsOverwrite] = useState(false);
  const [azistaPortal, setAzistaPortal] = useState(false);
  const [azistaDC, setAzistaDC] = useState(false);
  const [stateDC, setStateDC] = useState(false);
  const [wimsDC, setWimsDC] = useState(false);

  // Table pagination state
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  // Loader state
  const [loading, setLoading] = useState(false);

  // API table data
  const [data, setData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  // ================================
  // Load backup logs on initial page load
  // ================================
  const getTableData = useCallback(async () => {
    const formdata = new FormData();
    const fromDate = dayjs().subtract(1, "day").format("DD-MMM-YYYY");

    // Sending safe default values
    formdata.append("source", "");
    formdata.append("destination", "");
    formdata.append("status", "");
    formdata.append("requestIds", "");
    formdata.append("fromDate", fromDate);
    formdata.append("toDate", dayjs().format("DD-MMM-YYYY"));

    const url = `/Backup/Backup/GetBackupLogs`;

    apiCaller({
      setLoading,
      apiCall: () => api.post(url, formdata),
      onSuccess: (result) => setData(result ?? []),
    });
  }, []);

  // ================================
  // Trigger API call on component mount
  // ================================
  useEffect(() => {
    getTableData();
  }, [getTableData]);

  // ================================
  // Generate dynamic table columns from API response
  // ================================
  const columns = useMemo(() => {
    if (!data.length) return [];

    const sampleRecord = data[0];

    return Object.keys(sampleRecord).map((key) => ({
      title: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase()),
      dataIndex: key,
      key: key,
    }));
  }, [data]);

  // ================================
  // Handle pagination change
  // ================================
  const handleChange = useCallback((pagination) => {
    setPagination(pagination);
  }, []);

  // ================================
  // Handle file selection (max 5 files allowed)
  // ================================
  const onChnageFiles = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 30) {
      // alert("You can select a maximum of 30 files");
      e.target.value = "";
      return setShowAlert(true);
    }

    setFiles(selectedFiles);
  }, []);

  // ================================
  // Upload selected backup files to server
  // ================================
  const uploadBackup = useCallback(async () => {
    if (!files.length) {
      alert("Please select at least one file");
      return;
    }

    const formData = axios.toFormData({
      sourceName,
      IsOverwrite,
      azistaPortal,
      azistaDC,
      stateDC,
      wimsDC,
    });

    files.forEach((file) => {
      formData.append("Files", file);
    });

    const url = `/Backup/Backup/UploadBackupFiles`;

    apiCaller({
      showSuccess: true,
      apiCall: () => api.post(url, formData),
      onSuccess: () => {
        // Reset form after successful upload
        setFiles([]);
        setSourceName("B");
        setIsOverwrite(false);
        setAzistaPortal(false);
        setAzistaDC(false);
        setStateDC(false);
        setWimsDC(false);

        document.getElementById("fileInput").value = "";

        // Refresh logs after upload
        getTableData();
      },
    });
  }, [
    files,
    sourceName,
    IsOverwrite,
    azistaPortal,
    azistaDC,
    stateDC,
    wimsDC,
    getTableData,
  ]);

  // ================================
  // Component UI
  // ================================
  return (
    <div className='container py-4 upload-tab'>
      {/* ================= Source & File Selection ================= */}
      <div className='section-box mb-4 p-3 row'>
        {showAlert && (
          <div className='col-12 my-2'>
            <Alert
              message='You can select a maximum of 30 files'
              type='warning'
              closable
              onClose={() => setShowAlert(false)}
            />
          </div>
        )}
        <div className='col-6 col-md-2 py-3 border border-2 rounded-3'>
          <strong>Source</strong>

          <div className='form-check mt-2'>
            <input
              className='form-check-input'
              type='radio'
              name='source'
              checked={sourceName === "AP"}
              onChange={() => setSourceName("AP")}
            />
            <label className='form-check-label'>Azista Portal</label>
          </div>

          <div className='form-check mt-2'>
            <input
              id='fileInput'
              className='form-check-input'
              type='radio'
              name='source'
              checked={sourceName === "B"}
              onChange={() => setSourceName("B")}
            />
            <label className='form-check-label'>Backup</label>
          </div>
        </div>

        <div className='d-flex justify-content-center align-items-start mt-3 col-6 col-md-2'>
          <input
            type='file'
            id='fileUpload'
            multiple
            accept='.xlsx,.xls,.csv'
            style={{ display: "none" }}
            onChange={onChnageFiles}
          />

          <button
            className='btn btn-primary'
            onClick={() => document.getElementById("fileUpload").click()}
          >
            ⬆ Select File
          </button>
        </div>

        <div className='d-flex align-items-start mt-3 col-6 col-md-8'>
          <textarea
            className='form-control file-box'
            rows='4'
            disabled
            value={files.map((f) => f.name).join("\n")}
            placeholder='Selected files appear here...'
          ></textarea>
        </div>
      </div>

      {/* ================= Destination Options ================= */}
      <div className='section-box mb-4 px-2 py-3 row align-items-center'>
        <div className='row col-md-10 ms-2 border border-2 py-3 rounded-3'>
          <strong>Destination</strong>

          <div className='col-md-2'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={IsOverwrite}
              onChange={(e) => setIsOverwrite(e.target.checked)}
            />
            <label className='ms-2'>Overwrite Data</label>
          </div>

          <div className='col-md-2'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={azistaPortal}
              onChange={(e) => setAzistaPortal(e.target.checked)}
            />
            <label className='ms-2'>Azista Portal</label>
          </div>

          <div className='col-md-3'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={azistaDC}
              onChange={(e) => setAzistaDC(e.target.checked)}
            />
            <label className='ms-2'>Azista Data Center (FTP)</label>
          </div>

          <div className='col-md-3'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={stateDC}
              onChange={(e) => setStateDC(e.target.checked)}
            />
            <label className='ms-2'>State Data Center (FTP)</label>
          </div>

          <div className='col-md-2'>
            <input
              className='form-check-input'
              type='checkbox'
              checked={wimsDC}
              onChange={(e) => setWimsDC(e.target.checked)}
            />
            <label className='ms-2'>WIMS (FTP)</label>
          </div>
        </div>

        <div className='col-md-2 mt-3'>
          <button className='btn btn-dark float-end' onClick={uploadBackup}>
            ⬆ Upload
          </button>
        </div>
      </div>

      {/* ================= Backup Logs Table ================= */}
      <div className='section-box p-3 row'>
        <div className='info-text mb-2'>
          ℹ Data will be shown for the last 24 hours.
        </div>

        <Table
          className='custom-role-table'
          size='small'
          loading={{ spinning: loading, indicator: <Loader /> }}
          rowKey={(record) => record?.requestId ?? Math.random()}
          columns={columns}
          dataSource={data}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: data.length,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50", "100"],
            position: ["bottomCenter"],
            onChange: (page, pageSize) =>
              setPagination({ current: page, pageSize }),
          }}
          onChange={handleChange}
          scroll={tableSizes(columns.length, 350)}
        />
      </div>
    </div>
  );
};

export default UploadTab;
