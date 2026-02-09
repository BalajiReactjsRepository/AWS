import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  callActionWarningPopup,
  IntactionActionBtns,
} from "../../../components/ActionsBtns";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import api from "../../../api/axiosConfig.js";
import { apiCaller } from "../../../api/apihelper.js";

// clientMstId: "", RoleId : ""   address: "",
const ManageUserActions = () => {
  const reasonRef = useRef("");
  const { action } = useParams();
  const location = useLocation();
  const [roles, setRoles] = useState([]);
  const [clients, setClients] = useState([]);

  const navigate = useNavigate();

  // Validation schema
  const validationSchema = Yup.object({
    roleId: Yup.string().trim().required("Role is required"),
    userCode: Yup.string().trim().required("User Code is required"),
    userName: Yup.string().trim().required("User Name is required"),
    password: Yup.string()
      .trim()
      .when("action", {
        is: "add-user",
        then: (schema) => schema.required("Password is required"),
        otherwise: (schema) => schema.notRequired(),
      }),

    firstName: Yup.string().trim().required("First Name is required"),
    lastName: Yup.string().trim().required("Last Name is required"),
    emailAddress: Yup.string()
      .trim()
      .email("Invalid email format")
      .required("Email is required"),
    mobileNumber: Yup.string()
      .trim()
      .matches(/^[5-9][0-9]{9}$/, "Invalid mobile number")
      .required("Mobile number is required"),
    clientMstId: Yup.string().trim().required("Client is required"),
    //address: Yup.string().trim().required("Address is required"),
  });

  // Initial form values
  const initialValues = {
    roleId: "",
    userCode: "",
    userName: "",
    password: "",
    firstName: "",
    middleName: "",
    lastName: "",
    emailAddress: "",
    mobileNumber: "",
    clientMstId: "",
    action: action,
  };

  // ✅ Safe destructuring fallback
  const userData = location?.state?.record ?? initialValues;

  useEffect(() => {
    const getDropdowns = async () => {
      let roles = [];
      let clients = [];

      await Promise.all([
        // ✅ Roles API
        apiCaller({
          apiCall: () => api.get(`/Admin/Role/GetActiveRoles`),
          onSuccess: (result) => {
            const rolesData = result ?? [];
            roles = rolesData.map((r) => ({
              roleId: r._id,
              roleName: r.roleName,
            }));
          },
          // Optional: show inline error instead of popup
          setErrorMessage: (msg) => {
            console.warn("Roles API Error:", msg);
          },
        }),

        // ✅ Clients API
        apiCaller({
          apiCall: () => api.get(`/Admin/Client/GetAllActiveClients`),
          onSuccess: (result) => {
            const clientsData = result ?? [];
            clients = clientsData.map((c) => ({
              clientId: c._id,
              clientName: c.clientName,
            }));
          },
          setErrorMessage: (msg) => {
            console.warn("Clients API Error:", msg);
          },
        }),
      ]);

      // ✅ One single safe state update
      setRoles(roles);
      setClients(clients);
    };

    getDropdowns();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    const reason = reasonRef.current;

    let payload = {};

    // Add fromdata only when editing
    if (action === "edit-user") {
      const formData = new FormData();

      formData.append("_id", userData._id);
      formData.append("RoleId", values?.roleId);
      formData.append("UserCode", values?.userCode ?? "");
      formData.append("UserName", values?.userName ?? "");
      formData.append("FirstName", values?.firstName ?? "");
      formData.append("MiddleName", values?.middleName ?? "");
      formData.append("LastName", values?.lastName ?? "");
      formData.append("EmailAddress", values?.emailAddress ?? "");
      formData.append("ClientMstId", values?.clientMstId ?? "");
      formData.append("MobileNumber", values?.mobileNumber ?? "");
      formData.append("Reason", reason);

      payload = formData;
    } else {
      const body = {
        RoleId: values?.roleId ?? null,
        UserCode: values?.userCode ?? "",
        UserName: values?.userName ?? "",
        Password: values?.password ?? "",
        FirstName: values?.firstName ?? "",
        MiddleName: values?.middleName ?? "",
        LastName: values?.lastName ?? "",
        EmailAddress: values?.emailAddress ?? "",
        MobileNumber: values?.mobileNumber ?? "",
        ClientMstId: values?.clientMstId ?? null,
        Reason: reason,
      };

      payload = body;
    }

    const url = `/Admin/User/${
      action === "edit-user" ? "UpdateUser" : "CreateUser"
    }`;

    // --- API call ---
    apiCaller({
      showSuccess: true,
      apiCall: () => api.post(url, payload),
      onSuccess: (result) => {
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

    if (action === "add-user") {
      submitForm();
    } else {
      callActionWarningPopup(action, async (reason) => {
        reasonRef.current = reason;
        await submitForm();
      });
    }
  };

  const isViewMode = action.startsWith("view");

  // ✅ Input component with numeric restriction for mobileNumber
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
          if (name === "mobileNumber") {
            e.target.value = e.target.value.replace(/\D/g, "");
          }
        }}
        {...rest}
      />
      <ErrorMessage name={name} component="span" className="text-danger mt-1" />
    </div>
  );

  const FormSelect = ({ label, name, disabled, children }) => (
    <div className="add-user-input_container col-12 col-md-4 mb-2">
      <label htmlFor={name}>{label}</label>
      <Field
        id={name}
        as="select"
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
      initialValues={userData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ validateForm, submitForm, resetForm, setTouched }) => (
        <Form>
          <div className="row">
            <FormInput
              label="User Code"
              name="userCode"
              readOnly={isViewMode}
              type="text"
              maxLength={20}
              placeholder="Enter User Code"
            />
            <FormInput
              label="User Name"
              name="userName"
              readOnly={isViewMode}
              type="text"
              maxLength={20}
              placeholder="Enter User Name"
            />
            {action === "add-user" && (
              <FormInput
                label="Password"
                name="password"
                readOnly={isViewMode}
                type="text"
                maxLength={20}
                placeholder="Enter password"
              />
            )}

            <FormSelect label="Role" name="roleId" disabled={isViewMode}>
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option value={r.roleId} key={r.roleId}>
                  {r.roleName}
                </option>
              ))}
            </FormSelect>

            <FormInput
              label="First Name"
              name="firstName"
              disabled={isViewMode}
              type="text"
              maxLength={25}
              placeholder="Enter First Name"
            />

            <FormInput
              label="Middle Name"
              name="middleName"
              disabled={isViewMode}
              type="text"
              maxLength={25}
              placeholder="Enter Middle Name"
            />

            <FormInput
              label="Last Name"
              name="lastName"
              disabled={isViewMode}
              type="text"
              maxLength={25}
              placeholder="Enter Last Name"
            />

            <FormInput
              label="Email Address"
              name="emailAddress"
              type="email"
              disabled={isViewMode}
              maxLength={50}
              placeholder="Enter Email"
            />

            <FormInput
              label="Mobile Number"
              name="mobileNumber"
              readOnly={isViewMode}
              type="text"
              maxLength={10}
              placeholder="Enter Mobile Number"
            />

            {/* <FormInput
              label="Address"
              name="address"
              type="text"
              readOnly={isViewMode}
              maxLength={150}
              placeholder="Enter Address"
            />*/}

            <FormSelect label="Client" name="clientMstId" disabled={isViewMode}>
              <option value="">Select Client</option>
              {clients.map((c) => (
                <option key={c.clientId} value={c.clientId}>
                  {c.clientName}
                </option>
              ))}
            </FormSelect>
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

export default ManageUserActions;
