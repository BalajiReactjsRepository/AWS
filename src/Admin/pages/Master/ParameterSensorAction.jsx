import React, { useRef } from "react";
import {
  callActionWarningPopup,
  IntactionActionBtns,
} from "../../../components/ActionsBtns";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { apiCaller } from "../../../api/apihelper";
import api from "../../../api/axiosConfig";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// Validation schema
const validationSchema = Yup.object({
  parameterName: Yup.string().trim().required("Parameter Name is required"),
});

const ParameterSensorAction = () => {
  const location = useLocation();
  const { action } = useParams();
  const { record } = location?.state || {};

  const reasonRef = useRef("");
  const Navigate = useNavigate();

  const initialValues = {
    parameterName: record?.parameterName || "",
    description: record?.description || "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    const reason = reasonRef?.current || "";

    const formData = new FormData();

    formData.append("ParameterName", values?.parameterName);
    formData.append("Description", values?.description ?? "");
    formData.append("Reason", reason);

    if (action === "edit-parameter sensor") formData.append("_id", record._id);

    const url = `/Admin/ParameterInSensor/${
      action === "add-parameter"
        ? "CreateParameterInSensor"
        : "UpdateParameterInSensor"
    }`;

    //API CALLER

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
      // Mark all fields as touched so errors appear
      setTouched({ parameterName: true });
      return;
    }
    if (action === "add-parameter") {
      submitForm();
    } else {
      callActionWarningPopup(
        action,
        async (reason) => {
          reasonRef.current = reason;
          await submitForm();
        },
        "parameter",
      );
    }
  };

  const isViewMode = action === "view-parameter sensor";

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, validateForm, submitForm, setTouched, resetForm }) => (
        <Form>
          <div className='row'>
            <div className='m-3 col-md-5 add-user-input_container'>
              <label style={{ color: "#262626" }}>Parameter Name</label>
              <Field
                name='parameterName'
                className='form-control'
                readOnly={isViewMode}
              />

              <ErrorMessage
                name='parameterName'
                component='span'
                className='text-danger mt-2'
              />
            </div>
            <div className='m-3 col-md-5 add-user-input_container'>
              <label style={{ color: "#262626" }}>Description</label>

              <Field
                name='description'
                className='form-control'
                readOnly={isViewMode}
              />
              <ErrorMessage
                name='description'
                component='span'
                className='text-danger mt-2'
              />
            </div>
          </div>

          <div className='m-5 text-center'>
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

export default ParameterSensorAction;
