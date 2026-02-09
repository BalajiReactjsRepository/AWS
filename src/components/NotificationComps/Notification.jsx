import React from "react";
import {
  Empty,
  Input,
  Select,
  Typography,
  Checkbox,
  DatePicker,
  TimePicker,
} from "antd";
import * as Yup from "yup";
import { UploadOutlined } from "@ant-design/icons";
import { Formik, Form, ErrorMessage } from "formik";
import { useLocation, useParams } from "react-router-dom";

import NotificationInputs from "./NotificationInputs";
import { notificationInputs } from "../../utils/notificationInputs";
import { callActionWarningPopup, IntactionActionBtns } from "../ActionsBtns";
import ErrorHandler from "../../utils/errorhandler";

import "../components.css";

const { TextArea } = Input;
const { Title } = Typography;

// Initial Values (all form fields managed by Formik)
const initialValues = notificationInputs.reduce(
  (acc, item) => {
    acc[item.name] = "";
    return acc;
  },
  {
    subject: "",
    file: null,
    content: "",
    title: "",
    message: "",
  },
  {
    triggerPeriod: "",
  }
);

// Yup Validation Schema (all fields required)
const validationSchema = Yup.object(
  // notification inputs
  notificationInputs.reduce(
    (acc, item) => {
      acc[item.name] = Yup.string().required(`${item.label} is required`);
      return acc;
    },
    // mail sms inputs
    {
      subject: Yup.string().max(100).required("Subject is required"),
      content: Yup.string().max(250).required("Content is required"),
      file: Yup.mixed().required("Image file is required"),
      title: Yup.string().max(100).required("Title is required"),
      message: Yup.string().max(250).required("Description is required"),
    },
    //trigger inputs
    {
      triggerPeriod: Yup.string().required("TriggerPeriod is required"),
    }
  )
);

const triggerPeriodOptions = [
  { label: "Daily", value: "Daily" },
  { label: "Weekly", value: "Weekly" },
  { label: "Monthly", value: "Monthly" },
  { label: "Yearly", value: "Yearly" },
];

const monthsOptions = [
  { label: "January", value: "January" },
  { label: "February", value: "February" },
  { label: "March", value: "March" },
  { label: "April", value: "April" },
  { label: "May", value: "May" },
  { label: "June", value: "June" },
  { label: "July", value: "July" },
  { label: "August", value: "August" },
  { label: "September", value: "September" },
  { label: "October", value: "October" },
  { label: "November", value: "November" },
  { label: "December", value: "December" },
];

const daysOptions = [
  { label: "Sunday", value: "Sunday" },
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
];

const onOptions = [
  { label: "First", value: "First" },
  { label: "Second", value: "Second" },
  { label: "Third", value: "Third" },
  { label: "Fourth", value: "Fourth" },
  { label: "Last", value: "Last" },
];

