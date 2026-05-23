import { useEffect, useRef, useState } from "react";
import {
  callActionWarningPopup,
  IntactionActionBtns,
} from "../../../components/ActionsBtns";
import { ErrorMessage, Form, Formik, Field } from "formik";
import { apiCaller } from "../../../api/apihelper";
import { useStore } from "../../../Context/masterapis/MasterApisContext";
import api from "../../../api/axiosConfig";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

// Validation schema
// const validationSchema = Yup.object({
  // selectProfile: Yup.string().trim().required("Profile is required"),
  // selectProfile:
  //   action === "add-hydraulic-details"
  //     ? Yup.string().trim().required("Profile is required")
  //     : Yup.string(),
  // selectRBL: Yup.number()
  //   .required("RBL is required")
  //   .typeError("Must be a number"),
  // selectHFL: Yup.number()
  //   .required("HFL is required")
  //   .typeError("Must be a number"),
  // selectMDDL: Yup.number()
  //   .required("MDDL is required")
  //   .typeError("Must be a number"),
  // selectFRL: Yup.number()
  //   .required("FRL is required")
  //   .typeError("Must be a number"),
  // selectLiveCapacity: Yup.number()
  //   .required("Live Capacity is required")
  //   .typeError("Must be a number"),
// });

const AddHydraulicParameter = () => {
  const location = useLocation();
  const [profileId, setProfileId] = useState("");
  const [data, setData] = useState([]);
  const { store } = useStore();
  const { profiles } = store;
  const { record } = location?.state || {};

  const { action } = useParams();

  const validationSchema = Yup.object({
    // selectProfile: Yup.string().trim().required("Profile is required"),
    selectProfile:
      action === "add-hydraulic-details"
        ? Yup.string().trim().required("Profile is required")
        : Yup.string(),
  });

  const reasonRef = useRef("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!profileId) return;

    const formData = new FormData();
    formData.append("profileId", profileId);
    apiCaller({
      // setLoading,
      apiCall: () =>
        api.post(`/Admin/ShowStationAccess/GetStationList`, formData),
      onSuccess: (result) => setData(result ?? []),
    });
  }, [profileId]);

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    formData.append("StationId", values.selectStation || record.stationID);
    formData.append("RBL", values.selectRBL);
    formData.append("HFL", values.selectHFL);
    formData.append("MDDL", values.selectMDDL);
    formData.append("FRL", values.selectFRL);
    formData.append("LiveCapacity", values.selectLiveCapacity);
    if (action !== "add-hydraulic-details") {
      formData.append("_id", record._id);
      formData.append("Reason", reasonRef);
    }

    const url = `/Admin/HydraulicDetails/${
      action === "add-hydraulic-details"
        ? "CreateHydraulicDetails"
        : "UpdateHydraulicDetails"
    }`;
   

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

    if (action === "add-hydraulic-details") {
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
        selectStation: "",
        selectRBL: record?.rbl || "",
        selectHFL: record?.hfl || "",
        selectMDDL: record?.mddl || "",
        selectFRL: record?.frl || "",
        selectLiveCapacity: record?.liveCapacity || "",
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
          {action === "add-hydraulic-details" && (
            <div className='row'>
              <div className='my-2 col-md-4 add-user-input_container'>
                <label style={{ color: "#262626" }}>Select Profile</label>
                <select
                  className='form-control form-select me-3'
                  name='selectProfile'
                  value={values.selectProfile}
                  onChange={(e) => {
                    handleChange(e);
                    setProfileId(e.target.value);
                  }}
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
            </div>
          )}
          <div className='row'>
            {action !== "add-hydraulic-details" ? (
              <div className='my-2 col-md-4 add-user-input_container'>
                <label style={{ color: "#262626" }}>Staion Id</label>

                <Field
                  name='selectRBL'
                  className='form-control'
                  value={record?.stationID}
                  readOnly={true}
                />
              </div>
            ) : (
              <div className='my-2 col-md-4 add-user-input_container'>
                <label style={{ color: "#262626" }}>Select Station</label>
                <select
                  className='form-control form-select me-2'
                  name='selectStation'
                  value={values.selectStation}
                  onChange={handleChange}
                >
                  <option value=''>Select Station</option>
                  {data?.map((s) => (
                    <option key={s._id} value={s.stationId}>
                      {s.stationId}
                    </option>
                  ))}
                </select>

                <ErrorMessage
                  name='selectStation'
                  component='span'
                  className='text-danger mt-2'
                />
              </div>
            )}
            <div className='my-2 col-md-4 add-user-input_container'>
              <label style={{ color: "#262626" }}>RBL</label>

              <Field
                name='selectRBL'
                className='form-control'
                type='number'
                // readOnly={isViewMode}
              />
            </div>
            <div className='my-2 col-md-4 add-user-input_container'>
              <label style={{ color: "#262626" }}>HFL</label>

              <Field
                name='selectHFL'
                className='form-control'
                type='number'
                // readOnly={isViewMode}
              />
            </div>
            <div className='my-2 col-md-4 add-user-input_container'>
              <label style={{ color: "#262626" }}>MDDL</label>

              <Field
                name='selectMDDL'
                className='form-control'
                type='number'
                // readOnly={isViewMode}
              />
            </div>
            <div className='my-2 col-md-4 add-user-input_container'>
              <label style={{ color: "#262626" }}>FRL</label>

              <Field
                name='selectFRL'
                className='form-control'
                type='number'
                // readOnly={isViewMode}
              />
            </div>
            <div className='my-2 col-md-4 add-user-input_container'>
              <label style={{ color: "#262626" }}>Live Capacity</label>

              <Field
                name='selectLiveCapacity'
                className='form-control'
                type='number'
                // readOnly={isViewMode}
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

export default AddHydraulicParameter;
