import React, { useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useParams } from "react-router-dom";
import { Typography, Input } from "antd";

import NotificationInputs from "./NotificationInputs";

import { callActionWarningPopup, IntactionActionBtns } from "../ActionsBtns";
import ErrorHandler from "../../utils/errorhandler";
import AlertConfiguration from "./AlertConfiguration";
import { notificationInputs } from "../../utils/notificationInputs";

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
    title: "",
    content: "",
    description: "",
  }
);

// Yup Validation Schema (all fields required)
const validationSchema = Yup.object(
  notificationInputs.reduce(
    (acc, item) => {
      acc[item.name] = Yup.string().required(`${item.label} is required`);
      return acc;
    },
    {
      subject: Yup.string().required("Subject is required"),
      title: Yup.string().required("Title is required"),
      content: Yup.string().required("Content is required"),
      description: Yup.string().required("Description is required"),
    }
  )
);

const Alert = () => {
  const { action } = useParams();
  const location = useLocation();
  const isViewMode = action?.startsWith("view");

  const useData = location?.state?.record ?? initialValues;

  const [configurations, setConfigurations] = useState([]);

  // Simulate API call
  const fakeApiCall = (data) =>
    new Promise((resolve) => {
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
          <AlertConfiguration
            configurations={configurations}
            setConfigurations={setConfigurations}
          />

          <div>
            <Title level={4}>Notify : Mail</Title>
            <div className="row mb-3">
              <div className="add-user-input_container col-md-6">
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

              <div className="add-user-input_container col-md-6">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <Input
                  id="title"
                  name="title"
                  value={values.title}
                  maxLength={100}
                  onChange={(e) => setFieldValue("title", e.target.value)}
                  placeholder="Enter title"
                  disabled={isViewMode}
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>
            </div>
            <div className="row">
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
              <div className="add-user-input_container col-md-6">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <TextArea
                  id="description"
                  name="description"
                  rows={2}
                  maxLength={250}
                  value={values.description}
                  onChange={(e) => setFieldValue("description", e.target.value)}
                  disabled={isViewMode}
                  placeholder="Enter description"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-danger mt-1"
                />
              </div>
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

export default Alert;

// import React, { useState } from "react";
// import { Formik, Form, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useLocation, useParams } from "react-router-dom";
// import { Select, Empty, Typography, Input } from "antd";
// import { callActionWarningPopup, IntactionActionBtns } from "./ActionsBtns";
// import ErrorHandler from "../utils/errorhandler";
// import "./components.css";
// import AlertConfiguration from "./AlertConfiguration";

// const { TextArea } = Input;
// const { Title } = Typography;

// // Dropdown data
// const roles = [
//   "System Admin",
//   "Admin",
//   "General User",
//   "Department",
//   "Support",
//   "Manager",
//   "Operator",
//   "Supervisor",
//   "Executive",
//   "Auditor",
// ];
// const stationNames = [
//   "WSD1-Awstestfac",
//   "Nivagam",
//   "Annavaram",
//   "Veligallu Project",
//   "Mumbai",
//   "Hyderabad Central",
//   "Chennai Port",
//   "Kolkata East",
//   "Ahmedabad North",
//   "Jaipur South",
// ];
// const profiles = ["NHPAP-AWLR", "NHPAP-AWS", "BARC", "IMD", "WRD", "NRSC"];

// // Helper for dropdown options
// const createOptions = (items) =>
//   items.map((val, idx) => ({
//     key: `key${idx}`,
//     label: val,
//     value: val,
//   }));

// // Dropdown inputs structure
// const drownInputs = [
//   {
//     key: "notify",
//     label: "Notify",
//     name: "notify",
//     options: createOptions([
//       "Notification Alert",
//       "Sensor Value",
//       "Battery Low",
//       "Temperature Rise",
//     ]),
//   },
//   {
//     key: "clientname",
//     label: "Client Name",
//     name: "clientname",
//     options: createOptions(["NHP", "AWS", "NRSC", "BARC"]),
//   },
//   {
//     key: "role",
//     label: "Role",
//     name: "role",
//     options: createOptions(roles),
//   },
//   {
//     key: "users",
//     label: "Users",
//     name: "users",
//     options: createOptions([
//       "user1@example.com",
//       "user2@example.com",
//       "admin@example.com",
//     ]),
//   },
//   {
//     key: "profile",
//     label: "Profile",
//     name: "profile",
//     options: createOptions(profiles),
//   },
//   {
//     key: "station",
//     label: "Station",
//     name: "station",
//     options: createOptions(stationNames),
//   },
// ];

// // Add these fields to initialValues
// const initialValues = drownInputs.reduce(
//   (acc, item) => {
//     acc[item.name] = "";
//     return acc;
//   },
//   {
//     subject: "",
//     title: "",
//     content: "",
//     description: "",
//   }
// );

// // Yup Validation Schema
// const validationSchema = Yup.object(
//   drownInputs.reduce(
//     (acc, item) => {
//       acc[item.name] = Yup.string().required(`${item.label} is required`);
//       return acc;
//     },
//     {
//       subject: Yup.string().required("Subject is required"),
//       title: Yup.string().required("Title is required"),
//       content: Yup.string().required("Content is required"),
//       description: Yup.string().required("Description is required"),
//     }
//   )
// );

// const Alert = () => {
//   const { action } = useParams();
//   const location = useLocation();
//   const isViewMode = action?.startsWith("view");

//   const useData = location?.state?.record ?? initialValues;

//   const [configurations, setConfigurations] = useState([]);
//   //   const [subject, setSubject] = useState("");
//   //   const [title, setTitle] = useState("");
//   //   const [content, setContent] = useState("");
//   //   const [description, setDescription] = useState("");

//   // Simulate API call
//   const fakeApiCall = (data) =>
//     new Promise((resolve) => {
//       console.log("API called with:", data);
//       setTimeout(resolve, 1000);
//     });

//   // Form submission handler
//   const handleSubmit = async (values, { resetForm }) => {
//     try {
//       await fakeApiCall(values);
//       ErrorHandler.SuccessToast("Data submitted successfully");
//       resetForm();
//     } catch (error) {
//       ErrorHandler.ErrorToast("Submission failed");
//     }
//   };

//   // External submit handler with validation
//   const handleExternalSubmit = async (validateForm, submitForm, setTouched) => {
//     const errors = await validateForm();
//     if (Object.keys(errors).length > 0) {
//       setTouched(
//         Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {})
//       );
//       return;
//     }
//     callActionWarningPopup(action, async () => {
//       await submitForm();
//     });
//   };

//   return (
//     <Formik
//       initialValues={useData}
//       validationSchema={validationSchema}
//       onSubmit={handleSubmit}
//     >
//       {({
//         values,
//         setFieldValue,
//         validateForm,
//         submitForm,
//         setTouched,
//         resetForm,
//       }) => (
//         <Form>
//           <div className="row">
//             {drownInputs.map((item) => (
//               <div
//                 key={item.key}
//                 className="add-user-input_container col-12 col-md-4 mb-3"
//               >
//                 <label htmlFor={item.name}>{item.label}</label>
//                 <Select
//                   showSearch
//                   allowClear
//                   className="w-100 add-user-input_container"
//                   placeholder={`Select ${item.label}`}
//                   value={values[item.name] || undefined}
//                   onChange={(value) => setFieldValue(item.name, value)}
//                   disabled={isViewMode}
//                   notFoundContent={<Empty description="No matching options" />}
//                   optionFilterProp="children"
//                   filterOption={(input, option) =>
//                     option?.label?.toLowerCase().includes(input.toLowerCase())
//                   }
//                   options={item.options}
//                 />
//                 <ErrorMessage
//                   name={item.name}
//                   component="div"
//                   className="text-danger mt-1"
//                 />
//               </div>
//             ))}
//           </div>

//           <hr style={{ border: "1px solid #E4E4E4" }} />

//           <AlertConfiguration
//             configurations={configurations}
//             setConfigurations={setConfigurations}
//           />

//           <div>
//             <Title level={4}>Notify : Mail</Title>

//             {/* Subject & Content */}
//             <div className="row mb-3">
//               <div className="add-user-input_container col-md-6">
//                 <label className="form-label">Subject</label>
//                 <Input
//                   value={subject}
//                   onChange={(e) => setSubject(e.target.value)}
//                   placeholder="Enter subject"
//                   disabled={isViewMode}
//                 />
//               </div>
//               <div className="add-user-input_container col-md-6">
//                 <label className="form-label">Content</label>
//                 <TextArea
//                   rows={2}
//                   value={content}
//                   onChange={(e) => setContent(e.target.value)}
//                   disabled={isViewMode}
//                 />
//               </div>
//             </div>

//             {/* Title & Description */}
//             <div className="row">
//               <div className="add-user-input_container col-md-6">
//                 <label className="form-label">Title</label>
//                 <Input
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   placeholder="Enter title"
//                   disabled={isViewMode}
//                 />
//               </div>
//               <div className="add-user-input_container col-md-6">
//                 <label className="form-label">Description</label>
//                 <TextArea
//                   rows={2}
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   disabled={isViewMode}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="m-5 text-center">
//             <IntactionActionBtns
//               actionFunction={() =>
//                 handleExternalSubmit(validateForm, submitForm, setTouched)
//               }
//               setFunc={resetForm}
//               isViewMode={isViewMode}
//             />
//           </div>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default Alert;
