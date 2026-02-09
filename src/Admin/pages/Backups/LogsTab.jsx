import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { DatePicker, Table, Tooltip } from "antd";
import "./backup.css";
import Loader from "../../../components/Loader";
import { PlusCircleOutlined } from "@ant-design/icons";
import { tableSizes } from "../../../utils/tableAction";
import DetailModal from "./DetailModal";
import DownloadBtn from "../../../components/DownloadBtn";
import { handleDownloadCsv } from "../../../utils/downloadData";

import api from "../../../api/axiosConfig.js";
import dayjs from "dayjs";
import { apiCaller } from "../../../api/apihelper.js";

const LogsTab = () => {
  const filterInitialValues = {
    source: "",
    destination: "",
    status: "",
    requestIds: "",
    fromDate: dayjs().format("DD-MMM-YYYY"),
    toDate: dayjs().format("DD-MMM-YYYY"),
  };

  const sources = [
    { id: "", name: "All" },
    { id: "AP", name: "Portal" },
    { id: "B", name: "Backup" },
  ];

  const Destinations = [
    { id: "", name: "All" },
    { id: "AP", name: "Azista Portal" },
    { id: "ADC", name: "Azista Data Center (FTP)" },
    { id: "SDC", name: "State Data Center (FTP)" },
    { id: "WDC", name: "WIMS (FTP)" },
  ];

  const Statuses = [
    { id: "", name: "All" },
    { id: "F", name: "Failed" },
    { id: "C", name: "Completed" },
    { id: "P", name: "Processing" },
  ];

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [showTable, setShowTable] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    const formdata = new FormData();

    formdata.append("source", values.source ?? "");
    formdata.append("destination", values.destination ?? "");
    formdata.append("status", values.status ?? "");
    formdata.append("requestIds", values.requestIds ?? "");
    formdata.append("fromDate", values.fromDate ?? "");
    formdata.append("toDate", values.toDate ?? "");

    const url = `/Backup/Backup/GetBackupLogs`;

    setShowTable(true);

    apiCaller({
      setLoading,
      apiCall: () => api.post(url, formdata),
      onSuccess: (result) => {
        resetForm();
        setData(result ?? []);
      },
    });
  };

  const handleOpenDetails = (record) => {
    setSelectedRecordId(record.requestId);
    setModalOpen(true);
  };

  let columns = [];
  //.filter((key) => !excludeFiles.includes(key))
  if (data && data.length > 0) {
    const sampleRecord = data[0] || {};
    const datacolumns = Object.keys(sampleRecord).map((key) => {
      const col = {
        title: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        dataIndex: key,
        key: key,
      };
      return col;
    });

    datacolumns.unshift({
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Tooltip title="Details View">
          <PlusCircleOutlined
            style={{ cursor: "pointer" }}
            onClick={() => handleOpenDetails(record)}
          />
        </Tooltip>
      ),
    });

    columns = datacolumns;
  }

  const paginatedData = data.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  /** Reusable Wrapper */
  const InputWrapper = ({ label, children }) => (
    <div className="add-user-input_container col-12 col-md-3 mb-3">
      <label className="form-label">{label}</label>
      {children}
    </div>
  );

  /** Select Input */
  const SelectBox = ({ label, name, options }) => (
    <InputWrapper label={label}>
      <Field as="select" name={name} className="form-select">
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </Field>
    </InputWrapper>
  );

  /** Text Input */
  const TextInput = ({ label, name, placeholder }) => (
    <InputWrapper label={label}>
      <Field
        name={name}
        className="form-control"
        placeholder={placeholder || "Enter value"}
      />
    </InputWrapper>
  );

  /** Date Input (Formik + Antd integrated) */
  const DateInput = ({ label, name }) => (
    <InputWrapper label={label}>
      <Field name={name}>
        {({ form }) => (
          <DatePicker
            className="add-user-input_container form-control"
            format="DD-MMM-YYYY"
            onChange={(date, dateString) =>
              form.setFieldValue(name, dateString)
            }
          />
        )}
      </Field>
    </InputWrapper>
  );

  const handleChange = (pagination) => {
    setPagination(pagination);
  };

  const handleDownload = () => {
    handleDownloadCsv([], paginatedData, columns);
  };

  return (
    <>
      <Formik initialValues={filterInitialValues} onSubmit={handleSubmit}>
        {() => (
          <Form className="container p-3">
            <div className="row">
              <SelectBox
                label="Select Source"
                name="source"
                options={sources}
              />

              <SelectBox
                label="Select Destination"
                name="destination"
                options={Destinations}
              />

              <SelectBox
                label="Select Status"
                name="status"
                options={Statuses}
              />
              <TextInput label="Request IDs" name="requestIds" />
            </div>

            <div className="row">
              <DateInput label="From Date" name="fromDate" />
              <DateInput label="To Date" name="toDate" />

              <div className="col-6 col-md-2 d-flex align-items-center mt-2">
                <button type="submit" className="btn btn-dark w-100">
                  👁️ View
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {showTable && (
        <>
          <div className="d-flex justify-content-end mb-2">
            <DownloadBtn handleDownload={handleDownload} data={paginatedData} />
          </div>
          <Table
            className="custom-role-table"
            size="small"
            loading={{
              spinning: loading,
              indicator: <Loader />,
            }}
            rowKey={(record) => record["requestId"]}
            columns={columns}
            dataSource={paginatedData.length > 0 ? paginatedData : []}
            expandable={false}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: data.length,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50", "100"],
              position: ["bottomCenter"],
              onChange: (page, pageSize) =>
                setPagination({ current: page, pageSize }),
              itemRender: (current, type, originalElement) => {
                if (type === "prev") {
                  return <span>«</span>;
                }
                if (type === "next") {
                  return <span>»</span>;
                }
                return originalElement;
              },
            }}
            onChange={handleChange}
            scroll={tableSizes(columns.length, 330)}
          />
        </>
      )}

      <DetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        requestId={selectedRecordId}
      />
    </>
  );
};

export default LogsTab;
