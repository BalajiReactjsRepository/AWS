import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  callActionWarningPopup,
  IntactionActionBtns,
} from "../../../components/ActionsBtns";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ErrorHandler from "../../../utils/errorhandler";

import SensorSelectComponent from "../../../components/ProfileFormComps/SensorSelectComponent";
import SelectedSensors from "../../../components/ProfileFormComps/SelectedSensors";
import api from "../../../api/axiosConfig";
import { apiCaller } from "../../../api/apihelper";

// Form validation schema
const validationSchema = Yup.object({
  profileName: Yup.string().trim().required("Profile Name is required"),
  aliasProfileName: Yup.string()
    .trim()
    .required("Profile Alias Name is required"),
  delimiter: Yup.string().trim().required("Delimiter Type is required"),
  dateFormat: Yup.string().trim().required("DateFormat is required"),
  validationType: Yup.string().trim().required("ValidationType is required"),
  centerLat: Yup.string()
    .trim()
    .notRequired()
    .test(
      "is-valid-lat",
      "Latitude must be a valid number",
      (value) => !value || /^[-+]?[0-9]*\.?[0-9]+$/.test(value)
    ),

  centerLong: Yup.string()
    .trim()
    .notRequired()
    .test(
      "is-valid-long",
      "Longitude must be a valid number",
      (value) => !value || /^[-+]?[0-9]*\.?[0-9]+$/.test(value)
    ),
});

const initialValues = {
  profileName: "",
  aliasProfileName: "",
  delimiter: "",
  dateFormat: "",
  validationType: "",
  centerLat: "",
  centerLong: "",
  profileColor: "",
  profileIcon: "",
};

