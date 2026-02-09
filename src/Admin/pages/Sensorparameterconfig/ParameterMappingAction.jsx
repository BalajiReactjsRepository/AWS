import React, { useEffect, useMemo, useState } from "react";
import { Button, Table, Input, Space, Modal } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./ParameterMappingAction.css";

import arrowIcon from "../../../images/AdminImages/arrow-small-left.png";
import trashIcon from "../../../images/AdminImages/trash.png";
import editIcon from "../../../images/AdminImages/file-edit.png";

import { useStore } from "../../../Context/masterapis/MasterApisContext";
import ErrorHandler from "../../../utils/errorhandler.js";
import api from "../../../api/axiosConfig.js";
import { apiCaller } from "../../../api/apihelper.js";
import { callActionWarningPopup } from "../../../components/ActionsBtns.jsx";

const ParameterMappingAction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { action } = useParams();
  const { record } = location?.state || {};
  const { store } = useStore();
  const { profiles, sensors } = store;

  const isViewMode = action === "view-parameter";

  /** ----------------------------------------------------
   *  Dropdown State
   * ---------------------------------------------------- */
  const [units, setUnits] = useState([]);
  const [parameters, setParameters] = useState([]);

  /** ----------------------------------------------------
   *  Main Table State
   * ---------------------------------------------------- */
  const [sensorParameters, setSensorParameters] = useState(
    record?.parameters ?? []
  );

  /** ----------------------------------------------------
   *  Add Parameter State
   * ---------------------------------------------------- */
  const [showEnter, setShowEnter] = useState(false);
  const [enterValue, setEnterValue] = useState("");

  const [addParameter, setAddParameter] = useState({
    isActive: true,
    parameterName: "",
    sensorParameterId: "",
    values: "",
    unitId: "",
    _id: "",
  });

  /** ----------------------------------------------------
   *  Edit Modal State
   * ---------------------------------------------------- */
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editParameter, setEditParameter] = useState({
    _id: "",
    unitId: "",
    value: "",
  });

  /** ----------------------------------------------------
   * Profile / Sensor Selected
   * ---------------------------------------------------- */
  const [profileId, setProfileId] = useState(record?.profileId ?? "");
  const [sensorId, setSensorId] = useState(record?.sensorId ?? "");

  const [mainError, setMainErros] = useState({ profile: false, sensor: false });

  /** ----------------------------------------------------
   * Fetch Dropdown Values
   * ---------------------------------------------------- */
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [parameterRes, unitRes] = await Promise.allSettled([
          api.get("/Admin/ParameterInSensor/GetAllParameterInSensor"),
          api.get("/Admin/Unit/GetUnits"),
        ]);

        setUnits(unitRes?.value?.data?.result ?? []);
        setParameters(parameterRes?.value?.data?.result ?? []);
      } catch (error) {
        ErrorHandler.onError(error);
      }
    };

    loadDropdownData();
  }, []);

  /** ----------------------------------------------------
   * Reusable Helpers
   * ---------------------------------------------------- */

  const findUnit = (id) => units.find((u) => u._id === id) ?? null;
  const findParameter = (id) => parameters.find((p) => p._id === id) ?? null;

  /** ----------------------------------------------------
   * Add Parameter Logic
   * ---------------------------------------------------- */
  const onChangeAdd = (e) => {
    const { id, value } = e.target;

    if (id === "unit") {
      setShowEnter(value === "enter");
      if (value !== "enter") {
        const found = findUnit(value);
        setAddParameter((prev) => ({
          ...prev,
          unitId: found?._id,
          values: found?.unitName,
        }));
      } else {
        setEnterValue("");
        setAddParameter((prev) => ({ ...prev, unitId: "enter", values: "" }));
      }

      return;
    }

    if (id === "parameter") {
      const selected = findParameter(value);
      const exists = sensorParameters.some(
        (p) => p.sensorParameterId === value
      );

      if (selected && !exists) {
        setEnterValue("");
        setAddParameter({
          isActive: true,
          parameterName: selected.parameterName,
          sensorParameterId: selected._id,
          values: "",
          unitId: "",
          _id: "",
        });
      } else {
        setAddParameter({
          isActive: true,
          parameterName: "",
          sensorParameterId: "",
          values: "",
          unitId: "",
          _id: "",
        });
      }
    }
  };

  const handleAddParameter = () => {
    if (!addParameter.sensorParameterId || !addParameter.values)
      return alert("Please select parameter and enter value");

    setSensorParameters((prev) => [...prev, addParameter]);

    // reset
    setAddParameter({
      isActive: true,
      parameterName: "",
      sensorParameterId: "",
      values: "",
      unitId: "",
      _id: "",
    });
    setEnterValue("");
    setShowEnter(false);
  };

  /** ----------------------------------------------------
   * Edit Parameter Logic
   * ---------------------------------------------------- */
  const openEditModal = (record) => {
    const unitId = record.unitId || "enter";

    setShowEnter(unitId === "enter");
    setEditParameter({
      _id: record.sensorParameterId,
      unitId,
      value: record.values,
    });

    setIsEditModalOpen(true);
  };

  const onChangeEdit = (e) => {
    const { id, value } = e.target;

    if (id === "unit") {
      setShowEnter(value === "enter");

      if (value !== "enter") {
        const u = findUnit(value);
        setEditParameter((prev) => ({
          ...prev,
          unitId: u?._id,
          value: u?.unitName,
        }));
      } else {
        setEditParameter((prev) => ({
          ...prev,
          unitId: "enter",
          value: "",
        }));
      }

      return;
    }

    setEditParameter((prev) => ({
      ...prev,
      value,
    }));
  };

  const saveEditValue = () => {
    setSensorParameters((prev) =>
      prev.map((p) =>
        p.sensorParameterId === editParameter._id
          ? { ...p, values: editParameter.value }
          : p
      )
    );
    setShowEnter(false);
    setIsEditModalOpen(false);
  };

  /** ----------------------------------------------------
   * Delete Parameter
   * ---------------------------------------------------- */
  const handleDeleteParameter = async (id, sensorParamId) => {
    if (!id) {
      setSensorParameters((prev) =>
        prev.filter((p) => p.sensorParameterId !== sensorParamId)
      );
      return;
    }

    const reason = await new Promise((resolve) => {
      callActionWarningPopup(
        "Delete",
        (reason) => resolve(reason),
        "parameter"
      );
    });

    const formData = new FormData();
    formData.append("_id", id);
    formData.append("IsActive", false);
    formData.append("Reason", reason);

    const url =
      "/Admin/SensorParameterMapping/ActiveDeactiveSensorParameterMapping";

    apiCaller({
      showSuccess: true,
      apiCall: () => api.post(url, formData),
      onSuccess: () =>
        setSensorParameters((prev) => prev.filter((p) => p._id !== id)),
    });
  };

  /** ----------------------------------------------------
   * Assign Mapping
   * ---------------------------------------------------- */
  const handleAssign = async () => {
    if (!profileId) {
      setMainErros({ ...mainError, profile: true });
      return;
    }
    if (!sensorId) {
      setMainErros({ ...mainError, sensor: true });
      return;
    }

    let reason = "";
    if (action === "edit-parameter") {
      reason = await new Promise((resolve) => {
        callActionWarningPopup(
          "edit",
          (reason) => resolve(reason),
          "parameter"
        );
      });
    }

    const SensorParameterMapping = sensorParameters.map(
      ({ parameterName, unitId, values, ...rest }) => ({
        profileId,
        sensorId,
        values: unitId === "" || unitId === "enter" ? values : unitId,
        ...rest,
        Reason: reason,
      })
    );

    const url = `/Admin/SensorParameterMapping/${
      action === "edit-parameter"
        ? "UpdateSensorParameter"
        : "MappingSensorParameter"
    }`;

    const payload =
      action === "edit-parameter"
        ? SensorParameterMapping
        : { SensorParameterMapping };

    apiCaller({
      showSuccess: true,
      apiCall: () => api.post(url, payload),
      onSuccess: () => {
        if (action === "edit-parameter") {
          navigate(-1);
        } else {
          setSensorId("");
          setSensorParameters([]);
        }
      },
    });
  };

  /** ----------------------------------------------------
   * Memoized Columns
   * ---------------------------------------------------- */
  const columns = useMemo(() => {
    const base = [
      { title: "Parameter Name", dataIndex: "parameterName" },
      { title: "Parameter Value", dataIndex: "values" },
    ];

    if (isViewMode) return base;

    return [
      ...base,
      {
        title: "Action",
        render: (_, record) => (
          <Space>
            <Button
              type="link"
              icon={<img src={editIcon} alt="edit" width={16} />}
              onClick={() => openEditModal(record)}
            />

            <Button
              type="link"
              danger
              icon={<img src={trashIcon} alt="delete" width={16} />}
              onClick={() =>
                handleDeleteParameter(record._id, record.sensorParameterId)
              }
            />
          </Space>
        ),
      },
    ];
  }, [isViewMode]);

  const onChangeSensor = (e) => {
    setSensorId(e.target.value);
    setMainErros((prev) => ({ ...prev, sensor: false }));
    setSensorParameters([]);
  };

  const onChangeProfile = (e) => {
    setProfileId(e.target.value);
    setMainErros((prev) => ({ ...prev, profile: false }));
  };

  return (
    <div className="p-3 row">
      {/* ============== HEADER ============== */}
      {action !== "edit-parameter" && (
        <>
          <div className="col-12 col-lg-9 mb-3">
            <div className="mapping-header row">
              <Button
                className="col-2 col-lg-1 custom-button mb-4"
                style={{ background: "#F2F2F2", border: "none" }}
                icon={<img src={arrowIcon} alt="back" />}
                onClick={() => navigate(-1)}
              >
                Back
              </Button>

              <div className="col-4 col-lg-5">
                <select
                  className="form-select mapping-drop-input"
                  value={profileId}
                  onChange={onChangeProfile}
                  disabled={isViewMode}
                >
                  <option value="">Select Profile</option>
                  {profiles.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.profileName}
                    </option>
                  ))}
                </select>

                <span className="ms-2 text-danger">
                  {mainError.profile ? "select profile" : ""}
                </span>
              </div>

              <div className="col-4 col-lg-5">
                <select
                  className="form-select mapping-drop-input"
                  value={sensorId}
                  onChange={onChangeSensor}
                  disabled={isViewMode}
                >
                  <option value="">Select Sensor</option>
                  {sensors.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.sensorName}
                    </option>
                  ))}
                </select>
                <span className="ms-2 text-danger">
                  {mainError.sensor ? "select sensor" : ""}
                </span>
              </div>
            </div>
          </div>

          <hr style={{ width: "97%", borderBottom: "1px solid #E4E4E4" }} />
        </>
      )}

      {/* ============== ADD PARAMETER ============== */}
      {!isViewMode && (
        <div className="parameter-section col-12">
          <h4>Sensor Parameter</h4>

          <div className="parameter-actions row">
            <div className="col-3">
              <select
                className="form-select mapping-drop-input"
                value={addParameter.sensorParameterId}
                id="parameter"
                onChange={onChangeAdd}
              >
                <option value="">Select Parameter</option>
                {parameters.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.parameterName}
                  </option>
                ))}
              </select>
            </div>

            {addParameter.sensorParameterId === "676d2aea956863f31b4bb782" ? (
              <div className="col-3">
                <select
                  className="form-select mapping-drop-input"
                  value={addParameter.unitId}
                  id="unit"
                  onChange={onChangeAdd}
                >
                  <option value="">Select Unit</option>

                  {units.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.unitName}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="col-3">
                <Input
                  placeholder="Enter Parameter Value"
                  value={enterValue}
                  maxLength={50}
                  onChange={(e) => {
                    setEnterValue(e.target.value);
                    setAddParameter((prev) => ({
                      ...prev,
                      values: e.target.value,
                    }));
                  }}
                />
              </div>
            )}

            <div className="col-3 text-end">
              <Button type="primary" onClick={handleAddParameter}>
                + Add Parameter
              </Button>

              <Button
                type="primary"
                className="ms-4"
                onClick={handleAssign}
                disabled={!sensorParameters.length}
              >
                ✓ Assign
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============== TABLE ============== */}
      <Table
        className="custom-role-table mt-3"
        columns={columns}
        dataSource={sensorParameters.filter((s) => s.isActive)}
        pagination={false}
        rowKey={(row) => row._id || row.sensorParameterId}
        size="small"
        bordered
      />

      {/* ============== EDIT MODAL ============== */}
      <Modal
        title="Edit Parameter Value"
        open={isEditModalOpen}
        onOk={saveEditValue}
        onCancel={() => setIsEditModalOpen(false)}
      >
        <div className="row">
          {showEnter ? (
            <div className="col-6">
              <Input
                placeholder="Enter Parameter Value"
                id="value"
                value={editParameter.value}
                onChange={onChangeEdit}
                maxLength={50}
              />
            </div>
          ) : (
            <div className="col-6">
              <select
                className="form-select mapping-drop-input"
                value={editParameter.unitId}
                id="unit"
                onChange={onChangeEdit}
              >
                <option value="">Select Unit</option>
                <option value="enter">Enter value</option>
                {units.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.unitName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ParameterMappingAction;
