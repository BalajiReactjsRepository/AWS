import React from "react";
import { Field, FieldArray } from "formik";
import { Input, Checkbox, Button } from "antd";
//import saveIcon from "../images/AdminImages/save-small-color.png";
import crossIcon from "../images/AdminImages/cross-small-b.png";

import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useStore } from "../Context/masterapis/MasterApisContext";

import api from "../api/axiosConfig";
import { apiCaller } from "../api/apihelper";

const SensorConfiguration = (props) => {
  const { isViewMode, sensors, setSensors, resetConfiguration } = props;

  const { store } = useStore();
  const { sensors: mastersensors } = store;

  // const handleSave = () => {
  //   ErrorHanlder.SuccessToast("S Configuration Saved ✅");
  //   //alert("S Configuration Saved ✅");
  // };

  const handleReset = () => {
    resetConfiguration();
  };

  const onchangeSensorValues = (id, key, value) => {
    const updatedList = sensors.map((s) => {
      if (s.sensorId === id) {
        return { ...s, [key]: value };
      } else {
        return s;
      }
    });
    setSensors(updatedList);
  };

  const addSensortoStation = (sensorId) => {
    const selectedSensor = mastersensors.find((s) => s._id === sensorId);
    if (!selectedSensor) return;

    setSensors((prev) => {
      // If already exists, return existing list
      if (prev.some((s) => s.sensorId === selectedSensor._id)) {
        return prev;
      }

      // Otherwise add new one
      return [
        ...prev,
        {
          sensorName: selectedSensor.sensorName,
          sensorId: selectedSensor._id,
          serialNo: "",
          showInGraph: false,
          showInGrid: false,
          showInMapTooltip: false,
          showInWidget: false,
          gain: "No",
          offset: "No",
        },
      ];
    });
  };

  const chnageStatusOfsensor = async (id, status) => {
    const formData = new FormData();

    formData.append("_id", id);
    formData.append("IsActive", status);

    const url = `/Admin/Station/ActiveDeactiveStationSensor`;

    apiCaller({
      showSuccess: true,
      apiCall: () => api.post(url, formData),
      onSuccess: () => {
        const updatdData = sensors.map((d) =>
          d.sensorId === id ? { ...d, status: "Inactive" } : d
        );
        setSensors(updatdData);
      },
    });
  };

  return (
    <div className="row">
      <div className="col-12 d-flex align-items-center">
        <h5 className="col-3" style={{ fontWeight: "bold" }}>
          Sensor Details
        </h5>
        {!isViewMode && (
          <div className="col-9 d-flex justify-content-end">
            {/* Sensor */}
            <div className="col-6 col-md-3">
              <select
                className="form-select mapping-drop-input m-0"
                disabled={isViewMode}
                onChange={(e) => addSensortoStation(e.target.value)}
              >
                <option value="">Select Sensor to add</option>
                {mastersensors.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.sensorName}
                  </option>
                ))}
              </select>
            </div>
            {/* <Button
              type="text"
              onClick={handleSave}
              icon={
                <img src={saveIcon} alt="save" style={{ width: ".7rem" }} />
              }
              style={{ color: "#256DF0", margin: "0 1rem", border: "none" }}
            >
              Save Configuration
            </Button> */}
            <Button
              type="text"
              onClick={handleReset}
              icon={
                <img src={crossIcon} alt="reset" style={{ width: ".8rem" }} />
              }
              style={{ color: "#4B4B4B", border: "none" }}
            >
              Reset Configuration
            </Button>
          </div>
        )}
      </div>

      <div className="col-12 mt-3">
        <table className="table s-add-table">
          <thead>
            <tr>
              <th>Sensor Name</th>
              <th>Serial No</th>
              <th>Gain</th>
              <th>Offset</th>
              <th>Showing Grid</th>
              <th>Showing Graph</th>
              <th>Showing Map Tooltip</th>
              <th>Showing Widget</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <FieldArray>
              {() =>
                sensors.map((s, i) => (
                  <tr key={s.sensorId}>
                    <td>{s.sensorName}</td>
                    <td>
                      <Input
                        size="small"
                        value={s.serialNo}
                        id={`serialNo-${i}`}
                        placeholder="Enter SerialNo"
                        max={25}
                        readOnly={isViewMode || s.status === "Inactive"}
                        onChange={(e) =>
                          onchangeSensorValues(
                            s.sensorId,
                            "serialNo",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <Field
                        size="small"
                        as="select"
                        value={s.gain}
                        placeholder="Select Gain"
                        id={`gain-${i}`}
                        disabled={isViewMode || s.status === "Inactive"}
                        className="form-select"
                        onChange={(e) =>
                          onchangeSensorValues(
                            s.sensorId,
                            "gain",
                            e.target.value
                          )
                        }
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </Field>
                    </td>
                    <td>
                      <Field
                        size="small"
                        as="select"
                        value={s.offset}
                        placeholder="Select Offset"
                        id={`offset-${i}`}
                        disabled={isViewMode || s.status === "Inactive"}
                        className="form-select"
                        onChange={(e) =>
                          onchangeSensorValues(
                            s.sensorId,
                            "offset",
                            e.target.value
                          )
                        }
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </Field>
                    </td>
                    <td className="text-center">
                      <Checkbox
                        disabled={isViewMode || s.status === "Inactive"}
                        checked={s.showInGrid}
                        id={`showGrid-${i}`}
                        onChange={(e) =>
                          onchangeSensorValues(
                            s.sensorId,
                            "showInGrid",
                            e.target.checked
                          )
                        }
                      />
                    </td>
                    <td className="text-center">
                      <Checkbox
                        id={`showGraph-${i}`}
                        disabled={isViewMode || s.status === "Inactive"}
                        checked={s.showInGraph}
                        onChange={(e) =>
                          onchangeSensorValues(
                            s.sensorId,
                            "showInGraph",
                            e.target.checked
                          )
                        }
                      />
                    </td>
                    <td className="text-center">
                      <Checkbox
                        id={`showMap-${i}`}
                        disabled={isViewMode || s.status === "Inactive"}
                        checked={s.showInMapTooltip}
                        onChange={(e) =>
                          onchangeSensorValues(
                            s.sensorId,
                            "showInMapTooltip",
                            e.target.checked
                          )
                        }
                      />
                    </td>
                    <td className="text-center">
                      <Checkbox
                        id={`showWidget-${i}`}
                        disabled={isViewMode || s.status === "Inactive"}
                        checked={s.showInWidget}
                        onChange={(e) =>
                          onchangeSensorValues(
                            s.sensorId,
                            "showInWidget",
                            e.target.checked
                          )
                        }
                      />
                    </td>
                    <td>
                      {s.status === "Active" ? (
                        <EyeOutlined
                          onClick={() =>
                            chnageStatusOfsensor(s.sensorId, false)
                          }
                        />
                      ) : (
                        <EyeInvisibleOutlined
                          onClick={() => chnageStatusOfsensor(s.sensorId, true)}
                        />
                      )}
                    </td>
                  </tr>
                ))
              }
            </FieldArray>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensorConfiguration;