const ProfileForm = () => {
  const reasonRef = useRef("");
  const { action } = useParams();
  const location = useLocation();

  const navigate = useNavigate();

  const record = location?.state?.record;

  const sensorData = record ?? initialValues;
  const recordSensors = record?.sensors ?? [];

  const [selectedSensors, setSelectedSensors] = useState(recordSensors);

  const [sensors, setSensors] = useState([]);
  const [dateFormats, setDateFormats] = useState([]);
  const [validations, setValidations] = useState([]);

  const isViewMode = action.startsWith("view");

  // Fetch dropdown values
  useEffect(() => {
    const getDropDownValues = async () => {
      try {
        const dateUrl = `/Admin/Profile/GetDateformats`;
        const validationUrl = `/Admin/Profile/GetValidationType`;
        const sensorUrl = `/Admin/Sensor/GetSensorDetails`;

        const [dateFormatsRes, validationsRes, sensorRes] = await Promise.all([
          api.get(dateUrl),
          api.get(validationUrl),
          api.get(sensorUrl),
        ]);

        setSensors(sensorRes?.data?.result ?? []);
        setDateFormats(dateFormatsRes?.data?.result ?? []);
        setValidations(validationsRes?.data?.result ?? []);
      } catch (error) {
        ErrorHandler.onError(error);
      }
    };

    getDropDownValues();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    const reason = reasonRef.current;

    const payload = {
      profile: {
        ProfileName: values?.profileName,
        Delimiter: values?.delimiter,
        DateFormat: values?.dateFormat,
        ValidationType: values?.validationType,
        AliasProfileName: values?.aliasProfileName,
        CenterLat: values?.centerLat,
        CenterLong: values?.centerLong,
        ProfileColor: values?.profileColor,
        ProfileIcon: values?.profileIcon,
        Reason: reason,
      },

      profileHasSensorDetails: selectedSensors.map((item, index) => ({
        _id: item._id,
        sensorId: item.sensorId,
        position: `${index}`,
        Reason: reason,
      })),
    };

    if (action === "edit-profile") {
      payload.profile["_id"] = sensorData?._id ?? "";
    }

    const url = `/Admin/Profile/${
      action === "add-profile" ? "CreateProfile" : "UpdateProfile"
    }`;

    apiCaller({
      apiCall: () => api.post(url, payload),
      onSuccess: () => {
        resetForm();
        navigate(-1);
      },
      showSuccess: true,
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

    if (action === "add-profile") {
      submitForm();
    } else {
      callActionWarningPopup(action, async (reason) => {
        reasonRef.current = reason;
        await submitForm();
      });
    }
  };

  // Form reusable inputs
  const FormInput = ({ label, name, type, readOnly, ...rest }) => (
    <div className="add-user-input_container col-12 col-md-3 mb-2">
      <label htmlFor={name}>{label}</label>
      <Field
        id={name}
        name={name}
        type={type}
        className="form-control"
        readOnly={readOnly}
        {...rest}
      />
      <ErrorMessage name={name} component="span" className="text-danger mt-1" />
    </div>
  );

  const FormSelect = ({ label, name, disabled, children }) => (
    <div className="add-user-input_container col-12 col-md-3 mb-2">
      <label htmlFor={name}>{label}</label>
      <Field
        as="select"
        id={name}
        name={name}
        disabled={disabled}
        className="form-select"
      >
        {children}
      </Field>
      <ErrorMessage name={name} component="span" className="text-danger mt-1" />
    </div>
  );

  return (
    <Formik
      initialValues={sensorData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ validateForm, submitForm, resetForm, setTouched }) => (
        <Form>
          <div className="row">
            <FormInput
              label="Profile Name"
              name="profileName"
              readOnly={isViewMode}
              type="text"
              maxLength={50}
              placeholder="Enter Profile Name"
            />
            <FormInput
              label="Alias Profile Name"
              name="aliasProfileName"
              type="text"
              disabled={isViewMode}
              maxLength={25}
              placeholder="Enter Alias Profile Name"
            />
            <FormInput
              label="Delimiter"
              name="delimiter"
              type="text"
              disabled={isViewMode}
              maxLength={15}
              placeholder="Enter Delimiter"
            />
            <FormInput
              label="CenterLat"
              name="centerLat"
              type="text"
              disabled={isViewMode}
              maxLength={15}
              placeholder="Enter CenterLat"
            />
            <FormInput
              label="CenterLong"
              name="centerLong"
              type="text"
              disabled={isViewMode}
              maxLength={15}
              placeholder="Enter CenterLong"
            />
            <FormInput
              label="Profile Color"
              name="profileColor"
              type="color"
              disabled={isViewMode}
              maxLength={15}
              placeholder="Enter Profile Color"
            />
            <FormInput
              label="Profile Icon"
              name="profileIcon"
              type="text"
              disabled={isViewMode}
              maxLength={15}
              placeholder="Enter Profile Icon"
            />
            <FormSelect
              label="Date Format"
              name="dateFormat"
              disabled={isViewMode}
            >
              <option value="">Select Date Format</option>
              {dateFormats.map((df) => (
                <option value={df} key={df}>
                  {df}
                </option>
              ))}
            </FormSelect>
            <FormSelect
              label="Validation Type"
              name="validationType"
              disabled={isViewMode}
            >
              <option value="">Select Validation Type</option>
              {validations.map((v) => (
                <option value={v} key={v}>
                  {v}
                </option>
              ))}
            </FormSelect>
          </div>

          <hr />
          <div className="row">
            <h5 style={{ fontWeight: "bold" }}>Sensor Details</h5>
            {!isViewMode && (
              <div className="col-12 col-md-6 ">
                <SensorSelectComponent
                  selectedSensors={selectedSensors}
                  setSelectedSensors={setSelectedSensors}
                  allSensors={sensors}
                />
              </div>
            )}

            <div className="col-12 col-md-6 ">
              <SelectedSensors
                selectedSensors={selectedSensors}
                setSelectedSensors={setSelectedSensors}
              />
            </div>
          </div>

          <div className="m-3 text-center">
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

export default ProfileForm;
