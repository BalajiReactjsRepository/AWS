import { useCallback, useEffect, useState } from "react";
import { Modal, Table, Tooltip, Grid } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import Loader from "../../../components/Loader";

import { tableSizes } from "../../../utils/tableAction";
import api from "../../../api/axiosConfig.js";
import { apiCaller } from "../../../api/apihelper.js";

const DetailModal = ({ open, onClose, requestId }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const { useBreakpoint } = Grid;
  // Fetch API when modal opens

  const fetchData = useCallback(async () => {
    const formData = new FormData();
    formData.append("requestId", requestId);

    const url = `/Backup/Backup/GetBackupDetailLogs`;

    apiCaller({
      setLoading,
      apiCall: () => api.post(url, formData),
      onSuccess: (result) => setData(result ?? []),
    });
  }, [requestId]);

  useEffect(() => {
    if (open && requestId) {
      fetchData();
    }
  }, [open, requestId, fetchData]);

  const sampleRecord = data[0] ?? {};

  const columns = Object.keys(sampleRecord)
    .filter((key) => key !== "outputFilePath")
    .map((key) => {
      const col = {
        title: key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase()),
        dataIndex: key,
        key: key,
      };
      return col;
    });

  const dowCol = {
    title: "Output File",
    key: "download",
    render: (_, row) => {
      const file = row.outputFilePath;

      const isValid = file && file !== "-" && file.trim() !== "";

      return isValid ? (
        <Tooltip title="Download data status file">
          <DownloadOutlined
            style={{
              fontSize: 18,
              cursor: "pointer",
            }}
            onClick={() => downloadFile(file)}
          />
        </Tooltip>
      ) : (
        "-"
      );
    },
  };

  columns.push(dowCol);

  const downloadFile = (filelink) => {
    const link = document.createElement("a");
    link.href = filelink;
    link.download = filelink.split("/").pop(); // optional: use filename from URL
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const paginatedData = data.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  const handleChange = (pagination) => {
    setPagination(pagination);
  };

  const screens = useBreakpoint();

  const modalWidth = screens.xl
    ? 1500
    : screens.lg
    ? 1400
    : screens.md
    ? 800
    : screens.sm
    ? 600
    : "95%";

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={modalWidth}
      title={`Detail View - ${requestId}`}
    >
      <Table
        className="custom-role-table"
        size="small"
        loading={{
          spinning: loading,
          indicator: <Loader />,
        }}
        rowKey={(record) => record["fileName"]}
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
        scroll={tableSizes(columns.length, 400)}
      />
    </Modal>
  );
};

export default DetailModal;
