import React, { useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import "../pages.css";
import {
  callActionWarningPopup,
  IntactionActionBtns,
} from "../../../components/ActionsBtns";

import api from "../../../api/axiosConfig.js";
import { apiCaller } from "../../../api/apihelper.js";

// Validation schema
const validationSchema = Yup.object({
  roleName: Yup.string().trim().required("Role Name is required"),
});

const RoleMasterAction = () => {
  const location = useLocation();
  const { action } = useParams();
  const { record } = location?.state || {};

  const reasonRef = useRef("");
  const Navigate = useNavigate();

  const initialValues = {
    roleName: record?.roleName || "",
    roleDescription: record?.roleDescription || "",
  };

  const handleSubmit = async (values, { resetForm }) => {
    const reason = reasonRef?.current || "";

    const formData = new FormData();

    formData.append("RoleName", values?.roleName);
    formData.append("RoleDescription", values?.roleDescription ?? "");
    formData.append("Reason", reason);

    if (action === "edit-role") formData.append("_id", record._id);

    const url = `/Admin/Role/${
      action === "add-role" ? "CreateRole" : "UpdateRole"
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
      setTouched({ roleName: true });
      return;
    }

    if (action === "add-role") {
      submitForm();
    } else {
      callActionWarningPopup(
        action,
        async (reason) => {
          reasonRef.current = reason;
          await submitForm();
        },
        "role"
      );
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, validateForm, submitForm, setTouched, resetForm }) => (
        <Form>
          <div className="row">
            <div className="m-3 col-md-5 add-user-input_container">
              <label style={{ color: "#262626" }}>Role Name</label>
              <Field
                name="roleName"
                className="form-control"
                readOnly={action === "view-role"}
              />

              <ErrorMessage
                name="roleName"
                component="span"
                className="text-danger mt-2"
              />
            </div>
            <div className="m-3 col-md-5 add-user-input_container">
              <label style={{ color: "#262626" }}>Role Description</label>

              <Field
                name="roleDescription"
                className="form-control"
                readOnly={action === "view-role"}
              />
              <ErrorMessage
                name="roleDescription"
                component="span"
                className="text-danger mt-2"
              />
            </div>
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

export default RoleMasterAction;
