import React, { useCallback, useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  callActionWarningPopup,
  IntactionActionBtns,
} from "../../../components/ActionsBtns";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SensorConfiguration from "../../../components/SensorConfiguration";
// import { UploadOutlined } from "@ant-design/icons";

import api from "../../../api/axiosConfig";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { apiCaller } from "../../../api/apihelper";
import { useStore } from "../../../Context/masterapis/MasterApisContext";

// 🎯 Validation schema
const validationSchema = Yup.object({
  stationId: Yup.string().trim().required("Station ID is required"),
  stationName: Yup.string().trim().required("Station Name is required"),
  latitude: Yup.string()
    .trim()
    .required("Latitude is required")
    .matches(/^[-+]?[0-9]*\.?[0-9]+$/, "Latitude must be a valid number"),
  longitude: Yup.string()
    .trim()
    .required("Longitude is required")
    .matches(/^[-+]?[0-9]*\.?[0-9]+$/, "Longitude must be a valid number"),
  city: Yup.string().trim().required("City is required"),
  district: Yup.string().trim().required("District is required"),
  state: Yup.string().trim().required("State is required"),
  // tahesil: Yup.string().trim().required("Tahesil is required"),
  block: Yup.string().trim().optional("Block is required"),
  village: Yup.string().trim().optional("Village is required"),
  address: Yup.string().trim().required("Address is required"),
  // bank: Yup.string().trim().required("Bank is required"),
  // busStand: Yup.string().trim().required("Bus Stand is required"),
  // railwayStation: Yup.string().trim().required("Railway Station is required"),
  // airport: Yup.string().trim().required("Airport is required"),
  otherInformation: Yup.string().trim().optional(),
  profileId: Yup.string().trim().required("Profile selection is required"),
  // file: Yup.mixed().required("Image file is required"),
});

//  sensors: Yup.array().of(
//     Yup.object().shape({
//       sensorName: Yup.string().required(),
//       gain: Yup.string().nullable(),
//       offset: Yup.string().nullable(),
//       serialNo: Yup.string().nullable(),
//       showGrid: Yup.boolean(),
//       showGraph: Yup.boolean(),
//     })
//   ),

// 🧾 Initial values
const initialValues = {
  stationId: "",
  stationName: "",
  latitude: "",
  longitude: "",
  city: "",
  district: "",
  state: "",
  block: "",
  village: "",
  address: "",
  otherInformation: "",
  profileId: "",
  file: null,
  installationDate: "",
  image: "",
};

// remove these

// Bank
// Railway Station
// Tahesil
// Bus Stand
// Airport

