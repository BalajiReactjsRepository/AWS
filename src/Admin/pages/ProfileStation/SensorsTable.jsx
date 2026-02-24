import { Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import "./profile.css";
import { tableSizes } from "../../../utils/tableAction";

import { apiCaller } from "../../../api/apihelper";
import api from "../../../api/axiosConfig";

const SensorsTable = ({ setIsModalVisible, isModalVisible, stationId }) => {
  const [sensor, setSensor] = useState([]);

  useEffect(() => {
    if (isModalVisible && stationId) {
      const url = `/Admin/Station/GetStationSensorDetails`;

      const formdata = new FormData();

      formdata.append("stationId", stationId);
      apiCaller({
        apiCall: () => api.post(url, formdata),
        onSuccess: (result) => {
          setSensor(result ?? []);
        },
      });
    }
  }, [isModalVisible, stationId]);

  // gain: "No";
  // offset: "Yes";
  // performedBy: "Rajnik Patel";
  // performedOn: "23-Apr-2025 05:48";
  // sensorId: "6774d77f3d31857ca66946e5";
  // sensorName: "Battery Voltage";
  // serialNo: "";
  // showInGraph: true;
  // showInGrid: true;
  // showInMapTooltip: false;
  // showInWidget: true;

  const columns = [
    { title: "Sensor Name", dataIndex: "sensorName", key: "sensorName" },
    { title: "Gain", dataIndex: "gain", key: "gain" },
    { title: "Offset", dataIndex: "offset", key: "offset" },
    { title: "Serial No", dataIndex: "serialNo", key: "serialNo" },
    {
      title: "Showing Grid",
      dataIndex: "showInGrid",
      key: "showInGrid",
      render: (val) => (val ? "✔️" : "❌"),
    },
    {
      title: "Show in Map Tooltip",
      dataIndex: "showInMapTooltip",
      key: "showInMapTooltip",
      render: (val) => (val ? "✔️" : "❌"),
    },
    {
      title: "Show in Widget",
      dataIndex: "showInWidget",
      key: "showInWidget",
      render: (val) => (val ? "✔️" : "❌"),
    },
    {
      title: "Show in Graph",
      dataIndex: "showInGraph",
      key: "showInGraph",
      render: (val) => (val ? "✔️" : "❌"),
    },
  ];

  return (
    <Modal
      title='Sensor Details'
      open={isModalVisible}
      footer={null}
      onCancel={() => setIsModalVisible(false)}
      width={1000}
    >
      <Table
        className='custom-sensor-table'
        size='small'
        bordered
        columns={columns}
        dataSource={sensor}
        rowKey='sensorName'
        pagination={false}
        scroll={tableSizes(5, undefined)}
      />
    </Modal>
  );
};

export default SensorsTable;
