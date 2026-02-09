import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  callActionWarningPopup,
  IntactionActionBtns,
} from "../../../components/ActionsBtns";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ErrorHandler from "../../../utils/errorhandler";
import api from "../../../api/axiosConfig";
import { apiCaller } from "../../../api/apihelper";

// Validation schema
const validationSchema = Yup.object({
  menuCode: Yup.string().trim().required("Menu Code is required"),
  menuName: Yup.string().trim().required("Menu Name is required"),
  // menuPath: Yup.string().trim().required("Menu Path is required"),
  // parentMenuId: Yup.string().trim().required("Parent Menu is required"),
  // menuSequenceOrder: Yup.string().trim().required("Seq No is required"),
  // menuIcon: Yup.string().trim().required("Menu Icon is required"),
});

// Initial form values
const initialValues = {
  menuCode: "",
  menuName: "",
  menuPath: "",
  parentMenuId: "",
  menuSequenceOrder: "",
  menuIcon: "",
};

const ManageMenuForm = () => {
  const reasonRef = useRef("");
  const { action } = useParams();
  const location = useLocation();
  const menuData = location?.state?.record ?? initialValues;

  const [parentMenus, setParentMenus] = useState([]);

  const Navigate = useNavigate();

  useEffect(() => {
    const getParentMenu = async () => {
      try {
        ErrorHandler.onLoading();

        const res = await api.get(`/Admin/Menu/GetParentMenuList`);

        ErrorHandler.onLoadingClose();
        if (res?.data?.statusCode === 200) {
          setParentMenus(res.data.result);
        } else {
          ErrorHandler.onError({ message: res?.data?.message ?? "" });
        }
      } catch (error) {
        ErrorHandler.onLoadingClose();
        ErrorHandler.onError(error);
      }
    };

    getParentMenu();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    const reason = reasonRef?.current || "";

    const formData = new FormData();

    formData.append("MenuCode", values?.menuCode);
    formData.append("MenuName", values?.menuName ?? "");
    formData.append("MenuPath", values?.menuPath);
    formData.append("MenuSequenceOrder", values?.menuSequenceOrder ?? "");
    formData.append("ParentMenuId", values?.parentMenuId);
    formData.append("MenuIcon", values?.menuIcon ?? "");
    formData.append("Reason", reason);

    if (action === "edit-menu") formData.append("_id", menuData._id);

    const url = `/Admin/Menu/${
      action === "add-menu" ? "CreateMenu" : "UpdateMenu"
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
        Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
      return;
    }

    if (action === "add-menu") {
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
      initialValues={menuData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, validateForm, submitForm, resetForm, setTouched }) => (
        <Form>
          <div className="row">
            {/* Menu Code */}
            <FormInput
              label="Menu Code"
              name="menuCode"
              readOnly={isViewMode}
              type="text"
              maxLength={30}
              placeholder="Enter Menu Code"
            />
            {/* Menu Name */}
            <FormInput
              label="Menu Name"
              name="menuName"
              type="text"
              disabled={isViewMode}
              maxLength={25}
              placeholder="Enter Menu Name"
            />
            {/* Menu Path */}
            <FormInput
              label="Menu Path"
              name="menuPath"
              readOnly={isViewMode}
              type="text"
              maxLength={25}
              placeholder="Enter Menu Path"
            />
            {/* Parent Menu */}
            {/* <FormInput
              label="Parent Menu"
              name="parentMenu"
              disabled={isViewMode}
              type="text"
              maxLength={50}
              placeholder="Enter Parent Menu"
            /> */}
            <FormSelect
              label="Parent Menu"
              name="parentMenuId"
              disabled={isViewMode}
            >
              <option value="">Select ParentMenu</option>
              {parentMenus.map((m) => (
                <option value={m.id} key={m.id}>
                  {m.parentMenuName}
                </option>
              ))}
            </FormSelect>
            {/* Seq No */}
            <FormInput
              label="Seq No"
              name={"menuSequenceOrder"}
              type="text"
              readOnly={isViewMode}
              maxLength={50}
              placeholder="Enter Seq No"
            />
            {/* Menu Icon */}
            <FormInput
              label="Menu Icon"
              name="menuIcon"
              type="text"
              readOnly={isViewMode}
              maxLength={50}
              placeholder="Enter Menu Icon"
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

export default ManageMenuForm;
