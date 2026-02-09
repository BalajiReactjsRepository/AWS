import React, { useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  callActionWarningPopup,
  IntactionActionBtns,
} from "../../../components/ActionsBtns";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import api from "../../../api/axiosConfig";
import { apiCaller } from "../../../api/apihelper";

// Validation schema
const validationSchema = Yup.object({
  sensorName: Yup.string().trim().required("Sensor Name is required"),
  sensorType: Yup.string().trim().required("Sensor Type is required"),
  modelNo: Yup.string().trim().required("ModelNo is required"),
  make: Yup.string().trim().required("Sensor Make is required"),
  aliasName: Yup.string().trim().required("Alias Name is required"),
  shortName: Yup.string().trim().required("Short Name is required"),
});

// Initial form values
const initialValues = {
  sensorName: "",
  sensorType: "",
  modelNo: "",
  make: "",
  aliasName: "",
  shortName: "",
};

// aliasName
// isActive
// make
// modelNo
// sensorName
// sensorType
// shortName

const ManageSensorAction = () => {
  const reasonRef = useRef("");
  const { action } = useParams();
  const location = useLocation();
  const sensorData = location?.state?.record ?? initialValues;
  const Navigate = useNavigate();

  const handleSubmit = async (values, { resetForm }) => {
    const reason = reasonRef?.current || "";

    const formData = new FormData();

    formData.append("SensorName", values?.sensorName ?? "");
    formData.append("SensorType", values?.sensorType ?? "");
    formData.append("AliasName", values?.aliasName ?? "");
    formData.append("ShortName", values?.shortName ?? "");
    formData.append("ModelNo", values?.modelNo ?? "");
    formData.append("Make", values?.make ?? "");

    formData.append("Reason", reason);

    if (action === "edit-sensor") {
      formData.append("_id", sensorData._id);
    }

    const url = `/Admin/Sensor/${
      action === "add-sensor" ? "CreateSensor" : "UpdateSensor"
    }`;

    apiCaller({
      showSuccess: true,
      apiCall: () => api.post(url, formData),
      onSuccess: () => {
        resetForm();
        Navigate(-1);
      },
    });
  };

  const handleExternalSubmit = async (validateForm, submitForm, setTouched) => {
    const errors = await validateForm();

    if (Object.keys(errors).length > 0) {
      // ✅ Mark all fields as touched so errors show under fields
      setTouched(
        Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
      return;
    }
    if (action === "add-sensor") {
      submitForm();
    } else {
      callActionWarningPopup(action, async (reason) => {
        reasonRef.current = reason;
        await submitForm();
      });
    }
  };

  const isViewMode = action.startsWith("view");

  // Reusable input component
  const FormInput = ({ label, name, type, readOnly, ...rest }) => (
    <div className="add-user-input_container col-12 col-md-4 mb-2">
      <label htmlFor={name}>{label}</label>
      <Field
        id={name}
        name={name}
        type={type}
        className="form-control"
        readOnly={readOnly}
        onInput={(e) => {
          if (name === "mobileNo") {
            e.target.value = e.target.value.replace(/\D/g, ""); // Remove non-digits
          }
        }}
        {...rest}
      />
      <ErrorMessage name={name} component="span" className="text-danger mt-1" />
    </div>
  );

  return (
    <Formik
      initialValues={sensorData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, validateForm, submitForm, resetForm, setTouched }) => (
        <Form>
          <div className="row">
            {/* sensor Name */}
            <FormInput
              label="Sensor Name"
              name="sensorName"
              readOnly={isViewMode}
              type="text"
              maxLength={30}
              placeholder="Enter Sensor Name"
            />
            {/* AliasName */}
            <FormInput
              label="Alias Name"
              name="aliasName"
              type="text"
              disabled={isViewMode}
              maxLength={25}
              placeholder="Enter Alias Name"
            />
            {/* ShortName */}
            <FormInput
              label="Short Name"
              name="shortName"
              readOnly={isViewMode}
              type="text"
              maxLength={25}
              placeholder="Enter Short Name"
            />
            {/* Sensor Type */}
            <FormInput
              label="Sensor Type"
              name="sensorType"
              disabled={isViewMode}
              type="text"
              maxLength={50}
              placeholder="Enter Sensor Type"
            />
            {/* Sensor Make */}

            <FormInput
              label="Sensor Make"
              name="make"
              type="text"
              readOnly={isViewMode}
              maxLength={50}
              placeholder="Enter Sensor Make"
            />
            {/* ModelNo */}
            <FormInput
              label="Sensor Model"
              name="modelNo"
              type="text"
              readOnly={isViewMode}
              maxLength={50}
              placeholder="Enter Sensor Model"
            />
          </div>

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

export default ManageSensorAction;