const Notification = () => {
  const { action } = useParams();
  const location = useLocation();
  const isViewMode = action?.startsWith("view");

  const useData = location?.state?.record ?? initialValues;

  // Simulate API call
  const fakeApiCall = (data) =>
    new Promise((resolve) => {
      //  console.log("API called with:", data);
      setTimeout(resolve, 1000);
    });

  // Form submission handler
  const handleSubmit = async (values, { resetForm }) => {
    try {
      await fakeApiCall(values);
      ErrorHandler.SuccessToast("Data submitted successfully");
      resetForm();
    } catch (error) {
      ErrorHandler.ErrorToast("Submission failed");
    }
  };

  // External submit handler with validation
  const handleExternalSubmit = async (validateForm, submitForm, setTouched) => {
    const errors = await validateForm();
    if (Object.keys(errors).length > 0) {
      setTouched(
        Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
      return;
    }
    callActionWarningPopup(action, async () => {
      await submitForm();
    });
  };

  return (
    <Formik
      initialValues={useData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        setFieldValue,
        validateForm,
        submitForm,
        setTouched,
        resetForm,
      }) => (
        <Form>
          <NotificationInputs
            notificationInputs={notificationInputs}
            values={values}
            setFieldValue={setFieldValue}
          />

          {/* Mail Inputs */}
          <div>
            <Title level={4}> Mail</Title>
            <div className="row mb-3">
              <div className="add-user-input_container col-md-3">
                <label htmlFor="subject" className="form-label">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  maxLength={100}
                  value={values.subject}
                  onChange={(e) => setFieldValue("subject", e.target.value)}
                  placeholder="Enter subject"
                  disabled={isViewMode}
                />
                <ErrorMessage
                  name="subject"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>
              {/* Image Upload */}
              <div className="col-12 col-md-3 mb-3">
                <label
                  htmlFor="file"
                  style={{ color: "#262626", marginBottom: "0.3rem" }}
                >
                  Select Image
                </label>
                <div
                  className="form-control"
                  style={{
                    position: "relative",
                    backgroundColor: "#0000000a",
                    border: "1px solid #00000057",
                    height: "2.8rem",
                  }}
                >
                  <UploadOutlined className="me-2" />
                  {values.file?.name || "No file chosen"}

                  <input
                    id="file"
                    type="file"
                    name="file"
                    accept="image/*"
                    style={{
                      opacity: 0,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      width: "100%",
                      cursor: isViewMode ? "not-allowed" : "pointer",
                    }}
                    disabled={isViewMode}
                    onChange={(event) =>
                      setFieldValue("file", event.currentTarget.files[0])
                    }
                  />
                </div>
                <ErrorMessage
                  name="file"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>
              <div className="add-user-input_container col-md-6">
                <label htmlFor="content" className="form-label">
                  Content
                </label>
                <TextArea
                  id="content"
                  name="content"
                  rows={2}
                  maxLength={250}
                  value={values.content}
                  onChange={(e) => setFieldValue("content", e.target.value)}
                  disabled={isViewMode}
                  placeholder="Enter content"
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>
            </div>
            <hr style={{ border: "1px solid #E4E4E4" }} />
          </div>

          {/* SMS Inputs */}
          <div>
            <Title level={4}> SMS</Title>
            <div className="row mb-3">
              <div className="add-user-input_container col-md-4">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <Input
                  id="title"
                  name="title"
                  value={values.title}
                  onChange={(e) => setFieldValue("title", e.target.value)}
                  placeholder="Enter Title"
                  maxLength={100}
                  disabled={isViewMode}
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>
              <div className="add-user-input_container col-md-8">
                <label htmlFor="message" className="form-label">
                  SMS Message Preview
                </label>
                <TextArea
                  id="message"
                  name="message"
                  rows={2}
                  value={values.message}
                  onChange={(e) => setFieldValue("message", e.target.value)}
                  disabled={isViewMode}
                  maxLength={250}
                  placeholder="Enter Message"
                />
                <ErrorMessage
                  name="message"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>
            </div>
            <hr style={{ border: "1px solid #E4E4E4" }} />
          </div>

          {/* Trigger Section */}
          <div>
            <Title level={4}>Trigger</Title>
            <div className="row mb-3">
              <div className="add-user-input_container col-md-4">
                <label htmlFor="triggerPeriod">Trigger Period</label>
                <Select
                  id="triggerPeriod"
                  showSearch
                  allowClear
                  disabled={isViewMode}
                  className="w-100 add-user-input_container"
                  placeholder="Select Trigger Period"
                  notFoundContent={<Empty description="No matching options" />}
                  value={values.triggerPeriod}
                  onChange={(value) => setFieldValue("triggerPeriod", value)}
                  options={triggerPeriodOptions}
                />
                <ErrorMessage
                  name="triggerPeriod"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>
              <div className="add-user-input_container col-md-4">
                <label htmlFor="startDate">Start Date</label>
                <DatePicker
                  id="startDate"
                  className="w-100 "
                  disabled={isViewMode}
                  value={values.startDate}
                  onChange={(date) => setFieldValue("startDate", date)}
                />
              </div>
              <div className="add-user-input_container col-md-4">
                <label htmlFor="startTime">Start Time</label>
                <TimePicker
                  id="startTime"
                  className="w-100"
                  disabled={isViewMode}
                  value={values.startTime}
                  onChange={(time) => setFieldValue("startTime", time)}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="add-user-input_container col-md-5">
                <label htmlFor="triggerMonths">Months</label>
                <Select
                  id="triggerMonths"
                  showSearch
                  allowClear
                  mode="multiple"
                  disabled={isViewMode}
                  className="w-100 add-user-input_container"
                  placeholder="Select Months"
                  notFoundContent={<Empty description="No matching options" />}
                  value={values.triggerMonths}
                  onChange={(val) => setFieldValue("triggerMonths", val)}
                  options={monthsOptions}
                />
              </div>
              <div className="add-user-input_container col-md-3">
                <label htmlFor="triggerOn">On</label>
                <Select
                  id="triggerOn"
                  showSearch
                  allowClear
                  mode="multiple"
                  disabled={isViewMode}
                  className="w-100 add-user-input_container"
                  placeholder="Select On"
                  notFoundContent={<Empty description="No matching options" />}
                  value={values.triggerOn}
                  onChange={(val) => setFieldValue("triggerOn", val)}
                  options={onOptions}
                />
              </div>
              <div className="add-user-input_container col-md-4">
                <label htmlFor="triggerDays">Days</label>
                <Select
                  id="triggerDays"
                  showSearch
                  allowClear
                  mode="multiple"
                  disabled={isViewMode}
                  className="w-100 add-user-input_container"
                  placeholder="Select Days"
                  notFoundContent={<Empty description="No matching options" />}
                  value={values.triggerDays}
                  onChange={(val) => setFieldValue("triggerDays", val)}
                  options={daysOptions}
                />
              </div>
            </div>
            <hr style={{ border: "1px solid #E4E4E4" }} />
          </div>

          {/* Expire  */}
          <div className="row mb-2">
            <div className="col-md-4 d-flex align-items-center">
              <Checkbox
                id="expire"
                className="user-input_checkbox"
                checked={values.expire}
                disabled={isViewMode}
                onChange={(e) => setFieldValue("expire", e.target.checked)}
              >
                Expire :
              </Checkbox>
            </div>
            <div className="add-user-input_container col-md-4">
              <label htmlFor="expirestartDate">Start Date</label>
              <DatePicker
                id="expirestartDate"
                className="custom-date-picker w-100"
                value={values.startDate}
                disabled={isViewMode || !values.expire}
                onChange={(date) => setFieldValue("expirestartDate", date)}
              />
            </div>
            <div className="add-user-input_container col-md-4">
              <label htmlFor="expiresstartTime">Start Time</label>
              <TimePicker
                id="expiresstartTime"
                className="w-100"
                disabled={isViewMode || !values.expire}
                value={values.startTime}
                onChange={(time) => setFieldValue("expiresstartTime", time)}
              />
            </div>
          </div>
          <hr style={{ border: "1px solid #E4E4E4" }} />
          {/* Repeat Option */}
          <div className="row mb-2">
            <div className="col-md-4 d-flex align-items-center">
              <Checkbox
                id="repeat"
                className="user-input_checkbox"
                checked={values.repeat}
                disabled={isViewMode}
                onChange={(e) => setFieldValue("repeat", e.target.checked)}
              >
                Repeat :
              </Checkbox>
            </div>

            <div className="add-user-input_container col-md-4">
              <label htmlFor="repeatDuration">Repeat Duration</label>
              <Select
                id="repeatDuration"
                showSearch
                allowClear
                mode="multiple"
                className="w-100 add-user-input_container"
                placeholder="Select Trigger Period"
                notFoundContent={<Empty description="No matching options" />}
                value={values.repeatDuration}
                disabled={isViewMode || !values.repeat}
                onChange={(value) => setFieldValue("repeatDuration", value)}
                options={triggerPeriodOptions}
              />
            </div>
          </div>
          <hr style={{ border: "1px solid #E4E4E4" }} />
          {/* Enable Options */}
          <div className="row">
            <div className="col-md-2">
              <Checkbox
                id="enabled"
                className="user-input_checkbox"
                checked={values.enabled}
                disabled={isViewMode}
                onChange={(e) => setFieldValue("enabled", e.target.checked)}
              >
                Enabled
              </Checkbox>
            </div>
          </div>

          <div className="m-4 text-center">
            <IntactionActionBtns
              actionFunction={() =>
                handleExternalSubmit(validateForm, submitForm, setTouched)
              }
              setFunc={resetForm}
              isViewMode={isViewMode}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Notification;
