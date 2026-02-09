import React, { useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  callActionWarningPopup,
  IntactionActionBtns,
} from "../../../components/ActionsBtns";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import api from "../../../api/axiosConfig.js";
import { apiCaller } from "../../../api/apihelper.js";

// Validation schema
const validationSchema = Yup.object({
  clientCode: Yup.string().trim().required("Client Code is required"),
  clientName: Yup.string().trim().required("Client Name is required"),
  emailId: Yup.string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),
  mobileNo: Yup.string()
    .trim()
    .matches(/^[5-9][0-9]{9}$/, "Invalid mobile number")
    .required("Mobile number is required"),
  address: Yup.string().trim().required("Address is required"),
});

// Initial form values
const initialValues = {
  clientName: "",
  clientCode: "",
  emailId: "",
  mobileNo: "",
  address: "",
};

const ClientConfigActions = () => {
  const reasonRef = useRef("");
  const { action } = useParams();
  const location = useLocation();
  const clientData = location?.state?.record ?? initialValues;

  const Navigate = useNavigate();

  const handleSubmit = async (values, { resetForm }) => {
    const reason = reasonRef?.current || "";

    const formData = new FormData();

    formData.append("ClientName", values?.clientName);
    formData.append("ClientCode", values?.clientCode ?? "");
    formData.append("EmailId", values?.emailId ?? "");
    formData.append("MobileNo", values?.mobileNo ?? "");
    formData.append("Address", values?.address ?? "");
    formData.append("Reason", reason);

    if (action === "edit-client") formData.append("_id", clientData._id);

    const url = `/Admin/Client/${
      action === "add-client" ? "CreateClient" : "UpdateClient"
    }`;

    // --- API call ---
    apiCaller({
      showSuccess: true,
      apiCall: () => api.post(url, formData),
      onSuccess: (result) => {
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
        Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
      );
      return;
    }

    if (action === "add-client") {
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
        name={name}
        id={name}
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
      initialValues={clientData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, validateForm, submitForm, resetForm, setTouched }) => (
        <Form>
          <div className="row">
            {/* Client Name */}

            <FormInput
              label="Client Name"
              name="clientName"
              readOnly={isViewMode}
              type="text"
              maxLength={20}
              placeholder="Enter Client Name"
            />
            {/* Client Code */}
            <FormInput
              label="Client Code"
              name="clientCode"
              disabled={isViewMode}
              type="text"
              maxLength={25}
              placeholder="Enter Client Code"
            />
            {/* Email */}
            <FormInput
              label="Email Address"
              name="emailId"
              type="email"
              disabled={isViewMode}
              maxLength={50}
              placeholder="Enter Email"
            />

            {/* Mobile */}
            <FormInput
              label="Mobile Number"
              name="mobileNo"
              readOnly={isViewMode}
              type="text"
              maxLength={10}
              placeholder="Enter Mobile Number"
            />

            {/* Address */}
            <FormInput
              label="Address"
              name="address"
              type="text"
              readOnly={isViewMode}
              maxLength={150}
              placeholder="Enter Address"
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

export default ClientConfigActions;
