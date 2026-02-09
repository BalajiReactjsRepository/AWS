import React, { useRef } from "react";
import {
  callActionWarningPopup,
  IntactionActionBtns,
} from "../../../components/ActionsBtns";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { apiCaller } from "../../../api/apihelper";
import api from "../../../api/axiosConfig";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

// Validation schema
const validationSchema = Yup.object({
  unitName: Yup.string().trim().required("Unit Name is required"),
  unitSymbol: Yup.string().trim().required("Unit Symbol is required"),
  unitIcon: Yup.string().trim().required("Unit Icon is required"),
  // unitCategory: Yup.string().trim().required("Unit Category is required"),
  // unitDescription: Yup.string().trim().required("Unit Description is required"),
});

const UnitControllerAction = () => {
  // Initial form values
  const initialValues = {
    unitName: "",
    unitSymbol: "",
    unitIcon: "",
    unitCategory: "",
    unitDescription: "",
  };

  const location = useLocation();
  const { action } = useParams();
  const unitData = location?.state?.record ?? initialValues;

  const reasonRef = useRef("");
  const navigate = useNavigate();

  const handleSubmit = async (values, { resetForm }) => {
    const reason = reasonRef?.current || "";

    const formData = new FormData();

    formData.append("UnitName", values?.unitName);
    formData.append("UnitSymbol", values?.unitSymbol ?? "");
    formData.append("UnitIcon", values?.unitIcon);
    formData.append("UnitCategory", values?.unitCategory ?? "");
    formData.append("UnitDescription", values?.unitDescription);

    formData.append("Reason", reason);

    if (action === "edit-unit") formData.append("_id", unitData._id);

    const url = `/Admin/Unit/${
      action === "add-unit" ? "CreateUnit" : "UpdateUnit"
    }`;

    //API CALLER

    apiCaller({
      showSuccess: true,
      apiCall: () => api.post(url, formData),
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

    if (action === "add-unit") {
      submitForm();
    } else {
      callActionWarningPopup(action, async (reason) => {
        reasonRef.current = reason;
        await submitForm();
      });
    }
  };

  return (
    <Formik
      initialValues={unitData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, validateForm, submitForm, setTouched, resetForm }) => (
        <Form>
          <div className="row">
            <div className="my-3 col-md-4 add-user-input_container">
              <label style={{ color: "#262626" }}>Unit Name</label>
              <Field
                name="unitName"
                className="form-control"
                readOnly={action === "view-unit"}
              />

              <ErrorMessage
                name="unitName"
                component="span"
                className="text-danger mt-2"
              />
            </div>

            <div className="my-3 col-md-4 add-user-input_container">
              <label style={{ color: "#262626" }}>Unit Symbol</label>
              <Field
                name="unitSymbol"
                className="form-control"
                readOnly={action === "view-unit"}
              />

              <ErrorMessage
                name="unitSymbol"
                component="span"
                className="text-danger mt-2"
              />
            </div>

            <div className="my-3 col-md-4 add-user-input_container">
              <label style={{ color: "#262626" }}>Unit Icon</label>
              <Field
                name="unitIcon"
                className="form-control"
                readOnly={action === "view-unit"}
              />

              <ErrorMessage
                name="unitIcon"
                component="span"
                className="text-danger mt-2"
              />
            </div>

            <div className="my-3 col-md-4 add-user-input_container">
              <label style={{ color: "#262626" }}>Unit Category</label>
              <Field
                name="unitCategory"
                className="form-control"
                readOnly={action === "view-unit"}
              />

              <ErrorMessage
                name="unitCategory"
                component="span"
                className="text-danger mt-2"
              />
            </div>

            <div className="my-3 col-md-5 add-user-input_container">
              <label style={{ color: "#262626" }}>Unit Description</label>

              <Field
                name="unitDescription"
                className="form-control"
                readOnly={action === "view-unit"}
              />
              <ErrorMessage
                name="unitDescription"
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

export default UnitControllerAction;
