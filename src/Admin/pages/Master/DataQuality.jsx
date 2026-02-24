import * as Yup from "yup";
import { apiCaller } from "../../../api/apihelper";
import api from "../../../api/axiosConfig";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Button, DatePicker } from "antd";
import dayjs from "dayjs";
import { Select } from "antd";
import { useStore } from "../../../Context/masterapis/MasterApisContext";
import { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { RiErrorWarningFill } from "react-icons/ri";
import TrackRequestsPage from "./TrackRequestsPage";
import { Modal } from "antd";
import { HiLightBulb } from "react-icons/hi";

const { Option } = Select;

// -------------------- Validation --------------------
const validationSchema = Yup.object({
  CheckType: Yup.string().required("Check Type is required"),
  IssueType: Yup.array().when("CheckType", {
    is: "Data Quality",
    then: (schema) => schema.min(1, "Issue Type is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  ProfileId: Yup.string().required("Profile is required"),
  station: Yup.array().min(1, "Station is required"),
  SelectDate: Yup.string().required("Date is required"),

  FromDate: Yup.string().when("SelectDate", {
    is: "custom",
    then: (schema) => schema.required("From Date is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  ToDate: Yup.string().when("SelectDate", {
    is: "custom",
    then: (schema) =>
      schema
        .required("To Date is required")
        .test("valid-to", "Invalid To Date", (value) =>
          dayjs(value, "DD-MMM-YYYY", true).isValid(),
        )
        .test(
          "compare-dates",
          "To Date must be greater than From Date",
          function (value) {
            const { FromDate } = this.parent;
            if (!FromDate || !value) return true;
            return dayjs(value, "DD-MMM-YYYY").isAfter(
              dayjs(FromDate, "DD-MMM-YYYY"),
            );
          },
        ),
  }),
});

// -------------------- Initial Values --------------------
const initialValues = {
  CheckType: "",
  IssueType: [],
  ProfileId: "", // ✅ must be array
  FromDate: "",
  ToDate: "",
  station: [],
  SelectDate: "",
};

// -------------------- Reusable Select --------------------

const FormSelect = ({ label, name, children }) => (
  <div className='add-user-input_container col-12 col-md-3 mb-2'>
    <label htmlFor={name}>{label}</label>
    <Field
      as='select'
      id={name}
      name={name}
      className='form-select'
      style={{ border: "1px solid #c2bdbd57" }}
    >
      {children}
    </Field>

    <ErrorMessage name={name} component='div' className='text-danger' />
  </div>
);

// -------------------- Component --------------------
const DataQuality = () => {
  const checkTypes = ["Data Completeness", "Data Quality"];
  const [key, setKey] = useState("newCheck");
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [stationData, setStationData] = useState([]);
  const [issueType, setIssueType] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [CheckType, setCheckType] = useState("");

  const { store } = useStore();

  const profileOptions = store?.profiles ?? [];

  useEffect(() => {
    if (!selectedProfileId) return;

    const formData = new FormData();
    formData.append("profileId", selectedProfileId);

    apiCaller({
      apiCall: () =>
        api.post(`/Admin/ShowStationAccess/GetStationList`, formData),
      onSuccess: (result) => setStationData(result ?? []),
    });
  }, [selectedProfileId]);

  useEffect(() => {
    const issueTypes = async () => {
      const url = "Admin/DataQuality/GetIssueTypes";
      apiCaller({
        apiCall: () => api.get(url),
        onSuccess: (result) => setIssueType(result ?? []),
      });
    };
    issueTypes();
  }, []);

  const AutoDateHandler = ({ values, setFieldValue }) => {
    useEffect(() => {
      if (values.SelectDate === "today") {
        const today = dayjs().format("DD-MMM-YYYY");
        setFieldValue("FromDate", today);
        setFieldValue("ToDate", today);
      }

      if (values.SelectDate === "yesterday") {
        const yesterday = dayjs().subtract(1, "day").format("DD-MMM-YYYY");
        setFieldValue("FromDate", yesterday);
        setFieldValue("ToDate", yesterday);
      }

      if (values.SelectDate === "custom") {
        setFieldValue("FromDate", "");
        setFieldValue("ToDate", "");
      }
    }, [values.SelectDate, setFieldValue]);

    return null;
  };

  const handleIssueTypeChange = (value, values, setFieldValue) => {
    const allIssueTypes = issueType;

    // if Select All clicked
    if (value.includes("ALL")) {
      if (values.IssueType.length === allIssueTypes.length) {
        // unselect all
        setFieldValue("IssueType", []);
      } else {
        // select all
        setFieldValue("IssueType", allIssueTypes);
      }
    } else {
      setFieldValue("IssueType", value);
    }
  };

  const handleStationChange = (value, values, setFieldValue) => {
    if (value.includes("ALL")) {
      const allStationIds = stationData.map((s) => s._id);

      if (values?.station?.length === allStationIds.length) {
        setFieldValue("station", []);
      } else {
        setFieldValue("station", allStationIds);
      }
    } else {
      setFieldValue("station", value);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    let checkTypeValue = values.CheckType === "Data Completeness" ? "dc" : "dq";
    console.log(checkTypeValue, values);
    setCheckType(checkTypeValue);
    formData.append("CheckType", checkTypeValue);
    formData.append("IssueType", values.IssueType?.join(","));
    formData.append("StationIds", values.station?.join(","));
    formData.append("FromDate", values.FromDate);
    formData.append("ToDate", values.ToDate);

    const url = "Admin/DataQuality/CheckManualDataCompleteAndQuality";

    apiCaller({
      showSuccess: false,
      apiCall: () => api.post(url, formData),
      onSuccess: (result) => {
        setRequestId(result?.requestId);
        setIsModalOpen(true);
        resetForm();
      },
    });
  };

  return (
    <Tabs
      defaultActiveKey='profile'
      id='manual-data-check'
      className='mb-3 tabs-cont'
      activeKey={key}
      onSelect={(k) => setKey(k)}
    >
      <Tab eventKey='newCheck' title='New Check' className='tab-button'>
        <Modal
          open={isModalOpen}
          onOk={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
          centered
          width={350}
          footer={null}
          closable={false}
        >
          <h6 className='text-center'>
            <strong>
              {CheckType === "dc" ? "Data Completeness" : "Data Quality"} Check
              Started Successfully.
              <br /> Request ID: {requestId}
            </strong>
          </h6>

          <div className='text-center my-3'>
            <Button type='primary' onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </div>
          <small className='d-flex justify-content-center align-items-center'>
            <HiLightBulb className='me-1' />
            Hint: Note the Request Id for the future reference
          </small>
        </Modal>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <AutoDateHandler values={values} setFieldValue={setFieldValue} />
              <div className='row'>
                {/* Check Type */}
                <FormSelect label='Check Type' name='CheckType'>
                  <option value=''>Select Check Type</option>
                  {checkTypes.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </FormSelect>
                {values.CheckType === "Data Quality" && (
                  <div className='add-user-input_container col-12 col-md-3 mb-2'>
                    <label htmlFor='IssueType'>Select Issue Type</label>
                    <Select
                      mode='multiple'
                      id='IssueType'
                      allowClear
                      placeholder='Select Issue Type(s)'
                      className='w-100'
                      value={values.IssueType}
                      // disabled={values.CheckType !== "Data Quality"}
                      maxTagCount='1'
                      listHeight={200}
                      onChange={(value) =>
                        handleIssueTypeChange(value, values, setFieldValue)
                      }
                    >
                      {issueType.length > 0 && (
                        <Option value='ALL'>Select All</Option>
                      )}
                      {issueType.map((v) => (
                        <Option key={v} value={v}>
                          {v}
                        </Option>
                      ))}
                    </Select>

                    <ErrorMessage
                      name='IssueType'
                      component='div'
                      className='text-danger'
                    />
                  </div>
                )}

                {/* Profile Ids */}
                <div className='add-user-input_container col-12 col-md-3 mb-2'>
                  <label htmlFor='profile'>Select Profile</label>
                  <Select
                    placeholder='Select profile'
                    className='w-100'
                    value={values.ProfileId}
                    onChange={(value) => {
                      setFieldValue("ProfileId", value);
                      setSelectedProfileId(value);
                    }}
                  >
                    <Option value=''>Select Profile</Option>
                    {profileOptions.map((p) => (
                      <Option key={p._id} value={p._id}>
                        {p.profileName}
                      </Option>
                    ))}
                  </Select>

                  <ErrorMessage
                    name='ProfileId'
                    component='div'
                    className='text-danger'
                  />
                </div>

                {/* station ids */}

                <div className='add-user-input_container col-12 col-md-3 mb-2'>
                  <label htmlFor='station'>Select Station</label>
                  <Select
                    mode='multiple'
                    id='station'
                    allowClear
                    placeholder='Select Station(s)'
                    className='w-100'
                    value={values.station}
                    maxTagCount='1'
                    listHeight={200}
                    onChange={(value) =>
                      handleStationChange(value, values, setFieldValue)
                    }
                    // maxTagPlaceholder={(omittedValues) =>
                    //   `+ ${omittedValues.length}`
                    // }
                  >
                    {stationData.length > 0 && (
                      <Option value='ALL'>Select All</Option>
                    )}
                    {stationData.map((s) => (
                      <Option key={s._id} value={s._id}>
                        {s.stationName} - {s.stationId}
                      </Option>
                    ))}
                  </Select>

                  <ErrorMessage
                    name='station'
                    component='div'
                    className='text-danger'
                  />
                </div>

                <FormSelect label='Select Date' name='SelectDate'>
                  <option value=''>Select date</option>
                  <option value='today'>Today</option>
                  <option value='yesterday'>Yesterday</option>
                  <option value='custom'>Custom</option>
                </FormSelect>

                {values.SelectDate === "custom" && (
                  <>
                    {/* From Date */}
                    <div className='add-user-input_container col-12 col-md-3 mb-2'>
                      <label htmlFor='fromdate'>From Date</label>
                      <DatePicker
                        className='form-control'
                        id='fromdate'
                        format='DD-MMM-YYYY'
                        value={
                          values.FromDate
                            ? dayjs(values.FromDate, "DD-MMM-YYYY")
                            : null
                        }
                        placeholder='select from date'
                        onChange={(date) => {
                          setFieldValue(
                            "FromDate",
                            date ? date.format("DD-MMM-YYYY") : "",
                          );
                          // Auto clear ToDate
                          setFieldValue("ToDate", "");
                        }}
                      />
                      <ErrorMessage
                        name='FromDate'
                        component='div'
                        className='text-danger'
                      />
                    </div>

                    {/* To Date */}
                    <div className='add-user-input_container col-12 col-md-3 mb-2'>
                      <label htmlFor='todate'>To Date</label>
                      <DatePicker
                        className='form-control'
                        id='todate'
                        format='DD-MMM-YYYY'
                        value={
                          values.ToDate
                            ? dayjs(values.ToDate, "DD-MMM-YYYY")
                            : null
                        }
                        placeholder='select to date'
                        disabledDate={(current) =>
                          values.FromDate &&
                          current &&
                          (current.isBefore(
                            dayjs(values.FromDate, "DD-MMM-YYYY"),
                          ) ||
                            current.isSame(
                              dayjs(values.FromDate, "DD-MMM-YYYY"),
                            ))
                        }
                        onChange={(date) =>
                          setFieldValue(
                            "ToDate",
                            date ? date.format("DD-MMM-YYYY") : "",
                          )
                        }
                      />

                      <ErrorMessage
                        name='ToDate'
                        component='div'
                        className='text-danger'
                      />
                    </div>
                  </>
                )}
              </div>

              <div className='mt-3 text-center'>
                <Button type='primary' size='large' htmlType='submit'>
                  Check Data
                </Button>
              </div>
            </Form>
          )}
        </Formik>
        <div className='info-card p-3 w-50 mt-5'>
          <h6 className='fw-semibold d-flex align-items-center mb-2'>
            <RiErrorWarningFill
              className='me-1'
              style={{ fontSize: "1.4rem" }}
            />
            Check Types And Issue Types
          </h6>
          <h6 className='fw-semibold mb-0'>Data Completeness:</h6>
          <p className='mb-0'>
            Checks for missing or incomplete data entries across selected
            stations
          </p>
          <h6 className='fw-semibold mt-2 mb-0'>Data Quality:</h6>
          <p className='mb-0'>
            Checks for issues like Invalid Date, Invalid Time, Blank Value,
            Unexpected Character or Value, Out of Range
          </p>
        </div>
      </Tab>
      <Tab eventKey='trackRequest' title='Track Request' className='tab-button'>
        <TrackRequestsPage />
      </Tab>
    </Tabs>
  );
};

export default DataQuality;