const StationForm = () => {
  const reasonRef = useRef("");
  const { action } = useParams();
  const location = useLocation();
  const [sensors, setSensors] = useState([]);

  const navigate = useNavigate();

  const record = location?.state?.record;

  const stationData = record ?? initialValues;

  const stationId = record?._id ?? "";

  const { store } = useStore();

  const profileOptions = store?.profiles ?? [];

  const isViewMode = action.startsWith("view");

  const getsensordata = useCallback(() => {
    if (stationId) {
      const url = `/Admin/Station/GetStationSensorDetails`;

      const formdata = new FormData();

      formdata.append("stationId", stationId);
      apiCaller({
        apiCall: () => api.post(url, formdata),
        onSuccess: (result) => {
          setSensors(result ?? []);
        },
      });
    }
  }, [stationId]);

  useEffect(() => {
    getsensordata();
  }, [getsensordata]);

  const handleSubmit = async (values, { resetForm }) => {
    const reason = reasonRef?.current || "";

    const station = {
      StationId: values.stationId,
      StationName: values.stationName,
      Latitude: values.latitude,
      Longitude: values.longitude,
      District: values.district,
      State: values.state,
      City: values.city,
      Block: values.block,
      Village: values.village,
      Address: values.address,
      ProfileId: values.profileId,
      InstallationDate: values.installationDate,
      OtherInfo: values.otherInformation,
      Reason: reason,
    };

    // Image: values.image, //values.image.substring(values.image.lastIndexOf("/") + 1)

    const stationSensorDetails = sensors.map((s) => ({
      ...(s._id && { _id: s._id }), // _id: s._id,
      SensorId: s.sensorId,
      Gain: s.gain === "No" ? 1 : 0,
      Offset: s.offset === "No" ? 1 : 0,
      SerialNo: s.serialNo,
      ShowInGraph: s.showInGraph,
      ShowInGrid: s.showInGrid,
      ShowInMapTooltip: s.showInMapTooltip,
      ShowInWidget: s.showInWidget,
      Reason: reason,
    }));

    const formData = new FormData();

    if (action === "edit-station") {
      station["_id"] = record._id;
    }

    formData.append("station", JSON.stringify(station));
    formData.append(
      "stationSensorDetails",
      JSON.stringify(stationSensorDetails)
    );
    formData.append("image", values.file);
    formData.append("Reason", reason);

    const url = `/Admin/Station/${
      action === "add-station" ? "CreateStation" : "UpdateStation"
    }`;

    apiCaller({
      apiCall: () => api.post(url, formData),
      showSuccess: true,
      onSuccess: () => {
        resetForm();
        navigate(-1);
      },
    });
  };

  const handleExternalSubmit = async (validateForm, submitForm, setTouched) => {
    const errors = await validateForm();
    if (Object.keys(errors).length > 0) {
      setTouched(
        Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
      return;
    }
    if (action === "add-station") {
      submitForm();
    } else {
      callActionWarningPopup(action, async (reason) => {
        reasonRef.current = reason;
        await submitForm();
      });
    }
  };

  const FormInput = ({
    label,
    name,
    type = "text",
    readOnly,
    disabled,
    maxLength,
    placeholder,
  }) => (
    <div className="add-user-input_container col-12 col-md-4 mb-2">
      <label htmlFor={name}>{label}</label>
      <Field
        name={name}
        id={name}
        type={type}
        className="form-control"
        readOnly={readOnly}
        disabled={disabled}
        maxLength={maxLength}
        placeholder={placeholder}
        onInput={(e) => {
          if (name === "latitude" || name === "longitude") {
            e.target.value = e.target.value.replace(/[^0-9.]/g, "");
          }
        }}
      />
      <ErrorMessage name={name} component="span" className="text-danger mt-1" />
    </div>
  );

  const FormSelect = ({ label, name, disabled, options }) => (
    <div className="add-user-input_container col-12 col-md-4 mb-2">
      <label htmlFor={name}>{label}</label>
      <Field
        as="select"
        id={name}
        name={name}
        disabled={disabled}
        className="form-select"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt._id} value={opt._id}>
            {opt.profileName}
          </option>
        ))}
      </Field>
      <ErrorMessage name={name} component="span" className="text-danger mt-1" />
    </div>
  );

  const formFields = [
    { label: "Station ID", name: "stationId", maxLength: 25 },
    { label: "Station Name", name: "stationName", maxLength: 50 },
    { label: "Latitude", name: "latitude", maxLength: 15 },
    { label: "Longitude", name: "longitude", maxLength: 15 },
    { label: "City", name: "city", maxLength: 35 },
    { label: "District", name: "district", maxLength: 35 },
    { label: "State", name: "state", maxLength: 35 },
    // { label: "Tahesil", name: "tahesil", maxLength: 35 },
    { label: "Block", name: "block", maxLength: 35 },
    { label: "Village", name: "village", maxLength: 55 },
    { label: "Address", name: "address", maxLength: 150 },
    // { label: "Bank", name: "bank", maxLength: 100 },
    // { label: "Bus Stand", name: "busStand", maxLength: 100 },
    // { label: "Railway Station", name: "railwayStation", maxLength: 100 },
    // { label: "Airport", name: "airport", maxLength: 100 },
    { label: "Other Information", name: "otherInformation", maxLength: 150 },
  ];

  return (
    <Formik
      initialValues={stationData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        setFieldValue,
        validateForm,
        submitForm,
        resetForm,
        setTouched,
        values,
      }) => (
        <Form>
          <div className="row">
            {formFields.map(({ label, name, maxLength }) => (
              <FormInput
                key={name}
                label={label}
                name={name}
                readOnly={isViewMode}
                placeholder={`Enter ${label}`}
                maxLength={maxLength}
              />
            ))}
            {/* instation Date */}
            <div className="add-user-input_container col-12 col-md-4 mb-2">
              <label htmlFor={"installationDate "}>Installation Date</label>
              <Field name="installationDate">
                {({ field, form }) => (
                  <DatePicker
                    className="add-user-input_container form-control"
                    format="DD-MMM-YYYY"
                    value={
                      field.value ? dayjs(field.value, "DD-MMM-YYYY") : null
                    }
                    onChange={(date) =>
                      form.setFieldValue(
                        "installationDate",
                        date ? date.format("DD-MMM-YYYY") : ""
                      )
                    }
                  />
                )}
              </Field>
            </div>

            {/* Profile Dropdown */}
            <FormSelect
              label="Profile"
              name="profileId"
              disabled={isViewMode}
              options={profileOptions}
            />
            {/* show image file view */}
            {/* <div className="add-user-input_container col-12 col-md-4 mb-3">
              <label>Station Image</label>

            
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                disabled={isViewMode}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFieldValue("file", file);
                  }
                }}
              />

         
              <img
                src={
                  values.file
                    ? URL.createObjectURL(values.file) // new preview
                    : values.image // existing image
                }
                alt="station-image"
                style={{
                  width: "5rem",
                  height: "5rem",
                  objectFit: "cover",
                  cursor: isViewMode ? "not-allowed" : "pointer",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
                onClick={() => {
                  if (!isViewMode) document.getElementById("fileInput").click();
                }}
              />
            </div> */}

            <div className="col-12 col-md-4 mb-3">
              <label className="mb-1 ">Station Image</label>
              <div
                className="d-flex   align-items-start  rounded p-1"
                style={{ border: "1px solid #00000057" }}
              >
                {/* Image Preview */}
                <label
                  htmlFor="fileInput"
                  style={{ cursor: isViewMode ? "not-allowed" : "pointer" }}
                >
                  <img
                    src={
                      values.file
                        ? URL.createObjectURL(values.file)
                        : values.image || "https://via.placeholder.com/150"
                    }
                    alt="station"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </label>

                {/* Hidden File Input */}
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  disabled={isViewMode}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (file) {
                      setFieldValue("file", file);
                    }
                  }}
                />

                {/* Upload Button */}
                {!isViewMode && (
                  <div className="ms-3">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    >
                      Change Image
                    </button>
                    <br />
                    <span>{values?.file?.name ?? ""}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr />
          <SensorConfiguration
            isViewMode={isViewMode}
            sensors={sensors}
            setSensors={setSensors}
            resetConfiguration={getsensordata}
          />

          <div className="m-5 text-center">
            <IntactionActionBtns
              actionFunction={() =>
                handleExternalSubmit(validateForm, submitForm, setTouched)
              }
              setFunc={() => resetForm()}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default StationForm;
