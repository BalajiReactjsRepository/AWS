import React, { useEffect, useState } from "react";

import { buildColumns } from "../../../utils/tableAction";
import ErrorHandler from "../../../utils/errorhandler";

import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import arrowIcon from "../../../images/AdminImages/arrow-small-left.png";
import { stationHistory } from "../../../Data/Profiledata";
import DataTable from "../../../components/DataTable";

const fetchData = async () => {
  return stationHistory;
};

const StationImportHistrory = () => {
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataApi = async () => {
      setLoading(true);
      await new Promise((rese) => {
        setTimeout(() => {
          rese();
        }, 2000);
      });

      const data = await fetchData(); // make sure to await here!
      setData(data);

      setLoading(false);
    };
    fetchDataApi();
  }, []);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const selectFields = [
    "fileName",
    "reason",
    "status",
    "performedBy",
    "performedOn",
  ];

  const filteredData = data.filter((item) => {
    // Dynamic filters
    const filterMatch = selectFields.every((field) => {
      if (filteredInfo[field]) {
        return filteredInfo[field].includes(item[field]);
      }
      return true;
    });

    return filterMatch;
  });

  const paginatedData = filteredData.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  const handleDeleteUser = async (reason) => {
    // alert(`Deleting Uset reason : ${reason}`);
    ErrorHandler.SuccessToast("Data saved successfully");
  };

  let columns = [];

  if (data && data.length > 0) {
    const numberFields = ["roleId"];
    const dateFields = ["performedOn"];

    const filterFields = { selectFields, numberFields, dateFields };
    columns = buildColumns("profile", data, filterFields, handleDeleteUser);
  }

  return (
    <>
      <Button
        className="custom-button"
        style={{
          background: "#F2F2F2",
          color: "#000",
          border: "none",
          marginBottom: "1rem",
        }}
        icon={<img src={arrowIcon} alt="back" />}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
      <DataTable
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        paginatedData={paginatedData}
        pagination={pagination}
        filteredData={filteredData}
        setPagination={setPagination}
        setFilteredInfo={setFilteredInfo}
        height={335}
      />
    </>
  );
};

export default StationImportHistrory;
