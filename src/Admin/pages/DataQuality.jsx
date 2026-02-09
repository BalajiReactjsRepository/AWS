import * as Yup from "yup";
import { apiCaller } from "../../api/apihelper";
import api from "../../api/axiosConfig";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Button, DatePicker } from "antd";
import dayjs from "dayjs";
import { Select } from "antd";
import { useStore } from "../../Context/masterapis/MasterApisContext";

const { Option } = Select;

// -------------------- Validation --------------------
const validationSchema = Yup.object({
  CheckType: Yup.string().required("Check Type is required"),
  ProfileIds: Yup.array()
    .min(1, "At least one Profile  is required")
    .required("Profile is required"),

  FromDate: Yup.string()
    .required("From Date is required")
    .test("valid-from", "Invalid From Date", (value) =>
      dayjs(value, "DD-MMM-YYYY", true).isValid()
    ),

  ToDate: Yup.string()
    .required("To Date is required")
    .test("valid-to", "Invalid To Date", (value) =>
      dayjs(value, "DD-MMM-YYYY", true).isValid()
    )
    .test(
      "compare-dates",
      "To Date must be greater than From Date",
      function (value) {
        const { FromDate } = this.parent;
        if (!FromDate || !value) return true;
        return dayjs(value, "DD-MMM-YYYY").isAfter(
          dayjs(FromDate, "DD-MMM-YYYY")
        );
      }
    ),
});

// -------------------- Initial Values --------------------
const initialValues = {
  CheckType: "",
  ProfileIds: [],
  FromDate: "",
  ToDate: "",
};

// -------------------- Reusable Select --------------------

const FormSelect = ({ label, name, children }) => (
  <div className="add-user-input_container col-12 col-md-3 mb-2">
    <label htmlFor={name}>{label}</label>
    <Field
      as="select"
      id={name}
      name={name}
      className="form-select"
      style={{ border: "1px solid #c2bdbd57" }}
    >
      {children}
    </Field>

    <ErrorMessage name={name} component="div" className="text-danger" />
  </div>
);

// -------------------- Component --------------------
const DataQuality = () => {
  const checkTypes = ["dc", "dq"];

  const { store } = useStore();

  const profileOptions = store?.profiles ?? [];

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();

    formData.append("CheckType", values.CheckType);
    formData.append("ProfileIds", values.ProfileIds.join(","));
    formData.append("FromDate", values.FromDate);
    formData.append("ToDate", values.ToDate);

    const url = "Admin/DataQuality/CheckManualDataCompleteAndQuality";

    apiCaller({
      showSuccess: true,
      apiCall: () => api.post(url, formData),
      onSuccess: () => resetForm(),
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <div className="row">
            {/* Check Type */}
            <FormSelect label="Check Type" name="CheckType">
              <option value="">Select Check Type</option>
              {checkTypes.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </FormSelect>

            {/* From Date */}
            <div className="add-user-input_container col-12 col-md-3 mb-2">
              <label htmlFor="fromdate">From Date</label>
              <DatePicker
                className="form-control"
                id="fromdate"
                format="DD-MMM-YYYY"
                value={
                  values.FromDate ? dayjs(values.FromDate, "DD-MMM-YYYY") : null
                }
                placeholder="select from date"
                onChange={(date) => {
                  setFieldValue(
                    "FromDate",
                    date ? date.format("DD-MMM-YYYY") : ""
                  );
                  // Auto clear ToDate
                  setFieldValue("ToDate", "");
                }}
              />
              <ErrorMessage
                name="FromDate"
                component="div"
                className="text-danger"
              />
            </div>

            {/* To Date */}
            <div className="add-user-input_container col-12 col-md-3 mb-2">
              <label htmlFor="todate">To Date</label>
              <DatePicker
                className="form-control"
                id="todate"
                format="DD-MMM-YYYY"
                value={
                  values.ToDate ? dayjs(values.ToDate, "DD-MMM-YYYY") : null
                }
                placeholder="select to date"
                disabledDate={(current) =>
                  values.FromDate &&
                  current &&
                  (current.isBefore(dayjs(values.FromDate, "DD-MMM-YYYY")) ||
                    current.isSame(dayjs(values.FromDate, "DD-MMM-YYYY")))
                }
                onChange={(date) =>
                  setFieldValue(
                    "ToDate",
                    date ? date.format("DD-MMM-YYYY") : ""
                  )
                }
              />

              <ErrorMessage
                name="ToDate"
                component="div"
                className="text-danger"
              />
            </div>

            {/* Profile Ids */}
            <div className="add-user-input_container col-12 col-md-3 mb-2">
              <label htmlFor="profile">Select Profile</label>
              <Select
                mode="multiple"
                id="profile"
                allowClear
                placeholder="Select profile(s)"
                className="w-100"
                value={values.ProfileIds}
                onChange={(value) => setFieldValue("ProfileIds", value)}
              >
                {profileOptions.map((p) => (
                  <Option key={p._id} value={p._id}>
                    {p.profileName}
                  </Option>
                ))}
              </Select>

              <ErrorMessage
                name="ProfileIds"
                component="div"
                className="text-danger"
              />
            </div>
          </div>

          <div className="mt-3 text-center">
            <Button type="primary" size="large" htmlType="submit">
              Submit
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default DataQuality;
