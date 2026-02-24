import { useRef } from "react";
import {
  callActionWarningPopup,
  IntactionActionBtns,
} from "../../../components/ActionsBtns";
import { ErrorMessage, Form, Formik } from "formik";
import { apiCaller } from "../../../api/apihelper";
import { useStore } from "../../../Context/masterapis/MasterApisContext";
import api from "../../../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

// Validation schema
const validationSchema = Yup.object({
  selectProfile: Yup.string().trim().required("Profile is required"),
  selectSensor: Yup.string().trim().required("Sensor is required"),
});

const ManageDerivedParameterMapping = () => {
  const { store } = useStore();
  const { profiles, sensors } = store;

  const { action } = useParams();

  const reasonRef = useRef("");
  const navigate = useNavigate();

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();

    formData.append("ProfileId", values.selectProfile);
    formData.append("SensorId", values.selectSensor);

    const url = `/Admin/DerivedParameterMapping/CreateDerivedParameterMapping`;

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
        Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
      );
      return;
    }

    if (action === "add-derived-parameter-mapping") {
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
      initialValues={{
        selectProfile: "",
        selectSensor: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        validateForm,
        submitForm,
        resetForm,
        handleChange,
        setTouched,
      }) => (
        <Form>
          <div className='row'>
            <div className='my-3 col-md-4 add-user-input_container'>
              <label style={{ color: "#262626" }}>Select Profile</label>
              <select
                className='form-control form-select me-3'
                name='selectProfile'
                value={values.selectProfile}
                onChange={handleChange}
              >
                <option value=''>Select Profile</option>
                {profiles?.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.profileName}
                  </option>
                ))}
              </select>

              <ErrorMessage
                name='selectProfile'
                component='span'
                className='text-danger mt-2'
              />
            </div>

            <div className='my-3 col-md-4 add-user-input_container'>
              <label style={{ color: "#262626" }}>Select Sensor</label>
              <select
                className='form-control form-select me-3'
                name='selectSensor'
                value={values.selectSensor}
                onChange={handleChange}
              >
                <option value=''>Select Sensor</option>
                {sensors?.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.sensorName}
                  </option>
                ))}
              </select>

              <ErrorMessage
                name='selectSensor'
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

export default ManageDerivedParameterMapping;
