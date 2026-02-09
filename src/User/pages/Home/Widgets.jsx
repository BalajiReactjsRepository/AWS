import React, { memo, useEffect, useState } from "react";
import { Modal } from "bootstrap";

import WidgetTable from "./WidgetTable";
import { apiCaller } from "../../../api/apihelper";
import api from "../../../api/axiosConfig";

const Widgets = () => {
  const [tableData, setTableData] = useState([]);
  const [widgetsList, setWidgetsList] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [stationFilter, setStationFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getWidgets = async () => {
      apiCaller({
        apiCall: () =>
          api.post("/User/UserMapDashboard/GetStationSummaryWidget"),
        onSuccess: (result) => {
          setWidgetsList(result ?? []);
        },
      });
    };
    getWidgets();
  }, []);

  const callGetTableDataApi = async (url, body) => {
    apiCaller({
      apiCall: () => api.post(`/User/UserMapDashboard/${url}`, body),
      onSuccess: (result) => {
        setTableData(result ?? []);

        // Open modal AFTER data is set
        const modalEl = document.getElementById("exampleModal");
        if (modalEl) {
          const modal = new Modal(modalEl);
          modal.show();
        }
      },
    });
  };

  const appendData = (title) => {
    setStationFilter("");
    setSelectedTitle(title);
    setCurrentPage(1);
    const formdata = new FormData();
    switch (title) {
      case "Total Stations":
        formdata.append("stationStatus", "total");
        callGetTableDataApi("GetActiveInactiveStations", formdata);
        break;
      case "Active Stations":
        formdata.append("stationStatus", "active");
        callGetTableDataApi("GetActiveInactiveStations", formdata);
        break;
      case "Cancelled Stations":
        formdata.append("stationStatus", "cancelled");
        callGetTableDataApi("GetActiveInactiveStations", formdata);
        break;
      case "Inactive Stations":
        formdata.append("stationStatus", "inactive");
        callGetTableDataApi("GetActiveInactiveStations", formdata);
        break;
      case "Max Rainfall":
        formdata.append("reportType", "rain");
        callGetTableDataApi("GetMaxRainfallAndTempList", formdata);
        break;
      case "Max Temperature":
        formdata.append("reportType", "temp");
        callGetTableDataApi("GetMaxRainfallAndTempList", formdata);
        break;
      default:
        setTableData([]);
    }
  };

  return (
    <div className="d-flex my-1 flex-wrap">
      {/* Modal */}
      <WidgetTable
        tableData={tableData}
        setTableData={setTableData}
        stationFilter={stationFilter}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        selectedTitle={selectedTitle}
        setStationFilter={setStationFilter}
      />

      {/* Widget Cards */}
      {widgetsList.map((w, i) => {
        return (
          <div
            key={i}
            onClick={() => appendData(w.title)}
            className="me-3 text-center rounded-3 shadow-sm py-3"
            style={{
              background: w?.color ?? "#02b5cb",
              cursor: "pointer",
              color: "#fff",
              width: "10rem",
              height: "5rem",
            }}
          >
            <h6 className="m-0">{w.title}</h6>
            <p className="fs-5 fw-bold mb-0">{w?.values ?? ""}</p>
          </div>
        );
      })}
    </div>
  );
};

export default memo(Widgets);
